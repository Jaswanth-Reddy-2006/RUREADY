import sys
import os
import json
import re

sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'services', 'resume-service'))
from ats.bge_ats_scorer import RoleIndependentAtsScorer, SKILL_NORMALIZATION_MAP

scorer = RoleIndependentAtsScorer()

# -----------------------------------------------------------------------------
# 5 Test Resumes Representing Distinct Profiles
# -----------------------------------------------------------------------------

# 1. Weak / Short Student Resume
weak_student_resume = """
John Doe
johndoe@email.com

EDUCATION
State College
Computer Science
2025

SKILLS
HTML, CSS

PROJECTS
Simple Web Page
• Worked on a simple website for school project and helped with basic styling.
"""

# 2. Average Student Resume
avg_student_resume = """
Rahul Sharma
Hyderabad, India | rahul.sharma@email.com | +91 9876543210
linkedin.com/in/rahulsharma

EDUCATION
Bachelor of Technology in Computer Science
Osmania University, Hyderabad
2021 - 2025

SKILLS
Languages: Python, Java, JavaScript, SQL
Tools: Git, Node.js, React

PROJECTS
E-Commerce Website - Online shopping platform
• Built a full-stack web application using React and Node.js for browsing products.
• Created a backend service using Express.js and MySQL to store user orders.
• Integrated basic user login and authentication system.
"""

# 3. Strong Student Resume
strong_student_resume = """
Jaswanth Reddy
Hyderabad, Telangana, India | +91 8008154808 | jaswanthre9@gmail.com
https://linkedin.com/in/jasreaug | https://github.com/Jaswanth-Reddy-2006

EDUCATION
Bachelor of Technology in Computer Science & Engineering
Vidya Jyothi Institute of Technology, Hyderabad | GPA: 8.76 / 10 | 2024 - 2028 Expected

TECHNICAL SKILLS
Languages: Python, Java, C++, JavaScript, TypeScript, SQL
Frontend & Backend: React, Next.js, Node.js, Express.js, Tailwind CSS
Databases & Cloud: MongoDB, PostgreSQL, Redis, Docker, Git, AWS

PROJECTS
Smart Health Analytics Platform | React, Node.js, MongoDB, Docker
• Engineered real-time health telemetry dashboard handling 10,000+ daily patient records.
• Developed predictive health risk classification algorithms achieving 94% diagnostic accuracy.
• Containerized microservices using Docker and deployed on AWS EC2, reducing deployment cycle time by 45%.

ScaleETL - High-performance CLI for partitioning, transforming, loading, and searching CSV datasets up to 1 billion rows.
• Architected multi-threaded chunking engine in Python and Go, accelerating data ingestion throughput by 65%.
"""

# 4. Strong Experienced Professional Resume
strong_pro_resume = """
Alex Chen
San Francisco, CA | (555) 987-6543 | alex.chen@example.com
linkedin.com/in/alexchen | github.com/alexchen

PROFESSIONAL SUMMARY
Lead Backend & Infrastructure Engineer with 6+ years designing high-throughput distributed systems, cloud microservices, and high-concurrency database architectures.

TECHNICAL SKILLS
Languages: TypeScript, Go, Python, Java, SQL
Backend & APIs: Node.js, Express.js, gRPC, REST APIs, GraphQL
Databases: PostgreSQL, Redis, MongoDB, DynamoDB
DevOps & Cloud: Docker, Kubernetes, AWS, Terraform, CI/CD, GitHub Actions

PROFESSIONAL EXPERIENCE
CloudScale Technologies — San Francisco, CA
Lead Backend Engineer | 2021 - Present
• Architected resilient microservices in TypeScript and Go, reducing p99 API latency by 38% across 200,000+ daily active requests.
• Optimized distributed PostgreSQL indexing and Redis caching tiers, cutting database query response times by 52%.
• Automated end-to-end CI/CD deployment pipelines using Docker, Kubernetes, and GitHub Actions, achieving 99.99% service uptime.

DataVanguard Systems — San Jose, CA
Senior Software Engineer | 2018 - 2021
• Spearheaded migration of monolithic architecture into event-driven microservices on AWS, reducing server hosting overhead by $120,000 annually.
• Implemented automated rate limiting and OAuth2 token authorization services protecting 45+ enterprise API endpoints.
• Led sprint engineering reviews and mentored 6 junior backend engineers in distributed systems design.

EDUCATION
Bachelor of Science in Computer Science
University of California, Berkeley | 2014 - 2018
"""

# 5. Long Resume with Lots of Content but Poor Quality/Relevance (Bloated, Weak verbs, Passive, Repetitive)
bloated_weak_resume = """
Robert Miller
robert.miller@email.com | (555) 111-2222
Chicago, IL

CAREER SUMMARY
Hardworking individual with many years of experience in various software and computing tasks across multiple different industries and business settings. Experienced with day to day duties and assisting in multiple project environments.

SKILLS & PROFICIENCIES
Computers, Microsoft Office, Internet, Coding, Programming, Software, Hardware, Web, HTML, CSS, JavaScript, Tools, Problem Solving, Teamwork, Communication, Time Management, Multitasking

WORK EXPERIENCE
Tech Solutions LLC
General IT & Software Assistant | 2020 - Present
• Responsible for various day to day technical tasks and involved in regular sprint meetings.
• Assisted team with general software duties and helped with debugging minor issues.
• Worked on various internal web pages and handled day to day website maintenance tasks.
• Duties included reviewing documents, attending status meetings, and assisting with tasks.
• Helped with database updates and was responsible for running weekly administrative tasks.

Midwest Services Corp
Junior Technical Worker | 2017 - 2020
• Responsible for assisting senior developers on day to day programming assignments.
• Involved in general troubleshooting and assisted with basic customer ticket resolutions.
• Tasked with updating documentation and did work on legacy computer interfaces.
• Assisted team in various office tasks and participated in weekly project check-ins.
• Helped with software installations and was involved in routine system testing.

Old Enterprise Systems
Support Helper | 2015 - 2017
• Responsible for day to day operations and assisted supervisor with general duties.
• Worked on routine computer maintenance and was involved in various system updates.
• Assisted team with day to day filing and general technical support duties.

EDUCATION
Bachelor of General Studies
Midwest Regional University | 2011 - 2015
"""

resumes = [
    ("1. Weak/Short Student Resume", weak_student_resume),
    ("2. Average Student Resume", avg_student_resume),
    ("3. Strong Student Resume", strong_student_resume),
    ("4. Strong Experienced Pro Resume", strong_pro_resume),
    ("5. Long Bloated/Poor Quality Resume", bloated_weak_resume)
]

print("=" * 80)
print("ROLE-INDEPENDENT ATS SCORING EVALUATION & QUALITY DIFFERENTIATION TEST")
print("=" * 80)

results = []

for name, text in resumes:
    clean_text = text.strip()
    sections = scorer.parse_sections_and_bullets(clean_text)
    score_data = scorer.score_resume(clean_text)
    
    # Analyze lines and classification breakdown
    all_exp_lines = sections.get("EXPERIENCE", [])
    all_proj_lines = sections.get("PROJECTS", [])
    
    exp_bullets = []
    proj_bullets = []
    proj_descriptions = []
    excluded_lines = []
    
    for l in all_exp_lines:
        ct = scorer.classify_line_content_type(l, "EXPERIENCE")
        if ct == "EXPERIENCE_BULLET":
            exp_bullets.append(l)
        else:
            excluded_lines.append((l, ct))
            
    for l in all_proj_lines:
        ct = scorer.classify_line_content_type(l, "PROJECTS")
        if ct == "ACHIEVEMENT_BULLET":
            proj_bullets.append(l)
        elif ct == "PROJECT_DESCRIPTION":
            proj_descriptions.append(l)
        else:
            excluded_lines.append((l, ct))
            
    # Audit details
    quant_info = score_data["quantification"]
    breakdown = score_data["breakdown"]
    skills = score_data["extractedSkills"]
    improvements = score_data["bulletAudits"]
    
    # Skill Verification: Check that every detected skill is grounded in the text
    unmatched_skills = []
    for s in skills:
        found = False
        s_lower = s.lower()
        if s_lower in clean_text.lower():
            found = True
        else:
            # Check aliases
            for alias, (can, _) in SKILL_NORMALIZATION_MAP.items():
                if can == s and alias in clean_text.lower():
                    found = True
                    break
        if not found:
            unmatched_skills.append(s)
            
    results.append({
        "name": name,
        "score": score_data["overallScore"],
        "breakdown": breakdown,
        "skills": skills,
        "unmatched_skills": unmatched_skills,
        "exp_bullets_count": len(exp_bullets),
        "proj_bullets_count": len(proj_bullets),
        "proj_desc_count": len(proj_descriptions),
        "excluded_count": len(excluded_lines),
        "quant_count": quant_info["quantifiedCount"],
        "action_ratio": quant_info["actionVerbRatio"],
        "quant_density": quant_info["densityPercentage"],
        "total_work_bullets": quant_info["totalBullets"],
        "improvements": improvements
    })

# Print Individual Profiles
for r in results:
    print("\n" + "-" * 80)
    print(f"PROFILE: {r['name']}")
    print("-" * 80)
    print(f"  Overall ATS Score: {r['score']} / 100")
    print(f"  * Structure:                 {r['breakdown']['structure']} / 20")
    print(f"  * Content Completeness:      {r['breakdown']['completeness']} / 20")
    print(f"  * ATS Extractability:        {r['breakdown']['extractability']} / 20")
    print(f"  * Skills & Technical Content:{r['breakdown']['skills']} / 15")
    print(f"  * Experience Quality:        {r['breakdown']['experienceQuality']} / 15")
    print(f"  * ATS Formatting:            {r['breakdown']['formatting']} / 10")
    print()
    print(f"  Detected Skills ({len(r['skills'])}): [{', '.join(r['skills']) if r['skills'] else 'None'}]")
    unmatched_msg = 'PASSED (100% Grounded in source text)' if not r['unmatched_skills'] else f"FAILED: Unmatched: {r['unmatched_skills']}"
    print(f"  Skill Hallucination Check: {unmatched_msg}")
    print()
    print(f"  Experience & Project Breakdown:")
    print(f"    - Actual Experience Bullets: {r['exp_bullets_count']}")
    print(f"    - Actual Project Bullets:    {r['proj_bullets_count']}")
    print(f"    - Project Descriptions:      {r['proj_desc_count']}")
    print(f"    - Excluded Non-Bullet Lines: {r['excluded_count']}")
    print(f"    - Total Actionable Bullets:  {r['total_work_bullets']}")
    print(f"    - Quantified Bullets:        {r['quant_count']} ({r['quant_density']}%)")
    print(f"    - Action Verb Ratio:         {r['action_ratio']}%")
    print()
    print(f"  Top Improvements Generated ({len(r['improvements'])}):")
    if not r['improvements']:
        print("    -> No high-priority improvements needed (Accomplishment bullets and descriptions already strong).")
    else:
        for idx, imp in enumerate(r['improvements'], 1):
            print(f"    {idx}. [{imp['category']}] {imp['feedback']}")
            print(f"       Target: \"{imp['original']}\"")

# Comparison Table
print("\n" + "=" * 80)
print("SUMMARY COMPARISON TABLE")
print("=" * 80)
header = f"{'Resume Profile':<35} | {'Score':<5} | {'Struct':<6} | {'Compl':<5} | {'Extr':<5} | {'Skill':<5} | {'ExpQ':<5} | {'Fmt':<4} | {'Skills'}"
print(header)
print("-" * len(header))
for r in results:
    row = f"{r['name']:<35} | {r['score']:<5} | {r['breakdown']['structure']:<6} | {r['breakdown']['completeness']:<5} | {r['breakdown']['extractability']:<5} | {r['breakdown']['skills']:<5} | {r['breakdown']['experienceQuality']:<5} | {r['breakdown']['formatting']:<4} | {len(r['skills'])} detected"
    print(row)

# Cluster Analysis
scores = [r["score"] for r in results]
min_score = min(scores)
max_score = max(scores)
score_range = max_score - min_score

print("\n" + "=" * 80)
print("SCORE CLUSTERING & DIFFERENTIATION ANALYSIS")
print("=" * 80)
print(f"Score Range: {min_score} to {max_score} (Spread: {score_range} points)")
print(f"Rank Order:")
for rank, r in enumerate(sorted(results, key=lambda x: x["score"], reverse=True), 1):
    print(f"  {rank}. {r['name']}: {r['score']} / 100")

if score_range >= 40:
    print("\n[PASSED] Score Differentiation: EXCELLENT (Score spread >= 40 points).")
    print("   The scoring engine clearly distinguishes between weak, average, bloated/poor-quality, and high-impact resumes without clustering.")
else:
    print(f"\n[WARNING] Score Differentiation: POTENTIAL CLUSTERING (Spread: {score_range} points).")
