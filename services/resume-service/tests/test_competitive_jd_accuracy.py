import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

import json
from ml.inference.competitive_matcher import compute_match

jake_ryan_text = """
Jake Ryan
123-456-7890 | jake@su.edu | linkedin.com/in/jake | github.com/jake

Education
Southwestern University, Bachelor of Arts in Computer Science, Minor in Business Aug 2018 - May 2021
Blinn College, Associate in Liberal Arts Aug 2014 - May 2018

Experience
Undergraduate Research Assistant, Texas A&M University, June 2020 - Present
- Developed a REST API using FastAPI and PostgreSQL to store data from learning management systems
- Developed a full-stack web application using Flask, React, PostgreSQL and Docker to analyze GitHub data
- Explored ways to visualize GitHub collaboration in a classroom setting

Information Technology Support Specialist, Southwestern University, Sep 2018 - Present
- Communicate with managers to set up campus computers used on campus
- Assess and troubleshoot computer problems brought by students, faculty and staff
- Maintain upkeep of computers, classroom equipment, and 200 printers across campus

Artificial Intelligence Research Assistant, Southwestern University, May 2019 - July 2019
- Explored methods to generate video game dungeons based off of The Legend of Zelda
- Developed a game in Java to test the generated dungeons
- Contributed 50K+ lines of code to an established codebase via Git

Projects
Gitlytics | Python, Flask, React, PostgreSQL, Docker, June 2020 - Present
- Developed a full-stack web application using Flask serving a REST API with React as the frontend
- Implemented GitHub OAuth to get data from users repositories
- Visualized GitHub data to show collaboration
- Used Celery and Redis for asynchronous tasks

Simple Paintball | Spigot API, Java, Maven, TravisCI, Git, May 2018 - May 2020
- Developed a Minecraft server plugin to entertain kids during free time for a previous job
- Published plugin to websites gaining 2K+ downloads and an average 4.5/5-star review

Technical Skills
Languages: Java, Python, C/C++, SQL (Postgres), JavaScript, HTML/CSS, R
Frameworks: React, Node.js, Flask, JUnit, WordPress, Material-UI, FastAPI
Developer Tools: Git, Docker, TravisCI, Google Cloud Platform, VS Code, Visual Studio, PyCharm, IntelliJ, Eclipse
Libraries: pandas, NumPy, Matplotlib
"""

print("--- Test 1: Short JD ('ui/ux designer') ---")
res_short = compute_match(jake_ryan_text, "ui/ux designer", "UI/UX Designer", None)
print(json.dumps(res_short, indent=2))
assert res_short["status"] == "INSUFFICIENT_JD", f"Expected INSUFFICIENT_JD, got {res_short['status']}"
assert res_short["score"] is None, "Expected score to be None"
print("[PASS] Short JD correctly returned INSUFFICIENT_JD with score null")

print("\n--- Test 2: Relevant Fullstack JD ---")
fullstack_jd = """
We are looking for a Software Engineer with strong experience in Python, React, PostgreSQL, Docker, REST APIs, and Git.
Responsibilities include building robust backend services using Flask or FastAPI, developing intuitive frontend components,
managing relational database schemas, and maintaining CI/CD deployment pipelines.
Qualifications: Bachelor degree in Computer Science, 2+ years of experience with web applications and microservices.
"""
res_relevant = compute_match(jake_ryan_text, fullstack_jd, "Full Stack Engineer", None)
print(json.dumps({
    "status": res_relevant["status"],
    "score": res_relevant["score"],
    "matchSignals": res_relevant["matchSignals"],
    "matchedSkills": res_relevant["signalsDetail"]["matchedSkills"],
    "missingSkills": res_relevant["signalsDetail"]["missingSkills"]
}, indent=2))
assert res_relevant["status"] == "MATCHED", f"Expected MATCHED, got {res_relevant['status']}"
assert res_relevant["score"] is not None and res_relevant["score"] >= 70, f"Expected score >= 70, got {res_relevant['score']}"
print(f"[PASS] Relevant JD correctly matched with score {res_relevant['score']}/100 and evidence-based skills")

print("\n--- Test 3: Unrelated Chef/Culinary JD ---")
chef_jd = """
Executive Chef needed for high-end French restaurant. Must have 5+ years of culinary leadership experience,
menu development skills, inventory management, HACCP food safety certification, banquet preparation,
and fine dining pastry expertise. Candidates must manage kitchen staff and culinary suppliers.
"""
res_unrelated = compute_match(jake_ryan_text, chef_jd, "Executive Chef", None)
print(json.dumps({
    "status": res_unrelated["status"],
    "score": res_unrelated["score"],
    "reason": res_unrelated.get("reason"),
    "matchSignals": res_unrelated["matchSignals"]
}, indent=2))
assert res_unrelated["status"] == "NOT_RELEVANT", f"Expected NOT_RELEVANT, got {res_unrelated['status']}"
assert res_unrelated["score"] is None, "Expected score to be None"
print("[PASS] Unrelated JD correctly gated as NOT_RELEVANT with score null")

print("\n[ALL PASS] ALL 3 COMPETITIVE MATCH ACCURACY TESTS PASSED WITH 100% PRECISION!")
