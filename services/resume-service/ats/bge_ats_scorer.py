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


# =====================================================================
# CONTENT TAXONOMY LEXICONS (role-independent, structural only)
# =====================================================================
# Canonical content types produced by classify_line_content_type.
CONTENT_TYPES = [
    "SECTION_HEADING", "SUBSECTION_HEADING", "JOB_TITLE", "COMPANY_NAME",
    "DATE", "EXPERIENCE_BULLET", "ACHIEVEMENT_BULLET", "PROJECT_TITLE",
    "PROJECT_DESCRIPTION", "TECHNOLOGY_LINE", "EDUCATION", "CERTIFICATION",
    "PATENT", "PUBLICATION", "AWARD", "OTHER",
]

_SENIORITY = r'(?:senior|sr\.?|junior|jr\.?|lead|principal|staff|chief|head|associate|assistant|distinguished|entry[- ]level|mid[- ]level|graduate)'
_ROLE_MOD = r'(?:software|full[- ]stack|frontend|front[- ]end|backend|back[- ]end|data|machine[- ]learning|ml|devops|site[- ]reliability|sre|cloud|mobile|android|ios|security|qa|test|testing|platform|systems?|solutions?|product|program|research|technical|infrastructure|network|database|support|operations|marketing|sales|business|hr|human[- ]resources|finance|financial)?'
_TITLE_CORE = r'(?:engineer|developer|scientist|analyst|architect|manager|designer|consultant|administrator|admin|technician|specialist|coordinator|director|intern|trainee|researcher|programmer|developer|writer|editor|recruiter|accountant|officer|associate|lead|head)'
_TITLE_LEVEL = r'(?:i{1,3}v?|iv|v|vi|1|2|3|4|one|two|three|senior|junior|lead|principal|staff|ii|iii)'
JOB_TITLE_RE = re.compile(
    rf'^(?:{_SENIORITY}\s+)*{_ROLE_MOD}\s*{_TITLE_CORE}(?:\s+[-–—]?\s*(?:{_SENIORITY}|{_TITLE_LEVEL}))*\.?$',
    re.IGNORECASE
)

COMPANY_SUFFIX_RE = re.compile(
    r'\b(?:inc|inc\.|llc|ltd|ltd\.|corp|corp\.|corporation|co\.|company|companies|technologies|technology|'
    r'networks|systems|solutions|software|labs|lab|digital|studios|studio|group|holdings|enterprises|'
    r'partners|consulting|consultancy|media|industries|motors|aerospace|ventures|capital|bank|healthcare|'
    r'hospital|university|institute|college|school|academy|foundation|association|pvt|private limited|limited)\b',
    re.IGNORECASE
)

CERTIFICATION_RE = re.compile(
    r'\b(?:certif(?:ied|ication|icate)|comptia|comp?tia|ccna|ccnp|ccie|cissp|ceh|cism|pmp|itil|'
    r'aws certified|google cloud certified|microsoft certified|azure certified|oracle certified|'
    r'certified\s+\w+|ocp|ocjp|kubernetes\s+certif|cka|ckad)\b',
    re.IGNORECASE
)

AWARD_RE = re.compile(
    r'\b(?:awards?|awarded|honou?rs?|honou?red|winner|won|championship|champion|1st place|first place|'
    r'2nd place|second place|3rd place|third place|best paper|best thesis|scholarship|medal|'
    r'recognition|prize|fellowship|dean\'?s list|star performer|employee of the)\b',
    re.IGNORECASE
)

PATENT_RE = re.compile(
    r'\b(?:patents?|patent application|us patent|u\.s\. patent|provisional patent|patent no|pat\. no|'
    r'application no|inventors?|assignee|issued patent|patent pending)\b',
    re.IGNORECASE
)

PUBLICATION_RE = re.compile(
    r'\b(?:et al\.|ieee|acm|arxiv|springer|elsevier|conference on|proceedings of|journal of|trans\.|'
    r'symposium on|workshop on|doi:\s*10\.\d+|issn|isbn|publication|published in|research paper|'
    r'technical report|whitepaper|white paper)\b',
    re.IGNORECASE
)

# A line that is essentially only a date or date-range.
DATE_ONLY_RE = re.compile(
    r'^[\(\[]?\s*'
    r'(?:(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s+\d{4}|\d{4}|q[1-4]\s*\d{4})'
    r'(?:\s*(?:[-–—/]|to)\s*'
    r'(?:(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s+\d{4}|\d{4}|present|current|now|ongoing))?'
    r'\s*[\)\]]?\.?$'
    r'|^[\(\[]?\s*(?:(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s+\d{4}|\d{4})\s*[\)\]]?\.?$',
    re.IGNORECASE
)

# Generic employment work-mode / arrangement metadata that commonly trails a
# job-title header inside parentheses or after a separator, e.g.
# "Senior Software Engineer II (Juniper Networks, Work From Home)".
# These are structural metadata tokens, never experience content.
WORK_MODE_RE = re.compile(
    r'\b(?:remote|hybrid|on[- ]?site|onsite|work[- ]from[- ]home|wfh|in[- ]office|'
    r'full[- ]time|part[- ]time|contract|contractor|temporary|internship|intern|'
    r'freelance|seasonal|volunteer)\b',
    re.IGNORECASE
)

EDUCATION_LINE_RE = re.compile(
    r'\b(?:gpa|cgpa|grade|bachelor|bachelors|master|masters|b\.tech|btech|m\.tech|mtech|b\.e\.|m\.s\.|m\.sc|'
    r'b\.s\.|bsc|b\.sc|ph\.?d|doctorate|mba|bba|dean\'?s list|graduated|graduation|major|minor|'
    r'intermediate|high school|secondary school|diploma|coursework|university|institute|college)\b',
    re.IGNORECASE
)

TECH_LINE_RE = re.compile(
    r'^(?:technologies|technology|tools?|tech stack|technology stack|environment|languages?|frameworks?|'
    r'stack|platforms?|libraries|skills?)\s*[:|]',
    re.IGNORECASE
)

# Section-header recognition (ordered; first match wins).
SECTION_HEADER_PATTERNS = [
    ("PATENTS", re.compile(r'^(?:patents?|intellectual property|ip)\b', re.IGNORECASE)),
    ("PUBLICATIONS", re.compile(r'^(?:publications?|papers?|research papers?|articles?|writing|writings)\b', re.IGNORECASE)),
    ("AWARDS", re.compile(r'^(?:awards?|honors?|honours?|achievements?|accomplishments?|recognitions?|prizes?)\b', re.IGNORECASE)),
    ("CERTIFICATIONS", re.compile(r'^(?:certifications?|certificates?|licenses?|licences?|credentials?)\b', re.IGNORECASE)),
    ("SUMMARY", re.compile(r'^(?:summary|professional summary|profile|objective|career objective|about me|about)\b', re.IGNORECASE)),
    ("EDUCATION", re.compile(r'^(?:education|academic|academics|qualification|qualifications|scholastic|schooling)\b', re.IGNORECASE)),
    ("SKILLS", re.compile(r'^(?:skills|technical skills|technical competencies|technologies|core competencies|competencies|tools|skills & competencies|expertise|areas of expertise)\b', re.IGNORECASE)),
    ("EXPERIENCE", re.compile(r'^(?:experience|work experience|employment|employment history|work history|professional experience|internship|internships|work|career history|industry experience)\b', re.IGNORECASE)),
    ("PROJECTS", re.compile(r'^(?:projects|academic projects|key projects|personal projects|technical projects|notable projects|coursework projects)\b', re.IGNORECASE)),
    ("LEADERSHIP", re.compile(r'^(?:leadership|volunteer|volunteering|activities|extracurricular|clubs?|involvement)\b', re.IGNORECASE)),
]

_ALL_SECTION_KEYS = [
    "HEADER", "SUMMARY", "EDUCATION", "SKILLS", "EXPERIENCE", "PROJECTS",
    "CERTIFICATIONS", "PATENTS", "PUBLICATIONS", "AWARDS", "LEADERSHIP", "OTHER",
]


def section_bucket_for_header(header_text: str) -> Optional[str]:
    """Map a heading string to a section bucket, or None if it is not a heading."""
    clean_hdr = re.sub(r'[^a-zA-Z\s]', '', header_text).strip()
    words = clean_hdr.split()
    if not words or len(words) > 4:
        return None
    for bucket, pattern in SECTION_HEADER_PATTERNS:
        if pattern.search(clean_hdr):
            return bucket
    return None


# =====================================================================
# CONTEXT-AWARE SKILL DETECTION (explicit vs inferred)
# =====================================================================
# Skills whose surface form collides with ordinary English. These are ONLY
# counted as explicit when strong contextual evidence is present; otherwise
# they are reported as inferred (never scored).
STRICT_AMBIGUOUS_KEYS = {"go", "react", "express", "spring", "dart", "rust", "node"}
CONTEXT_AMBIGUOUS_KEYS = {"c", "ts", "js", "rest", "ruby", "vue", "flask", "lambda", "mongo", "s3", "ec2"}
AMBIGUOUS_KEYS = STRICT_AMBIGUOUS_KEYS | CONTEXT_AMBIGUOUS_KEYS

# Capitalization alone is NOT trusted for these (common sentence-initial words).
PROSE_CAP_RISK = {"go", "react", "express", "spring", "dart", "rust", "node", "rest", "c"}

AMBIGUOUS_CONTEXT = {
    "go": r'\b(?:golang|goroutines?|go\.mod|go module|go language|go standard library)\b',
    "rust": r'\b(?:cargo|rustc|rustup|rust language|rust crate|rustlang)\b',
    "react": r'\b(?:jsx|reactjs|react\.js|redux|react native|react hooks?|react component|react router)\b',
    "express": r'\b(?:expressjs|express\.js)\b|\bexpress\s+(?:server|framework|app|route|middleware)',
    "spring": r'\b(?:spring boot|springboot|spring framework|spring core|spring mvc|spring data|spring cloud|hibernate)\b',
    "dart": r'\b(?:flutter|dartpad|dart language|dart sdk|dart lang)\b',
    "node": r'\b(?:nodejs|node\.js|npm|node runtime|node server)\b',
    "vue": r'\b(?:vuejs|vue\.js|nuxt|vue component|vue router)\b',
    "ruby": r'\b(?:rails|ruby on rails|gemfile|rvm|rake)\b',
    "flask": r'\b(?:python flask|wsgi|jinja)\b|\bflask\s+(?:app|route|server|blueprint)',
    "lambda": r'\b(?:aws lambda|lambda function|lambda handler|serverless lambda)\b',
    "mongo": r'\b(?:mongodb|mongo db|mongo shell|mongo atlas|nosql)\b',
    "s3": r'\b(?:aws s3|amazon s3|s3 bucket|s3 storage)\b',
    "ec2": r'\b(?:aws ec2|amazon ec2|ec2 instance)\b',
    "c": r'\b(?:c language|c programming|ansi c|gnu c|gcc|embedded c|c standard library)\b',
    "ts": r'\btypescript\b|\.ts\b',
    "js": r'\bjavascript\b|\.js\b',
    "rest": r'\brest api\b|\brest apis\b|\brestful\b|\brest architecture\b|\brest\s+(?:service|endpoint)',
}

# Canonical skill -> category (first surface form wins).
CANONICAL_CATEGORY: Dict[str, str] = {}
for _surf, (_canon, _cat) in SKILL_NORMALIZATION_MAP.items():
    CANONICAL_CATEGORY.setdefault(_canon, _cat)

# Precompile a boundary-safe regex per skill surface form (longest first so
# multi-word keys such as "spring boot" are preferred over "spring").
_SKILL_KEYS_SORTED = sorted(SKILL_NORMALIZATION_MAP.keys(), key=len, reverse=True)
_SKILL_REGEXES: List[Tuple[str, "re.Pattern"]] = []
for _key in _SKILL_KEYS_SORTED:
    _parts = _key.split(' ')
    if len(_parts) > 1:
        _body = r'[\s\-]+'.join(re.escape(p) for p in _parts)
    else:
        _body = re.escape(_key)
    _pre = r'(?<![a-z0-9\-])' if _key[0].isalnum() else ''
    _post = r'(?![a-z0-9+#\-])' if _key[-1].isalnum() else ''
    _SKILL_REGEXES.append((_key, re.compile(_pre + _body + _post, re.IGNORECASE)))

_LIST_DELIM_RE = re.compile(r'[,;|/\n]')


def _normalized_segment(seg: str) -> str:
    s = seg.strip().strip('().,:').strip().lower()
    for suffix in (".js", "js", ".net", "++", "#"):
        if s.endswith(suffix):
            s = s[:-len(suffix)].strip()
    return s


def detect_skills_in_text(text: str, force_list: bool = False) -> Tuple[Set[str], Set[str]]:
    """
    Detect skills with contextual awareness.

    Returns (explicit, inferred) sets of canonical skill names. Only `explicit`
    should contribute to ATS / Competitive scoring. Ambiguous surface forms
    (Go, React, Spring, Express, Rust, Dart, Node, C, ...) are counted as
    explicit only with strong evidence:
      - they appear as an isolated item of a delimited list line, or
      - a technical-context phrase appears near them, or
      - they are Capitalized and not a common sentence-initial English word.
    Non-ambiguous technologies (Python, Docker, Kubernetes, AWS, ...) are always
    explicit when present as a whole token.
    """
    explicit: Set[str] = set()
    inferred: Set[str] = set()
    if not text:
        return explicit, inferred

    # Per-line list-like detection: a line with delimiters yields isolated
    # segments; an ambiguous token equal to a whole segment is list-context.
    line_segments: Dict[int, Set[str]] = {}
    for ln, line in enumerate(text.split('\n')):
        segs = set()
        if _LIST_DELIM_RE.search(line):
            for seg in _LIST_DELIM_RE.split(line):
                norm = _normalized_segment(seg)
                if norm:
                    segs.add(norm)
        line_segments[ln] = segs

    # Map char offset -> line index for window/list lookups.
    line_starts = []
    pos = 0
    for line in text.split('\n'):
        line_starts.append(pos)
        pos += len(line) + 1

    def _line_index(idx: int) -> int:
        lo = 0
        for li, start in enumerate(line_starts):
            if start <= idx:
                lo = li
            else:
                break
        return lo

    for key, regex in _SKILL_REGEXES:
        canonical, _cat = SKILL_NORMALIZATION_MAP[key]
        ambiguous = key in AMBIGUOUS_KEYS
        for m in regex.finditer(text):
            matched_text = m.group(0)
            is_explicit = True
            if ambiguous and not force_list:
                start, end = m.start(), m.end()
                window = text[max(0, start - 45):min(len(text), end + 45)]
                ctx = AMBIGUOUS_CONTEXT.get(key)
                has_ctx = bool(ctx and re.search(ctx, window, re.IGNORECASE))
                li = _line_index(start)
                seg_norm = _normalized_segment(matched_text)
                is_isolated = seg_norm in line_segments.get(li, set())
                is_cap = matched_text[0].isupper() and key not in PROSE_CAP_RISK and len(key) >= 3
                is_explicit = has_ctx or is_isolated or is_cap
            if is_explicit:
                explicit.add(canonical)
            else:
                inferred.add(canonical)
        if canonical in explicit:
            inferred.discard(canonical)

    return explicit, inferred


class RoleIndependentAtsScorer:
    """
    Evaluates resumes strictly across the 6 role-independent ATS pillars (Total 100 points).
    Features high score discrimination based on measurable signals.
    """

    def parse_sections_and_bullets(self, raw_text: str, structured_elements: Optional[List[Dict[str, Any]]] = None) -> Dict[str, Any]:
        """
        Segment resume into classified sections to prevent false positives in
        quantification audits.

        When Docling `structured_elements` are available the section hierarchy is
        taken directly from the document labels (section_header/list_item/
        paragraph) instead of being re-guessed from flattened plain text. A
        line-based heuristic is used only as a fallback.
        """
        sections_map: Dict[str, List[str]] = {k: [] for k in _ALL_SECTION_KEYS}

        # ---- Preferred path: Docling structured hierarchy ----
        used_structured = False
        if structured_elements:
            current_section = "HEADER"
            header_run = 0
            for el in structured_elements:
                if not isinstance(el, dict):
                    continue
                el_type = str(el.get("type", "")).lower()
                text = (el.get("text") or "").strip()
                if el_type == "table":
                    text = (el.get("markdown") or el.get("html") or "").strip()
                if not text:
                    continue
                used_structured = True

                if el_type == "section_header":
                    bucket = section_bucket_for_header(text)
                    if bucket:
                        current_section = bucket
                        header_run = 0
                        continue
                    # A heading Docling found but we have no bucket for -> OTHER.
                    current_section = "OTHER"
                    header_run = 0
                    continue

                if current_section == "HEADER" and header_run < 3:
                    sections_map["HEADER"].append(text)
                    header_run += 1
                else:
                    sections_map[current_section].append(text)

            if used_structured and sum(len(v) for k, v in sections_map.items() if k != "HEADER") > 0:
                return sections_map
            # Otherwise fall through to the line-based heuristic.
            sections_map = {k: [] for k in _ALL_SECTION_KEYS}

        # ---- Fallback path: line-based heuristic ----
        lines = [l.strip() for l in raw_text.split('\n') if l.strip()]
        current_section = "HEADER"

        for idx, line in enumerate(lines):
            matched_section = section_bucket_for_header(line)

            if matched_section:
                current_section = matched_section
                continue

            # First 3 lines before any section headers belong to HEADER
            if idx < 3 and current_section == "HEADER":
                sections_map["HEADER"].append(line)
            else:
                sections_map[current_section].append(line)

        return sections_map

    def normalize_extracted_skills(self, skills_lines: List[str], full_text: str) -> Tuple[List[str], Set[str], bool, List[str]]:
        """
        Extract, normalize, and categorize technical & domain skills.

        Returns (explicit_skills, categories, is_categorized, inferred_skills).
        Only explicit skills contribute to the ATS score. The dedicated SKILLS
        section is treated as a list (all whole-token matches are explicit);
        the remaining text is scanned with context-aware detection so that
        ordinary English (e.g. "go beyond", "react quickly", "spring cleaning")
        never produces false skills. The legacy "scan everything when <3 skills
        are found" amplification has been removed.
        """
        combined_skills_text = " ".join(skills_lines) if skills_lines else ""

        is_categorized = bool(re.search(
            r'\b(?:languages|frameworks|libraries|databases|tools|platforms|developer tools|cloud|methodologies|core competencies)\s*:',
            combined_skills_text or full_text, re.IGNORECASE))

        explicit: Set[str] = set()
        inferred: Set[str] = set()

        # 1. Dedicated skills section: delimited list -> all tokens explicit.
        if combined_skills_text.strip():
            e, i = detect_skills_in_text(combined_skills_text, force_list=True)
            explicit |= e
            inferred |= i

        # 2. Full text: context-aware scan (explicit for real technologies,
        #    inferred for weakly-evidenced ambiguous tokens).
        e2, i2 = detect_skills_in_text(full_text, force_list=False)
        explicit |= e2
        inferred |= i2

        inferred -= explicit

        categories: Set[str] = set()
        for canon in explicit:
            cat = CANONICAL_CATEGORY.get(canon)
            if cat:
                categories.add(cat)

        return sorted(explicit), categories, is_categorized, sorted(inferred)

    # Docling block labels that represent real bullets vs. non-bullet blocks.
    _BULLET_ELEMENT_TYPES = {"list_item"}
    _NON_BULLET_ELEMENT_TYPES = {
        "paragraph", "caption", "text", "title", "page_header", "page_footer",
        "section_header", "reference", "formula",
    }

    def classify_line_content_type(self, line: str, section_name: str, element_type: Optional[str] = None) -> str:
        """
        Classify a candidate line into one of the structural content types:
          SECTION_HEADING, SUBSECTION_HEADING, JOB_TITLE, COMPANY_NAME, DATE,
          EXPERIENCE_BULLET, ACHIEVEMENT_BULLET, PROJECT_TITLE,
          PROJECT_DESCRIPTION, TECHNOLOGY_LINE, EDUCATION, CERTIFICATION,
          PATENT, PUBLICATION, AWARD, OTHER.

        Only EXPERIENCE_BULLET, ACHIEVEMENT_BULLET and PROJECT_DESCRIPTION are
        ever audited for quality; every metadata/heading type is excluded so
        job titles, companies, dates, certifications, patents and publications
        never receive "weak action verb" / "missing metric" suggestions.

        `element_type` is the Docling block label (list_item / paragraph /
        section_header / caption / ...) when the document hierarchy is
        available. It is preferred over flattened-text guessing: a non-bullet
        block (e.g. a paragraph) is never promoted to EXPERIENCE_BULLET merely
        because it is long, while a list_item keeps bullet semantics.
        """
        el_type = str(element_type).lower() if element_type else None
        is_bullet_element = el_type in self._BULLET_ELEMENT_TYPES
        is_non_bullet_element = el_type in self._NON_BULLET_ELEMENT_TYPES

        clean = line.strip()
        if not clean:
            return "OTHER"

        no_bullet = re.sub(r'^[•\-\*▪◦‣⁃]\s*', '', clean).strip()
        no_bullet = re.sub(r'^\d+[.)]\s*', '', no_bullet).strip()
        has_bullet_marker = no_bullet != clean
        word_count = len(no_bullet.split())
        lower_nb = no_bullet.lower()

        # 0. Explicit section heading (consumed by the parser, but classified
        #    here too so direct callers get a consistent answer).
        if not has_bullet_marker and section_bucket_for_header(clean) is not None:
            return "SECTION_HEADING"

        # 1. A line that is nothing but a date / date-range.
        if not has_bullet_marker and DATE_ONLY_RE.match(clean):
            return "DATE"

        # 2. Patents & publications (always excluded from experience analysis).
        if PATENT_RE.search(clean):
            return "PATENT"
        author_citation_pattern = re.compile(
            r'^[A-Z][a-z]+(?:\s+[A-Z]\.?)?\s+[A-Z][a-z]+(?:,\s+[A-Z][a-z]+(?:\s+[A-Z]\.?)?\s+[A-Z][a-z]+)*\s+(?:et al\.|and\s+[A-Z][a-z]+)'
        )
        if PUBLICATION_RE.search(clean) or author_citation_pattern.match(clean):
            return "PUBLICATION"

        # 3. Certifications & awards (check before company/job-title because
        #    e.g. "AWS Certified Solutions Architect" contains company words).
        if CERTIFICATION_RE.search(clean) and word_count <= 14:
            return "CERTIFICATION"
        if AWARD_RE.search(clean) and word_count <= 14:
            return "AWARD"

        # 4. URLs / links / short contact lines.
        if re.search(r'https?://\S+|www\.\S+|github\.com/\S+|linkedin\.com/\S+', clean, re.IGNORECASE) and word_count <= 8:
            return "OTHER"

        # 5. Technology inventory lines.
        if TECH_LINE_RE.match(clean):
            return "TECHNOLOGY_LINE"
        if '|' in clean and not has_bullet_marker and word_count <= 14 and not any(
            re.search(r'\b' + v + r'\b', lower_nb) for v in ['built', 'developed', 'designed', 'managed', 'led', 'architected', 'engineered', 'implemented']
        ) and not JOB_TITLE_RE.match(self._leading_header_segment(no_bullet)):
            return "TECHNOLOGY_LINE"

        # 6. Education lines.
        if EDUCATION_LINE_RE.search(clean) and (section_name == "EDUCATION" or word_count <= 10):
            return "EDUCATION"

        # 7. Job titles & company names (structural metadata inside EXPERIENCE /
        #    HEADER / OTHER, not PROJECTS where they would clash with titles).
        #    A header core is recognised even when trailing metadata follows,
        #    e.g. "Senior Software Engineer II (Acme Corp, Work From Home)".
        #    A line that starts with an action verb is a bullet, never a header.
        meta_section = section_name in ("EXPERIENCE", "HEADER", "OTHER", "LEADERSHIP", "CERTIFICATIONS", "SUMMARY")
        starts_with_verb = self._first_word_is_verb(no_bullet) or self._starts_with_label_verb(no_bullet)
        if meta_section and not has_bullet_marker and not starts_with_verb:
            title_core = self._leading_header_segment(no_bullet)
            core_words = len(title_core.split()) if title_core else 0
            if title_core and core_words <= 10 and JOB_TITLE_RE.match(title_core):
                return "JOB_TITLE"
            if not is_bullet_element and word_count <= 10 and COMPANY_SUFFIX_RE.search(no_bullet):
                return "COMPANY_NAME"

        # 8. Subsection label with no trailing content -> heading.
        if not has_bullet_marker and clean.endswith(':') and word_count <= 6:
            return "SUBSECTION_HEADING"

        # 9. Projects: title vs description vs achievement bullet.
        project_desc_pattern = re.compile(r'^[A-Za-z0-9\s/+#.\'&-]{2,40}\s*[-–—:|]\s+(?=[A-Z0-9])')
        if section_name == "PROJECTS" or project_desc_pattern.match(clean):
            clean_no_bullet = no_bullet
            first_w = clean_no_bullet.split()[0].lower().rstrip(':,;.') if clean_no_bullet.split() else ''

            if project_desc_pattern.match(clean_no_bullet):
                parts = re.split(r'\s*[-–—:|]\s+', clean_no_bullet, maxsplit=1)
                if len(parts) == 2:
                    after_title = parts[1].strip()
                    after_first_w = after_title.split()[0].lower() if after_title.split() else ''
                    if after_first_w not in STRONG_ACTION_VERBS and not self._starts_with_label_verb(after_title):
                        return "PROJECT_DESCRIPTION"

            if not has_bullet_marker:
                if word_count <= 4 and first_w not in STRONG_ACTION_VERBS and first_w not in NEUTRAL_ACTION_VERBS:
                    return "PROJECT_TITLE"
                if (first_w not in STRONG_ACTION_VERBS and first_w not in NEUTRAL_ACTION_VERBS
                        and not any(lower_nb.startswith(v + ' ') for v in STRONG_ACTION_VERBS)
                        and not self._starts_with_label_verb(clean_no_bullet)):
                    return "PROJECT_DESCRIPTION"

        # 10. Experience / achievement bullets.
        if section_name == "PROJECTS":
            return "ACHIEVEMENT_BULLET"

        verb_led = self._first_word_is_verb(no_bullet) or self._starts_with_label_verb(no_bullet)

        # A header line carrying trailing company/date/work-mode metadata is
        # structural, not an experience bullet (e.g. "Title (Acme Corp, Remote)").
        if not has_bullet_marker and not verb_led and self._has_trailing_header_metadata(no_bullet):
            return "OTHER"

        # When the Docling hierarchy marks this block as a non-bullet paragraph /
        # caption / heading, do not promote it to a bullet merely for being long;
        # require an explicit bullet marker, list_item label, or a verb-led /
        # sentence-like line.
        if is_non_bullet_element and not has_bullet_marker and not verb_led:
            return "OTHER"

        # Default for EXPERIENCE (and anything else): only treat as a bullet if
        # it genuinely looks like one; otherwise it is stray metadata -> OTHER.
        looks_like_bullet = (
            has_bullet_marker
            or is_bullet_element
            or word_count >= 6
            or verb_led
        )
        if looks_like_bullet:
            return "EXPERIENCE_BULLET"
        return "OTHER"

    @staticmethod
    def _first_word_is_verb(text: str) -> bool:
        words = text.split()
        if not words:
            return False
        first = re.sub(r'[^a-z]', '', words[0].lower())
        if first in STRONG_ACTION_VERBS or first in NEUTRAL_ACTION_VERBS:
            return True
        return bool(first.endswith('ed') and len(first) >= 4 and first not in ('need', 'deed', 'seed', 'feed', 'weed', 'speed'))

    @staticmethod
    def _norm_text_key(text: str) -> str:
        """Normalize a block's text for matching a section line back to its
        Docling element label (strip bullet markers, collapse whitespace)."""
        t = re.sub(r'^[•\-\*▪◦‣⁃]\s*', '', (text or '').strip())
        t = re.sub(r'^\d+[.)]\s*', '', t).strip()
        return re.sub(r'\s+', ' ', t).lower()

    @staticmethod
    def _starts_with_label_verb(text: str) -> bool:
        """
        True when a leading label/subsection precedes an action verb, e.g.
        "Application Infrastructure & Packaging: Architected ..." or
        "CI/CD & Release Automation: Built ...".
        """
        m = re.match(r'^([A-Z][^:]{2,60}):\s+(.*)$', text)
        if not m:
            return False
        remainder = m.group(2).strip()
        return RoleIndependentAtsScorer._first_word_is_verb(remainder)

    @staticmethod
    def _leading_header_segment(text: str) -> str:
        """
        Return the leading noun-phrase segment of a header line, dropping any
        trailing parenthetical group and separator-delimited metadata. Fully
        generic — no specific title / company / person is hard-coded. Handles
        the common resume header layouts:

          "Title (Company, Work Mode)"    -> "Title"
          "Title (Company, Date Range)"   -> "Title"
          "Title, Company, Dates"         -> "Title"
          "Title | Company | Mode"        -> "Title"
          "Title – Company"               -> "Title"
          "Title at Company"              -> "Title"
          "Title"                         -> "Title"
        """
        core = text.strip()
        # Drop a trailing parenthetical / bracketed group, e.g. "(Acme, Remote)".
        core = re.sub(r'\s*[\(\[][^()\[\]]*[\)\]]\s*$', '', core).strip()
        # Leading segment before the first structural separator.
        sep = r'[,|·•\u2013\u2014]|\s+at\s+|\s+@\s+|\s+-\s+'
        parts = [p.strip() for p in re.split(sep, core, flags=re.IGNORECASE) if p.strip()]
        return parts[0] if parts else core

    @staticmethod
    def _has_trailing_header_metadata(text: str) -> bool:
        """
        True when the line ends with a parenthetical or separator-delimited
        metadata group holding a date, work-mode, or company-suffix token, e.g.
        "(Acme Corp, Remote)", "| Jan 2020 - Present", "– Initech". Used to keep
        header lines out of the experience-bullet analyzer without hard-coding
        any particular title or company.
        """
        tails: List[str] = []
        m = re.search(r'[\(\[]([^()\[\]]*)[\)\]]\s*$', text)
        if m:
            tails.append(m.group(1))
        m2 = re.match(r'^.*?[,|·•\u2013\u2014]\s*([^,|·•\u2013\u2014]+)$', text)
        if m2:
            tails.append(m2.group(1))
        for g in tails:
            g = g.strip()
            if g and (DATE_ONLY_RE.match(g) or WORK_MODE_RE.search(g) or COMPANY_SUFFIX_RE.search(g)):
                return True
        return False

    def audit_experience_and_project_bullets(self, sections_map: Dict[str, List[str]], structured_elements: Optional[List[Dict[str, Any]]] = None) -> Dict[str, Any]:
        """
        CONTENT-TYPE FILTER & 8-SIGNAL CONTEXTUAL BULLET AUDITOR:
        
        1. Classifies each candidate item by content-type:
           - PROJECT_TITLE -> Excluded from quality audit
           - PROJECT_DESCRIPTION -> Handled specifically; NEVER receives weak action verb warnings
           - ACHIEVEMENT_BULLET / EXPERIENCE_BULLET -> Audited across 8 semantic signals
           - SECTION_HEADING / SUBSECTION_HEADING / JOB_TITLE / COMPANY_NAME / DATE /
             EDUCATION / CERTIFICATION / PATENT / PUBLICATION / AWARD /
             TECHNOLOGY_LINE / OTHER -> Excluded

        2. Recognizes existing scale metrics in project descriptions and achievement bullets:
           (e.g., '1 billion rows', '1200+ developers', 'over 10,000 users', '4M users',
            'mentored 6 junior engineers')

        3. Selects ONE highest-impact recommendation per bullet, capped at the TOP 3–5 highest-value improvements.
        """
        experience_lines = sections_map.get("EXPERIENCE", [])
        project_lines = sections_map.get("PROJECTS", [])

        # Unit nouns that turn a preceding number into a quantitative outcome.
        unit_nouns = (
            r'users|clients|customers|records|rows|datasets|requests|transactions|events|'
            r'msgs|messages|qps|rps|tps|ms|milliseconds|seconds|mins|minutes|hours|days|weeks|'
            r'months|years|engineers|developers|members|endpoints|subscribers|leads|visitors|'
            r'queries|nodes|clusters|servers|services|apis?|tests?|tickets|issues|bugs|'
            r'features|modules|reports|documents|pages|screens|integrations|migrations|'
            r'terabytes|tb|gb|mb|kb|million|billion|thousand|hundred|k|m|b|people|teams|'
            r'employees|students|candidates|accounts|orders|payments|invoices|shipments'
        )
        # Metric patterns (including 1 billion rows, 1200+ developers, 10,000 users, 4M users, $500k, 45% speedup, etc.)
        metric_patterns = [
            r'\b\d+(?:\.\d+)?%',  # 45%, 94%, 3.5%
            r'\$\d+(?:,\d+)*(?:\.\d+)?[kKmMbB]?',  # $500k, $1.2M, $50k
            # number immediately followed by a unit noun (any magnitude, incl. single digit)
            rf'\b(?:over|more than|approximately|approx|around|up to|>\s*)?\s*\d+(?:,\d+)*(?:\.\d+)?[kKmMbB]?\+?\s*(?:{unit_nouns})\b',
            # number followed by up to TWO intervening words then a unit noun,
            # e.g. "6 junior engineers", "3 distributed services", "5 cloud regions"
            rf'\b\d+(?:\.\d+)?[kKmMbB]?\+?\s+(?:[a-zA-Z]+\s+){{0,2}}?(?:{unit_nouns})\b',
            r'\b(?:reduced|improved|increased|decreased|accelerated|optimized|scaled|boosted)\s+.*?\bby\s+\d+',
            r'\b\d+x\b',
            r'\b\d{2,}\b'  # bare counts >= 10 in context
        ]

        outcome_patterns = [
            r'\b(?:resulting in|leading to|achieving|yielding|enabling|reducing|improving|increasing|decreasing|accelerating|saving|optimizing|boosting|facilitating|ensuring|to develop|to simplify|to optimize|to automate|to scale|to ensure|to accelerate)\b'
        ]

        # Prefer the Docling document hierarchy when available: map each block's
        # normalized text to its element label (list_item / paragraph /
        # section_header / caption / ...) so classification can distinguish real
        # bullets from header/metadata paragraphs instead of guessing from
        # flattened plain text alone.
        el_type_by_text: Dict[str, str] = {}
        if structured_elements:
            for el in structured_elements:
                if not isinstance(el, dict):
                    continue
                txt = (el.get("text") or "").strip()
                if not txt and str(el.get("type", "")).lower() == "table":
                    txt = (el.get("markdown") or el.get("html") or "").strip()
                if txt:
                    el_type_by_text[self._norm_text_key(txt)] = str(el.get("type", "")).lower()

        classified_items = []
        for line in experience_lines:
            et = el_type_by_text.get(self._norm_text_key(line))
            c_type = self.classify_line_content_type(line, "EXPERIENCE", et)
            classified_items.append((line, c_type, "EXPERIENCE"))

        for line in project_lines:
            et = el_type_by_text.get(self._norm_text_key(line))
            c_type = self.classify_line_content_type(line, "PROJECTS", et)
            classified_items.append((line, c_type, "PROJECTS"))

        actionable_bullets = []
        # Only true work/achievement bullets and project descriptions are audited.
        AUDITED_TYPES = {"EXPERIENCE_BULLET", "ACHIEVEMENT_BULLET", "PROJECT_DESCRIPTION"}
        for line, c_type, sec in classified_items:
            if c_type not in AUDITED_TYPES:
                continue

            clean_text = re.sub(r'^[•\-\*▪◦‣⁃]\s*', '', line).strip()
            clean_text = re.sub(r'^\d+[.)]\s*', '', clean_text).strip()
            if len(clean_text.split()) >= 4:
                actionable_bullets.append((clean_text, c_type, sec))

        if not actionable_bullets:
            return {
                "quantifiedCount": 0,
                "actionVerbCount": 0,
                "fillerCount": 0,
                "impactCount": 0,
                "specificCount": 0,
                "totalBullets": 0,
                "densityPercentage": 0,
                "actionVerbRatio": 0,
                "fillerRatio": 0,
                "impactRatio": 0,
                "specificityRatio": 0,
                "audits": []
            }

        quantified_count = 0
        action_verb_count = 0
        filler_count = 0
        impact_count = 0
        specific_count = 0
        raw_audits = []

        for idx, (clean_b, c_type, sec) in enumerate(actionable_bullets):
            words = clean_b.split()
            if not words:
                continue

            # When a subsection label precedes the verb, e.g.
            # "Application Infrastructure & Packaging: Architected ...", the
            # verb is not the first token of the whole line. Analyze the text
            # AFTER the label so these bullets get credit for their action verb.
            verb_probe = clean_b
            label_match = re.match(r'^([A-Z][^:]{2,60}):\s+(.*)$', clean_b)
            if label_match and self._first_word_is_verb(label_match.group(2).strip()):
                verb_probe = label_match.group(2).strip()

            probe_words = verb_probe.split()
            first_word = probe_words[0].lower().rstrip(':,;.') if probe_words else ''
            first_word_clean = re.sub(r'[^a-z]', '', first_word)
            probe_lower = verb_probe.lower()

            # Robust verb recognition
            is_regular_ed_verb = bool(first_word_clean.endswith('ed') and len(first_word_clean) >= 4 and first_word_clean not in ['need', 'deed', 'seed', 'feed', 'weed', 'speed'])
            has_strong_action = bool(
                first_word_clean in STRONG_ACTION_VERBS or
                (is_regular_ed_verb and first_word_clean not in NEUTRAL_ACTION_VERBS) or
                any(probe_lower.startswith(verb + ' ') for verb in STRONG_ACTION_VERBS)
            )
            has_neutral = bool(
                first_word_clean in NEUTRAL_ACTION_VERBS or
                any(probe_lower.startswith(verb + ' ') for verb in NEUTRAL_ACTION_VERBS)
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

            # Substantive technical flow: a detailed, domain-specific statement that
            # reads as a real implementation even without an explicit number.
            is_substantive_flow = (has_security and len(words) >= 8) or (has_android and len(words) >= 8) or (has_api and len(words) >= 9)

            # Achievement / impact signal: measurable outcome, substantive technical
            # flow, or a concrete technical contribution of sufficient length that is
            # owned (not a vague responsibility). Computed for ALL audited types,
            # including PROJECT_DESCRIPTION, so strong project work earns credit.
            has_impact = bool(
                has_metric or has_outcome_phrase or is_substantive_flow or
                (has_domain_tools and len(words) >= 7 and not has_weak_opening)
            )

            # Specificity / clarity signal: names concrete technical substance, is
            # sufficiently detailed, and avoids vague-responsibility openings.
            is_specific = bool(not has_weak_opening and has_domain_tools and len(words) >= 6)

            if has_metric:
                quantified_count += 1
            if is_verb_form or c_type == "PROJECT_DESCRIPTION":
                action_verb_count += 1
            if has_weak_opening:
                filler_count += 1
            if has_impact:
                impact_count += 1
            if is_specific:
                specific_count += 1

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
        impact_ratio_pct = round((impact_count / max(1, total)) * 100, 1)
        specificity_ratio_pct = round((specific_count / max(1, total)) * 100, 1)

        return {
            "quantifiedCount": quantified_count,
            "actionVerbCount": action_verb_count,
            "fillerCount": filler_count,
            "impactCount": impact_count,
            "specificCount": specific_count,
            "totalBullets": total,
            "densityPercentage": density_pct,
            "actionVerbRatio": action_ratio_pct,
            "fillerRatio": filler_ratio_pct,
            "impactRatio": impact_ratio_pct,
            "specificityRatio": specificity_ratio_pct,
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
        extracted_skills, skill_categories, is_categorized, inferred_skills = self.normalize_extracted_skills(sections_map["SKILLS"], clean_text)
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
        bullet_audit_data = self.audit_experience_and_project_bullets(sections_map, structured_elements)
        action_ratio = bullet_audit_data["actionVerbRatio"]
        quant_density = bullet_audit_data["densityPercentage"]
        filler_ratio = bullet_audit_data["fillerRatio"]
        impact_ratio = bullet_audit_data["impactRatio"]
        specificity_ratio = bullet_audit_data["specificityRatio"]
        total_work_bullets = bullet_audit_data["totalBullets"]

        # Balanced composition (15 pts max) across four independent dimensions so
        # that a single weak dimension — most commonly missing metrics — can never
        # collapse the pillar when bullets are verb-led, specific, and impactful:
        #   Action-verb quality   : 4 pts
        #   Specificity / clarity : 4 pts
        #   Achievement / impact  : 4 pts
        #   Quantified metrics    : 3 pts
        exp_action_pts = 0
        exp_specific_pts = 0
        exp_impact_pts = 0
        exp_quant_pts = 0

        if total_work_bullets > 0:
            # Action-verb quality (4 pts)
            if action_ratio >= 75:
                exp_action_pts = 4
            elif action_ratio >= 50:
                exp_action_pts = 3
            elif action_ratio >= 25:
                exp_action_pts = 2
            else:
                exp_action_pts = 1

            # Specificity / clarity (4 pts) — concrete, technical, non-vague bullets
            if specificity_ratio >= 75:
                exp_specific_pts = 4
            elif specificity_ratio >= 50:
                exp_specific_pts = 3
            elif specificity_ratio >= 25:
                exp_specific_pts = 2
            else:
                exp_specific_pts = 1

            # Achievement / impact (4 pts) — outcome, scale, or substantive contribution
            if impact_ratio >= 75:
                exp_impact_pts = 4
            elif impact_ratio >= 50:
                exp_impact_pts = 3
            elif impact_ratio >= 25:
                exp_impact_pts = 2
            else:
                exp_impact_pts = 1

            # Quantified metrics (3 pts) — valuable but capped so it cannot dominate
            if quant_density >= 60:
                exp_quant_pts = 3
            elif quant_density >= 30:
                exp_quant_pts = 2
            elif quant_density >= 15:
                exp_quant_pts = 1
            else:
                exp_quant_pts = 0
        else:
            # Fallback if candidate only provided summary/non-bullet descriptions
            exp_action_pts = 1
            exp_specific_pts = 1
            exp_impact_pts = 1
            exp_quant_pts = 0

        experience_quality_score = min(
            15,
            exp_action_pts + exp_specific_pts + exp_impact_pts + exp_quant_pts
        )

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
            if quant_density >= 30:
                strengths.append(f"High-impact accomplishment bullets featuring strong action verbs and quantified outcomes ({quant_density}% metrics density).")
            else:
                strengths.append("High-impact accomplishment bullets featuring strong action verbs and clear, specific technical contributions.")
        else:
            # Bullet-quality recommendations are only meaningful when the content
            # classifier actually found genuine EXPERIENCE_BULLET / ACHIEVEMENT_BULLET /
            # PROJECT_DESCRIPTION items to analyze. A resume with no audited bullets
            # (e.g. a student resume whose projects are short titles, or one carrying
            # only certifications/awards) must NOT be told its bullets lack strong
            # verbs or metrics — there are none to judge. This also avoids penalizing
            # a resume merely for having no traditional WORK EXPERIENCE section.
            has_audited_bullets = total_work_bullets > 0

            if has_audited_bullets and quant_density < 30:
                improvements.append("Add quantified metrics (e.g. % performance increase, latency reduction, user count, dataset size) to project & work bullets.")

            # Only recommend strong action verbs when verb-led bullets are NOT the
            # majority of the analyzed set. If most genuine bullets already begin
            # with a strong/valid action verb, do not emit the generic advice, and
            # never emit it just to manufacture a suggestion.
            if has_audited_bullets and action_ratio <= 50:
                improvements.append("Start each project and experience bullet point with strong active verbs (e.g. Architected, Engineered, Developed).")

            if has_audited_bullets and filler_ratio > 0:
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
            "explicitlyDetectedSkills": extracted_skills,
            "inferredSkills": inferred_skills,
            "quantification": {
                "densityPercentage": bullet_audit_data["densityPercentage"],
                "actionVerbRatio": bullet_audit_data["actionVerbRatio"],
                "impactRatio": bullet_audit_data["impactRatio"],
                "specificityRatio": bullet_audit_data["specificityRatio"],
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
