"""
Reproducible fine-tuning pipeline for the RUREADY Competitive Score matcher.

Base model : BAAI/bge-large-en-v1.5
Dataset    : 0xnbk/resume-ats-score-v1-en  (resume + JD pairs with ATS compatibility scores)
Objective  : CosineSimilarityLoss on normalized compatibility score (ats_score / 100)

IMPORTANT SCOPE RULES
---------------------
This dataset is RESUME <-> JOB matching data. It is used ONLY to fine-tune the
semantic matcher behind the Competitive Score. It must NEVER be used as ground
truth for the role-independent six-pillar ATS Quality Score
(ats/bge_ats_scorer.py), which stays fully deterministic.

USAGE
-----
Local CPU smoke test (validates the pipeline end-to-end, NOT the final model):

    python ml/training/train_competitive_model.py --smoke-test

Full training run (GPU / Google Colab):

    python ml/training/train_competitive_model.py --epochs 2 --batch-size 16

On Colab:
    !pip install -q sentence-transformers pandas huggingface_hub
    !git clone <repo> && cd <repo>/services/resume-service
    !python ml/training/train_competitive_model.py --epochs 2 --batch-size 16

The dataset CSVs are expected in ml/datasets/resume-ats-score-v1-en/.
If missing they are downloaded automatically from the Hugging Face Hub.

Outputs (default ml/models/competitive-bge/):
    - fine-tuned SentenceTransformer model files
    - calibration.json   (cosine -> score mapping + blend weights, read by inference)
    - training_report.json (dataset stats, hyperparameters, evaluation metrics)

Smoke-test runs write to ml/models/competitive-bge-smoketest/ by default and are
flagged "smoke_test": true so production inference refuses to load them.
"""

import argparse
import json
import os
import sys
import time
from pathlib import Path

import numpy as np
import pandas as pd

ML_DIR = Path(__file__).resolve().parents[1]
SERVICE_DIR = ML_DIR.parent
DEFAULT_DATASET_DIR = ML_DIR / "datasets" / "resume-ats-score-v1-en"
DEFAULT_OUTPUT_DIR = ML_DIR / "models" / "competitive-bge"
SMOKE_OUTPUT_DIR = ML_DIR / "models" / "competitive-bge-smoketest"

HF_DATASET_ID = "0xnbk/resume-ats-score-v1-en"
BASE_MODEL_NAME = "BAAI/bge-large-en-v1.5"
SEPARATOR = " SEP "

# Competitive Score blend weights (documented; mirrored by the inference layer).
COMPETITIVE_WEIGHTS = {
    "semanticSimilarity": 0.45,
    "skillOverlap": 0.25,
    "experienceRelevance": 0.15,
    "terminologyMatch": 0.15,
}

LABEL_BANDS = {
    "No Fit": (0.0, 40.0),
    "Potential Fit": (40.0, 70.0),
    "Good Fit": (70.0, 100.0),
}


def log(msg: str) -> None:
    print(f"[train-competitive] {msg}", flush=True)


# ----------------------------------------------------------------------
# 1. Dataset loading (reproducible download from HF Hub if absent)
# ----------------------------------------------------------------------

def ensure_dataset(dataset_dir: Path) -> None:
    needed = ["train.csv", "validation.csv"]
    if all((dataset_dir / f).exists() for f in needed):
        return
    log(f"Dataset not found in {dataset_dir}; downloading {HF_DATASET_ID} ...")
    from huggingface_hub import hf_hub_download

    dataset_dir.mkdir(parents=True, exist_ok=True)
    for f in needed:
        local = hf_hub_download(HF_DATASET_ID, f, repo_type="dataset")
        target = dataset_dir / f
        if not target.exists():
            with open(local, "rb") as src, open(target, "wb") as dst:
                dst.write(src.read())
    log("Dataset download complete.")


def load_dataset(dataset_dir: Path) -> tuple[pd.DataFrame, pd.DataFrame]:
    train_df = pd.read_csv(dataset_dir / "train.csv")
    val_df = pd.read_csv(dataset_dir / "validation.csv")
    return train_df, val_df


# ----------------------------------------------------------------------
# 2. Dataset validation (fail fast before spending compute)
# ----------------------------------------------------------------------

def validate_dataset(train_df: pd.DataFrame, val_df: pd.DataFrame) -> dict:
    errors = []
    for name, df in (("train", train_df), ("validation", val_df)):
        expected = {"text", "ats_score", "original_label"}
        if not expected.issubset(df.columns):
            errors.append(f"{name}: missing columns {expected - set(df.columns)}")
            continue
        if df[list(expected)].isna().any().any():
            errors.append(f"{name}: null values present")
        sep_counts = df["text"].str.count(SEPARATOR)
        if not (sep_counts == 1).all():
            errors.append(f"{name}: rows without exactly one '{SEPARATOR.strip()}' separator")
        if not df["ats_score"].between(0, 100).all():
            errors.append(f"{name}: ats_score outside 0-100")
        for label, (lo, hi) in LABEL_BANDS.items():
            sub = df[df["original_label"] == label]["ats_score"]
            if len(sub) and not sub.between(lo, hi + 1e-6).all():
                errors.append(f"{name}: '{label}' rows outside band [{lo}, {hi}]")

    overlap = len(set(train_df["text"]) & set(val_df["text"]))
    if overlap:
        errors.append(f"train/validation text overlap: {overlap} rows")

    if errors:
        raise SystemExit("Dataset validation FAILED:\n  - " + "\n  - ".join(errors))

    report = {
        "train_examples": int(len(train_df)),
        "validation_examples": int(len(val_df)),
        "columns": list(train_df.columns),
        "label_distribution_train": train_df["original_label"].value_counts().to_dict(),
        "label_distribution_validation": val_df["original_label"].value_counts().to_dict(),
        "score_stats_train": train_df["ats_score"].describe().round(3).to_dict(),
        "train_val_overlap": 0,
    }
    log("Dataset validation passed.")
    return report


# ----------------------------------------------------------------------
# 3. Preprocessing (pure PyTorch pipeline — no HF `datasets`/pyarrow needed)
# ----------------------------------------------------------------------

def to_pairs(df: pd.DataFrame) -> tuple[list[str], list[str], list[float]]:
    resumes, jobs, labels = [], [], []
    for text, score in zip(df["text"], df["ats_score"]):
        resume, jd = text.split(SEPARATOR, 1)
        resumes.append(resume.strip())
        jobs.append(jd.strip())
        labels.append(float(score) / 100.0)
    return resumes, jobs, labels


class PairDataset:
    """Minimal torch Dataset of (resume, jd, normalized-score) triples."""

    def __init__(self, resumes, jobs, labels):
        self.resumes, self.jobs, self.labels = resumes, jobs, labels

    def __len__(self):
        return len(self.labels)

    def __getitem__(self, idx):
        return {"sentence_0": self.resumes[idx], "sentence_1": self.jobs[idx],
                "label": self.labels[idx]}


def make_collate_fn(model, device):
    import torch

    def tokenize_to_device(texts):
        tokenized = model.tokenize(texts)
        return {k: v.to(device) for k, v in tokenized.items() if torch.is_tensor(v)}

    def collate(batch):
        s0 = [b["sentence_0"] for b in batch]
        s1 = [b["sentence_1"] for b in batch]
        labels = torch.tensor([b["label"] for b in batch], dtype=torch.float32, device=device)
        emb0 = model(tokenize_to_device(s0))["sentence_embedding"]
        emb1 = model(tokenize_to_device(s1))["sentence_embedding"]
        return {"sentence_embedding_0": emb0, "sentence_embedding_1": emb1, "label": labels}

    return collate


# ----------------------------------------------------------------------
# 4. Evaluation + calibration (plain numpy; no scipy dependency)
# ----------------------------------------------------------------------

def pearson(a: np.ndarray, b: np.ndarray) -> float:
    if a.std() == 0 or b.std() == 0:
        return 0.0
    return float(np.corrcoef(a, b)[0, 1])


def spearman(a: np.ndarray, b: np.ndarray) -> float:
    def rank(x):
        order = x.argsort()
        ranks = np.empty_like(order, dtype=float)
        ranks[order] = np.arange(len(x))
        return ranks
    return pearson(rank(a), rank(b))


def fit_linear_calibration(cos: np.ndarray, scores_100: np.ndarray) -> dict:
    slope, intercept = np.polyfit(cos, scores_100, 1)
    return {"slope": float(slope), "intercept": float(intercept),
            "cos_min": float(cos.min()), "cos_max": float(cos.max())}


def tier_from_score(score: float) -> str:
    if score < 40:
        return "No Fit"
    if score <= 70:
        return "Potential Fit"
    return "Good Fit"


def evaluate(model, val_df: pd.DataFrame, batch_size: int, max_seq_length: int):
    resumes, jobs, labels = to_pairs(val_df)
    log(f"Encoding {len(resumes)} validation pairs for evaluation ...")
    res_emb = model.encode(resumes, batch_size=batch_size, normalize_embeddings=True,
                           show_progress_bar=True)
    jd_emb = model.encode(jobs, batch_size=batch_size, normalize_embeddings=True,
                          show_progress_bar=True)
    cos = np.einsum("ij,ij->i", res_emb, jd_emb)
    scores_100 = np.array(labels) * 100.0

    calib = fit_linear_calibration(cos, scores_100)
    pred = np.clip(cos * calib["slope"] + calib["intercept"], 0, 100)

    pred_tiers = [tier_from_score(p) for p in pred]
    true_tiers = list(val_df["original_label"])
    tier_acc = float(np.mean([p == t for p, t in zip(pred_tiers, true_tiers)]))

    metrics = {
        "spearman_cos_vs_score": round(spearman(cos, scores_100), 4),
        "pearson_cos_vs_score": round(pearson(cos, scores_100), 4),
        "rmse_calibrated_points": round(float(np.sqrt(np.mean((pred - scores_100) ** 2))), 3),
        "tier_accuracy": round(tier_acc, 4),
        "cosine_stats": {"min": round(float(cos.min()), 4), "mean": round(float(cos.mean()), 4),
                          "max": round(float(cos.max()), 4)},
    }
    return metrics, calib


# ----------------------------------------------------------------------
# 5. Main pipeline
# ----------------------------------------------------------------------

def parse_args() -> argparse.Namespace:
    p = argparse.ArgumentParser(description="Fine-tune BGE for resume/JD competitive matching")
    p.add_argument("--dataset-dir", type=Path, default=DEFAULT_DATASET_DIR)
    p.add_argument("--output-dir", type=Path, default=None,
                   help="Defaults to ml/models/competitive-bge (smoke test: -smoketest)")
    p.add_argument("--epochs", type=int, default=2)
    p.add_argument("--batch-size", type=int, default=None, help="Default 16 on GPU, 8 on CPU")
    p.add_argument("--learning-rate", type=float, default=2e-5)
    p.add_argument("--max-seq-length", type=int, default=256)
    p.add_argument("--seed", type=int, default=42)
    p.add_argument("--smoke-test", action="store_true",
                   help="Tiny subset run (CPU-safe) that only validates the pipeline. "
                        "Output is flagged non-production.")
    p.add_argument("--smoke-train-examples", type=int, default=150)
    p.add_argument("--smoke-val-examples", type=int, default=64)
    p.add_argument("--allow-cpu-full", action="store_true",
                   help="Permit a full (non-smoke) training run on CPU. Very slow.")
    return p.parse_args()


def main() -> None:
    args = parse_args()

    import torch
    use_cuda = torch.cuda.is_available()
    device = "cuda" if use_cuda else "cpu"

    if args.smoke_test:
        output_dir = args.output_dir or SMOKE_OUTPUT_DIR
        epochs = 1
        batch_size = args.batch_size or 8
        max_seq_length = min(args.max_seq_length, 128)
    else:
        output_dir = args.output_dir or DEFAULT_OUTPUT_DIR
        if not use_cuda and not args.allow_cpu_full:
            raise SystemExit(
                "No CUDA device detected. Full fine-tuning of bge-large on CPU takes many "
                "hours. Use --smoke-test for local validation, run on a GPU machine/Colab, "
                "or pass --allow-cpu-full to override.")
        epochs = args.epochs
        batch_size = args.batch_size or (16 if use_cuda else 8)
        max_seq_length = args.max_seq_length

    log(f"Device: {device} | smoke_test={args.smoke_test} | epochs={epochs} | batch={batch_size}")
    if args.smoke_test:
        log("*** SMOKE TEST — output model is for pipeline validation only, NOT production. ***")

    # --- Load + validate dataset ---
    ensure_dataset(args.dataset_dir)
    train_df, val_df = load_dataset(args.dataset_dir)
    dataset_report = validate_dataset(train_df, val_df)

    if args.smoke_test:
        train_df = train_df.head(args.smoke_train_examples)
        val_df = val_df.head(args.smoke_val_examples)
        log(f"Smoke test subset: {len(train_df)} train / {len(val_df)} validation examples")

    # --- Model + loss ---
    from sentence_transformers import SentenceTransformer, losses

    log(f"Loading base model {BASE_MODEL_NAME} (downloads once, then uses HF cache) ...")
    model = SentenceTransformer(BASE_MODEL_NAME, device=device)
    model.max_seq_length = max_seq_length
    loss_fn = losses.CosineSimilarityLoss(model)

    tr_res, tr_jd, tr_lab = to_pairs(train_df)
    train_ds = PairDataset(tr_res, tr_jd, tr_lab)
    collate = make_collate_fn(model, model.device)
    loader = torch.utils.data.DataLoader(
        train_ds, batch_size=batch_size, shuffle=True, collate_fn=collate,
        generator=torch.Generator().manual_seed(args.seed))

    # --- Train (manual PyTorch loop with linear warmup + decay) ---
    optimizer = torch.optim.AdamW(model.parameters(), lr=args.learning_rate)
    total_steps = max(1, len(loader) * epochs)
    warmup_steps = max(1, int(total_steps * 0.1))

    def lr_lambda(step: int) -> float:
        if step < warmup_steps:
            return step / warmup_steps
        return max(0.0, (total_steps - step) / (total_steps - warmup_steps))

    scheduler = torch.optim.lr_scheduler.LambdaLR(optimizer, lr_lambda)

    torch.manual_seed(args.seed)
    np.random.seed(args.seed)

    model.train()
    started = time.time()
    global_step = 0
    # Version-adaptive loss call:
    #   sentence-transformers >= 5/6 exposes compute_loss_from_embeddings([emb0, emb1], labels)
    #   sentence-transformers 3.x expects forward({"sentence_embedding_0": ..., ...})
    use_new_loss_api = hasattr(loss_fn, "compute_loss_from_embeddings")

    def apply_loss(batch):
        if use_new_loss_api:
            return loss_fn.compute_loss_from_embeddings(
                [batch["sentence_embedding_0"], batch["sentence_embedding_1"]], batch["label"])
        return loss_fn(batch)

    for epoch in range(epochs):
        running, seen = 0.0, 0
        for batch in loader:
            out = apply_loss(batch)
            out.backward()
            torch.nn.utils.clip_grad_norm_(model.parameters(), 1.0)
            optimizer.step()
            scheduler.step()
            optimizer.zero_grad()
            running += float(out.item())
            seen += 1
            global_step += 1
            if global_step % 10 == 0 or global_step == total_steps:
                log(f"epoch {epoch + 1}/{epochs} step {global_step}/{total_steps} "
                    f"loss(avg10)={running / seen:.4f}")
    train_seconds = round(time.time() - started, 1)
    log(f"Training finished in {train_seconds}s ({train_seconds / 60:.1f} min)")
    model.eval()

    # --- Evaluate + calibrate ---
    metrics, calib = evaluate(model, val_df, batch_size, max_seq_length)
    log(f"Validation metrics: {json.dumps(metrics)}")

    # --- Save model + artifacts ---
    output_dir.mkdir(parents=True, exist_ok=True)
    model.save_pretrained(str(output_dir))

    calibration_doc = {
        "base_model": BASE_MODEL_NAME,
        "dataset": HF_DATASET_ID,
        "fine_tuned": True,
        "smoke_test": bool(args.smoke_test),
        "cosine_to_score": calib,
        "label_thresholds": {"no_fit_below": 40, "good_fit_above": 70},
        "competitive_weights": COMPETITIVE_WEIGHTS,
        "validation_metrics": metrics,
        "created_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
    }
    with open(output_dir / "calibration.json", "w", encoding="utf-8") as f:
        json.dump(calibration_doc, f, indent=2)

    report = {
        "task": "resume-jd semantic matching for Competitive Score",
        "not_used_for": "role-independent six-pillar ATS Quality Score",
        "smoke_test": bool(args.smoke_test),
        "base_model": BASE_MODEL_NAME,
        "dataset": dataset_report,
        "hyperparameters": {
            "epochs": epochs, "batch_size": batch_size, "learning_rate": args.learning_rate,
            "max_seq_length": max_seq_length, "seed": args.seed, "device": device,
            "loss": "CosineSimilarityLoss (label = ats_score/100)",
        },
        "train_seconds": train_seconds,
        "validation_metrics": metrics,
        "output_dir": str(output_dir),
    }
    with open(output_dir / "training_report.json", "w", encoding="utf-8") as f:
        json.dump(report, f, indent=2)

    log(f"Model + calibration + report saved to {output_dir}")
    if args.smoke_test:
        log("Smoke test complete. This model is flagged non-production; production "
            "inference will keep using the base BGE model until a real fine-tuned "
            "model exists in ml/models/competitive-bge/.")


if __name__ == "__main__":
    main()
