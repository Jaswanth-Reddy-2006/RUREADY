"""
BGE-Large-en-v1.5 English-Only Role-Independent ATS Scoring Engine.

Strict 100-Point High-Discrimination Architecture:
1. Resume Structure — 20 points
2. Content Completeness — 20 points
3. ATS Extractability — 20 points
4. Skills & Technical Content — 15 points
5. Experience / Achievement Quality — 15 points
6. Basic ATS Formatting — 10 points
Total = 100 points.

Role-Independent: Does NOT require a job description or selected role.
Strict Quantification Filter: Only audits Experience & Project bullets.
Never audits Contact info, Location, Degrees, University names, GPA, or Education scores.
Domain-Aware: Supports both technical and non-technical professional resumes.
High Discrimination: Differentiates between weak, average, high-quality, and bloated resumes.
"""

import os
import sys
import json
import re
import warnings
from typing import Dict, Any, List, Optional, Set, Tuple

warnings.filterwarnings("ignore")

_BGE_MODEL = None
MODEL_NAME = "BAAI/bge-large-en-v1.5"


def get_bge_model():
    """Lazily load and cache the BAAI/bge-large-en-v1.5 sentence-transformers model."""
    global _BGE_MODEL
    if _BGE_MODEL is None:
        from sentence_transformers import SentenceTransformer
        _BGE_MODEL = SentenceTransformer(MODEL_NAME)
    return _BGE_MODEL


# Comprehensive technical & domain skill normalization dictionary
SKILL_NORMALIZATION_MAP = {
    # Web & Frontend
    "react.js": ("React", "Frontend"),
    "reactjs": ("React", "Frontend"),
    "react": ("React", "Frontend"),
    "next.js": ("Next.js", "Frontend"),
    "nextjs": ("Next.js", "Frontend"),
    "vue.js": ("Vue.js", "Frontend"),
    "vue": ("Vue.js", "Frontend"),
    "angular": ("Angular", "Frontend"),
    "html": ("HTML5", "Frontend"),
    "html5": ("HTML5", "Frontend"),
    "css": ("CSS3", "Frontend"),
    "css3": ("CSS3", "Frontend"),
    "tailwind": ("Tailwind CSS", "Frontend"),
    "tailwindcss": ("Tailwind CSS", "Frontend"),
    "tailwind css": ("Tailwind CSS", "Frontend"),
    "bootstrap": ("Bootstrap", "Frontend"),
    "redux": ("Redux", "Frontend"),
    "redux toolkit": ("Redux", "Frontend"),

    # Backend & APIs
    "node.js": ("Node.js", "Backend"),
    "nodejs": ("Node.js", "Backend"),
    "node": ("Node.js", "Backend"),
    "express.js": ("Express.js", "Backend"),
    "expressjs": ("Express.js", "Backend"),
    "express": ("Express.js", "Backend"),
    "fastapi": ("FastAPI", "Backend"),
    "flask": ("Flask", "Backend"),
    "django": ("Django", "Backend"),
    "spring": ("Spring Boot", "Backend"),
    "spring boot": ("Spring Boot", "Backend"),
    "graphql": ("GraphQL", "Backend"),
    "rest api": ("REST APIs", "Backend"),
    "rest apis": ("REST APIs", "Backend"),
    "restful api": ("REST APIs", "Backend"),
    "restful apis": ("REST APIs", "Backend"),
    "rest": ("REST APIs", "Backend"),
    "grpc": ("gRPC", "Backend"),

    # Languages
    "javascript": ("JavaScript", "Languages"),
    "js": ("JavaScript", "Languages"),
    "typescript": ("TypeScript", "Languages"),
    "ts": ("TypeScript", "Languages"),
    "python": ("Python", "Languages"),
    "java": ("Java", "Languages"),
    "c++": ("C++", "Languages"),
    "cpp": ("C++", "Languages"),
    "c": ("C", "Languages"),
    "c#": ("C#", "Languages"),
    "csharp": ("C#", "Languages"),
    "golang": ("Go", "Languages"),
    "go": ("Go", "Languages"),
    "rust": ("Rust", "Languages"),
    "ruby": ("Ruby", "Languages"),
    "php": ("PHP", "Languages"),
    "sql": ("SQL", "Languages"),

    # Databases & Caching
    "mongodb": ("MongoDB", "Databases"),
    "mongo": ("MongoDB", "Databases"),
    "postgresql": ("PostgreSQL", "Databases"),
    "postgres": ("PostgreSQL", "Databases"),
    "mysql": ("MySQL", "Databases"),
    "sqlite": ("SQLite", "Databases"),
    "redis": ("Redis", "Databases"),
    "nosql": ("NoSQL", "Databases"),
    "dynamodb": ("DynamoDB", "Databases"),
    "cassandra": ("Cassandra", "Databases"),
    "elasticsearch": ("Elasticsearch", "Databases"),

    # DevOps, Cloud & Tools
    "docker": ("Docker", "DevOps & Cloud"),
    "kubernetes": ("Kubernetes", "DevOps & Cloud"),
    "k8s": ("Kubernetes", "DevOps & Cloud"),
    "git": ("Git", "Tools"),
    "github": ("GitHub", "Tools"),
    "gitlab": ("GitLab", "Tools"),
    "aws": ("AWS", "DevOps & Cloud"),
    "amazon web services": ("AWS", "DevOps & Cloud"),
    "aws ec2": ("AWS EC2", "DevOps & Cloud"),
    "amazon ec2": ("AWS EC2", "DevOps & Cloud"),
    "ec2": ("AWS EC2", "DevOps & Cloud"),
    "aws s3": ("AWS S3", "DevOps & Cloud"),
    "amazon s3": ("AWS S3", "DevOps & Cloud"),
    "s3": ("AWS S3", "DevOps & Cloud"),
    "aws lambda": ("AWS Lambda", "DevOps & Cloud"),
    "lambda": ("AWS Lambda", "DevOps & Cloud"),
    "azure": ("Azure", "DevOps & Cloud"),
    "gcp": ("Google Cloud (GCP)", "DevOps & Cloud"),
    "google cloud": ("Google Cloud (GCP)", "DevOps & Cloud"),
    "ci/cd": ("CI/CD", "DevOps & Cloud"),
    "github actions": ("GitHub Actions", "DevOps & Cloud"),
    "linux": ("Linux", "Tools"),
    "kafka": ("Apache Kafka", "DevOps & Cloud"),
    "apache kafka": ("Apache Kafka", "DevOps & Cloud"),
    "terraform": ("Terraform", "DevOps & Cloud"),

    # AI / ML / Data
    "pytorch": ("PyTorch", "Data & AI"),
    "tensorflow": ("TensorFlow", "Data & AI"),
    "scikit-learn": ("Scikit-Learn", "Data & AI"),
    "pandas": ("Pandas", "Data & AI"),
    "numpy": ("NumPy", "Data & AI"),
    "tableau": ("Tableau", "Data & AI"),
    "power bi": ("Power BI", "Data & AI"),

    # Domain / Business / Management
    "agile": ("Agile Methodology", "Management"),
    "scrum": ("Scrum", "Management"),
    "jira": ("Jira", "Management"),
    "seo": ("SEO", "Marketing"),
    "sem": ("SEM", "Marketing"),
    "google analytics": ("Google Analytics", "Marketing"),
    "crm": ("CRM", "Business"),
    "salesforce": ("Salesforce", "Business"),
    "financial modeling": ("Financial Modeling", "Finance"),
    "project management": ("Project Management", "Management"),
    "figma": ("Figma", "Design"),
}

# 1. STRONG ACTION VERBS (Engineering, Systems, Security, Product, Transformation, Delivery)
STRONG_ACTION_VERBS = {
    # Engineering & Building
    'built', 'build', 'building', 'developed', 'develop', 'developing', 'designed', 'design', 'designing',
    'engineered', 'engineer', 'engineering', 'architected', 'architect', 'architecting',
    'implemented', 'implement', 'implementing', 'created', 'create', 'creating', 'constructed', 'construct',
    'programmed', 'program', 'programming', 'coded', 'code', 'coding', 'authored', 'author', 'authoring',
    'formulated', 'formulate', 'formulating', 'devised', 'devise', 'devising',
    # Optimization & Transformation
    'optimized', 'optimize', 'optimizing', 'scaled', 'scale', 'scaling', 'refactored', 'refactor', 'refactoring',
    'migrated', 'migrate', 'migrating', 'automated', 'automate', 'automating', 'consolidated', 'consolidate', 'consolidating',
    'modernized', 'modernize', 'modernizing', 'streamlined', 'streamline', 'streamlining', 'overhauled', 'overhaul',
    'transformed', 'transform', 'transforming', 'upgraded', 'upgrade', 'upgrading', 'standardized', 'standardize',
    'simplified', 'simplify', 'simplifying', 'restructured', 'restructure',
    # Security, Protection & Quality
    'protected', 'protect', 'protecting', 'secured', 'secure', 'securing', 'encrypted', 'encrypt', 'encrypting',
    'hardened', 'harden', 'hardening', 'isolated', 'isolate', 'isolating', 'sandboxed', 'sandbox',
    'scanned', 'scan', 'scanning', 'discovered', 'discover', 'discovering', 'classified', 'classify', 'classifying',
    'detected', 'detect', 'detecting', 'intercepted', 'intercept', 'captured', 'capture', 'capturing',
    'audited', 'audit', 'auditing', 'validated', 'validate', 'validating', 'authenticated', 'authenticate',
    # Deployment, Infrastructure & DevOps
    'deployed', 'deploy', 'deploying', 'integrated', 'integrate', 'integrating', 'orchestrated', 'orchestrate',
    'configured', 'configure', 'configuring', 'provisioned', 'provision', 'provisioning', 'containerized',
    'instantiated', 'monitored', 'monitor', 'benchmarked', 'benchmark', 'profiled', 'profile', 'instrumented',
    # Data & AI / ML
    'trained', 'train', 'training', 'fine-tuned', 'evaluated', 'evaluate', 'evaluating', 'extracted', 'extract',
    'parsed', 'parse', 'parsing', 'mined', 'modeled', 'model', 'analyzed', 'analyze', 'analyzing',
    # Leadership, Delivery & Impact
    'spearheaded', 'spearhead', 'led', 'lead', 'leading', 'pioneered', 'pioneer', 'accelerated', 'accelerate',
    'boosted', 'boost', 'boosting', 'delivered', 'deliver', 'delivering', 'launched', 'launch', 'launching',
    'resolved', 'resolve', 'resolving', 'established', 'establish', 'establishing', 'generated', 'generate',
    'improved', 'improve', 'improving', 'reduced', 'reduce', 'reducing', 'increased', 'increase', 'increasing',
    'applied', 'apply', 'applying', 'executed', 'execute', 'executing', 'curated', 'curate', 'facilitated', 'facilitate',
    'negotiated', 'negotiate', 'published', 'publish', 'publishing', 'maintained', 'maintain', 'maintaining',
    'managed', 'manage', 'managing', 'tested', 'test', 'testing', 'debugged', 'debug', 'debugging'
}

# 2. ACCEPTABLE / NEUTRAL VERBS (Valid verbs describing execution; not automatically weak)
NEUTRAL_ACTION_VERBS = {
    'used', 'use', 'using', 'utilized', 'utilize', 'utilizing',
    'worked', 'work', 'working', 'assisted', 'assist', 'assisting',
    'supported', 'support', 'supporting', 'participated', 'participate', 'participating',
    'collaborated', 'collaborate', 'collaborating', 'contributed', 'contribute', 'contributing',
    'helped', 'help', 'helping', 'employed', 'employ', 'employing',
    'applied', 'apply', 'applying', 'leveraged', 'leverage', 'leveraging',
    'drove', 'drive', 'driving', 'coordinated', 'coordinate', 'coordinating',
    'handled', 'handle', 'handling', 'facilitated', 'facilitate', 'facilitating'
}

# 3. WEAK / VAGUE OPENINGS (Passive phrasing without clear individual ownership)
WEAK_OPENINGS = [
    r'\bresponsible for\b',
    r'\bwas responsible for\b',
    r'\bduties included\b',
    r'\bworked on\b',
    r'\binvolved in\b',
    r'\bhelped with\b',
    r'\bassisted with\b',
    r'\bassisted in\b',
    r'\btasked with\b',
    r'\bdid work\b',
    r'\bgot involved in\b',
    r'\bvarious tasks\b',
    r'\bday to day\b',
    r'\bgeneral duties\b'
]

# Backward compatibility alias
GENERIC_FILLER_PHRASES = WEAK_OPENINGS


class RoleIndependentAtsScorer:
    """
    Evaluates resumes strictly across the 6 role-independent ATS pillars (Total 100 points).
    Features high score discrimination based on measurable signals.
    """

    def parse_sections_and_bullets(self, raw_text: str, structured_elements: Optional[List[Dict[str, Any]]] = None) -> Dict[str, Any]:
        """
        Segment resume into classified sections to prevent false positives in quantification audits.
        """
        lines = [l.strip() for l in raw_text.split('\n') if l.strip()]

        current_section = "HEADER"
        sections_map: Dict[str, List[str]] = {
            "HEADER": [],
            "SUMMARY": [],
            "EDUCATION": [],
            "SKILLS": [],
            "EXPERIENCE": [],
            "PROJECTS": [],
            "CERTIFICATIONS": [],
            "OTHER": []
        }

        # Regular expressions for section header recognition
        section_headers = {
            "SUMMARY": re.compile(r'^(?:summary|professional summary|profile|objective|career objective|about me)\b', re.IGNORECASE),
            "EDUCATION": re.compile(r'^(?:education|academic|academics|qualification|qualifications|scholastic)\b', re.IGNORECASE),
            "SKILLS": re.compile(r'^(?:skills|technical skills|technical competencies|technologies|core competencies|tools|skills & competencies)\b', re.IGNORECASE),
            "EXPERIENCE": re.compile(r'^(?:experience|work experience|employment|work history|professional experience|internship|internships|work)\b', re.IGNORECASE),
            "PROJECTS": re.compile(r'^(?:projects|academic projects|key projects|personal projects|technical projects|notable projects)\b', re.IGNORECASE),
            "CERTIFICATIONS": re.compile(r'^(?:certifications|certificates|licenses|achievements|honors|awards|leadership)\b', re.IGNORECASE),
        }

        for idx, line in enumerate(lines):
            clean_hdr = re.sub(r'[^a-zA-Z\s]', '', line).strip()
            matched_section = None
            if len(clean_hdr.split()) <= 4:
                for sec_name, pattern in section_headers.items():
                    if pattern.search(clean_hdr):
                        matched_section = sec_name
                        break

            if matched_section:
                current_section = matched_section
                continue

            # First 3 lines before any section headers belong to HEADER
            if idx < 3 and current_section == "HEADER":
                sections_map["HEADER"].append(line)
            else:
                sections_map[current_section].append(line)

        return sections_map

    def normalize_extracted_skills(self, skills_lines: List[str], full_text: str) -> Tuple[List[str], Set[str], bool]:
        """Extracts, normalizes, and categorizes technical & domain skills."""
        combined_skills_text = " ".join(skills_lines) if skills_lines else full_text
        found_skills: Set[str] = set()
        categories: Set[str] = set()

        # Check for category indicators like "Languages:", "Frameworks:", "Databases:", "Tools:"
        is_categorized = bool(re.search(r'\b(?:languages|frameworks|libraries|databases|tools|platforms|developer tools|cloud|methodologies|core competencies)\s*:', combined_skills_text, re.IGNORECASE))

        # Tokenize by comma, pipe, slash, colon, newlines
        raw_tokens = re.split(r'[,|;:\n•\t/]+', combined_skills_text)
        for token in raw_tokens:
            cleaned = token.strip().lower()
            if cleaned in SKILL_NORMALIZATION_MAP:
                canonical, cat = SKILL_NORMALIZATION_MAP[cleaned]
                found_skills.add(canonical)
                categories.add(cat)
            else:
                # Substring check for multi-word or compound skills
                for pattern_key, (canonical, cat) in SKILL_NORMALIZATION_MAP.items():
                    if re.search(r'\b' + re.escape(pattern_key) + r'\b', cleaned):
                        found_skills.add(canonical)
                        categories.add(cat)

        # Fallback scan across full text if skills section was empty
        if len(found_skills) < 3:
            full_lower = full_text.lower()
            for pattern_key, (canonical, cat) in SKILL_NORMALIZATION_MAP.items():
                if re.search(r'\b' + re.escape(pattern_key) + r'\b', full_lower):
                    found_skills.add(canonical)
                    categories.add(cat)

        return sorted(list(found_skills)), categories, is_categorized

    def classify_line_content_type(self, line: str, section_name: str) -> str:
        """
        Classifies candidate text into its semantic content-type:
        - PATENT_OR_PUBLICATION
        - COMPANY_OR_LOCATION
        - EDUCATION
        - TECHNOLOGY_LINE
        - PROJECT_TITLE
        - PROJECT_DESCRIPTION
        - ACHIEVEMENT_BULLET
        - EXPERIENCE_BULLET
        - OTHER
        """
        clean = line.strip()
        if not clean:
            return "OTHER"

        # 1. Patent & Publication references
        patent_pattern = re.compile(
            r'\b(?:patent|patent application|us patent|provisional patent|patent no|pat\. no|u\.s\. patent|application no|inventor|inventors|assignee)\b',
            re.IGNORECASE
        )
        publication_pattern = re.compile(
            r'\b(?:et al\.|ieee|acm|arxiv|springer|elsevier|conference on|proceedings of|journal of|trans\.|symposium on|workshop on|doi:\s*10\.\d+|issn|isbn)\b',
            re.IGNORECASE
        )
        author_citation_pattern = re.compile(
            r'^[A-Z][a-z]+(?:\s+[A-Z]\.?)?\s+[A-Z][a-z]+(?:,\s+[A-Z][a-z]+(?:\s+[A-Z]\.?)?\s+[A-Z][a-z]+)*\s+(?:et al\.|and\s+[A-Z][a-z]+)',
            re.IGNORECASE
        )
        if patent_pattern.search(clean) or publication_pattern.search(clean) or author_citation_pattern.search(clean):
            return "PATENT_OR_PUBLICATION"

        # 2. URLs / Links / Contact
        if re.search(r'https?://\S+|www\.\S+|github\.com/\S+|linkedin\.com/\S+', clean, re.IGNORECASE) and len(clean.split()) <= 6:
            return "OTHER"

        # 3. Technology Inventory Lines
        if re.match(r'^(?:technologies|tools|tech stack|environment|languages|frameworks|stack)\s*[:|]', clean, re.IGNORECASE):
            return "TECHNOLOGY_LINE"
        if '|' in clean and not clean.startswith(('•', '-', '*')) and len(clean.split()) <= 12 and not any(v in clean.lower() for v in ['built', 'developed', 'designed', 'managed', 'led']):
            return "TECHNOLOGY_LINE"

        # 4. Company / Location Metadata Lines
        company_or_loc_markers = re.compile(
            r'\b(?:inc|llc|ltd|corp|corporation|company of america|insurance company|technologies|solutions|bank|hospital|university|institute|college|school)\b|,\s*(?:[A-Z]{2}|India|USA|UK|Canada|Germany|Australia|Remote|Hyderabad|Bangalore|California|Texas|New York|NJ|NY|CA|TX|MA|WA)\b',
            re.IGNORECASE
        )
        date_range_pattern = re.compile(
            r'\b(?:(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+\d{4}|\d{4})\s*(?:[-–—]|to)\s*(?:(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+\d{4}|\d{4}|present|current)\b',
            re.IGNORECASE
        )
        if not clean.startswith(('•', '-', '*', '–', '—', '1.', '2.', '3.', '4.', '5.')):
            if date_range_pattern.search(clean) or company_or_loc_markers.search(clean):
                return "COMPANY_OR_LOCATION"

        # 5. Education Lines
        edu_markers = re.compile(
            r'\b(?:gpa|cgpa|grade|bachelor|master|b\.tech|m\.tech|b\.s\.|m\.s\.|ph\.d|dean\'s list|graduated|major|minor)\b',
            re.IGNORECASE
        )
        if edu_markers.search(clean) and (section_name == "EDUCATION" or len(clean.split()) <= 8):
            return "EDUCATION"

        # 6. Project Title vs Project Description vs Achievement Bullet
        # Check Project Title + Description pattern: "ProjectName - Description..." or "ProjectName: Description..."
        project_desc_pattern = re.compile(r'^[A-Za-z0-9\s/+#.-]{2,35}\s*[-–—:|]\s+(?=[A-Z0-9])', re.IGNORECASE)
        if section_name == "PROJECTS" or project_desc_pattern.match(clean):
            # Check standalone project title (short name without bullet marker)
            clean_no_bullet = re.sub(r'^[•\-\*\d\.\s]+', '', clean).strip()
            first_w = clean_no_bullet.split()[0].lower() if clean_no_bullet.split() else ''
            
            if project_desc_pattern.match(clean_no_bullet):
                # E.g. "ScaleETL - High-performance CLI for..."
                # Extract the post-hyphen text to see if it's a descriptive phrase or an action bullet
                parts = re.split(r'\s*[-–—:|]\s+', clean_no_bullet, maxsplit=1)
                if len(parts) == 2:
                    after_title = parts[1].strip()
                    after_first_w = after_title.split()[0].lower() if after_title.split() else ''
                    if after_first_w not in STRONG_ACTION_VERBS:
                        return "PROJECT_DESCRIPTION"

            if not clean.startswith(('•', '-', '*', '–', '—', '1.', '2.', '3.')):
                if len(clean.split()) <= 4 and first_w not in STRONG_ACTION_VERBS and first_w not in NEUTRAL_ACTION_VERBS:
                    return "PROJECT_TITLE"
                if first_w not in STRONG_ACTION_VERBS and first_w not in NEUTRAL_ACTION_VERBS and not any(clean.lower().startswith(v + ' ') for v in STRONG_ACTION_VERBS):
                    return "PROJECT_DESCRIPTION"

        # 7. Achievement / Experience Bullets
        if section_name == "EXPERIENCE":
            return "EXPERIENCE_BULLET"
        if section_name == "PROJECTS":
            return "ACHIEVEMENT_BULLET"

        return "ACHIEVEMENT_BULLET"

    def audit_experience_and_project_bullets(self, sections_map: Dict[str, List[str]], structured_elements: Optional[List[Dict[str, Any]]] = None) -> Dict[str, Any]:
        """
        CONTENT-TYPE FILTER & 8-SIGNAL CONTEXTUAL BULLET AUDITOR:
        
        1. Classifies each candidate item by content-type:
           - PROJECT_TITLE -> Excluded from quality audit
           - PROJECT_DESCRIPTION -> Handled specifically; NEVER receives weak action verb warnings
           - ACHIEVEMENT_BULLET / EXPERIENCE_BULLET -> Audited across 8 semantic signals
           - PATENT_OR_PUBLICATION / COMPANY_OR_LOCATION / EDUCATION / TECHNOLOGY_LINE / OTHER -> Excluded

        2. Recognizes existing scale metrics in project descriptions and achievement bullets:
           (e.g., '1 billion rows', '1200+ developers', 'over 10,000 users', '4M users')

        3. Selects ONE highest-impact recommendation per bullet, capped at the TOP 3–5 highest-value improvements.
        """
        experience_lines = sections_map.get("EXPERIENCE", [])
        project_lines = sections_map.get("PROJECTS", [])

        # Metric patterns (including 1 billion rows, 1200+ developers, 10,000 users, 4M users, $500k, 45% speedup, etc.)
        metric_patterns = [
            r'\b\d+(?:\.\d+)?%',  # 45%, 94%, 3.5%
            r'\$\d+(?:,\d+)*(?:\.\d+)?[kKmMbB]?',  # $500k, $1.2M, $50k
            r'\b(?:over|more than|approximately|approx|around|up to|>\s*)?\s*\d+(?:,\d+)*(?:\.\d+)?[kKmMbB]?\+?\s*(?:users|clients|customers|records|rows|datasets|requests|transactions|events|msgs|messages|qps|rps|tps|ms|milliseconds|seconds|mins|minutes|hours|days|weeks|months|engineers|developers|members|endpoints|subscribers|leads|visitors|queries|nodes|clusters|terabytes|tb|gb|mb|million|billion)\b',
            r'\b(?:reduced|improved|increased|decreased|accelerated|optimized|scaled|boosted)\s+.*?\bby\s+\d+',
            r'\b\d+x\b',
            r'\b\d{2,}\b' # counts >= 10 in context
        ]

        outcome_patterns = [
            r'\b(?:resulting in|leading to|achieving|yielding|enabling|reducing|improving|increasing|decreasing|accelerating|saving|optimizing|boosting|facilitating|ensuring|to develop|to simplify|to optimize|to automate|to scale|to ensure|to accelerate)\b'
        ]

        classified_items = []
        for line in experience_lines:
            c_type = self.classify_line_content_type(line, "EXPERIENCE")
            classified_items.append((line, c_type, "EXPERIENCE"))

        for line in project_lines:
            c_type = self.classify_line_content_type(line, "PROJECTS")
            classified_items.append((line, c_type, "PROJECTS"))

        actionable_bullets = []
        for line, c_type, sec in classified_items:
            # Exclude non-achievement metadata
            if c_type in ["PATENT_OR_PUBLICATION", "COMPANY_OR_LOCATION", "EDUCATION", "TECHNOLOGY_LINE", "PROJECT_TITLE", "OTHER"]:
                continue

            clean_text = re.sub(r'^[•\-\*\d\.\s]+', '', line).strip()
            if len(clean_text.split()) >= 4:
                actionable_bullets.append((clean_text, c_type, sec))

        if not actionable_bullets:
            return {
                "quantifiedCount": 0,
                "actionVerbCount": 0,
                "fillerCount": 0,
                "totalBullets": 0,
                "densityPercentage": 0,
                "actionVerbRatio": 0,
                "fillerRatio": 0,
                "audits": []
            }

        quantified_count = 0
        action_verb_count = 0
        filler_count = 0
        raw_audits = []

        for idx, (clean_b, c_type, sec) in enumerate(actionable_bullets):
            words = clean_b.split()
            if not words:
                continue

            first_word = words[0].lower().rstrip(':,;.')
            first_word_clean = re.sub(r'[^a-z]', '', first_word)

            # Robust verb recognition
            is_regular_ed_verb = bool(first_word_clean.endswith('ed') and len(first_word_clean) >= 4 and first_word_clean not in ['need', 'deed', 'seed', 'feed', 'weed', 'speed'])
            has_strong_action = bool(
                first_word_clean in STRONG_ACTION_VERBS or
                (is_regular_ed_verb and first_word_clean not in NEUTRAL_ACTION_VERBS) or
                any(clean_b.lower().startswith(verb + ' ') for verb in STRONG_ACTION_VERBS)
            )
            has_neutral = bool(
                first_word_clean in NEUTRAL_ACTION_VERBS or
                any(clean_b.lower().startswith(verb + ' ') for verb in NEUTRAL_ACTION_VERBS)
            )
            is_verb_form = has_strong_action or has_neutral or is_regular_ed_verb

            has_weak_opening = any(re.search(pat, clean_b, re.IGNORECASE) for pat in WEAK_OPENINGS)
            has_metric = any(re.search(pat, clean_b, re.IGNORECASE) for pat in metric_patterns)
            has_outcome_phrase = any(re.search(pat, clean_b, re.IGNORECASE) for pat in outcome_patterns)

            # Multi-domain keyword detection for contextual recommendations
            has_android = bool(re.search(r'\b(?:kotlin|jetpack compose|android|compose|coroutine|coroutines|room db|hilt|dagger|apk|aar|viewmodel|ndk|mobile app)\b', clean_b, re.IGNORECASE))
            has_security = bool(re.search(r'\b(?:security|privacy|scanner|permissions?|vulnerabilit(?:y|ies)|nmap|encrypt(?:ed|ion)?|biometric|authentication|auth|authorization|cve|firewall|intruder|intrusion|threat|pen-?test(?:ing)?|tls|ssl|jwt|oauth|crypto|tamper|failed-attempt|risky app)\b', clean_b, re.IGNORECASE))
            has_api = bool(re.search(r'\b(?:api|apis|rest|restful|graphql|endpoints?|microservices?|grpc|services?|soap|gateway)\b', clean_b, re.IGNORECASE))
            has_db = bool(re.search(r'\b(?:database|postgres|postgresql|mongodb|redis|sql|nosql|query|queries|tables?|dynamodb|cassandra|schema|indexing|csv datasets|partitioning)\b', clean_b, re.IGNORECASE))
            has_ui = bool(re.search(r'\b(?:ui|ux|frontend|react|vue|angular|interface|components?|responsive|client|app|web app|tailwind|css|html|social media platform|starter kit)\b', clean_b, re.IGNORECASE))
            has_cloud = bool(re.search(r'\b(?:docker|kubernetes|k8s|aws|cloud|ci/cd|pipeline|terraform|deploy|deployment|serverless|infrastructure|sdlc|linux|nginx|preview environments|ephemeral)\b', clean_b, re.IGNORECASE))
            has_ml = bool(re.search(r'\b(?:ai|ml|model|pytorch|tensorflow|algorithm|prediction|training|accuracy|llm|nlp|deep learning|dataset|inference)\b', clean_b, re.IGNORECASE))
            has_auto = bool(re.search(r'\b(?:automation|automated|scripts?|workflow|cron|jobs?|invoices?|scraping|cli)\b', clean_b, re.IGNORECASE))
            has_mkt = bool(re.search(r'\b(?:marketing|campaigns?|seo|sem|leads?|sales|conversion|crm|funnel|retention|traffic|revenue)\b', clean_b, re.IGNORECASE))

            has_domain_tools = bool(has_android or has_security or has_api or has_db or has_ui or has_cloud or has_ml or has_auto or has_mkt or re.search(r'\b(?:python|java|javascript|typescript|go|golang|c\+\+|node|html|css|terraform|c#|rust|php|ruby)\b', clean_b, re.IGNORECASE))

            has_outcome = bool(has_metric or has_outcome_phrase)
            has_ownership = bool(not has_weak_opening and (has_strong_action or (has_neutral and has_domain_tools and has_outcome)))

            if has_metric:
                quantified_count += 1
            if is_verb_form or c_type == "PROJECT_DESCRIPTION":
                action_verb_count += 1
            if has_weak_opening:
                filler_count += 1

            # -------------------------------------------------------------
            # SPECIAL HANDLING: PROJECT_DESCRIPTION
            # -------------------------------------------------------------
            if c_type == "PROJECT_DESCRIPTION":
                # NEVER flag for missing action verb
                # If project description already contains scale/metrics (e.g. 1 billion rows, 1200+ developers, 10,000 users), it is STRONG!
                if has_metric or (has_domain_tools and has_outcome and len(words) >= 8):
                    continue # Strong project description -> Exclude from suggestions

                # If missing outcome and missing scale, suggest clarifying contribution or measurable impact
                raw_audits.append({
                    "priority": 3,
                    "category": "Measurable Outcome",
                    "original": clean_b[:180],
                    "hasMetric": False,
                    "hasActionVerb": True,
                    "feedback": "Clarify your specific technical contribution or measurable performance outcome, if available."
                })
                continue

            # -------------------------------------------------------------
            # ACHIEVEMENT & EXPERIENCE BULLETS
            # -------------------------------------------------------------
            # 6. STRONG BULLET CHECK (Action verb + technical details + outcome/metric/security mechanism + sufficient length + clean ownership)
            is_substantive_flow = (has_security and len(words) >= 8) or (has_android and len(words) >= 8) or (has_api and len(words) >= 9)
            if is_verb_form and (has_outcome or is_substantive_flow) and has_domain_tools and len(words) >= 7 and not has_weak_opening:
                if has_outcome or len(words) >= 10:
                    continue # ALREADY STRONG! Exclude from suggestions.

            # 2. VAGUE RESPONSIBILITY / OWNERSHIP ISSUE
            if has_weak_opening or (re.search(r'\b(?:participated in|contributed to|helped with|assisted in|assisted the team)\b', clean_b, re.IGNORECASE) and not has_ownership):
                if re.search(r'\b(?:participated in|contributed to)\b.*?\b(?:agile|scrum|sprint|standups?|meetings?|cycles?|releases?)\b', clean_b, re.IGNORECASE):
                    feedback = "Make your individual contribution more specific by stating what you delivered during the sprint rather than only describing participation."
                elif re.search(r'\b(?:responsible for|duties included|was responsible for)\b', clean_b, re.IGNORECASE):
                    feedback = "Shift focus from assigned job duties to the specific accomplishments, features, or solutions you directly executed."
                elif re.search(r'\b(?:helped with|assisted in|assisted the team|tasked with)\b', clean_b, re.IGNORECASE):
                    feedback = "Clarify your individual ownership by stating what component, feature, or tool you individually designed or built."
                elif re.search(r'\b(?:worked on|did work)\b', clean_b, re.IGNORECASE):
                    feedback = "Specify your direct technical contribution by detailing which modules, fixes, or architecture you implemented."
                else:
                    feedback = "Clarify your direct contribution by stating what specific feature, system, or solution you individually delivered."

                raw_audits.append({
                    "priority": 1,
                    "category": "Vague Responsibility",
                    "original": clean_b[:180],
                    "hasMetric": has_metric,
                    "hasActionVerb": is_verb_form,
                    "feedback": feedback
                })
            # 1. WEAK / MISSING ACTION VERB (CRITICAL: NEVER flag if bullet starts with any verb form!)
            elif not is_verb_form:
                if has_security:
                    feedback = "Start with a strong action verb (e.g., Engineered, Implemented, Hardened) describing the security mechanism delivered."
                elif has_android:
                    feedback = "Start with a strong action verb (e.g., Developed, Architected, Engineered) describing the Android feature delivered."
                elif has_api:
                    feedback = "Start with a strong action verb (e.g., Architected, Engineered, Developed) describing the API service or architecture delivered."
                elif has_ui:
                    feedback = "Start with a strong action verb (e.g., Developed, Designed, Engineered) highlighting the specific user interface or component delivered."
                elif has_cloud:
                    feedback = "Start with a strong action verb (e.g., Automated, Deployed, Orchestrated) showcasing direct infrastructure ownership."
                elif has_ml:
                    feedback = "Start with a strong action verb (e.g., Trained, Engineered, Implemented) highlighting the data pipeline or model built."
                else:
                    feedback = "Start with a strong action verb (e.g., Engineered, Spearheaded, Implemented) describing your direct contribution."

                raw_audits.append({
                    "priority": 2,
                    "category": "Weak Action Verb",
                    "original": clean_b[:180],
                    "hasMetric": has_metric,
                    "hasActionVerb": False,
                    "feedback": feedback
                })
            # 3. MISSING MEASURABLE OUTCOME (Context-specific, non-prescriptive 'if available' guidance)
            elif not has_outcome and not has_metric:
                if has_security and has_android:
                    feedback = "Add measurable impact, such as the number of security checks supported, Android versions covered, detection coverage, or scan-time improvement, if available."
                elif has_security:
                    feedback = "Add measurable scale or outcome, such as the number of vulnerabilities/apps analyzed, threat detection coverage %, or scan-time improvement, if available."
                elif has_android:
                    feedback = "Add measurable impact, such as the number of features/checks supported, target Android versions, device footprint, or a measurable performance improvement, if available."
                elif has_api:
                    feedback = "Add a measurable outcome of the API work, if available, such as API/endpoint count, request throughput, latency reduction, error reduction %, or team adoption."
                elif has_ui:
                    feedback = "Add a measurable user or performance outcome, if available, such as active user count, page load speedup %, responsiveness, accessibility score, or conversion lift."
                elif has_db:
                    feedback = "Add a measurable database outcome, if available, such as query latency reduction, record volume managed, throughput, or reliability improvement."
                elif has_cloud:
                    feedback = "Add a measurable infrastructure outcome, if available, such as deployment cycle time reduction, build speedup %, uptime %, or infrastructure scale."
                elif has_ml:
                    feedback = "Add a measurable outcome of the AI feature, if available, such as inference speed, detection accuracy, dataset scale, or user adoption."
                elif has_auto:
                    feedback = "Add measurable efficiency gained, if available, such as processing time reduced, volume of tasks/records handled, or hours saved."
                elif has_mkt:
                    feedback = "Add a measurable business outcome, if available, such as conversion rate %, lead volume growth, customer retention lift, or revenue impact."
                else:
                    feedback = "Add measurable scale or outcome of this achievement, if available, such as efficiency gained, user adoption, time saved, or process improvement."

                raw_audits.append({
                    "priority": 3,
                    "category": "Measurable Outcome",
                    "original": clean_b[:180],
                    "hasMetric": False,
                    "hasActionVerb": True,
                    "feedback": feedback
                })
            # 4. MISSING TECHNICAL IMPLEMENTATION DETAIL
            elif not has_domain_tools:
                if has_android:
                    feedback = "Specify the key Android libraries, architecture components, or Jetpack modules used (e.g., Room, Coroutines, ViewModel, Hilt)."
                elif has_security:
                    feedback = "Specify the security mechanisms, protocols, or cryptographic algorithms used (e.g., AES-256, TLS, BiometricPrompt, SHA-256)."
                elif has_cloud:
                    feedback = "Specify the deployment tools, cloud services, or container runtime used (e.g., Docker, Kubernetes, AWS, Terraform)."
                else:
                    feedback = "Specify the key technologies, libraries, or architecture used to achieve this result (e.g., frameworks, tools, or design patterns)."

                raw_audits.append({
                    "priority": 4,
                    "category": "Technical Implementation",
                    "original": clean_b[:180],
                    "hasMetric": has_metric,
                    "hasActionVerb": True,
                    "feedback": feedback
                })
            # 5. MISSING SCALE / CONTEXT
            elif len(words) < 8:
                if has_security:
                    feedback = "Clarify the security outcome or scope, such as what threat this protection mitigates or the operational scale covered, if available."
                elif has_android:
                    feedback = "Clarify the mobile outcome or scope, such as the target Android API levels, device compatibility, or operational scale, if available."
                elif has_api:
                    feedback = "Clarify the operational outcome, such as how this API integration impacted system architecture or client workflows, if available."
                else:
                    feedback = "Provide more context on the scope or challenge solved, such as the environment scale, problem addressed, or user base impacted, if available."

                raw_audits.append({
                    "priority": 5,
                    "category": "Scale & Context",
                    "original": clean_b[:180],
                    "hasMetric": has_metric,
                    "hasActionVerb": True,
                    "feedback": feedback
                })

        # Deduplicate similar suggestions and limit to TOP 3-5 improvements
        seen_feedback = set()
        final_audits = []
        # Sort by priority (most critical first)
        raw_audits.sort(key=lambda x: x["priority"])

        for idx, audit in enumerate(raw_audits):
            if audit["feedback"] not in seen_feedback:
                seen_feedback.add(audit["feedback"])
                final_audits.append({
                    "id": f"improvement-{len(final_audits) + 1}",
                    "category": audit["category"],
                    "original": audit["original"],
                    "hasMetric": audit["hasMetric"],
                    "hasActionVerb": audit["hasActionVerb"],
                    "feedback": audit["feedback"]
                })
            if len(final_audits) >= 4: # Top 3-5 limit
                break

        total = len(actionable_bullets)
        density_pct = round((quantified_count / max(1, total)) * 100, 1)
        action_ratio_pct = round((action_verb_count / max(1, total)) * 100, 1)
        filler_ratio_pct = round((filler_count / max(1, total)) * 100, 1)

        return {
            "quantifiedCount": quantified_count,
            "actionVerbCount": action_verb_count,
            "fillerCount": filler_count,
            "totalBullets": total,
            "densityPercentage": density_pct,
            "actionVerbRatio": action_ratio_pct,
            "fillerRatio": filler_ratio_pct,
            "audits": final_audits
        }

    def score_resume(self, resume_text: str, structured_elements: Optional[List[Dict[str, Any]]] = None) -> Dict[str, Any]:
        """
        Executes the role-independent ATS score calculation across all 6 core categories.
        Total max points = 100.
        """
        if not resume_text or not resume_text.strip():
            raise ValueError("Resume text is empty.")

        clean_text = resume_text.strip()
        word_count = len(clean_text.split())
        sections_map = self.parse_sections_and_bullets(clean_text, structured_elements)

        # ---------------------------------------------------------------------
        # 1. Resume Structure (20 Points Max)
        # ---------------------------------------------------------------------
        # Signal 1: Contact Header & Identification (4 pts)
        has_header_lines = len(sections_map["HEADER"]) > 0
        has_email = bool(re.search(r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}', clean_text))
        has_phone = bool(re.search(r'(?:\+?\d{1,4}[-.\s]?)?\(?\d{2,5}\)?[-.\s]?\d{3,5}[-.\s]?\d{3,5}', clean_text))
        
        structure_header_pts = 0
        if has_header_lines and (has_email or has_phone):
            structure_header_pts = 4
        elif has_email and has_phone:
            structure_header_pts = 3
        elif has_email or has_phone:
            structure_header_pts = 2

        # Signal 2: Core Section Presence & Organization (8 pts)
        has_edu_sec = len(sections_map["EDUCATION"]) > 0 or bool(re.search(r'\b(?:education|academic|bachelor|master|b\.tech)\b', clean_text, re.IGNORECASE))
        has_skills_sec = len(sections_map["SKILLS"]) > 0 or bool(re.search(r'\b(?:skills|technical skills|technologies)\b', clean_text, re.IGNORECASE))
        has_exp_sec = len(sections_map["EXPERIENCE"]) > 0
        has_proj_sec = len(sections_map["PROJECTS"]) > 0

        structure_core_pts = 0
        if has_edu_sec:
            structure_core_pts += 2
        if has_skills_sec:
            structure_core_pts += 2
        
        # Fair balance: Rich experience or rich projects
        if has_exp_sec and has_proj_sec:
            structure_core_pts += 4
        elif has_proj_sec or has_exp_sec:
            structure_core_pts += 3

        # Signal 3: Supplemental / Profile Sections (4 pts)
        has_summary_sec = len(sections_map["SUMMARY"]) > 0 or bool(re.search(r'\b(?:summary|objective|profile)\b', clean_text[:400], re.IGNORECASE))
        has_cert_sec = len(sections_map["CERTIFICATIONS"]) > 0 or bool(re.search(r'\b(?:certifications|certificates|achievements|awards|publications)\b', clean_text, re.IGNORECASE))
        
        structure_supp_pts = 0
        if has_summary_sec:
            structure_supp_pts += 2
        if has_cert_sec:
            structure_supp_pts += 2

        # Signal 4: Logical Section Ordering (2 pts)
        # Header is at top, followed by logical body
        structure_order_pts = 2 if has_header_lines else 1

        # Signal 5: Heading Distinctiveness (2 pts)
        detected_sections_count = sum([1 for k, v in sections_map.items() if len(v) > 0 and k not in ('OTHER', 'HEADER')])
        structure_heading_pts = 2 if detected_sections_count >= 3 else (1 if detected_sections_count >= 2 else 0)

        structure_score = min(20, structure_header_pts + structure_core_pts + structure_supp_pts + structure_order_pts + structure_heading_pts)

        # ---------------------------------------------------------------------
        # 2. Content Completeness (20 Points Max)
        # ---------------------------------------------------------------------
        # Signal 1: Contact Details Richness (6 pts)
        # Full Name (2), Email (2), Phone (1), Links/Profiles (1)
        first_line = sections_map["HEADER"][0] if sections_map["HEADER"] else clean_text.split('\n')[0]
        has_valid_name = len(first_line.split()) in (2, 3, 4) and not '@' in first_line and not any(c.isdigit() for c in first_line)
        has_links = bool(re.search(r'linkedin\.com|github\.com|portfolio|gitlab\.com|behance\.net|medium\.com', clean_text, re.IGNORECASE))

        completeness_contact_pts = 0
        if has_valid_name:
            completeness_contact_pts += 2
        if has_email:
            completeness_contact_pts += 2
        if has_phone:
            completeness_contact_pts += 1
        if has_links:
            completeness_contact_pts += 1

        # Signal 2: Education Completeness (4 pts)
        has_degree = bool(re.search(r'\b(?:bachelor|master|b\.tech|btech|b\.e\.|m\.tech|b\.s\.|m\.s\.|bba|mba|phd|degree|intermediate|high school)\b', clean_text, re.IGNORECASE))
        has_institution = bool(re.search(r'\b(?:university|institute|college|school|academy)\b', clean_text, re.IGNORECASE))
        has_edu_date = bool(re.search(r'\b(?:\d{4}|\b(?:expected|graduated|batch)\b)\b', clean_text, re.IGNORECASE))

        completeness_edu_pts = 0
        if has_degree:
            completeness_edu_pts += 2
        if has_institution:
            completeness_edu_pts += 1
        if has_edu_date:
            completeness_edu_pts += 1

        # Signal 3: Work / Project Experience Substance (6 pts)
        total_work_lines = len(sections_map["EXPERIENCE"]) + len(sections_map["PROJECTS"])
        completeness_work_pts = 0
        if total_work_lines >= 4:
            completeness_work_pts = 6
        elif total_work_lines >= 2:
            completeness_work_pts = 4
        elif total_work_lines >= 1:
            completeness_work_pts = 2

        # Signal 4: Skills Coverage (4 pts)
        extracted_skills, skill_categories, is_categorized = self.normalize_extracted_skills(sections_map["SKILLS"], clean_text)
        skill_count = len(extracted_skills)
        completeness_skills_pts = 0
        if skill_count >= 8:
            completeness_skills_pts = 4
        elif skill_count >= 5:
            completeness_skills_pts = 3
        elif skill_count >= 2:
            completeness_skills_pts = 2
        elif skill_count >= 1:
            completeness_skills_pts = 1

        completeness_score = min(20, completeness_contact_pts + completeness_edu_pts + completeness_work_pts + completeness_skills_pts)

        # ---------------------------------------------------------------------
        # 3. ATS Extractability (20 Points Max)
        # ---------------------------------------------------------------------
        # Signal 1: Clean Extraction Stream & Zero Artifacts (6 pts)
        has_replacement_chars = '\ufffd' in clean_text or '\x00' in clean_text or '???' in clean_text
        extractability_clean_pts = 6 if not has_replacement_chars else 2

        # Signal 2: Heading & Section Parseability (6 pts)
        if detected_sections_count >= 4:
            extractability_heading_pts = 6
        elif detected_sections_count >= 3:
            extractability_heading_pts = 4
        elif detected_sections_count >= 2:
            extractability_heading_pts = 3
        else:
            extractability_heading_pts = 1

        # Signal 3: Linear Text Flow & Layout Integrity (5 pts)
        has_clear_line_breaks = len(clean_text.split('\n')) >= 8
        reasonable_line_lengths = all(len(l) < 400 for l in clean_text.split('\n'))
        extractability_flow_pts = 0
        if has_clear_line_breaks:
            extractability_flow_pts += 3
        if reasonable_line_lengths:
            extractability_flow_pts += 2

        # Signal 4: Redundancy & Loop Check (3 pts)
        # Check for duplicated consecutive paragraphs
        paragraphs = [p.strip() for p in clean_text.split('\n\n') if p.strip()]
        has_duplicates = len(paragraphs) > len(set(paragraphs)) and len(paragraphs) > 3
        extractability_redundancy_pts = 1 if has_duplicates else 3

        extractability_score = min(20, extractability_clean_pts + extractability_heading_pts + extractability_flow_pts + extractability_redundancy_pts)

        # ---------------------------------------------------------------------
        # 4. Skills & Technical / Domain Content (15 Points Max)
        # ---------------------------------------------------------------------
        # Signal 1: Dedicated Skills Section (3 pts)
        skills_sec_pts = 3 if len(sections_map["SKILLS"]) > 0 else (1 if skill_count >= 3 else 0)

        # Signal 2: Normalized De-duplicated Skill Count (5 pts)
        if skill_count >= 10:
            skills_count_pts = 5
        elif skill_count >= 7:
            skills_count_pts = 4
        elif skill_count >= 4:
            skills_count_pts = 3
        elif skill_count >= 2:
            skills_count_pts = 2
        elif skill_count >= 1:
            skills_count_pts = 1
        else:
            skills_count_pts = 0

        # Signal 3: Skill Diversity Across Categories (4 pts)
        cat_count = len(skill_categories)
        if cat_count >= 3:
            skills_div_pts = 4
        elif cat_count >= 2:
            skills_div_pts = 3
        elif cat_count >= 1:
            skills_div_pts = 2
        else:
            skills_div_pts = 1

        # Signal 4: Structured Categorization (3 pts)
        if is_categorized:
            skills_cat_pts = 3
        elif len(sections_map["SKILLS"]) > 0 and skill_count >= 5:
            skills_cat_pts = 2
        elif skill_count >= 2:
            skills_cat_pts = 1
        else:
            skills_cat_pts = 0

        skills_score = min(15, skills_sec_pts + skills_count_pts + skills_div_pts + skills_cat_pts)

        # ---------------------------------------------------------------------
        # 5. Experience / Achievement Quality (15 Points Max)
        # ---------------------------------------------------------------------
        # STRICT: Only Experience & Project bullets evaluated
        bullet_audit_data = self.audit_experience_and_project_bullets(sections_map)
        action_ratio = bullet_audit_data["actionVerbRatio"]
        quant_density = bullet_audit_data["densityPercentage"]
        filler_ratio = bullet_audit_data["fillerRatio"]
        total_work_bullets = bullet_audit_data["totalBullets"]

        exp_action_pts = 0
        exp_quant_pts = 0
        exp_substance_pts = 0

        if total_work_bullets > 0:
            # Action verbs component (5 pts)
            if action_ratio >= 75:
                exp_action_pts = 5
            elif action_ratio >= 50:
                exp_action_pts = 4
            elif action_ratio >= 25:
                exp_action_pts = 2
            else:
                exp_action_pts = 1

            # Metric / Quantification density component (5 pts)
            if quant_density >= 60:
                exp_quant_pts = 5
            elif quant_density >= 30:
                exp_quant_pts = 4
            elif quant_density >= 15:
                exp_quant_pts = 2
            else:
                exp_quant_pts = 0

            # Substance vs Filler component (5 pts)
            if filler_ratio == 0 and total_work_bullets >= 2:
                exp_substance_pts = 5
            elif filler_ratio < 25:
                exp_substance_pts = 3
            else:
                exp_substance_pts = 1
        else:
            # Fallback if candidate only provided summary/non-bullet descriptions
            exp_action_pts = 1
            exp_quant_pts = 0
            exp_substance_pts = 2

        experience_quality_score = min(15, exp_action_pts + exp_quant_pts + exp_substance_pts)

        # ---------------------------------------------------------------------
        # 6. Basic ATS Formatting (10 Points Max)
        # ---------------------------------------------------------------------
        # Signal 1: Consistent Bullet Formatting (3 pts)
        has_clean_bullets = bool(re.search(r'[•\-\*]', clean_text)) or total_work_bullets > 0
        fmt_bullet_pts = 3 if has_clean_bullets else 1

        # Signal 2: Standard Date Patterns (3 pts)
        has_standard_dates = bool(re.search(r'\b(?:\d{4}|\b(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+\d{4})\b', clean_text, re.IGNORECASE))
        fmt_date_pts = 3 if has_standard_dates else 1

        # Signal 3: Length & Information Density (2 pts)
        # Concise 200 - 1000 words rewarded; extreme sparse or bloated penalized
        if 200 <= word_count <= 950:
            fmt_length_pts = 2
        elif 100 <= word_count < 200 or 950 < word_count <= 1400:
            fmt_length_pts = 1
        else:
            fmt_length_pts = 0

        # Signal 4: Clean Layout & Symbol Hygiene (2 pts)
        no_corrupt_symbols = not bool(re.search(r'[^\x00-\x7F\u2010-\u2022\u2013\u2014]', clean_text[:500]))
        fmt_symbol_pts = 2 if no_corrupt_symbols else 0

        formatting_score = min(10, fmt_bullet_pts + fmt_date_pts + fmt_length_pts + fmt_symbol_pts)

        # ---------------------------------------------------------------------
        # Total Overall ATS Score (Exact Sum: 20+20+20+15+15+10 = 100 max)
        # ---------------------------------------------------------------------
        overall_score = structure_score + completeness_score + extractability_score + skills_score + experience_quality_score + formatting_score
        overall_score = max(0, min(100, int(overall_score)))

        # ---------------------------------------------------------------------
        # Strengths & Improvements Generation
        # ---------------------------------------------------------------------
        strengths = []
        improvements = []

        if structure_score >= 16:
            strengths.append("Standard, well-defined resume sections (Contact, Education, Skills, Projects/Experience) detected.")
        else:
            improvements.append("Ensure standard section headers (Education, Technical Skills, Projects, Experience) are distinct and properly ordered.")

        if has_email and has_phone and has_links and has_valid_name:
            strengths.append("Complete, ATS-parseable contact information with active professional links (GitHub, LinkedIn/Portfolio).")
        elif not has_links:
            improvements.append("Add professional profiles such as LinkedIn and GitHub/Portfolio to enhance recruiter verification.")

        if skills_score >= 12:
            strengths.append(f"Strong, extractable technical inventory with {skill_count} recognized skills across modern frameworks and tools.")
        else:
            improvements.append("Expand and categorize your technical skills section (e.g. Languages, Frameworks, Developer Tools, Databases).")

        if experience_quality_score >= 12:
            strengths.append(f"High-impact accomplishment bullets featuring strong action verbs and quantified outcomes ({quant_density}% metrics density).")
        else:
            if quant_density < 30:
                improvements.append("Add quantified metrics (e.g. % performance increase, latency reduction, user count, dataset size) to project & work bullets.")
            if action_ratio < 60:
                improvements.append("Start each project and experience bullet point with strong active verbs (e.g. Architected, Engineered, Developed).")
            if filler_ratio > 0:
                improvements.append("Replace passive filler phrases (e.g. 'responsible for', 'worked on') with active accomplishment statements.")

        if extractability_score >= 16 and formatting_score >= 8:
            strengths.append("Clean typography and layout structure optimized for reliable parsing by modern ATS systems.")

        return {
            "model": MODEL_NAME,
            "overallScore": overall_score,
            "breakdown": {
                "structure": structure_score,
                "completeness": completeness_score,
                "extractability": extractability_score,
                "skills": skills_score,
                "experienceQuality": experience_quality_score,
                "formatting": formatting_score
            },
            "maxBreakdown": {
                "structure": 20,
                "completeness": 20,
                "extractability": 20,
                "skills": 15,
                "experienceQuality": 15,
                "formatting": 10
            },
            "extractedSkills": extracted_skills,
            "quantification": {
                "densityPercentage": bullet_audit_data["densityPercentage"],
                "actionVerbRatio": bullet_audit_data["actionVerbRatio"],
                "quantifiedCount": bullet_audit_data["quantifiedCount"],
                "totalBullets": bullet_audit_data["totalBullets"]
            },
            "bulletAudits": bullet_audit_data["audits"],
            "strengths": strengths[:4],
            "improvements": improvements[:4]
        }


def main():
    """CLI handler for subprocess execution of role-independent ATS scoring."""
    if len(sys.argv) < 2:
        print(json.dumps({
            "success": False,
            "error": "Usage: python bge_ats_scorer.py <payload_json_path_or_string>"
        }))
        sys.exit(1)

    payload_input = sys.argv[1]

    try:
        if os.path.exists(payload_input):
            with open(payload_input, "r", encoding="utf-8") as f:
                payload = json.load(f)
        else:
            payload = json.loads(payload_input)

        resume_text = payload.get("resumeText", "")
        structured_elements = payload.get("structuredElements", None)

        scorer = RoleIndependentAtsScorer()
        result = scorer.score_resume(
            resume_text=resume_text,
            structured_elements=structured_elements
        )

        print(json.dumps({
            "success": True,
            "data": result
        }))
        sys.exit(0)
    except Exception as e:
        print(json.dumps({
            "success": False,
            "error": str(e)
        }))
        sys.exit(1)


if __name__ == "__main__":
    main()
