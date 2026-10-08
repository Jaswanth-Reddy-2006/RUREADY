"""
Competitive Score matcher — resume <-> job-description semantic matching.

MODEL SEPARATION (do not merge these):
  MODEL 1  Docling                      -> document extraction (parser/document_parser.py)
  MODEL 2  Deterministic ATS Engine     -> role-independent ATS Score (ats/bge_ats_scorer.py)
  MODEL 3  This matcher (BGE-based)     -> Competitive Score / resume-JD matching ONLY

Model resolution (never trains, never downloads at API startup beyond the
one-time base-model HF cache download):
  1. If ml/models/competitive-bge/ contains a fine-tuned model with a
     production calibration.json (smoke_test == false), load it.
  2. Otherwise fall back to the base BAAI/bge-large-en-v1.5 from the HF cache.

CLI contract (same subprocess style as ats/bge_ats_scorer.py):
    python competitive_matcher.py <payload_json_path_or_string>
    payload: { "resumeText": str, "jobDescription": str, "role"?: str,
               "structuredElements"?: list }
    stdout:  { "success": true, "data": { ... } }

Competitive Score (transparent, documented weights — no LLM, no sentiment):
    score = 100 * ( 0.45 * semanticSimilarity   (calibrated cosine)
                  + 0.25 * skillOverlap          (explicit skill intersection / JD skills)
                  + 0.15 * experienceRelevance   (best resume chunks vs JD)
                  + 0.15 * terminologyMatch )    (JD term coverage in resume)

Role-match gate (multi-signal, NOT embedding-only):
    RELEVANT iff semanticSimilarity >= 0.30
             AND (skillOverlap >= 0.20 OR terminologyMatch >= 0.45
                  OR experienceRelevance >= 0.55)
    Otherwise status = NOT_RELEVANT and score = null (N/A, never 0).
"""

import json
import os
import re
import sys
import warnings
from pathlib import Path
from typing import Any, Dict, List, Optional, Set, Tuple

warnings.filterwarnings("ignore")

ML_DIR = Path(__file__).resolve().parents[1]
SERVICE_DIR = ML_DIR.parent
FINETUNED_MODEL_DIR = ML_DIR / "models" / "competitive-bge"
BASE_MODEL_NAME = "BAAI/bge-large-en-v1.5"

# Reuse the deterministic skill lexicon AND the hardened, context-aware
# detector from the six-pillar ATS engine so both layers agree on normalized
# skill names and never count ordinary English words ("go beyond", "react
# quickly") as skills. Only explicitly detected skills are used here.
sys.path.insert(0, str(SERVICE_DIR / "ats"))
from bge_ats_scorer import SKILL_NORMALIZATION_MAP, detect_skills_in_text  # noqa: E402

COMPETITIVE_WEIGHTS = {
    "semanticSimilarity": 0.45,
    "skillOverlap": 0.25,
    "experienceRelevance": 0.15,
    "terminologyMatch": 0.15,
}

GATE = {
    "minSemanticSimilarity": 0.30,
    "minSkillOverlap": 0.20,
    "minTerminologyMatch": 0.45,
    "minExperienceRelevance": 0.55,
}

# Fallback cosine -> [0,1] mapping for the *base* (non-fine-tuned) BGE model.
# Base BGE cosines on unrelated English texts rarely drop below ~0.3 and
# strong resume/JD matches saturate around ~0.75; these constants define a
# documented linear ramp between them. Overridden by calibration.json when a
# fine-tuned model is present.
BASE_COS_LOW = 0.30
BASE_COS_HIGH = 0.75

STOPWORDS = {
    "the", "and", "for", "with", "you", "your", "our", "are", "will", "have",
    "has", "that", "this", "from", "they", "their", "them", "who", "what",
    "when", "where", "which", "while", "about", "into", "over", "after",
    "before", "between", "under", "above", "should", "would", "could", "can",
    "may", "must", "shall", "able", "ability", "strong", "good", "great",
    "excellent", "work", "working", "role", "team", "teams", "job", "jobs",
    "candidate", "candidates", "position", "positions", "responsibilities",
    "requirements", "qualifications", "experience", "years", "year", "plus",
    "preferred", "preferredly", "including", "include", "includes", "etc",
    "such", "some", "all", "any", "other", "more", "most", "than", "then",
    "also", "well", "very", "high", "highly", "new", "one", "two", "three",
    "per", "via", "use", "using", "used", "help", "ensure", "within",
    "across", "through", "both", "each", "only", "same", "different",
    "related", "relevant", "proven", "self", "motivated", "apply", "join",
    "looking", "seeking", "want", "need", "needs", "required", "require",
    "requires", "minimum", "least", "benefits", "salary", "location",
    "remote", "hybrid", "onsite", "full", "time", "part", "company",
    "companies", "business", "office", "day", "days", "week", "weeks",
    "month", "months", "today", "now", "currently", "please", "sure",
    "make", "makes", "making", "take", "takes", "taking", "come", "comes",
    "keep", "keeps", "keeping", "let", "lets", "get", "gets", "getting",
    "way", "ways", "many", "much", "level", "levels", "best", "better",
    "close", "closed", "closing", "open", "opened", "opening", "openings",
}

_MODEL_CACHE: Dict[str, Any] = {}


def _cosine(a, b) -> float:
    return float((a * b).sum())


def select_model_source() -> Tuple[Optional[str], Optional[dict], str]:
    """
    Decide which model to load WITHOUT loading weights (pure, testable).
    Returns (model_path_or_None_for_base, calibration, source).
    A fine-tuned model is only accepted when calibration.json says
    fine_tuned == true AND smoke_test == false.
    """
    calib_path = FINETUNED_MODEL_DIR / "calibration.json"
    if calib_path.exists() and (FINETUNED_MODEL_DIR / "config.json").exists():
        try:
            with open(calib_path, "r", encoding="utf-8") as f:
                candidate = json.load(f)
            if candidate.get("fine_tuned") and not candidate.get("smoke_test"):
                return str(FINETUNED_MODEL_DIR), candidate, "fine-tuned"
        except (json.JSONDecodeError, OSError):
            pass
    return None, None, "base-bge"


def resolve_model() -> Tuple[Any, Optional[dict], str]:
    """Load the fine-tuned model if a production one exists, else base BGE."""
    if "model" in _MODEL_CACHE:
        return _MODEL_CACHE["model"], _MODEL_CACHE["calibration"], _MODEL_CACHE["source"]

    from sentence_transformers import SentenceTransformer

    model_path, calibration, source = select_model_source()
    model = SentenceTransformer(model_path or BASE_MODEL_NAME)
    _MODEL_CACHE.update({"model": model, "calibration": calibration, "source": source})
    return model, calibration, source


def normalize_cosine(cos: float, calibration: Optional[dict]) -> float:
    """Map a raw cosine similarity onto [0, 1] transparently."""
    if calibration and calibration.get("cosine_to_score"):
        c = calibration["cosine_to_score"]
        score = cos * c["slope"] + c["intercept"]
        return max(0.0, min(1.0, score / 100.0))
    span = BASE_COS_HIGH - BASE_COS_LOW
    return max(0.0, min(1.0, (cos - BASE_COS_LOW) / span))


# ----------------------------------------------------------------------
# Deterministic signals (no model, no inference of absent skills)
# ----------------------------------------------------------------------

def detect_skills(text: str) -> Set[str]:
    """
    Explicit skills only (Phase-4/5 rule: no inference, no English collisions).
    Delegates to the shared, context-aware detector in the ATS engine so the
    matcher and the six-pillar scorer agree exactly. Weakly-evidenced ambiguous
    tokens (e.g. "go" in "go beyond", "react" in "react quickly") are dropped.
    """
    explicit, _inferred = detect_skills_in_text(text, force_list=False)
    return explicit


def skill_overlap(resume_text: str, jd_text: str) -> Tuple[float, List[str], List[str], List[str]]:
    resume_skills = detect_skills(resume_text)
    jd_skills = detect_skills(jd_text)
    if not jd_skills:
        return 0.0, sorted(resume_skills), [], []
    matched = sorted(resume_skills & jd_skills)
    missing = sorted(jd_skills - resume_skills)
    return len(matched) / len(jd_skills), matched, missing, sorted(resume_skills)


def salient_terms(text: str) -> Set[str]:
    tokens = re.findall(r"[a-z][a-z0-9+#.]{3,}", text.lower())
    terms = {t for t in tokens if t not in STOPWORDS}
    return terms


def terminology_match(resume_text: str, jd_text: str) -> float:
    """Fraction of salient JD terms (unigrams+bigrams) covered by the resume."""
    jd_tokens = [t for t in re.findall(r"[a-z][a-z0-9+#]{3,}", jd_text.lower())
                 if t not in STOPWORDS]
    resume_lower = resume_text.lower()
    resume_tokens = set(re.findall(r"[a-z][a-z0-9+#]{3,}", resume_lower))

    unigrams = {t for t in jd_tokens}
    bigrams = {f"{a} {b}" for a, b in zip(jd_tokens, jd_tokens[1:])}
    terms = unigrams | bigrams
    if not terms:
        return 0.0
    hits = 0
    for term in terms:
        if " " in term:
            if term in resume_lower:
                hits += 1
        elif term in resume_tokens:
            hits += 1
    return hits / len(terms)


def resume_chunks(resume_text: str, structured_elements: Optional[list],
                  max_chunks: int = 12, chunk_chars: int = 600) -> List[str]:
    """Prefer Docling structure; fall back to fixed-size windows."""
    chunks: List[str] = []
    if structured_elements:
        for el in structured_elements:
            if not isinstance(el, dict):
                continue
            text = (el.get("text") or "").strip()
            if len(text) >= 80:
                chunks.append(text[:chunk_chars])
    if not chunks:
        blocks = [b.strip() for b in re.split(r"\n\s*\n|\n(?=[A-Z][A-Za-z ]{3,}\n)", resume_text)
                  if b.strip()]
        for b in blocks:
            for i in range(0, len(b), chunk_chars):
                chunks.append(b[i:i + chunk_chars])
    return chunks[:max_chunks]


def experience_relevance(model, jd_text: str, resume_text: str,
                         structured_elements: Optional[list],
                         calibration: Optional[dict]) -> Tuple[float, float]:
    """Mean of top-3 chunk similarities vs the JD, normalized to [0,1]."""
    chunks = resume_chunks(resume_text, structured_elements)
    if not chunks:
        return 0.0, 0.0
    embeddings = model.encode([jd_text] + chunks, normalize_embeddings=True,
                              show_progress_bar=False)
    jd_emb = embeddings[0]
    cosines = sorted((_cosine(jd_emb, e) for e in embeddings[1:]), reverse=True)
    top = cosines[:3]
    raw = sum(top) / len(top)
    return normalize_cosine(raw, calibration), raw


# ----------------------------------------------------------------------
# Scoring
# ----------------------------------------------------------------------

def compute_match(resume_text: str, job_description: str, role: Optional[str],
                  structured_elements: Optional[list]) -> Dict[str, Any]:
    model, calibration, source = resolve_model()

    resume_input = resume_text.strip()[:12000]
    jd_input = job_description.strip()[:8000]

    res_emb, jd_emb = model.encode([resume_input, jd_input], normalize_embeddings=True,
                                   show_progress_bar=False)
    raw_cos = _cosine(res_emb, jd_emb)
    semantic = normalize_cosine(raw_cos, calibration)

    overlap, matched_skills, missing_skills, resume_skills = skill_overlap(resume_text, job_description)
    terminology = terminology_match(resume_text, job_description)
    exp_rel, _exp_raw = experience_relevance(model, jd_input, resume_text,
                                             structured_elements, calibration)

    gate_passed = semantic >= GATE["minSemanticSimilarity"] and (
        overlap >= GATE["minSkillOverlap"]
        or terminology >= GATE["minTerminologyMatch"]
        or exp_rel >= GATE["minExperienceRelevance"]
    )

    role_label = role or "Selected Role"

    if not gate_passed:
        return {
            "status": "NOT_RELEVANT",
            "score": None,
            "role": role_label,
            "reason": "Resume domain does not sufficiently match the selected role "
                      "(multi-signal role-match gate not passed).",
            "model": BASE_MODEL_NAME,
            "modelSource": source,
            "weights": COMPETITIVE_WEIGHTS,
            "gate": GATE,
            "matchSignals": {
                "semanticSimilarity": round(semantic, 4),
                "skillOverlap": round(overlap, 4),
                "experienceRelevance": round(exp_rel, 4),
                "terminologyMatch": round(terminology, 4),
            },
            "signalsDetail": {
                "rawCosine": round(raw_cos, 4),
                "matchedSkills": matched_skills,
                "missingSkills": missing_skills,
                "resumeSkills": resume_skills,
            },
        }

    weighted = (
        COMPETITIVE_WEIGHTS["semanticSimilarity"] * semantic
        + COMPETITIVE_WEIGHTS["skillOverlap"] * overlap
        + COMPETITIVE_WEIGHTS["experienceRelevance"] * exp_rel
        + COMPETITIVE_WEIGHTS["terminologyMatch"] * terminology
    )
    score = max(0, min(100, round(weighted * 100)))

    return {
        "status": "MATCHED",
        "score": score,
        "role": role_label,
        "model": BASE_MODEL_NAME,
        "modelSource": source,
        "weights": COMPETITIVE_WEIGHTS,
        "gate": GATE,
        "matchSignals": {
            "semanticSimilarity": round(semantic, 4),
            "skillOverlap": round(overlap, 4),
            "experienceRelevance": round(exp_rel, 4),
            "terminologyMatch": round(terminology, 4),
        },
        "signalsDetail": {
            "rawCosine": round(raw_cos, 4),
            "matchedSkills": matched_skills,
            "missingSkills": missing_skills,
            "resumeSkills": resume_skills,
        },
    }


def main() -> None:
    if len(sys.argv) < 2:
        print(json.dumps({
            "success": False,
            "error": "Usage: python competitive_matcher.py <payload_json_path_or_string | --server>",
        }))
        sys.exit(1)

    payload_input = sys.argv[1]

    if payload_input == "--server":
        if hasattr(sys.stdin, "reconfigure"):
            sys.stdin.reconfigure(encoding="utf-8", line_buffering=True)
        if hasattr(sys.stdout, "reconfigure"):
            sys.stdout.reconfigure(encoding="utf-8", line_buffering=True)

        # Persistent daemon worker mode: pre-load model, then process JSON lines on stdin
        try:
            resolve_model()
            sys.stdout.write(json.dumps({"ready": True, "model": BASE_MODEL_NAME}) + "\n")
            sys.stdout.flush()
        except Exception as init_err:  # noqa: BLE001
            sys.stdout.write(json.dumps({"ready": False, "error": str(init_err)}) + "\n")
            sys.stdout.flush()
            sys.exit(1)

        while True:
            line = sys.stdin.readline()
            if not line:
                break
            raw_line = line.strip()
            if not raw_line:
                continue
            if raw_line == "PING":
                sys.stdout.write(json.dumps({"pong": True}) + "\n")
                sys.stdout.flush()
                continue
            try:
                payload = json.loads(raw_line)
                resume_text = (payload.get("resumeText") or "").strip()
                job_description = (payload.get("jobDescription") or "").strip()
                if not resume_text:
                    sys.stdout.write(json.dumps({"success": False, "error": "resumeText is required"}) + "\n")
                elif not job_description:
                    sys.stdout.write(json.dumps({"success": False, "error": "jobDescription is required for competitive matching"}) + "\n")
                else:
                    result = compute_match(
                        resume_text=resume_text,
                        job_description=job_description,
                        role=payload.get("role"),
                        structured_elements=payload.get("structuredElements"),
                    )
                    sys.stdout.write(json.dumps({"success": True, "data": result}) + "\n")
            except Exception as e:  # noqa: BLE001
                sys.stdout.write(json.dumps({"success": False, "error": str(e)}) + "\n")
            sys.stdout.flush()
        sys.exit(0)

    try:
        if os.path.exists(payload_input):
            with open(payload_input, "r", encoding="utf-8") as f:
                payload = json.load(f)
        else:
            payload = json.loads(payload_input)

        resume_text = (payload.get("resumeText") or "").strip()
        job_description = (payload.get("jobDescription") or "").strip()
        if not resume_text:
            raise ValueError("resumeText is required")
        if not job_description:
            raise ValueError("jobDescription is required for competitive matching")

        result = compute_match(
            resume_text=resume_text,
            job_description=job_description,
            role=payload.get("role"),
            structured_elements=payload.get("structuredElements"),
        )
        print(json.dumps({"success": True, "data": result}))
        sys.exit(0)
    except Exception as e:  # noqa: BLE001
        print(json.dumps({"success": False, "error": str(e)}))
        sys.exit(1)


if __name__ == "__main__":
    main()

