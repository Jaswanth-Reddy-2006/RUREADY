# ML Layer — Competitive Score (Model 3)

This directory contains everything related to the **resume ↔ job-description
semantic matcher** that powers the Competitive Score.

## Model separation (strict)

| Model | Purpose | Location |
|---|---|---|
| 1. Docling | Document extraction | `parser/document_parser.py` |
| 2. Deterministic ATS Quality Engine | Role-independent ATS Score (six pillars, 100 pts) | `ats/bge_ats_scorer.py` |
| 3. Fine-tuned BGE matcher | Competitive Score / resume-JD matching ONLY | `ml/` (this directory) |

The resume/JD dataset used here is **never** ground truth for the six-pillar
ATS Score, and the three models are never merged into one opaque score.

## Structure

```
ml/
  datasets/resume-ats-score-v1-en/   # 0xnbk/resume-ats-score-v1-en CSVs (auto-downloaded)
  training/train_competitive_model.py
  training/requirements-training.txt # training-only deps (not needed in production)
  models/competitive-bge/            # production fine-tuned model (created by a full training run)
  models/competitive-bge-smoketest/  # smoke-test output — flagged non-production, never loaded by inference
  inference/competitive_matcher.py   # CLI used by the backend via subprocess
```

## Training

Base model: `BAAI/bge-large-en-v1.5`. Objective: `CosineSimilarityLoss` on
`ats_score / 100`. Device: CUDA automatically when available.

Local CPU smoke test (~150 examples, validates the pipeline end-to-end; output
is flagged `"smoke_test": true` and is refused by production inference):

```bash
python ml/training/train_competitive_model.py --smoke-test
```

Full run (GPU / Google Colab — 5,099 train / 1,275 validation pairs):

```bash
pip install -r ml/training/requirements-training.txt
python ml/training/train_competitive_model.py --epochs 2 --batch-size 16
```

Outputs: model weights, `calibration.json` (cosine→score linear calibration,
tier thresholds, blend weights, validation metrics) and `training_report.json`.

Validation metrics produced: Spearman, Pearson, calibrated RMSE (points),
3-tier accuracy, cosine distribution stats.

## Inference

`ml/inference/competitive_matcher.py` loads
`ml/models/competitive-bge/` when it contains a production calibration
(`fine_tuned: true`, `smoke_test: false`); otherwise it falls back to the base
BGE model from the HF cache. It never trains and never re-downloads at API
startup.

CLI contract (same subprocess style as `ats/bge_ats_scorer.py`):

```bash
python ml/inference/competitive_matcher.py '<payload.json | inline-json>'
# payload: {"resumeText": ..., "jobDescription": ..., "role"?: ..., "structuredElements"?: [...]}
# stdout:  {"success": true, "data": {...}}
```

### Competitive Score (transparent, documented weights)

```
score = 100 * ( 0.45 * semanticSimilarity    # calibrated cosine (calibration.json or documented base ramp)
              + 0.25 * skillOverlap          # explicit skill intersection / JD skills (no inferred skills)
              + 0.15 * experienceRelevance   # mean of top-3 resume-chunk ↔ JD similarities
              + 0.15 * terminologyMatch )    # salient JD unigram+bigram coverage in the resume
```

Role-match gate (multi-signal, not embedding-only):

```
MATCHED iff semanticSimilarity >= 0.30
        AND ( skillOverlap >= 0.20 OR terminologyMatch >= 0.45 OR experienceRelevance >= 0.55 )
otherwise status = NOT_RELEVANT, score = null (N/A — never 0)
```

No sentiment models and no LLMs are used in this layer.

## Backend wiring

- `src/services/competitiveMatch.service.ts` — spawns the matcher (subprocess).
- `POST /api/resume-parser/evaluate` — returns `{ ats, competitive }` (Phase-11 shape).
- `src/services/ats.service.ts` — `analyzeResumeAndJob` uses the matcher for the
  numeric match score; the LLM only contributes qualitative fields.

## Tests

```bash
npm run test:matcher:py   # unit tests (model-free: gate, calibration, skills, terminology)
npm run test:matcher      # integration test through the TS bridge (loads BGE once)
```
