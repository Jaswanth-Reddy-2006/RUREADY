# 🏆 Kaggle GPU Training Quickstart Guide
## Fine-Tuning RU Ready AI Interviewer Model (Video, Coding & System Design)

Follow this 5-minute setup to train the interviewer model on Kaggle using free NVIDIA GPUs (T4 x2 or P100).

---

### Prerequisites
1. A free account on [Kaggle](https://www.kaggle.com).
2. Phone-verified account on Kaggle (required to enable free GPU hours: 30 hours per week).
3. Optional: A free account on [Hugging Face](https://huggingface.co) if you want to push model weights to the Hub.

---

### Step-by-Step Instructions

#### 1. Create a New Kaggle Notebook
1. Go to [kaggle.com/code](https://www.kaggle.com/code).
2. Click **New Notebook**.
3. In the notebook top menu: **File** → **Upload Notebook**.
4. Select the file from your local repository:
   `ml/kaggle/ru_ready_interviewer_training_kaggle.ipynb`

#### 2. Enable GPU Acceleration
1. Look at the right sidebar panel under **Notebook Settings**.
2. Find the **Accelerator** dropdown.
3. Select **GPU T4 x2** (recommended, dual 16GB VRAM) or **GPU P100** (16GB VRAM).
4. Ensure **Internet** is toggled to **ON** (needed to download Hugging Face packages and base model weights).

#### 3. Optional: Add Hugging Face Token (For LLaMA 3.2 or Hub Uploads)
If using `meta-llama/Llama-3.2-3B-Instruct` or pushing model weights back to your Hugging Face account:
1. In Kaggle, go to **Add-ons** → **Secrets**.
2. Add a new secret with Label: `HF_TOKEN` and Value: `your_huggingface_write_token`.
3. (If you use `Qwen/Qwen2.5-Coder-7B-Instruct`, no token is required as it is completely open-access).

#### 4. Run the Training Pipeline
1. Click **Run All** (or `Shift + Enter` through each cell).
2. The notebook will:
   - Install `transformers`, `peft`, `trl`, `bitsandbytes`, and `accelerate`.
   - Load the curated multi-turn interview dataset across Oral, Coding, and System Design tracks.
   - Quantize the base model in 4-bit NormalFloat4 (NF4).
   - Configure and attach LoRA trainable adapter ranks.
   - Run SFTTrainer for 3 epochs (~20 to 35 minutes depending on GPU).
   - Execute test inferences for:
     * Oral interview technical follow-up challenge
     * Coding interview progressive Socratic hints
     * System design scale and failure-mode probe
   - Save the LoRA weights to `/kaggle/working/ru_ready_interviewer_adapter`.

#### 5. Download or Deploy the Trained Weights
- **Option A (Direct Download)**: In the right sidebar under **Output**, download the `ru_ready_interviewer_adapter` zip archive containing `adapter_model.safetensors` and `adapter_config.json`.
- **Option B (Hugging Face Hub)**: Uncomment Step 8 in the notebook to push directly to your Hugging Face repository with `model.push_to_hub("username/ru-ready-interviewer-lora")`.

#### 6. Plug into RU Ready
Once downloaded, place the adapter into `ml/models/ru_ready_interviewer_adapter` and run:
```bash
python ml/inference/serve_interviewer_model.py --adapter-dir ml/models/ru_ready_interviewer_adapter
```
RU Ready microservices can now interact directly with your custom-trained interviewer!
