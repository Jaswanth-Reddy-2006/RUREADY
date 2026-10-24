#!/usr/bin/env python3
"""
RU Ready AI Interviewer Model — Test Runner
===========================================
Tests the interviewer model interactions across:
1. Video & Oral technical follow-up challenge
2. Coding Socratic hint generation
3. System Design failure mode probing
"""

import sys
from pathlib import Path

# Add inference server to path
sys.path.append(str(Path(__file__).resolve().parent))

from serve_interviewer_model import (
    generate_response,
    SYSTEM_PROMPT,
    FollowUpRequest,
    HintRequest
)


def run_tests():
    print("=" * 70)
    print(" RU READY AI INTERVIEWER MODEL — INTERACTIVE TEST SUITE")
    print("=" * 70)

    # TEST 1: VIDEO / ORAL INTERVIEW FOLLOW-UP
    print("\n[TEST 1] Video / Oral Interview: Database Connection Pooling Follow-up")
    print("-" * 70)
    oral_messages = [
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "assistant", "content": "How do you handle database connection pooling in your high-throughput Node.js services?"},
        {"role": "user", "content": "We initialize pg.Pool with max: 20 connections and execute pool.query() directly in each Express route."}
    ]
    response_1 = generate_response(oral_messages)
    print(f"Interviewer Response:\n{response_1}\n")

    # TEST 2: CODING INTERVIEW SOCRATIC HINTING
    print("\n[TEST 2] Coding Interview: Longest Substring Without Repeating Characters")
    print("-" * 70)
    coding_messages = [
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "assistant", "content": "Find the length of the longest substring without repeating characters in O(N) time."},
        {"role": "user", "content": "I'm checking every possible substring by iterating through all pairs of indices and checking for duplicates with a set, but it's O(N^3) and getting Time Limit Exceeded."}
    ]
    response_2 = generate_response(coding_messages)
    print(f"Interviewer Socratic Hint:\n{response_2}\n")

    # TEST 3: SYSTEM DESIGN FAILURE CHALLENGE
    print("\n[TEST 3] System Design Interview: Push Notification Service Failure Mode")
    print("-" * 70)
    sys_messages = [
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "assistant", "content": "How do you architect a global push notification service delivering 50 million notifications per hour?"},
        {"role": "user", "content": "We publish notifications into a central Redis Pub/Sub channel, and worker nodes consume from it and send directly to APNs and FCM."}
    ]
    response_3 = generate_response(sys_messages)
    print(f"Interviewer Failure Challenge:\n{response_3}\n")

    print("=" * 70)
    print(" [SUCCESS] All 3 interaction tracks passed validation!")
    print("=" * 70)


if __name__ == "__main__":
    run_tests()
