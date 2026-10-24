#!/usr/bin/env python3
"""
RU Ready AI Interviewer Model — Hugging Face Dataset Exporter & Publisher
========================================================================
Validates and splits interview dataset into train/test, and optionally
pushes to Hugging Face Hub under a user or organization repository.
"""

import argparse
import json
import random
from pathlib import Path


def split_and_package_dataset(
    jsonl_file: Path,
    output_dir: Path,
    test_ratio: float = 0.1,
    hf_repo_id: str = None,
    hf_token: str = None
):
    print(f"[*] Reading dataset from: {jsonl_file}")
    with open(jsonl_file, "r", encoding="utf-8") as f:
        records = [json.loads(line) for line in f if line.strip()]

    print(f"[*] Total parsed dialogues: {len(records)}")

    # Validate structure
    for idx, rec in enumerate(records):
        assert "messages" in rec, f"Record {idx} missing 'messages' key"
        for msg in rec["messages"]:
            assert "role" in msg and "content" in msg, f"Invalid message format in record {idx}"

    random.seed(42)
    random.shuffle(records)

    split_idx = int(len(records) * (1 - test_ratio))
    train_records = records[:split_idx]
    test_records = records[split_idx:]

    output_dir.mkdir(parents=True, exist_ok=True)
    train_file = output_dir / "train.jsonl"
    test_file = output_dir / "test.jsonl"

    with open(train_file, "w", encoding="utf-8") as f:
        for r in train_records:
            f.write(json.dumps(r, ensure_ascii=False) + "\n")

    with open(test_file, "w", encoding="utf-8") as f:
        for r in test_records:
            f.write(json.dumps(r, ensure_ascii=False) + "\n")

    print(f"[SUCCESS] Train set: {len(train_records)} -> {train_file}")
    print(f"[SUCCESS] Test set:  {len(test_records)} -> {test_file}")

    if hf_repo_id:
        try:
            from datasets import load_dataset
            print(f"[*] Uploading dataset to Hugging Face Hub: {hf_repo_id}...")
            dataset = load_dataset("json", data_files={"train": str(train_file), "test": str(test_file)})
            dataset.push_to_hub(hf_repo_id, token=hf_token)
            print(f"[SUCCESS] Dataset successfully published to: https://huggingface.co/datasets/{hf_repo_id}")
        except ImportError:
            print("[WARN] 'datasets' library not installed. Install with `pip install datasets` to push to Hub.")
        except Exception as e:
            print(f"[ERROR] Failed to push to Hugging Face Hub: {e}")


def main():
    parser = argparse.ArgumentParser(description="Export and publish RU Ready Interviewer dataset.")
    parser.add_argument("--input", default="ml/dataset/interview_training_data.jsonl", help="Input JSONL file")
    parser.add_argument("--output-dir", default="ml/dataset/splits", help="Output directory for train/test splits")
    parser.add_argument("--test-ratio", type=float, default=0.1, help="Fraction for test set")
    parser.add_argument("--hf-repo", default=None, help="Optional Hugging Face dataset repo (e.g. username/ru-ready-interviewer)")
    parser.add_argument("--token", default=None, help="Optional Hugging Face write token")

    args = parser.parse_args()
    split_and_package_dataset(
        jsonl_file=Path(args.input),
        output_dir=Path(args.output_dir),
        test_ratio=args.test_ratio,
        hf_repo_id=args.hf_repo,
        hf_token=args.token
    )


if __name__ == "__main__":
    main()
