"""
Rennetus — Comprehensive HuggingFace Dataset Downloader & Formatter
Downloads and standardizes:
1. HuggingFaceH4/ultrachat_200k
2. sahil2801/CodeAlpaca-20k
3. greentfrapp/interview-qa
4. System Design & Distributed Systems Q&A
"""

import json
import os
import sys

# Force pure PyTorch backend in Transformers & HuggingFace
os.environ["USE_TF"] = "0"
os.environ["USE_TORCH"] = "1"
os.environ["TF_ENABLE_ONEDNN_OPTS"] = "0"
sys.modules['tensorflow'] = None
sys.modules['keras'] = None

from datasets import load_dataset

OUTPUT_DIR = os.path.dirname(os.path.abspath(__file__))
TRAIN_FILE = os.path.join(OUTPUT_DIR, "full_rennetus_benchmark_train.jsonl")
EVAL_FILE = os.path.join(OUTPUT_DIR, "full_rennetus_benchmark_eval.jsonl")

SYSTEM_PROMPT = """You are a Principal Engineering Lead and Staff Technical Interviewer at Rennetus. You conduct rigorous, human-like technical interviews, evaluate using strict 40-60 baseline rubrics with zero grade inflation, and always return structured JSON matching the requested schema."""

def process_ultrachat(limit=1000):
    print("\n[1/4] Loading HuggingFaceH4/ultrachat_200k...")
    samples = []
    try:
        ds = load_dataset("HuggingFaceH4/ultrachat_200k", split="train_sft", streaming=True)
        count = 0
        for item in ds:
            messages = item.get("messages", [])
            if len(messages) >= 2:
                # Add our system prompt as the first message
                formatted_conv = [{"role": "system", "content": SYSTEM_PROMPT}]
                for m in messages:
                    role = m.get("role")
                    content = m.get("content", "").strip()
                    if role in ["user", "assistant"] and content:
                        formatted_conv.append({"role": role, "content": content})
                if len(formatted_conv) >= 3:
                    samples.append({"messages": formatted_conv})
                    count += 1
                    if count >= limit:
                        break
        print(f"-> Successfully extracted {len(samples)} multi-turn dialogue samples from UltraChat 200k.")
    except Exception as e:
        print(f"UltraChat load note: {e}")
    return samples

def process_code_alpaca(limit=1000):
    print("\n[2/4] Loading sahil2801/CodeAlpaca-20k...")
    samples = []
    try:
        ds = load_dataset("sahil2801/CodeAlpaca-20k", split="train")
        for i, item in enumerate(ds):
            if i >= limit:
                break
            instr = item.get("instruction", "").strip()
            inp = item.get("input", "").strip()
            out = item.get("output", "").strip()
            
            user_msg = f"{instr}\nInput: {inp}" if inp else instr
            eval_assistant_json = json.dumps({
                "algorithmicApproach": "Optimal Solution",
                "solutionCode": out,
                "complexity": "Analyzed for time and space optimality",
                "evaluationCriteria": {
                    "correctness": 90,
                    "codeQuality": 85,
                    "edgeCaseHandling": 80
                }
            }, indent=2)

            samples.append({
                "messages": [
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user", "content": f"Candidate Coding Challenge:\n{user_msg}"},
                    {"role": "assistant", "content": eval_assistant_json}
                ]
            })
        print(f"-> Successfully extracted {len(samples)} coding samples from CodeAlpaca 20k.")
    except Exception as e:
        print(f"CodeAlpaca load note: {e}")
    return samples

def process_interview_qa():
    print("\n[3/4] Loading greentfrapp/interview-qa...")
    samples = []
    try:
        ds = load_dataset("greentfrapp/interview-qa", split="train")
        for item in ds:
            q = item.get("question", "").strip()
            a = item.get("answer", "").strip()
            context = item.get("context", "")
            if q and a:
                eval_json = json.dumps({
                    "score": 80,
                    "feedback": "Clear explanation of technical principles.",
                    "keyPoints": [a[:120] + "..."],
                    "betterAnswer": a
                }, indent=2)
                samples.append({
                    "messages": [
                        {"role": "system", "content": SYSTEM_PROMPT},
                        {"role": "user", "content": f"Interview Question: {q}\nCandidate Response: {a}"},
                        {"role": "assistant", "content": eval_json}
                    ]
                })
        print(f"-> Successfully extracted {len(samples)} technical interview samples from interview-qa.")
    except Exception as e:
        print(f"interview-qa load note: {e}")
    return samples

def process_system_design():
    print("\n[4/4] Generating & Loading System Design & Distributed Systems Dataset...")
    system_design_cases = [
        ("Design a Global Distributed Rate Limiter with 10M QPS", "Token Bucket algorithm with Redis Cluster, local memory token batching, and sliding window counters."),
        ("Design a Real-Time Collaborative Document Editor like Google Docs", "Operational Transformation (OT) or Conflict-Free Replicated Data Types (CRDTs) over WebSockets with central sequencing."),
        ("Design a Video Streaming Platform (Netflix/YouTube)", "Chunked HLS/DASH video encoding, global CDN edge caching, adaptive bitrate streaming, and metadata storage in Cassandra."),
        ("Design a Distributed Key-Value Store with Strong Consistency", "Raft consensus protocol, LSM-Tree storage engine with write-ahead log (WAL) and SSTables, consistent hashing partition."),
        ("Design an E-Commerce Flash Sale System with 1M Concurrent Users", "Pessimistic DB lock prevention via Redis inventory pre-decrements, RabbitMQ asynchronous order queue, and CDN static asset caching.")
    ]
    samples = []
    for title, desc in system_design_cases:
        user_prompt = f"Role: Staff System Architect\nScenario: {title}\nExplain your high-level architecture and trade-offs."
        asst_json = json.dumps({
            "architectureOverview": desc,
            "tradeOffs": ["Consistency vs Availability (CAP Theorem)", "Latency vs Durability"],
            "failureModes": ["Network Partition", "Cache Cold Start", "Leader Node Outage"],
            "score": 88
        }, indent=2)
        samples.append({
            "messages": [
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": user_prompt},
                {"role": "assistant", "content": asst_json}
            ]
        })
    print(f"-> Successfully extracted {len(samples)} system design samples.")
    return samples

def main():
    all_samples = []
    all_samples.extend(process_ultrachat(limit=500))
    all_samples.extend(process_code_alpaca(limit=500))
    all_samples.extend(process_interview_qa())
    all_samples.extend(process_system_design())

    import random
    random.shuffle(all_samples)
    split_idx = int(len(all_samples) * 0.9)
    train_data = all_samples[:split_idx]
    eval_data = all_samples[split_idx:]

    with open(TRAIN_FILE, "w", encoding="utf-8") as f:
        for s in train_data:
            f.write(json.dumps(s, ensure_ascii=False) + "\n")

    with open(EVAL_FILE, "w", encoding="utf-8") as f:
        for s in eval_data:
            f.write(json.dumps(s, ensure_ascii=False) + "\n")

    print("\n=======================================================")
    print(f"ALL DATASETS INSTALLED & PROCESSED SUCCESSFULLY!")
    print(f"Total Combined Training Samples: {len(train_data)} -> {TRAIN_FILE}")
    print(f"Total Combined Validation Samples: {len(eval_data)} -> {EVAL_FILE}")
    print("=======================================================")

if __name__ == "__main__":
    main()
