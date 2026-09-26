"""
Rennetus — Production Fine-Tuning Pipeline
Fine-tunes the Interviewer model using Hugging Face Transformers, Datasets, and PEFT (LoRA).
Works seamlessly across GPU (CUDA/MPS) and CPU.
"""

import os
import sys

# Force pure PyTorch backend in Transformers
os.environ["USE_TF"] = "0"
os.environ["USE_TORCH"] = "1"
os.environ["TF_ENABLE_ONEDNN_OPTS"] = "0"
sys.modules['tensorflow'] = None
sys.modules['keras'] = None

import torch
from datasets import load_dataset
from transformers import (
    AutoTokenizer,
    AutoModelForCausalLM,
    TrainingArguments,
    Trainer,
    DataCollatorForSeq2Seq
)
from peft import LoraConfig, get_peft_model, TaskType

def train():
    base_model_name = os.environ.get("BASE_MODEL", "meta-llama/Llama-3.2-1B-Instruct" if not torch.cuda.is_available() else "meta-llama/Meta-Llama-3.1-8B-Instruct")
    
    # Fallback to local small open model for CPU fine-tuning verification if no HuggingFace token
    local_eval_mode = "--cpu-quick" in sys.argv or not torch.cuda.is_available()
    if local_eval_mode:
        base_model_name = "Qwen/Qwen2.5-0.5B-Instruct"
        print(f"[Notice] CPU environment detected. Using fast base model '{base_model_name}' for local training & verification.")
    else:
        print(f"Using standard base model: '{base_model_name}'")

    print(f"Loading Tokenizer for {base_model_name}...")
    tokenizer = AutoTokenizer.from_pretrained(base_model_name, trust_remote_code=True)
    if tokenizer.pad_token is None:
        tokenizer.pad_token = tokenizer.eos_token

    print(f"Loading Base Model {base_model_name}...")
    model = AutoModelForCausalLM.from_pretrained(
        base_model_name,
        torch_dtype=torch.float32 if local_eval_mode else torch.bfloat16,
        device_map="auto" if torch.cuda.is_available() else None,
        trust_remote_code=True
    )

    # Configure LoRA Adapters
    lora_config = LoraConfig(
        r=16,
        lora_alpha=32,
        target_modules=["q_proj", "k_proj", "v_proj", "o_proj"],
        lora_dropout=0.05,
        bias="none",
        task_type=TaskType.CAUSAL_LM
    )
    model = get_peft_model(model, lora_config)
    model.print_trainable_parameters()

    # Load master benchmark dataset
    script_dir = os.path.dirname(os.path.abspath(__file__))
    train_file = os.path.join(script_dir, "full_rennetus_benchmark_train.jsonl")
    eval_file = os.path.join(script_dir, "full_rennetus_benchmark_eval.jsonl")

    raw_dataset = load_dataset("json", data_files={"train": train_file, "validation": eval_file})

    def preprocess_function(examples):
        input_ids_list = []
        labels_list = []

        for conv in examples["messages"]:
            # Format using chat template with truncation
            formatted_text = tokenizer.apply_chat_template(conv, tokenize=False)
            tokens = tokenizer(formatted_text, max_length=256, truncation=True)
            input_ids = tokens["input_ids"]
            labels = list(input_ids)
            input_ids_list.append(input_ids)
            labels_list.append(labels)

        return {"input_ids": input_ids_list, "labels": labels_list}

    print("Preprocessing and tokenizing training dataset...")
    tokenized_dataset = raw_dataset.map(preprocess_function, batched=True, remove_columns=raw_dataset["train"].column_names)

    output_dir = os.path.join(script_dir, "rennetus_finetuned_adapter")
    training_args = TrainingArguments(
        output_dir=output_dir,
        per_device_train_batch_size=1,
        gradient_accumulation_steps=1,
        warmup_steps=2,
        max_steps=10 if local_eval_mode else 150,
        learning_rate=3e-4,
        logging_steps=2,
        save_strategy="no",
        eval_strategy="no",
        use_cpu=not torch.cuda.is_available(),
        report_to="none"
    )

    data_collator = DataCollatorForSeq2Seq(tokenizer=tokenizer, model=model, padding=True)

    trainer = Trainer(
        model=model,
        args=training_args,
        train_dataset=tokenized_dataset["train"],
        eval_dataset=tokenized_dataset["validation"],
        data_collator=data_collator,
    )

    print("\nStarting LoRA Fine-Tuning on Rennetus Master Interview Dataset...")
    trainer.train()

    print(f"\nSaving fine-tuned adapter to {output_dir}...")
    model.save_pretrained(output_dir)
    tokenizer.save_pretrained(output_dir)
    print("Fine-tuning completed successfully!")

if __name__ == "__main__":
    train()
