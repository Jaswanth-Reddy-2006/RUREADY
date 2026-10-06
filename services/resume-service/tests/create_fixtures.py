import os
import docx

def create_sample_pdf(output_path: str):
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
        "(Frameworks: React, Express, Docker, Kubernetes, AWS, PostgreSQL, Redis) Tj",
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

def create_fixtures():
    current_dir = os.path.dirname(os.path.abspath(__file__))
    docx_path = os.path.join(current_dir, "rich_test_resume.docx")
    pdf_path = os.path.join(current_dir, "test_sample.pdf")
    
    d = docx.Document()
    d.add_heading("Alex Morgan", level=0)
    d.add_paragraph("alex.morgan@example.com | +1 (555) 234-5678 | San Francisco, CA | linkedin.com/in/alexmorgan")
    d.add_heading("Professional Summary", level=1)
    d.add_paragraph("Senior Software Engineer with 6+ years experience in distributed systems and TypeScript.")
    d.add_heading("Technical Skills", level=1)
    d.add_paragraph("TypeScript, Node.js, Python, PostgreSQL, Redis, Docker, Kubernetes, AWS")
    d.add_heading("Work Experience", level=1)
    d.add_heading("Senior Backend Engineer at CloudScale Technologies", level=2)
    d.add_paragraph("2022 - Present | San Francisco, CA")
    d.add_paragraph("• Architected event-driven microservices processing 45M daily transactions with 99.99% uptime.")
    d.add_paragraph("• Optimized PostgreSQL database query latencies by 42% with Redis caching.")
    d.add_heading("Education", level=1)
    d.add_paragraph("Bachelor of Science in Computer Science | UC Berkeley | 2015 - 2019")
    d.save(docx_path)
    print(f"Generated fixture at: {docx_path}")

    create_sample_pdf(pdf_path)
    print(f"Generated fixture at: {pdf_path}")

if __name__ == "__main__":
    create_fixtures()
