"""
Programmatic Test Suite for Docling Resume Extraction in Rennetus Resume Service.
Tests PDF and DOCX resume extraction, data contracts, and section preservation.
"""

import os
import sys
import json
import tempfile
import unittest
from pathlib import Path

# Add services/resume-service to sys.path so we can import parser.document_parser
current_dir = Path(__file__).resolve().parent
resume_service_dir = current_dir.parent
sys.path.insert(0, str(resume_service_dir))

from parser.document_parser import ResumeDocumentParser, UnsupportedFormatError, DocumentParsingException


def create_sample_docx(output_path: str):
    """Create a high-fidelity sample DOCX resume."""
    import docx
    from docx.shared import Inches, Pt

    doc = docx.Document()
    
    # Candidate Header
    doc.add_heading("Alex Morgan", level=0)
    p_contact = doc.add_paragraph()
    p_contact.add_run("alex.morgan@example.com | +1 (555) 234-5678 | San Francisco, CA | linkedin.com/in/alexmorgan | github.com/alexmorgan")

    # Professional Summary
    doc.add_heading("Professional Summary", level=1)
    doc.add_paragraph(
        "Senior Software Engineer with 6+ years of experience designing high-throughput distributed systems, "
        "microservices architectures, and modern web applications using TypeScript, Node.js, Python, and AWS."
    )

    # Technical Skills
    doc.add_heading("Technical Skills", level=1)
    p_skills = doc.add_paragraph()
    p_skills.add_run("Languages: TypeScript, JavaScript, Python, Go, SQL\n")
    p_skills.add_run("Frameworks: React, Next.js, Express, FastAPI, Node.js\n")
    p_skills.add_run("Databases: PostgreSQL, Redis, MongoDB\n")
    p_skills.add_run("Cloud & DevOps: Docker, Kubernetes, AWS, Terraform, CI/CD")

    # Work Experience
    doc.add_heading("Work Experience", level=1)
    
    # Role 1
    doc.add_heading("Senior Backend Engineer at CloudScale Technologies", level=2)
    doc.add_paragraph("March 2022 - Present | San Francisco, CA")
    doc.add_paragraph("Architected event-driven microservices processing 45M daily transactions with 99.99% uptime.", style='List Bullet')
    doc.add_paragraph("Optimized PostgreSQL database query latencies by 42% through strategic index redesign and Redis caching.", style='List Bullet')
    doc.add_paragraph("Led cross-functional team of 6 engineers across sprint cycles and automated CI/CD deployment pipelines.", style='List Bullet')

    # Role 2
    doc.add_heading("Software Engineer at Nova Labs", level=2)
    doc.add_paragraph("July 2019 - February 2022 | Austin, TX")
    doc.add_paragraph("Developed RESTful APIs and GraphQL gateways serving 500,000 active monthly users.", style='List Bullet')
    doc.add_paragraph("Integrated Stripe payment gateway and automated webhook reconciliation system.", style='List Bullet')

    # Education
    doc.add_heading("Education", level=1)
    doc.add_heading("Bachelor of Science in Computer Science", level=2)
    doc.add_paragraph("University of California, Berkeley | 2015 - 2019 | GPA: 3.85 / 4.0")

    # Projects
    doc.add_heading("Projects", level=1)
    doc.add_heading("Distributed Task Queue | TypeScript, Redis, Docker", level=2)
    doc.add_paragraph("Implemented a lightweight distributed task queue with priority scheduling and dead-letter queue recovery.", style='List Bullet')

    # Certifications
    doc.add_heading("Certifications", level=1)
    doc.add_paragraph("AWS Certified Solutions Architect - Associate | 2023", style='List Bullet')

    doc.save(output_path)


def create_sample_pdf(output_path: str):
    """Create a valid sample PDF resume using raw PDF specification text operators."""
    # A standard minimal valid PDF with full textual content stream
    content_lines = [
        "BT",
        "/F1 18 Tf",
        "50 750 Td",
        "(Elena Rostova) Tj",
        "0 -20 Td",
        "/F1 10 Tf",
        "(elena.rostova@example.com | +1 415 800 1234 | Seattle, WA | github.com/erostova) Tj",
        "0 -30 Td",
        "/F1 14 Tf",
        "(SUMMARY) Tj",
        "0 -15 Td",
        "/F1 10 Tf",
        "(Full Stack Software Engineer specializing in React, Node.js, and cloud native architectures.) Tj",
        "0 -30 Td",
        "/F1 14 Tf",
        "(TECHNICAL SKILLS) Tj",
        "0 -15 Td",
        "/F1 10 Tf",
        "(Languages: TypeScript, JavaScript, Python, SQL) Tj",
        "0 -15 Td",
        "(Frameworks & Tools: React, Express, Docker, Kubernetes, AWS, PostgreSQL, Redis) Tj",
        "0 -30 Td",
        "/F1 14 Tf",
        "(EXPERIENCE) Tj",
        "0 -15 Td",
        "/F1 12 Tf",
        "(Lead Software Engineer at DataWave Systems - 2021 to Present) Tj",
        "0 -15 Td",
        "/F1 10 Tf",
        "(- Engineered scalable data visualization dashboard in React and TypeScript.) Tj",
        "0 -15 Td",
        "(- Reduced backend response time by 35% through Redis caching layer.) Tj",
        "0 -30 Td",
        "/F1 14 Tf",
        "(EDUCATION) Tj",
        "0 -15 Td",
        "/F1 11 Tf",
        "(Bachelor of Technology in Computer Engineering) Tj",
        "0 -15 Td",
        "/F1 10 Tf",
        "(University of Washington | 2017 - 2021 | GPA: 3.9) Tj",
        "0 -30 Td",
        "/F1 14 Tf",
        "(PROJECTS) Tj",
        "0 -15 Td",
        "/F1 10 Tf",
        "(Real-Time Analytics Pipeline: Built Kafka consumer service processing 10k msgs/sec.) Tj",
        "ET"
    ]
    
    stream_content = "\n".join(content_lines)
    stream_len = len(stream_content.encode('latin1'))

    pdf_template = f"""%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>
endobj
4 0 obj
<< /Length {stream_len} >>
stream
{stream_content}
endstream
endobj
5 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000229 00000 n 
0000000300 00000 n 
trailer
<< /Size 6 /Root 1 0 R >>
startxref
369
%%EOF"""

    with open(output_path, "wb") as f:
        f.write(pdf_template.encode('latin1'))


class TestDoclingResumeExtraction(unittest.TestCase):
    
    def setUp(self):
        self.parser = ResumeDocumentParser()
        self.temp_dir = tempfile.mkdtemp()

    def test_docx_resume_extraction(self):
        """Test extraction of a comprehensive DOCX resume."""
        docx_path = os.path.join(self.temp_dir, "test_resume.docx")
        create_sample_docx(docx_path)

        with open(docx_path, "rb") as f:
            file_bytes = f.read()

        result = self.parser.parse_document(file_bytes, "test_resume.docx")

        # 1. Verify response structure & data contracts
        self.assertIn("resumeText", result)
        self.assertIn("plain_text", result)
        self.assertIn("markdown", result)
        self.assertIn("sections", result)
        self.assertIn("structured_elements", result)
        self.assertEqual(result["file_type"], "application/vnd.openxmlformats-officedocument.wordprocessingml.document")

        extracted_text = result["resumeText"]
        self.assertTrue(len(extracted_text) > 100, f"Extracted text too short: {len(extracted_text)}")

        # 2. Verify all major sections and content are preserved
        self.assertIn("Alex Morgan", extracted_text)
        self.assertIn("alex.morgan@example.com", extracted_text)
        self.assertIn("Senior Software Engineer", extracted_text)
        self.assertIn("CloudScale Technologies", extracted_text)
        self.assertIn("45M daily transactions", extracted_text)
        self.assertIn("University of California, Berkeley", extracted_text)
        self.assertIn("AWS Certified Solutions Architect", extracted_text)
        self.assertIn("TypeScript", extracted_text)
        self.assertIn("PostgreSQL", extracted_text)

        print("\n[DOCX Test Passed]: Extracted", len(extracted_text), "characters from DOCX successfully.")

    def test_pdf_resume_extraction(self):
        """Test extraction of a PDF resume."""
        pdf_path = os.path.join(self.temp_dir, "test_resume.pdf")
        create_sample_pdf(pdf_path)

        with open(pdf_path, "rb") as f:
            file_bytes = f.read()

        result = self.parser.parse_document(file_bytes, "test_resume.pdf")

        # 1. Verify response structure & data contracts
        self.assertIn("resumeText", result)
        self.assertIn("plain_text", result)
        self.assertEqual(result["file_type"], "application/pdf")

        extracted_text = result["resumeText"]
        self.assertTrue(len(extracted_text) > 50, f"Extracted text too short: {len(extracted_text)}")

        # 2. Verify key details are preserved
        self.assertIn("Elena Rostova", extracted_text)
        self.assertIn("elena.rostova@example.com", extracted_text)
        self.assertIn("DataWave Systems", extracted_text)
        self.assertIn("University of Washington", extracted_text)

        print("\n[PDF Test Passed]: Extracted", len(extracted_text), "characters from PDF successfully.")

    def test_unsupported_legacy_doc_format(self):
        """Test that legacy .doc files raise UnsupportedFormatError with helpful message."""
        with self.assertRaises(UnsupportedFormatError) as ctx:
            self.parser.parse_document(b"fake legacy word content", "old_resume.doc")
        
        self.assertIn("Legacy Microsoft Word format (.doc) is not supported", str(ctx.exception))
        print("\n[.DOC Format Test Passed]: Correctly caught UnsupportedFormatError.")

    def test_empty_file_handling(self):
        """Test that empty file raises DocumentParsingException."""
        with self.assertRaises(DocumentParsingException) as ctx:
            self.parser.parse_document(b"", "empty_resume.pdf")
        self.assertIn("empty", str(ctx.exception).lower())
        print("\n[Empty File Test Passed]: Correctly rejected empty file.")


if __name__ == "__main__":
    unittest.main()
