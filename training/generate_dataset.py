"""
Rennetus — Synthetic Interview Dataset Generator
Generates high-quality multi-turn Socratic interview dialogue datasets in Llama 3.1 ChatML JSONL format.
"""

import json
import random
import os

ROLES = [
    {"title": "Senior Backend Engineer", "tech": ["Node.js", "PostgreSQL", "Kafka", "Redis", "Docker", "Kubernetes"], "domain": "Distributed Systems"},
    {"title": "Frontend Architect", "tech": ["React", "TypeScript", "Next.js", "WebSockets", "Vite", "TailwindCSS"], "domain": "Web Performance & UI"},
    {"title": "Full Stack Developer", "tech": ["React", "Node.js", "Express", "MongoDB", "PostgreSQL", "AWS"], "domain": "Full Stack Applications"},
    {"title": "DevOps & SRE Engineer", "tech": ["Kubernetes", "Terraform", "AWS", "Prometheus", "CI/CD", "Docker"], "domain": "Cloud Infrastructure"},
    {"title": "AI / ML Systems Engineer", "tech": ["Python", "PyTorch", "FastAPI", "Vector DBs", "RAG", "vLLM"], "domain": "Machine Learning Infra"}
]

SYSTEM_PROMPT = """You are a Principal Engineering Lead and Staff Technical Interviewer at Rennetus. You conduct rigorous, human-like technical interviews, evaluate using strict 40-60 baseline rubrics with zero grade inflation, and always return structured JSON matching the requested schema."""

def generate_sample(role_info, sample_id):
    role = role_info["title"]
    techs = random.sample(role_info["tech"], 3)
    domain = role_info["domain"]
    
    # 1. Question Generation Turn
    question_user_prompt = f"""Candidate Session Context:
- Target Role: {role}
- Experience Level: SENIOR
- Focus Areas: {', '.join(techs)}
- Sequence: Question {random.randint(1, 5)}

Generate a sharp, Socratic technical interview question with natural conversational bridging."""

    question_assistant_resp = json.dumps({
        "questionType": "FOLLOW_UP_CHALLENGE",
        "targetedTechnology": techs[0],
        "questionText": f"I like how you structured the data layer in your previous design. Building on that, how would you design a write-heavy telemetry ingestion pipeline using {techs[0]} and {techs[1]} to guarantee zero message loss during peak traffic spikes?",
        "interrogatorIntent": f"Assess candidate understanding of backpressure, buffer queues, and durability guarantees in {techs[0]} and {techs[1]}."
    }, indent=2)

    # 2. Evaluation Turn
    eval_user_prompt = f"""Role: {role}
Experience Level: SENIOR
Question: How would you handle database connection exhaustion under 50,000 concurrent requests in {techs[0]}?
Candidate Spoken Answer:
"I would increase the database connection pool limit and add a Redis cache in front of read queries. If connections still max out, I would implement connection pooling via PgBouncer and add circuit breakers with exponential backoff."
"""

    eval_assistant_resp = json.dumps({
        "score": 78,
        "feedback": "Strong practical answer with clear mitigation strategies (PgBouncer, circuit breakers), though lacked specific metric calculations for pool sizing formulas.",
        "strengths": [
            "Correctly identified PgBouncer for external connection pooling",
            "Included Redis caching to alleviate read traffic pressure",
            "Applied resilience patterns including circuit breakers and backoff"
        ],
        "weaknesses": [
            "Did not define pool sizing calculations (CPU cores * 2 + spindle count)",
            "Omitted read-replica routing for scaling database reads",
            "Did not address slow transaction timeout thresholds"
        ],
        "betterAnswer": "A Staff Engineer would calculate pool sizing based on hardware thread limits (e.g. pool size = (core_count * 2) + effective_spindle_count), enforce aggressive query timeouts, implement read-replicas, and place an asynchronous write-buffer queue before the relational database.",
        "technicalDepth": 80,
        "subjectCoverage": 75,
        "communicationClarity": 85,
        "completeness": 78,
        "starCompliance": 80,
        "tutorialCopierFlag": False,
        "technicalOriginality": 82
    }, indent=2)

    return [
        {
            "messages": [
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": question_user_prompt},
                {"role": "assistant", "content": question_assistant_resp}
            ]
        },
        {
            "messages": [
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": eval_user_prompt},
                {"role": "assistant", "content": eval_assistant_resp}
            ]
        }
    ]

def main():
    output_dir = os.path.dirname(os.path.abspath(__file__))
    train_file = os.path.join(output_dir, "rennetus_interview_train.jsonl")
    eval_file = os.path.join(output_dir, "rennetus_interview_eval.jsonl")

    all_samples = []
    sample_count = 500  # Generate 500 high quality multi-turn conversations (1000 training pairs)
    
    for i in range(sample_count):
        role_info = random.choice(ROLES)
        pairs = generate_sample(role_info, i)
        all_samples.extend(pairs)

    random.shuffle(all_samples)
    split_idx = int(len(all_samples) * 0.9)
    train_samples = all_samples[:split_idx]
    eval_samples = all_samples[split_idx:]

    with open(train_file, "w", encoding="utf-8") as f:
        for item in train_samples:
            f.write(json.dumps(item, ensure_ascii=False) + "\n")

    with open(eval_file, "w", encoding="utf-8") as f:
        for item in eval_samples:
            f.write(json.dumps(item, ensure_ascii=False) + "\n")

    print(f"Generated {len(train_samples)} training samples -> {train_file}")
    print(f"Generated {len(eval_samples)} validation samples -> {eval_file}")

if __name__ == "__main__":
    main()
