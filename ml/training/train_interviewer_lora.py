#!/usr/bin/env python3
"""
RU Ready AI Interviewer Model — QLoRA Fine-Tuning Pipeline
==========================================================
Trains our conversational AI interviewer model on multi-turn interview interactions:
- Video & Oral Technical/STAR interviewing
- Coding / DSA Socratic hinting & optimization probing
- System Design scale, trade-offs, and failure mode challenges

Supports execution on:
- Kaggle GPUs (T4 x2 or P100)
- Google Colab (T4 / A100)
- Local Linux / Windows workstation with NVIDIA GPU
- Hugging Face AutoTrain or Spaces
"""

import argparse
import os
import sys
from pathlib import Path
import torch

try:
    from transformers import (
        AutoModelForCausalLM,
        AutoTokenizer,
        BitsAndBytesConfig,
        TrainingArguments
    )
    from peft import LoraConfig, get_peft_model, prepare_model_for_kbit_training
    from trl import SFTTrainer
    from datasets import load_dataset
except ImportError as e:
    print(f"[!] Missing required ML library: {e}")
    print("[!] Install dependencies using: pip install -r ml/requirements-training.txt")


def parse_args():
    parser = argparse.ArgumentParser(description="Fine-tune RU Ready AI Interviewer Model with QLoRA")
    parser.add_argument(
        "--model-name",
        type=str,
        default="meta-llama/Llama-3.2-3B-Instruct",
        help="Base model from Hugging Face Hub (e.g., meta-llama/Llama-3.2-3B-Instruct, Qwen/Qwen2.5-Coder-7B-Instruct)"
    )
    parser.add_argument(
        "--train-file",
        type=str,
        default="ml/dataset/splits/train.jsonl",
        help="Path to training JSONL data"
    )
    parser.add_argument(
        "--test-file",
        type=str,
        default="ml/dataset/splits/test.jsonl",
        help="Path to evaluation JSONL data"
    )
    parser.add_argument(
        "--output-dir",
        type=str,
        default="ml/models/ru_ready_interviewer_adapter",
        help="Directory to save fine-tuned LoRA weights"
    )
    parser.add_argument("--batch-size", type=int, default=2, help="Per-device train batch size")
    parser.add_argument("--grad-accum", type=int, default=4, help="Gradient accumulation steps")
    parser.add_argument("--epochs", type=int, default=3, help="Total training epochs")
    parser.add_argument("--lr", type=float, default=2e-4, help="Peak learning rate")
    parser.add_argument("--max-seq-length", type=int, default=2048, help="Max sequence length for conversation")
    parser.add_argument("--lora-r", type=int, default=16, help="LoRA rank")
    parser.add_argument("--lora-alpha", type=int, default=32, help="LoRA alpha scaling factor")
    parser.add_argument("--lora-dropout", type=float, default=0.05, help="LoRA dropout rate")
    parser.add_argument("--push-to-hub", action="store_true", help="Push adapter to Hugging Face Hub after training")
    parser.add_argument("--hub-model-id", type=str, default=None, help="Target Hugging Face model repository name")
    parser.add_argument("--hf-token", type=str, default=None, help="Hugging Face API token")
    return parser.parse_args()


def train():
    args = parse_args()

    print("=" * 70)
    print(" RU READY AI INTERVIEWER MODEL — TRAINING INITIALIZATION")
    print("=" * 70)
    print(f"Base Model:       {args.model_name}")
    print(f"Training Set:     {args.train_file}")
    print(f"Evaluation Set:   {args.test_file}")
    print(f"Output Adapter:   {args.output_dir}")
    print(f"CUDA Available:   {torch.cuda.is_available()}")
    if torch.cuda.is_available():
        print(f"GPU Device:       {torch.cuda.get_device_name(0)}")
        print(f"Device VRAM:      {torch.cuda.get_device_properties(0).total_memory / (1024**3):.2f} GB")
    print("=" * 70)

    # 1. Quantization Configuration (4-bit NF4)
    bnb_config = BitsAndBytesConfig(
        load_in_4bit=True,
        bnb_4bit_quant_type="nf4",
        bnb_4bit_compute_dtype=torch.bfloat16 if torch.cuda.is_bf16_supported() else torch.float16,
        bnb_4bit_use_double_quant=True
    )

    # 2. Load Tokenizer
    print("\n[1/5] Loading tokenizer...")
    tokenizer = AutoTokenizer.from_pretrained(
        args.model_name,
        token=args.hf_token or os.environ.get("HF_TOKEN"),
        trust_remote_code=True
    )
    if tokenizer.pad_token is None:
        tokenizer.pad_token = tokenizer.eos_token
    tokenizer.padding_side = "right"

    # 3. Load Base Model in 4-bit
    print(f"\n[2/5] Loading base model ({args.model_name}) in 4-bit precision...")
    device_map = "auto" if torch.cuda.is_available() else None
    model = AutoModelForCausalLM.from_pretrained(
        args.model_name,
        quantization_config=bnb_config if torch.cuda.is_available() else None,
        device_map=device_map,
        token=args.hf_token or os.environ.get("HF_TOKEN"),
        trust_remote_code=True,
        torch_dtype=torch.bfloat16 if torch.cuda.is_bf16_supported() else torch.float16
    )

    if torch.cuda.is_available():
        model = prepare_model_for_kbit_training(model)

    # 4. Configure LoRA
    print("\n[3/5] Configuring LoRA PEFT adapters...")
    target_modules = [
        "q_proj", "k_proj", "v_proj", "o_proj",
        "gate_proj", "up_proj", "down_proj"
    ]
    peft_config = LoraConfig(
        r=args.lora_r,
        lora_alpha=args.lora_alpha,
        lora_dropout=args.lora_dropout,
        target_modules=target_modules,
        bias="none",
        task_type="CAUSAL_LM"
    )
    model = get_peft_model(model, peft_config)
    model.print_trainable_parameters()

    # 5. Load and format dataset
    print("\n[4/5] Loading multi-turn interview conversations...")
    data_files = {"train": args.train_file}
    if os.path.exists(args.test_file):
        data_files["test"] = args.test_file
    
    dataset = load_dataset("json", data_files=data_files)

    def formatting_prompts_func(example):
        """Formats multi-turn messages array into model chat template string."""
        texts = []
        for messages in example["messages"]:
            formatted = tokenizer.apply_chat_template(
                messages,
                tokenize=False,
                add_generation_prompt=False
            )
            texts.append(formatted)
        return texts

    # 6. Training Arguments & SFTTrainer
    print("\n[5/5] Launching SFTTrainer training loop...")
    training_args = TrainingArguments(
        output_dir=args.output_dir,
        per_device_train_batch_size=args.batch_size,
        gradient_accumulation_steps=args.grad_accum,
        num_train_epochs=args.epochs,
        learning_rate=args.lr,
        lr_scheduler_type="cosine",
        warmup_ratio=0.03,
        logging_steps=10,
        save_strategy="epoch",
        evaluation_strategy="epoch" if "test" in dataset else "no",
        fp16=not torch.cuda.is_bf16_supported() and torch.cuda.is_available(),
        bf16=torch.cuda.is_bf16_supported(),
        optim="paged_adamw_8bit" if torch.cuda.is_available() else "adamw_torch",
        report_to="none",
        push_to_hub=args.push_to_hub,
        hub_model_id=args.hub_model_id,
        hub_token=args.hf_token or os.environ.get("HF_TOKEN")
    )

    trainer = SFTTrainer(
        model=model,
        train_dataset=dataset["train"],
        eval_dataset=dataset.get("test"),
        peft_config=peft_config,
        dataset_text_field="text",
        formatting_func=formatting_prompts_func,
        max_seq_length=args.max_seq_length,
        tokenizer=tokenizer,
        args=training_args
    )

    trainer.train()

    print(f"\n[SUCCESS] Training completed! Saving LoRA adapter weights to: {args.output_dir}")
    trainer.save_model(args.output_dir)
    tokenizer.save_pretrained(args.output_dir)

    if args.push_to_hub and args.hub_model_id:
        print(f"[SUCCESS] Pushing model adapter to Hugging Face Hub: {args.hub_model_id}")
        trainer.push_to_hub()
        print(f"[SUCCESS] Available at: https://huggingface.co/{args.hub_model_id}")


if __name__ == "__main__":
    train()
