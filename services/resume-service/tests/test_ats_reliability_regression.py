"""
Reliability regression suite for the six-pillar ATS engine and the shared,
context-aware skill detector.

Covers the Phase-1 audit cases and the reviewer's explicit regression list:
  - "Senior Software Engineer II"            -> JOB_TITLE (not EXPERIENCE_BULLET)
  - "Juniper Networks"                        -> COMPANY_NAME (not EXPERIENCE_BULLET)
  - "AWS Certified Solutions Architect - Associate" -> CERTIFICATION
  - "Application Infrastructure & Packaging: Architected ..." -> EXPERIENCE_BULLET,
    and NOT flagged as a weak action verb (label precedes the verb)
  - "CI/CD & Release Automation: Built ..."   -> EXPERIENCE_BULLET, not weak-verb flagged
  - "mentored 6 junior engineers"             -> recognized as a quantitative outcome
  - ordinary English with go/react/spring/express/rust/dart -> NO explicit skills
  - legitimate technologies in a skills list  -> explicit skills preserved
  - project titles / descriptions             -> classification preserved
  - patents / publications                    -> excluded from experience analysis

Run from the service root:  PYTHONPATH=. python tests/test_ats_reliability_regression.py
"""

import sys
import unittest
from pathlib import Path

SERVICE_DIR = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(SERVICE_DIR))

from ats.bge_ats_scorer import (  # noqa: E402
    RoleIndependentAtsScorer,
    detect_skills_in_text,
)


class TestContentClassification(unittest.TestCase):
    def setUp(self):
        self.s = RoleIndependentAtsScorer()

    def test_job_title(self):
        self.assertEqual(
            self.s.classify_line_content_type("Senior Software Engineer II", "EXPERIENCE"),
            "JOB_TITLE",
        )

    def test_company_name(self):
        self.assertEqual(
            self.s.classify_line_content_type("Juniper Networks", "EXPERIENCE"),
            "COMPANY_NAME",
        )

    def test_certification(self):
        self.assertEqual(
            self.s.classify_line_content_type("AWS Certified Solutions Architect - Associate", "CERTIFICATIONS"),
            "CERTIFICATION",
        )

    def test_date_only_line(self):
        self.assertEqual(self.s.classify_line_content_type("2022 - 2024", "EXPERIENCE"), "DATE")
        self.assertEqual(self.s.classify_line_content_type("Jun 2020 – Present", "EXPERIENCE"), "DATE")

    def test_patent_and_publication(self):
        self.assertEqual(
            self.s.classify_line_content_type("US Patent 10,123,456 - Distributed cache eviction", "EXPERIENCE"),
            "PATENT",
        )
        self.assertEqual(
            self.s.classify_line_content_type("Smith J., Doe A., et al. Journal of ML Research, 2021", "EXPERIENCE"),
            "PUBLICATION",
        )

    def test_label_verb_bullets_are_experience_bullets(self):
        self.assertEqual(
            self.s.classify_line_content_type(
                "Application Infrastructure & Packaging: Architected resilient deployment pipelines serving 2M users.",
                "EXPERIENCE",
            ),
            "EXPERIENCE_BULLET",
        )
        self.assertEqual(
            self.s.classify_line_content_type(
                "CI/CD & Release Automation: Built GitHub Actions pipelines reducing deploy time by 40%.",
                "EXPERIENCE",
            ),
            "EXPERIENCE_BULLET",
        )

    def test_project_classification_preserved(self):
        # Short standalone name -> PROJECT_TITLE
        self.assertEqual(
            self.s.classify_line_content_type("ScaleETL", "PROJECTS"),
            "PROJECT_TITLE",
        )
        # Name - descriptive phrase (no leading strong verb) -> PROJECT_DESCRIPTION
        self.assertEqual(
            self.s.classify_line_content_type(
                "Full Stack Starter Kit - A reusable Next.js + Tailwind boilerplate for teams.",
                "PROJECTS",
            ),
            "PROJECT_DESCRIPTION",
        )
        # Bullet with a strong verb -> ACHIEVEMENT_BULLET
        self.assertEqual(
            self.s.classify_line_content_type(
                "• Engineered a caching layer that reduced API latency by 45%.",
                "PROJECTS",
            ),
            "ACHIEVEMENT_BULLET",
        )

    def test_all_types_are_known(self):
        from ats.bge_ats_scorer import CONTENT_TYPES
        for line, sec in [
            ("Senior Software Engineer II", "EXPERIENCE"),
            ("Juniper Networks", "EXPERIENCE"),
            ("2022 - 2024", "EXPERIENCE"),
            ("ScaleETL", "PROJECTS"),
        ]:
            self.assertIn(self.s.classify_line_content_type(line, sec), CONTENT_TYPES)


class TestExperienceAuditor(unittest.TestCase):
    def setUp(self):
        self.s = RoleIndependentAtsScorer()

    def _audit(self, experience_lines):
        return self.s.audit_experience_and_project_bullets(
            {"EXPERIENCE": experience_lines, "PROJECTS": []}
        )

    def test_label_verb_bullet_not_flagged_weak(self):
        data = self._audit([
            "Application Infrastructure & Packaging: Architected resilient deployment pipelines serving 2M users.",
            "CI/CD & Release Automation: Built GitHub Actions pipelines reducing deploy time by 40%.",
        ])
        weak = [a for a in data["audits"] if a["category"] == "Weak Action Verb"]
        self.assertEqual(weak, [], f"Label:verb bullets were wrongly flagged weak: {weak}")
        # Both contain strong verbs -> action verb ratio should be high.
        self.assertGreaterEqual(data["actionVerbRatio"], 99.0)

    def test_single_digit_metric_recognized(self):
        data = self._audit(["Mentored 6 junior engineers across two platform squads."])
        self.assertEqual(data["quantifiedCount"], 1)
        self.assertGreater(data["densityPercentage"], 0)

    def test_two_digit_and_percent_metrics_still_recognized(self):
        data = self._audit([
            "Reduced p99 latency by 38% while serving 150000 daily requests.",
        ])
        self.assertEqual(data["quantifiedCount"], 1)

    def test_job_title_company_not_audited(self):
        data = self._audit([
            "Senior Software Engineer II",
            "Juniper Networks",
            "2021 - 2024",
            "Led a team of 5 engineers to deliver the routing platform on schedule.",
        ])
        # Only the real bullet is audited.
        self.assertEqual(data["totalBullets"], 1)

    def test_patents_publications_excluded(self):
        data = self._audit([
            "US Patent 10,123,456 - Distributed cache eviction",
            "Smith J., Doe A., et al. Journal of ML Research, 2021",
            "Built a distributed cache handling 50000 requests per second.",
        ])
        self.assertEqual(data["totalBullets"], 1)


class TestSkillDetection(unittest.TestCase):
    def test_english_collisions_not_explicit(self):
        prose = (
            "He would go beyond the call of duty, express interest in spring cleaning, "
            "must react quickly, throw dart boards, drive go-to-market strategy, and rust removal."
        )
        explicit, _inferred = detect_skills_in_text(prose)
        for bad in ["Go", "Express.js", "Spring Boot", "React", "Rust"]:
            self.assertNotIn(bad, explicit, f"False positive skill: {bad}")

    def test_go_to_market_hyphen_not_go(self):
        explicit, _ = detect_skills_in_text("Led go-to-market strategy for the product launch.")
        self.assertNotIn("Go", explicit)

    def test_legitimate_skills_list_explicit(self):
        listing = "Python, Go, Rust, React, Node.js, Express.js, Spring Boot, Docker, AWS, C++"
        explicit, _ = detect_skills_in_text(listing)
        for good in ["Python", "Go", "Rust", "React", "Node.js", "Express.js", "Spring Boot", "Docker", "AWS", "C++"]:
            self.assertIn(good, explicit, f"Legitimate skill dropped: {good}")

    def test_technical_context_explicit(self):
        cases = {
            "Built backend services in Go with golang tooling.": "Go",
            "Wrote Rust parsers, managed with cargo.": "Rust",
            "Developed React components using JSX and Redux.": "React",
            "Designed Spring Boot microservices.": "Spring Boot",
        }
        for text, expected in cases.items():
            explicit, _ = detect_skills_in_text(text)
            self.assertIn(expected, explicit, f"Context skill missed: {expected} in '{text}'")

    def test_score_resume_exposes_explicit_and_inferred(self):
        s = RoleIndependentAtsScorer()
        resume = (
            "JANE DOE\njane@example.com | +1 555 0100 | linkedin.com/in/jane\n\n"
            "SKILLS\nPython, Docker, Kubernetes, PostgreSQL, React\n\n"
            "EXPERIENCE\nSenior Software Engineer II\nAcme Technologies\n2021 - 2024\n"
            "• Architected services in Python serving 2M requests daily.\n"
            "• Had to react quickly to incidents and go beyond expectations.\n"
        )
        result = s.score_resume(resume)
        self.assertIn("explicitlyDetectedSkills", result)
        self.assertIn("inferredSkills", result)
        self.assertIn("Python", result["explicitlyDetectedSkills"])
        self.assertIn("Docker", result["explicitlyDetectedSkills"])
        # extractedSkills must equal the explicit set (only explicit is scored).
        self.assertEqual(result["extractedSkills"], result["explicitlyDetectedSkills"])


class TestJobTitleHeaderClassification(unittest.TestCase):
    """
    Regression for the bug where job-title/header elements carrying trailing
    metadata — "Title (Company, Work Mode)", "Title (Company, Date)",
    "Title | Company | Mode", "Title, Company, Dates", "Title at Company" —
    were misclassified as EXPERIENCE_BULLET and sent to the weak-action-verb
    analyzer. All assertions use generic patterns across DIFFERENT titles,
    companies and layouts; no specific resume/person/company is hard-coded in
    the production classifier.
    """

    def setUp(self):
        self.s = RoleIndependentAtsScorer()

    def _classify(self, line, section="EXPERIENCE", element_type=None):
        return self.s.classify_line_content_type(line, section, element_type)

    def test_title_company_workmode_parenthetical(self):
        for line in [
            "Senior Software Engineer II (Juniper Networks, Remote)",
            "Software Engineer (Acme Corp, Work From Home)",
            "Product Designer (Globex, On-Site)",
            "Data Analyst (Initech, Hybrid)",
            "Senior Software Engineer II (Juniper Networks, Work From Home)",
            "Principal Architect (Nvidia, Hybrid)",
        ]:
            self.assertEqual(self._classify(line), "JOB_TITLE", f"misclassified: {line!r}")

    def test_title_company_date_parenthetical(self):
        for line in [
            "Staff Backend Engineer (Stripe, Jan 2020 - Present)",
            "Machine Learning Engineer (OpenAI, 2021 - 2024)",
            "DevOps Engineer (Cloudflare, Mar 2019 - Aug 2022)",
        ]:
            self.assertEqual(self._classify(line), "JOB_TITLE", f"misclassified: {line!r}")

    def test_title_company_various_separators(self):
        for line in [
            "DevOps Engineer | Cloudflare | Remote",
            "Machine Learning Engineer, Databricks, 2021 - 2024",
            "Frontend Developer at Shopify",
            "QA Engineer - Microsoft - On-Site",
        ]:
            self.assertEqual(self._classify(line), "JOB_TITLE", f"misclassified: {line!r}")

    def test_bare_title_still_job_title(self):
        self.assertEqual(self._classify("Senior Software Engineer II"), "JOB_TITLE")

    def test_company_only_header(self):
        for line in ["Juniper Networks", "Acme Corporation", "Globex Systems"]:
            self.assertEqual(self._classify(line), "COMPANY_NAME", f"misclassified: {line!r}")

    def test_date_only_metadata(self):
        for line in ["Jan 2020 - Present", "2021 - 2024", "Mar 2019 – Aug 2022"]:
            self.assertEqual(self._classify(line), "DATE", f"misclassified: {line!r}")

    def test_workmode_only_metadata_is_not_bullet(self):
        # Standalone work-mode/location metadata must never be an experience bullet.
        self.assertNotEqual(self._classify("Remote"), "EXPERIENCE_BULLET")
        self.assertNotEqual(self._classify("Work From Home"), "EXPERIENCE_BULLET")

    def test_genuine_verb_bullets_are_experience_bullets(self):
        for line in [
            "Developed REST APIs serving 1M requests daily",
            "Built CI/CD pipelines reducing deploy time by 40%",
            "Designed and shipped a React component library",
            "Implemented OAuth2 authentication for 50k users",
            "Integrated Stripe payments into the checkout flow",
            "Collaborated with design to ship the onboarding revamp",
        ]:
            self.assertEqual(self._classify(line), "EXPERIENCE_BULLET", f"misclassified: {line!r}")

    def test_docling_paragraph_title_not_bullet(self):
        # With the Docling hierarchy, a paragraph-labelled title header is never
        # promoted to a bullet just for being long.
        self.assertEqual(
            self._classify("Senior Software Engineer II (Juniper Networks, Work From Home)",
                           element_type="paragraph"),
            "JOB_TITLE",
        )

    def test_docling_list_item_bullet_preserved(self):
        self.assertEqual(
            self._classify("Built CI/CD pipelines reducing deploy time by 40%",
                           element_type="list_item"),
            "EXPERIENCE_BULLET",
        )


class TestHeaderNeverEntersVerbAnalyzer(unittest.TestCase):
    """
    Requirement: JOB_TITLE, COMPANY_NAME, DATE, EDUCATION, CERTIFICATION,
    PATENT, PUBLICATION, PROJECT_TITLE, TECHNOLOGY_LINE and OTHER must NEVER
    reach the weak-action-verb analyzer. Only EXPERIENCE_BULLET,
    ACHIEVEMENT_BULLET and PROJECT_DESCRIPTION are audited.
    """

    def setUp(self):
        self.s = RoleIndependentAtsScorer()

    def test_title_headers_not_audited(self):
        data = self.s.audit_experience_and_project_bullets({
            "EXPERIENCE": [
                "Senior Software Engineer II (Juniper Networks, Work From Home)",
                "Software Engineer (Acme Corp, Remote)",
                "Jan 2020 - Present",
                "Developed REST APIs serving 1M requests daily",
                "Built CI/CD pipelines reducing deploy time by 40%",
            ],
            "PROJECTS": [],
        })
        # Only the two genuine bullets are audited; headers are excluded.
        self.assertEqual(data["totalBullets"], 2)
        weak = [a for a in data["audits"] if a["category"] == "Weak Action Verb"]
        self.assertEqual(weak, [], f"a header was flagged weak-verb: {weak}")

    def test_docling_structured_path_excludes_title_paragraph(self):
        structured_elements = [
            {"type": "section_header", "text": "EXPERIENCE", "label": "SectionHeader"},
            {"type": "paragraph", "text": "Senior Software Engineer II (Juniper Networks, Work From Home)", "label": "Text"},
            {"type": "paragraph", "text": "Jan 2020 - Present", "label": "Text"},
            {"type": "list_item", "text": "Developed REST APIs serving 1M requests daily", "label": "ListItem"},
            {"type": "list_item", "text": "Built CI/CD pipelines reducing deploy time by 40%", "label": "ListItem"},
        ]
        data = self.s.audit_experience_and_project_bullets(
            {"EXPERIENCE": [
                "Senior Software Engineer II (Juniper Networks, Work From Home)",
                "Jan 2020 - Present",
                "Developed REST APIs serving 1M requests daily",
                "Built CI/CD pipelines reducing deploy time by 40%",
            ], "PROJECTS": []},
            structured_elements,
        )
        self.assertEqual(data["totalBullets"], 2)
        weak = [a for a in data["audits"] if a["category"] == "Weak Action Verb"]
        self.assertEqual(weak, [], f"a header was flagged weak-verb: {weak}")

    def test_project_title_with_metrics_not_weak_verb_flagged(self):
        # A project title/description carrying metrics is classified as
        # PROJECT_TITLE / PROJECT_DESCRIPTION and never weak-verb flagged.
        self.assertIn(
            self.s.classify_line_content_type("ScaleETL - Processed 1 billion rows nightly", "PROJECTS"),
            ("PROJECT_TITLE", "PROJECT_DESCRIPTION"),
        )
        data = self.s.audit_experience_and_project_bullets({
            "EXPERIENCE": [],
            "PROJECTS": ["ScaleETL - Processed 1 billion rows nightly"],
        })
        weak = [a for a in data["audits"] if a["category"] == "Weak Action Verb"]
        self.assertEqual(weak, [], f"project title flagged weak-verb: {weak}")

    def test_patent_publication_excluded_from_verb_analysis(self):
        data = self.s.audit_experience_and_project_bullets({
            "EXPERIENCE": [
                "US Patent 10,123,456 - Distributed cache eviction",
                "Smith J., Doe A., et al. Journal of ML Research, 2021",
                "Built a distributed cache handling 50000 requests per second.",
            ],
            "PROJECTS": [],
        })
        self.assertEqual(data["totalBullets"], 1)


class TestActionVerbImprovementLogic(unittest.TestCase):
    """
    Regression for the bug where the generic improvement
    "Start each project and experience bullet point with strong active verbs..."
    was emitted even when the analyzed bullets already began with strong action
    verbs (or when there were no audited bullets at all). The recommendation must
    be driven by the classified bullet / action-verb analysis, never fabricated.
    All resume content below is generic placeholder text — no specific person,
    company, or project is hard-coded in the production classifier.
    """

    WEAK_VERB_REC = "Start each project and experience bullet point with strong active verbs"
    METRICS_REC = "Add quantified metrics"

    def setUp(self):
        self.s = RoleIndependentAtsScorer()

    @staticmethod
    def _resume(body: str) -> str:
        header = (
            "JANE DOE\njane@example.com | +1 555 0100 | "
            "linkedin.com/in/jane | github.com/jane\n\n"
            "SKILLS\nPython, Docker, React, PostgreSQL, AWS\n\n"
        )
        return header + body

    def _result(self, body: str):
        return self.s.score_resume(self._resume(body))

    def _has_weak_verb_rec(self, body: str) -> bool:
        return any(self.WEAK_VERB_REC in i for i in self._result(body)["improvements"])

    def test_projects_only_strong_verbs_no_weak_verb_rec(self):
        body = (
            "PROJECTS\n"
            "- Developed a REST API serving 50000 requests per day.\n"
            "- Implemented OAuth2 authentication reducing failed logins by 90%.\n"
            "- Built a React dashboard used by 12000 internal users.\n"
            "- Designed CI/CD pipelines cutting release time to 10 minutes.\n"
        )
        self.assertFalse(self._has_weak_verb_rec(body))

    def test_strong_project_bullets_few_metrics_only_metrics_rec(self):
        body = (
            "PROJECTS\n"
            "- Developed a REST API for the internal tools team.\n"
            "- Implemented OAuth2 authentication in the login flow.\n"
            "- Built a React dashboard for operations.\n"
        )
        imps = self._result(body)["improvements"]
        # Metrics advice may appear, but never the weak-action-verb advice.
        self.assertFalse(any(self.WEAK_VERB_REC in i for i in imps))
        self.assertTrue(any(self.METRICS_REC in i for i in imps))

    def test_genuinely_weak_bullets_trigger_weak_verb_rec(self):
        body = (
            "EXPERIENCE\n"
            "- The system handles incoming requests and logs them.\n"
            "- A caching layer for the API responses.\n"
            "- Team player with good communication and coding skills.\n"
        )
        self.assertTrue(self._has_weak_verb_rec(body))

    def test_no_experience_section_strong_projects_not_penalized(self):
        body = (
            "PROJECTS\n"
            "- Developed a REST API serving 50000 requests per day.\n"
            "- Built a React dashboard used by 12000 internal users.\n"
            "\nCERTIFICATIONS\nAWS Certified Solutions Architect - Associate\n"
        )
        result = self._result(body)
        # Strong project bullets alone earn solid experience-quality credit; the
        # absence of a traditional WORK EXPERIENCE section is not penalized.
        self.assertGreaterEqual(result["breakdown"]["experienceQuality"], 12)
        self.assertFalse(any(self.WEAK_VERB_REC in i for i in result["improvements"]))

    def test_project_titles_only_no_bullet_advice(self):
        # Only short project titles -> zero audited bullets -> no bullet advice.
        body = "PROJECTS\nScaleETL\nAuthGate\nDashUI\n"
        imps = self._result(body)["improvements"]
        self.assertFalse(any(self.WEAK_VERB_REC in i for i in imps))
        self.assertFalse(any(self.METRICS_REC in i for i in imps))

    def test_all_strong_verbs_recognized_case_insensitively(self):
        verbs = [
            "Developed", "Implemented", "Built", "Protected", "Applied", "Designed",
            "Automated", "Engineered", "Architected", "Optimized", "Integrated",
            "Configured", "Deployed", "Managed", "Migrated", "Consolidated",
            "Reduced", "Improved", "Created",
        ]
        for transform in (str.upper, str.lower):
            lines = [f"- {transform(v)} a scalable subsystem for the platform team." for v in verbs]
            data = self.s.audit_experience_and_project_bullets(
                {"EXPERIENCE": lines, "PROJECTS": []}
            )
            self.assertEqual(
                data["actionVerbRatio"], 100.0,
                f"a strong verb was not recognized (case={transform.__name__})",
            )
            weak = [a for a in data["audits"] if a["category"] == "Weak Action Verb"]
            self.assertEqual(weak, [], f"strong verb flagged weak: {weak}")

    def test_project_title_not_treated_as_job_title(self):
        ct = self.s.classify_line_content_type(
            "ScaleETL - Processed 1 billion rows nightly", "PROJECTS"
        )
        self.assertNotEqual(ct, "JOB_TITLE")
        self.assertIn(ct, ("PROJECT_TITLE", "PROJECT_DESCRIPTION"))

    def test_job_title_headers_excluded_from_bullet_analysis(self):
        body = (
            "EXPERIENCE\n"
            "Senior Software Engineer II (Juniper Networks, Work From Home)\n"
            "Jan 2021 - Present\n"
            "- Developed a REST API serving 50000 requests per day.\n"
            "- Built a React dashboard used by 12000 internal users.\n"
        )
        result = self._result(body)
        # Only the two genuine bullets are audited; the title/date headers are not.
        self.assertEqual(result["quantification"]["totalBullets"], 2)
        self.assertFalse(any(self.WEAK_VERB_REC in i for i in result["improvements"]))


class TestExperienceQualityBalance(unittest.TestCase):
    """
    Regression for the Experience Quality pillar collapse bug: verb-led,
    specific, impactful project/experience bullets were scored unusually low
    purely because they lacked quantified metrics. The pillar is now balanced
    across four dimensions (action-verb quality, specificity/clarity,
    achievement/impact, quantified metrics) so that missing metrics reduces —
    but never dominates — the score. All resume content below is generic
    placeholder text; no person, company, project, or sentence is hard-coded in
    the production scorer, and no metrics are invented by these tests.
    """

    def setUp(self):
        self.s = RoleIndependentAtsScorer()

    @staticmethod
    def _resume(body: str) -> str:
        header = (
            "JANE DOE\njane@example.com | +1 555 0100 | "
            "linkedin.com/in/jane | github.com/jane\n\n"
            "SKILLS\nPython, Docker, React, PostgreSQL, AWS\n\n"
        )
        return header + body

    def _result(self, body: str):
        return self.s.score_resume(self._resume(body))

    def test_project_heavy_strong_verbs_few_metrics_not_collapsed(self):
        body = (
            "PROJECTS\n"
            "- Developed a REST API service for the internal tools team using Python.\n"
            "- Implemented OAuth2 authentication flows in the login service.\n"
            "- Built a React dashboard for the operations team.\n"
            "- Designed CI/CD pipelines for the platform group.\n"
        )
        result = self._result(body)
        q = result["quantification"]
        self.assertEqual(q["densityPercentage"], 0.0)          # genuinely no metrics
        self.assertEqual(q["actionVerbRatio"], 100.0)          # all strong verbs
        # Missing metrics may reduce the pillar but must NOT collapse it.
        self.assertGreaterEqual(result["breakdown"]["experienceQuality"], 12)

    def test_experience_heavy_strong_verbs_with_metrics_scores_high(self):
        body = (
            "EXPERIENCE\nSoftware Engineer\nAcme Corp\n2020 - 2023\n"
            "- Reduced API latency by 45% serving 10000 users via PostgreSQL query tuning.\n"
            "- Deployed Docker containers cutting build times by 60% across 12 services.\n"
            "- Automated CI/CD pipelines improving release frequency by 3x.\n"
        )
        result = self._result(body)
        self.assertEqual(result["quantification"]["densityPercentage"], 100.0)
        self.assertGreaterEqual(result["breakdown"]["experienceQuality"], 14)

    def test_genuinely_weak_bullets_score_low(self):
        body = (
            "EXPERIENCE\nAssistant\nSome Co\n2019 - 2021\n"
            "- Responsible for various tasks as assigned by the manager.\n"
            "- Worked on different things related to team goals.\n"
            "- Helped with miscellaneous duties included in the role.\n"
        )
        result = self._result(body)
        q = result["quantification"]
        self.assertEqual(q["specificityRatio"], 0.0)
        self.assertEqual(q["impactRatio"], 0.0)
        # Weak, vague, filler bullets must still be scored low.
        self.assertLessEqual(result["breakdown"]["experienceQuality"], 8)

    def test_no_traditional_employment_strong_projects_not_penalized(self):
        body = (
            "PROJECTS\n"
            "- Developed a REST API service for the internal tools team using Python.\n"
            "- Implemented OAuth2 authentication flows in the login service.\n"
            "- Built a React dashboard for the operations team.\n"
        )
        result = self._result(body)
        # No WORK EXPERIENCE section at all, yet strong projects earn real credit.
        self.assertGreaterEqual(result["breakdown"]["experienceQuality"], 12)

    def test_headers_and_job_titles_excluded_from_bullet_quality(self):
        body = (
            "EXPERIENCE\n"
            "Senior Software Engineer II (Juniper Networks, Work From Home)\n"
            "Jan 2021 - Present\n"
            "- Developed a REST API serving 50000 requests per day.\n"
            "- Built a React dashboard used by 12000 internal users.\n"
        )
        result = self._result(body)
        # Only the two genuine bullets are audited; title/date headers excluded.
        self.assertEqual(result["quantification"]["totalBullets"], 2)
        self.assertGreaterEqual(result["breakdown"]["experienceQuality"], 12)

    def test_missing_metrics_cannot_dominate_pillar(self):
        # Two resumes identical in verb quality / specificity / impact; only the
        # presence of metrics differs. The metric-less one must still clear the
        # 12/15 bar, proving metrics are one of four balanced dimensions.
        base = (
            "PROJECTS\n"
            "- Developed a REST API service for the internal tools team using Python.\n"
            "- Implemented OAuth2 authentication flows in the login service.\n"
            "- Built a React dashboard for the operations team.\n"
        )
        no_metric = self._result(base)["breakdown"]["experienceQuality"]
        self.assertGreaterEqual(no_metric, 12)
        self.assertLess(no_metric, 15)  # metrics still contribute the top 3 pts


class TestSixPillarWeightsUnchanged(unittest.TestCase):
    def test_max_breakdown_constant(self):
        s = RoleIndependentAtsScorer()
        result = s.score_resume(
            "JOHN SMITH\njohn@example.com | +1 555 0100\n\n"
            "SKILLS\nPython, Docker\n\n"
            "EXPERIENCE\nSoftware Engineer\nAcme Corp\n2020 - 2023\n"
            "• Built REST APIs in Python serving 10000 users.\n"
        )
        self.assertEqual(result["maxBreakdown"], {
            "structure": 20, "completeness": 20, "extractability": 20,
            "skills": 15, "experienceQuality": 15, "formatting": 10,
        })
        total = sum(result["breakdown"].values())
        self.assertEqual(total, result["overallScore"])
        self.assertLessEqual(result["overallScore"], 100)


if __name__ == "__main__":
    unittest.main(verbosity=2)
