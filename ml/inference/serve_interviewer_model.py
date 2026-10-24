#!/usr/bin/env python3
"""
RU Ready AI Interviewer Model — FastAPI Inference Server
=========================================================
Exposes the fine-tuned Interviewer Model (LoRA adapter + base model)
via OpenAI-compatible /v1/chat/completions and dedicated interview endpoints.

Integrates directly with RU Ready microservices:
- oral-interview-service
- coding-interview-service
- system-design-service
- ai-analysis-service
"""

import argparse
import os
import time
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import torch

app = FastAPI(
    title="RU Ready AI Interviewer Inference Engine",
    description="Custom-trained LLM for Video, Coding & System Design Interviews",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global model state
MODEL = None
TOKENIZER = None
DEVICE = "cuda" if torch.cuda.is_available() else "cpu"

SYSTEM_PROMPT = """You are Ava, a Principal Engineering Lead and Staff Technical Interviewer for RU Ready.
Your persona is authentic, observant, conversational, and technically rigorous.
Always bridge naturally from candidate points, probe for failure modes and trade-offs, and guide coding via progressive hints without giving away solutions."""

# ─────────────────────────────────────────────────────────────────────────────
# PYDANTIC SCHEMAS
# ─────────────────────────────────────────────────────────────────────────────

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatCompletionRequest(BaseModel):
    model: Optional[str] = "ru-ready-interviewer"
    messages: List[ChatMessage]
    temperature: Optional[float] = 0.7
    max_tokens: Optional[int] = 512
    stream: Optional[bool] = False

class FollowUpRequest(BaseModel):
    question: str
    answer: str
    track: Optional[str] = "ORAL" # "ORAL" | "CODING" | "SYSTEM_DESIGN"
    candidateHesitated: Optional[bool] = False

class HintRequest(BaseModel):
    problemTitle: str
    problemDescription: str
    candidateCode: str
    hintTier: Optional[int] = 1 # 1: Nudge, 2: Structural, 3: Syntax

# ─────────────────────────────────────────────────────────────────────────────
# MODEL INFERENCE LOGIC
# ─────────────────────────────────────────────────────────────────────────────

def generate_response(messages: List[Dict[str, str]], max_new_tokens: int = 512, temperature: float = 0.7) -> str:
    global MODEL, TOKENIZER
    if MODEL is None or TOKENIZER is None:
        # Fallback simulation if running without downloaded GPU weights
        last_user_msg = next((m["content"] for m in reversed(messages) if m["role"] == "user"), "")
        return (
            f"I hear your point regarding: '{last_user_msg[:60]}...'. Building on that, "
            f"how does your architecture defend against partition events or memory leaks under peak traffic?"
        )

    prompt = TOKENIZER.apply_chat_template(messages, tokenize=False, add_generation_prompt=True)
    inputs = TOKENIZER(prompt, return_tensors="pt").to(DEVICE)

    with torch.no_grad():
        outputs = MODEL.generate(
            **inputs,
            max_new_tokens=max_new_tokens,
            temperature=temperature,
            top_p=0.9,
            do_sample=True if temperature > 0 else False,
            eos_token_id=TOKENIZER.eos_token_id
        )

    gen_tokens = outputs[0][inputs.input_ids.shape[1]:]
    return TOKENIZER.decode(gen_tokens, skip_special_tokens=True).strip()

# ─────────────────────────────────────────────────────────────────────────────
# ENDPOINTS
# ─────────────────────────────────────────────────────────────────────────────

@app.get("/health")
def health():
    return {
        "status": "OPERATIONAL",
        "device": DEVICE,
        "modelLoaded": MODEL is not None,
        "cudaMemory": f"{torch.cuda.memory_allocated() / (1024**2):.1f} MB" if torch.cuda.is_available() else "N/A"
    }

@app.post("/v1/chat/completions")
def chat_completions(req: ChatCompletionRequest):
    """OpenAI-compatible chat completion endpoint."""
    messages = [{"role": m.role, "content": m.content} for m in req.messages]
    
    # Ensure system prompt is present
    if not any(m["role"] == "system" for m in messages):
        messages.insert(0, {"role": "system", "content": SYSTEM_PROMPT})

    start_time = time.time()
    reply = generate_response(messages, max_new_tokens=req.max_tokens or 512, temperature=req.temperature or 0.7)
    elapsed = time.time() - start_time

    return {
        "id": f"chatcmpl-ru-ready-{int(time.time())}",
        "object": "chat.completion",
        "created": int(time.time()),
        "model": req.model,
        "choices": [
            {
                "index": 0,
                "message": {"role": "assistant", "content": reply},
                "finish_reason": "stop"
            }
        ],
        "usage": {
            "prompt_tokens": 128,
            "completion_tokens": len(reply.split()),
            "total_tokens": 128 + len(reply.split())
        },
        "latency_ms": round(elapsed * 1000, 2)
    }

@app.post("/interviewer/followup")
def ask_followup(req: FollowUpRequest):
    """Specialized follow-up generator with natural conversational bridging."""
    messages = [
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "assistant", "content": req.question},
        {"role": "user", "content": req.answer}
    ]
    followup = generate_response(messages, max_new_tokens=256, temperature=0.7)
    return {
        "followUpQuestion": followup,
        "bridgeAcknowledged": True,
        "track": req.track
    }

@app.post("/interviewer/hint")
def generate_hint(req: HintRequest):
    """Socratic 3-tier progressive hint generator for coding interviews."""
    tier_desc = {
        1: "Tier 1: Subtle conceptual nudge. Remind them of the underlying property without naming data structures.",
        2: "Tier 2: Structural direction. Mention the optimal data structure or two-pointer / prefix-sum paradigm.",
        3: "Tier 3: Concrete algorithmic pattern. Give the exact loop invariant or edge case handling pattern."
    }.get(req.hintTier, "Tier 1: Subtle conceptual nudge.")

    messages = [
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "assistant", "content": f"Problem: {req.problemTitle}\n{req.problemDescription}"},
        {"role": "user", "content": f"Candidate code:\n{req.candidateCode}\nI'm stuck. Can you give me a hint?"},
        {"role": "system", "content": f"Instruction: Provide a {tier_desc} Do not output the full solution code."}
    ]
    hint = generate_response(messages, max_new_tokens=200, temperature=0.6)
    return {
        "hintTier": req.hintTier,
        "hint": hint
    }


def main():
    parser = argparse.ArgumentParser(description="Serve RU Ready AI Interviewer Model")
    parser.add_argument("--base-model", type=str, default="Qwen/Qwen2.5-Coder-7B-Instruct")
    parser.add_argument("--adapter-dir", type=str, default=None, help="Path to trained LoRA adapter directory")
    parser.add_argument("--port", type=int, default=8000)
    parser.add_argument("--host", type=str, default="0.0.0.0")
    args = parser.parse_args()

    global MODEL, TOKENIZER

    if args.adapter_dir and os.path.exists(args.adapter_dir):
        try:
            from transformers import AutoModelForCausalLM, AutoTokenizer
            from peft import PeftModel
            print(f"[*] Loading base model {args.base_model} and adapter {args.adapter_dir}...")
            TOKENIZER = AutoTokenizer.from_pretrained(args.adapter_dir, trust_remote_code=True)
            base = AutoModelForCausalLM.from_pretrained(
                args.base_model,
                torch_dtype=torch.bfloat16 if torch.cuda.is_available() else torch.float32,
                device_map="auto" if torch.cuda.is_available() else None,
                trust_remote_code=True
            )
            MODEL = PeftModel.from_pretrained(base, args.adapter_dir)
            print("[SUCCESS] Loaded fine-tuned Interviewer Model into memory!")
        except Exception as e:
            print(f"[WARN] Could not load weights directly ({e}). Running in lightweight simulation mode.")
    else:
        print("[INFO] No adapter directory specified or found. Starting server in API simulation mode.")

    uvicorn.run(app, host=args.host, port=args.port)


if __name__ == "__main__":
    main()
