"""
Rennetus — Llama 3.1 8B Instruct Fine-Tuning Pipeline
Powered by Unsloth & Hugging Face TRL (Fast Q-LoRA on single GPU / Colab)
"""

import os
import torch
from datasets import load_dataset
from trl import SFTTrainer
from transformers import TrainingArguments
from unsloth import FastLanguageModel

# 1. Model Configuration
MAX_SEQ_LENGTH = 4096
DTYPE = None  # None for auto detection (Float16 or Bfloat16)
LOAD_IN_4BIT = True  # 4bit quantization to fit in <=8GB VRAM

print("Loading base Llama-3.1-8B-Instruct...")
model, tokenizer = FastLanguageModel.from_pretrained(
    model_name="unsloth/Meta-Llama-3.1-8B-Instruct-bnb-4bit",
    max_seq_length=MAX_SEQ_LENGTH,
    dtype=DTYPE,
    load_in_4bit=LOAD_IN_4BIT,
)

# 2. Add LoRA Adapters
model = FastLanguageModel.get_peft_model(
    model,
    r=64,
    target_modules=["q_proj", "k_proj", "v_proj", "o_proj", "gate_proj", "up_proj", "down_proj"],
    lora_alpha=128,
    lora_dropout=0,  # Optimized to 0 for Unsloth
    bias="none",
    use_gradient_checkpointing="unsloth",
    random_state=3407,
)

# 3. Load & Format Dataset
data_dir = os.path.dirname(os.path.abspath(__file__))
train_path = os.path.join(data_dir, "full_rennetus_benchmark_train.jsonl")
eval_path = os.path.join(data_dir, "full_rennetus_benchmark_eval.jsonl")

dataset = load_dataset("json", data_files={"train": train_path, "validation": eval_path})

def formatting_prompts_func(examples):
    convos = examples["messages"]
    texts = [tokenizer.apply_chat_template(convo, tokenize=False, add_generation_prompt=False) for convo in convos]
    return {"text": texts}

dataset = dataset.map(formatting_prompts_func, batched=True)

# 4. Training Arguments
training_args = TrainingArguments(
    per_device_train_batch_size=2,
    gradient_accumulation_steps=4,
    warmup_steps=10,
    max_steps=120,
    learning_rate=2e-4,
    fp16=not torch.cuda.is_bf16_supported(),
    bf16=torch.cuda.is_bf16_supported(),
    logging_steps=10,
    optim="adamw_8bit",
    weight_decay=0.01,
    lr_scheduler_type="linear",
    seed=3407,
    output_dir="outputs",
    save_strategy="steps",
    save_steps=60,
    eval_strategy="steps",
    eval_steps=30,
)

# 5. Trainer
trainer = SFTTrainer(
    model=model,
    tokenizer=tokenizer,
    train_dataset=dataset["train"],
    eval_dataset=dataset["validation"],
    dataset_text_field="text",
    max_seq_length=MAX_SEQ_LENGTH,
    dataset_num_proc=2,
    packing=False,
    args=training_args,
)

print("Starting Fine-Tuning on Rennetus Interview Dataset...")
trainer.train()

# 6. Save GGUF for Ollama
print("Saving fine-tuned GGUF model for Ollama...")
model.save_pretrained_gguf("rennetus-llama3.1-8b", tokenizer, quantization_method="q8_0")
print("Done! You can now import the model into Ollama using 'ollama create rennetus-interviewer -f Modelfile'")
