# Rennetus Local LLM: Llama 3.1 8B Training & Context Blueprint

This directory contains the complete pipeline for generating datasets, fine-tuning **Llama 3.1 8B Instruct** using Q-LoRA, and serving it locally via **Ollama** with full-session context memory.

---

## 1. Quick Start: Local Llama 3.1 Setup

### A. Start Ollama & Pull Llama 3.1
```bash
# Start Ollama service (if not already running)
ollama serve

# Pull base Llama 3.1 8B Instruct
ollama pull llama3.1
```

### B. Environment Configuration (`.env`)
```env
AI_PROVIDER=ollama
AI_OLLAMA_BASE_URL=http://127.0.0.1:11434/v1
AI_OLLAMA_MODEL=llama3.1
AI_API_BASE_URL=http://127.0.0.1:11434/v1
AI_MODEL=llama3.1
AI_MOCK=false
```

---

## 2. Dataset Generation & Acquisition

### Option A: Generate Synthetic Interview Datasets (Included)
Run the generator script to create multi-turn interview conversations covering Frontend, Backend, Fullstack, AI/ML, and DevOps:
```bash
py training/generate_dataset.py
```
This generates:
- `training/rennetus_interview_train.jsonl` (900 multi-turn conversation pairs)
- `training/rennetus_interview_eval.jsonl` (100 validation pairs)

### Option B: Download Real Open-Source Datasets from Hugging Face
You can augment the training data with top open-source coding & interview datasets:
1. **`HuggingFaceH4/ultrachat_200k`**: Multi-turn dialogue, reasoning, and clarifying conversations.
2. **`sahil2801/CodeAlpaca-20k`**: Coding problem descriptions, constraints, and algorithmic solutions.
3. **`greentfrapp/interview-qa`**: Real-world software engineering interview Q&A.
4. **`vuk/system-design-interview`**: High-level distributed system design questions & capacity trade-offs.

---

## 3. Fine-Tuning Llama 3.1 with Q-LoRA (Unsloth)

### Prerequisites:
Install training dependencies (Google Colab or Local GPU with $\ge 8\text{GB}$ VRAM):
```bash
pip install torch transformers datasets trl unsloth
```

### Run Fine-Tuning:
```bash
py training/train_unsloth.py
```

### Training Highlights:
- **Quantization**: 4-bit NormalFloat (fits on single consumer GPU: RTX 3060/4060/4070 or Colab T4).
- **LoRA Rank**: 64 (Alpha 128) across all linear projection layers (`q, k, v, o, gate, up, down`).
- **Context Length**: 4,096 tokens per sample.
- **Export**: Generates quantized GGUF (`rennetus-llama3.1-8b-q8_0.gguf`).

---

## 4. Packaging into Ollama

Once trained, package the model with your custom system prompt and sampling parameters:
```bash
ollama create rennetus-interviewer -f training/Modelfile
```

Test the model in your terminal:
```bash
ollama run rennetus-interviewer
```
