"""
Unit tests for ml/inference/competitive_matcher.py.

These tests are model-free: a deterministic fake encoder replaces BGE so the
gate logic, calibration, skill detection (explicit-only), terminology overlap
and score math can be verified without downloading anything.

Run:  python tests/test_competitive_matcher.py
"""

import sys
import unittest
from pathlib import Path

import numpy as np

SERVICE_DIR = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(SERVICE_DIR / "ml" / "inference"))

import competitive_matcher as cm  # noqa: E402

SOFTWARE_JD = (
    "Senior Software Engineer. Requirements: Python, TypeScript, React, Node.js, "
    "Docker, Kubernetes, REST API design, PostgreSQL. Build distributed backend "
    "services and CI/CD pipelines."
)
SOFTWARE_RESUME = (
    "Software Engineer with 6 years of experience.\n\n"
    "SKILLS\nPython, TypeScript, React, Node.js, Docker, Kubernetes, PostgreSQL, REST API\n\n"
    "EXPERIENCE\n"
    "Software Engineer — Acme Corp — Jun 2020 - Present\n"
    "• Architected distributed backend services in Python and Node.js serving 2M requests/day.\n"
    "• Built CI/CD pipelines with Docker and Kubernetes, reducing deployment time by 40%.\n"
    "• Migrated legacy PostgreSQL schema, improving query latency by 35%.\n"
)
MECHANICAL_RESUME = (
    "Mechanical Design Engineer with 8 years of experience.\n\n"
    "SKILLS\nSolidWorks, AutoCAD, ANSYS, Finite Element Analysis, GD&T, Thermodynamics\n\n"
    "EXPERIENCE\n"
    "Mechanical Engineer — Turbo Systems — Jan 2016 - Present\n"
    "• Designed turbine housings using SolidWorks and ANSYS simulation.\n"
    "• Improved heat exchanger efficiency by 12% through CFD-driven geometry optimization.\n"
)

SOFTWARE_TERMS = ["python", "typescript", "react", "node", "docker",
                  "kubernetes", "postgresql", "api", "ci/cd", "backend"]
MECHANICAL_TERMS = ["solidworks", "autocad", "ansys", "mechanical", "turbine",
                    "thermodynamics", "cfd", "geometry"]


class FakeModel:
    """Deterministic 3-dim encoder: [software-affinity, mechanical-affinity, bias]."""

    def encode(self, texts, normalize_embeddings=True, show_progress_bar=False, **kwargs):
        vecs = []
        for t in texts:
            low = t.lower()
            sw = sum(1 for term in SOFTWARE_TERMS if term in low)
            mech = sum(1 for term in MECHANICAL_TERMS if term in low)
            v = np.array([float(sw), float(mech), 0.2], dtype=np.float32)
            vecs.append(v / np.linalg.norm(v))
        return np.vstack(vecs)


def install_fake_model():
    cm._MODEL_CACHE.clear()
    cm._MODEL_CACHE.update({"model": FakeModel(), "calibration": None, "source": "base-bge"})


class TestSkillDetection(unittest.TestCase):
    def test_only_explicit_skills_detected(self):
        resume_skills = cm.detect_skills("Experienced with Python and Docker. Built REST API services.")
        self.assertIn("Python", resume_skills)
        self.assertIn("Docker", resume_skills)

    def test_no_skill_inference(self):
        # Phase-4 rule: React must NOT imply Next.js; AWS must NOT imply Kubernetes.
        skills = cm.detect_skills("Worked with React and AWS in production.")
        self.assertNotIn("Next.js", skills)
        self.assertNotIn("Kubernetes", skills)

    def test_normalization(self):
        skills = cm.detect_skills("Used React.js and reactjs in projects.")
        self.assertIn("React", skills)

    def test_skill_overlap_ratio(self):
        overlap, matched, missing, _ = cm.skill_overlap(SOFTWARE_RESUME, SOFTWARE_JD)
        self.assertGreater(overlap, 0.5)
        self.assertIn("Python", matched)

    def test_skill_overlap_disjoint(self):
        overlap, matched, _missing, _ = cm.skill_overlap(MECHANICAL_RESUME, SOFTWARE_JD)
        self.assertLess(overlap, 0.2)
        self.assertEqual(len(matched), 0)


class TestTerminology(unittest.TestCase):
    def test_high_coverage(self):
        score = cm.terminology_match(SOFTWARE_RESUME, SOFTWARE_JD)
        self.assertGreaterEqual(score, 0.3)

    def test_low_coverage(self):
        score = cm.terminology_match(MECHANICAL_RESUME, SOFTWARE_JD)
        self.assertLess(score, 0.2)


class TestCalibration(unittest.TestCase):
    def test_base_model_mapping(self):
        self.assertEqual(cm.normalize_cosine(cm.BASE_COS_LOW, None), 0.0)
        self.assertEqual(cm.normalize_cosine(cm.BASE_COS_HIGH, None), 1.0)
        self.assertEqual(cm.normalize_cosine(0.1, None), 0.0)   # clamped low
        self.assertEqual(cm.normalize_cosine(0.99, None), 1.0)  # clamped high
        self.assertAlmostEqual(cm.normalize_cosine(0.525, None), 0.5, places=3)

    def test_finetuned_calibration_mapping(self):
        calib = {"cosine_to_score": {"slope": 100.0, "intercept": 0.0}}
        self.assertAlmostEqual(cm.normalize_cosine(0.75, calib), 0.75, places=4)
        calib2 = {"cosine_to_score": {"slope": 50.0, "intercept": 30.0}}
        self.assertAlmostEqual(cm.normalize_cosine(0.8, calib2), 0.70, places=4)


class TestChunks(unittest.TestCase):
    def test_chunk_cap(self):
        text = "\n\n".join([f"Section {i}. " + ("word " * 200) for i in range(30)])
        chunks = cm.resume_chunks(text, None, max_chunks=12)
        self.assertLessEqual(len(chunks), 12)
        self.assertTrue(all(len(c) <= 600 for c in chunks))

    def test_structured_elements_preferred(self):
        elements = [{"type": "paragraph", "text": "x" * 200}]
        chunks = cm.resume_chunks("ignored", elements)
        self.assertEqual(len(chunks), 1)


class TestComputeMatch(unittest.TestCase):
    def setUp(self):
        install_fake_model()

    def test_matching_resume_is_matched(self):
        result = cm.compute_match(SOFTWARE_RESUME, SOFTWARE_JD, "Software Engineer", None)
        self.assertEqual(result["status"], "MATCHED")
        self.assertIsNotNone(result["score"])
        self.assertTrue(0 <= result["score"] <= 100)
        self.assertGreater(result["matchSignals"]["semanticSimilarity"], 0.5)
        self.assertGreater(result["matchSignals"]["skillOverlap"], 0.5)
        for v in result["matchSignals"].values():
            self.assertTrue(0.0 <= v <= 1.0)
        # Weighted score must equal documented weights applied to signals
        w, s = result["weights"], result["matchSignals"]
        expected = round(100 * (w["semanticSimilarity"] * s["semanticSimilarity"]
                                + w["skillOverlap"] * s["skillOverlap"]
                                + w["experienceRelevance"] * s["experienceRelevance"]
                                + w["terminologyMatch"] * s["terminologyMatch"]))
        self.assertEqual(result["score"], max(0, min(100, expected)))

    def test_cross_domain_resume_is_not_relevant(self):
        result = cm.compute_match(MECHANICAL_RESUME, SOFTWARE_JD, "Software Engineer", None)
        self.assertEqual(result["status"], "NOT_RELEVANT")
        self.assertIsNone(result["score"])
        self.assertIn("reason", result)
        self.assertLess(result["matchSignals"]["skillOverlap"], 0.2)

    def test_output_contract(self):
        result = cm.compute_match(SOFTWARE_RESUME, SOFTWARE_JD, None, None)
        for key in ("status", "score", "role", "model", "modelSource",
                    "weights", "gate", "matchSignals", "signalsDetail"):
            self.assertIn(key, result)
        for sig in ("semanticSimilarity", "skillOverlap",
                    "experienceRelevance", "terminologyMatch"):
            self.assertIn(sig, result["matchSignals"])

    def test_finetuned_calibration_used_when_present(self):
        cm._MODEL_CACHE["calibration"] = {
            "cosine_to_score": {"slope": 60.0, "intercept": 20.0},
        }
        result = cm.compute_match(SOFTWARE_RESUME, SOFTWARE_JD, "Software Engineer", None)
        raw = result["signalsDetail"]["rawCosine"]
        expected = max(0.0, min(1.0, (raw * 60.0 + 20.0) / 100.0))
        self.assertAlmostEqual(result["matchSignals"]["semanticSimilarity"],
                               round(expected, 4), places=3)


class TestModelResolutionGuard(unittest.TestCase):
    def test_smoke_test_model_rejected(self):
        """A calibration flagged smoke_test=true must never drive production."""
        import json
        import tempfile

        with tempfile.TemporaryDirectory() as tmp:
            model_dir = Path(tmp)
            (model_dir / "config.json").write_text("{}")
            (model_dir / "calibration.json").write_text(
                json.dumps({"fine_tuned": True, "smoke_test": True}))
            original = cm.FINETUNED_MODEL_DIR
            try:
                cm.FINETUNED_MODEL_DIR = model_dir
                path, calib, source = cm.select_model_source()
                self.assertIsNone(path)
                self.assertIsNone(calib)
                self.assertEqual(source, "base-bge")
            finally:
                cm.FINETUNED_MODEL_DIR = original

    def test_production_finetuned_model_accepted(self):
        import json
        import tempfile

        with tempfile.TemporaryDirectory() as tmp:
            model_dir = Path(tmp)
            (model_dir / "config.json").write_text("{}")
            (model_dir / "calibration.json").write_text(
                json.dumps({"fine_tuned": True, "smoke_test": False}))
            original = cm.FINETUNED_MODEL_DIR
            try:
                cm.FINETUNED_MODEL_DIR = model_dir
                path, calib, source = cm.select_model_source()
                self.assertEqual(path, str(model_dir))
                self.assertEqual(source, "fine-tuned")
                self.assertIsNotNone(calib)
            finally:
                cm.FINETUNED_MODEL_DIR = original

    def test_missing_model_dir_falls_back_to_base(self):
        original = cm.FINETUNED_MODEL_DIR
        try:
            cm.FINETUNED_MODEL_DIR = Path("Z:/definitely/does/not/exist")
            path, calib, source = cm.select_model_source()
            self.assertIsNone(path)
            self.assertEqual(source, "base-bge")
        finally:
            cm.FINETUNED_MODEL_DIR = original


if __name__ == "__main__":
    unittest.main(verbosity=2)
