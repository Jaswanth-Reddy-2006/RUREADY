# 🧠 RU Ready AI Interviewer Model — ML Training & Fine-Tuning Suite
### Specialized Question Asking, Follow-up Probing & Socratic Interactions
#### Powered by Hugging Face (Transformers, PEFT, TRL) & Kaggle GPU (T4 x2 / P100)

This directory contains the complete end-to-end Machine Learning pipeline to train, fine-tune, and deploy custom LLM interviewer personas (**Ava** & **Ethan**) for the **RU Ready** platform.

---

## 🎯 3 Specialized Interview Tracks Trained

| Track | Interviewer Core Competencies | Model Training Focus |
|---|---|---|
| **📹 Video & Oral Interviewing** | Authentic human opening questions, conversational bridging ("I like how you structured the caching layer..."), Socratic architectural defenses, behavioral STAR probing. | Natural turn-taking, handling candidate interruptions & hesitations, zero-flattery rigorous evaluation. |
| **💻 Coding & DSA Interviewing** | Problem scoping, 3-tier progressive hinting (nudge → structural direction → syntax pattern), edge-case identification. | Never prematurely outputting full solution code; probing for $O(1)$ space and $O(N)$ time limits. |
| **🏗️ System Design Interviewing** | Scoping functional & non-functional requirements, traffic math ($QPS$, bandwidth, storage), SPOF & bottleneck stress-testing. | Probing for CAP/PACELC trade-offs, network partition handling, cache stampede mitigation, database sharding. |

---

## 📂 Repository Structure

```
ml/
├── README.md                               # Architecture & usage manual (this file)
├── requirements-training.txt               # Pinned GPU training dependencies
│
├── dataset/
│   ├── generate_interview_dataset.py       # Multi-turn conversational dataset synthesizer
│   ├── export_hf_dataset.py                # Train/Test splitter & Hugging Face Hub publisher
│   ├── interview_training_data.jsonl       # Full generated multi-turn dataset
│   └── splits/
│       ├── train.jsonl                     # 90% Training split (ChatML format)
│       └── test.jsonl                      # 10% Validation split (ChatML format)
│
├── training/
│   ├── train_interviewer_lora.py           # Production QLoRA (4-bit NF4) fine-tuning script
│   └── config.yaml                         # Hyperparameter configs (Batch size, LoRA rank, LR)
│
├── kaggle/
│   ├── ru_ready_interviewer_training_kaggle.ipynb # Ready-to-run Kaggle GPU notebook
│   └── kaggle_quickstart.md                # 5-minute setup instructions for free Kaggle T4 GPUs
│
└── inference/
    ├── serve_interviewer_model.py          # FastAPI OpenAI-compatible (/v1/chat/completions) server
    └── test_model_inference.py             # Validation test runner across all 3 tracks
```

---

## 🚀 Quickstart: Train on Kaggle (Free Dual T4 GPUs)

1. Open **[kaggle.com/code](https://www.kaggle.com/code)** and click **New Notebook**.
2. Go to **File → Upload Notebook** and select:
   `ml/kaggle/ru_ready_interviewer_training_kaggle.ipynb`
3. Under **Settings → Accelerator**, select **GPU T4 x2**.
4. Click **Run All**. In ~25–30 minutes, your custom interviewer LoRA adapter will be trained and saved in `/kaggle/working/ru_ready_interviewer_adapter`.
5. See [`ml/kaggle/kaggle_quickstart.md`](file:///c:/Users/Jaswanth%20Reddy/OneDrive/Desktop/Projects/RU_Ready/ml/kaggle/kaggle_quickstart.md) for full walkthrough.

---

## ⚡ Local Training / Hugging Face Hub Workflow

### 1. Generate Dataset
```bash
py ml/dataset/generate_interview_dataset.py
py ml/dataset/export_hf_dataset.py --hf-repo your-username/ru-ready-interviewer-dataset --token $HF_TOKEN
```

### 2. Fine-Tune with QLoRA (4-bit)
```bash
pip install -r ml/requirements-training.txt

python ml/training/train_interviewer_lora.py \
  --model-name "Qwen/Qwen2.5-Coder-7B-Instruct" \
  --train-file "ml/dataset/splits/train.jsonl" \
  --test-file "ml/dataset/splits/test.jsonl" \
  --output-dir "ml/models/ru_ready_interviewer_adapter" \
  --epochs 3 \
  --batch-size 2 \
  --grad-accum 4 \
  --lr 2e-4
```

### 3. Serve the Model
```bash
python ml/inference/serve_interviewer_model.py \
  --base-model "Qwen/Qwen2.5-Coder-7B-Instruct" \
  --adapter-dir "ml/models/ru_ready_interviewer_adapter" \
  --port 8000
```

The server exposes:
- `http://localhost:8000/v1/chat/completions` (OpenAI drop-in compatibility)
- `http://localhost:8000/interviewer/followup` (Conversational follow-up generator)
- `http://localhost:8000/interviewer/hint` (3-tier progressive coding hints)

---

## 🔗 Connecting to RU Ready Microservices

In `.env`, configure the AI provider to point to your fine-tuned model:
```env
AI_PROVIDER=ollama
AI_OLLAMA_BASE_URL=http://localhost:8000/v1
AI_OLLAMA_MODEL=ru-ready-interviewer
```
All interview services (`oral-interview-service`, `coding-interview-service`, `system-design-service`, `ai-analysis-service`) will automatically route prompts through your custom fine-tuned interviewer model!
