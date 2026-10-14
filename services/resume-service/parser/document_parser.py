import os
import sys
import json
import tempfile
import logging
import warnings
from pathlib import Path
from typing import Dict, Any, List, Optional

# Suppress deprecation and third-party warnings from polluting stdout
warnings.filterwarnings("ignore")
logging.basicConfig(level=logging.ERROR, stream=sys.stderr)
logger = logging.getLogger("document_parser")

class DocumentParsingException(Exception):
    """Custom exception for document parsing failures."""
    pass

class UnsupportedFormatError(DocumentParsingException):
    """Exception raised when an unsupported format like .doc or others is uploaded."""
    pass


class ResumeDocumentParser:
    """
    Parser using Docling to extract complete resume structure and text
    from PDF and DOCX files while preserving reading order.
    """

    def __init__(self):
        self._pdf_converter = None
        self._pdf_ocr_converter = None
        self._docx_converter = None

    def _get_converter(self, suffix: str, force_ocr: bool = False, force_backend: Any = None):
        """Lazily initialize the Docling DocumentConverter with appropriate options per format."""
        if suffix == ".docx":
            if self._docx_converter is None:
                try:
                    from docling.document_converter import DocumentConverter
                    self._docx_converter = DocumentConverter()
                    logger.info("Docling DOCX DocumentConverter successfully initialized.")
                except Exception as e:
                    logger.error(f"Failed to initialize Docling DOCX converter: {e}", exc_info=True)
                    raise DocumentParsingException(f"Failed to initialize Docling engine: {str(e)}")
            return self._docx_converter
        else:
            # Determine best available backend for PDF
            selected_backend = force_backend
            if selected_backend is None:
                try:
                    import docling_parse.pdf_parsers
                    selected_backend = None
                except Exception:
                    try:
                        from docling.backend.pypdfium2_backend import PyPdfiumDocumentBackend
                        selected_backend = PyPdfiumDocumentBackend
                    except Exception:
                        selected_backend = None

            if force_ocr:
                if self._pdf_ocr_converter is None or force_backend is not None:
                    try:
                        from docling.document_converter import DocumentConverter, PdfFormatOption
                        from docling.datamodel.base_models import InputFormat
                        from docling.datamodel.pipeline_options import PdfPipelineOptions

                        pipeline_options = PdfPipelineOptions()
                        pipeline_options.do_ocr = True
                        pipeline_options.do_table_structure = True

                        backend_kw = {"backend": selected_backend} if selected_backend else {}
                        format_options = {
                            InputFormat.PDF: PdfFormatOption(pipeline_options=pipeline_options, **backend_kw)
                        }
                        converter = DocumentConverter(format_options=format_options)
                        if force_backend is None:
                            self._pdf_ocr_converter = converter
                        return converter
                    except Exception as e:
                        logger.error(f"Failed to initialize Docling OCR PDF converter: {e}", exc_info=True)
                        raise DocumentParsingException(f"Failed to initialize Docling engine: {str(e)}")
                return self._pdf_ocr_converter
            else:
                if self._pdf_converter is None or force_backend is not None:
                    try:
                        from docling.document_converter import DocumentConverter, PdfFormatOption
                        from docling.datamodel.base_models import InputFormat
                        from docling.datamodel.pipeline_options import PdfPipelineOptions

                        pipeline_options = PdfPipelineOptions()
                        pipeline_options.do_ocr = False
                        pipeline_options.do_table_structure = True

                        backend_kw = {"backend": selected_backend} if selected_backend else {}
                        format_options = {
                            InputFormat.PDF: PdfFormatOption(pipeline_options=pipeline_options, **backend_kw)
                        }
                        converter = DocumentConverter(format_options=format_options)
                        logger.info(f"Docling PDF DocumentConverter initialized with backend={selected_backend}.")
                        if force_backend is None:
                            self._pdf_converter = converter
                        return converter
                    except Exception as e:
                        logger.error(f"Failed to initialize Docling PDF converter: {e}", exc_info=True)
                        raise DocumentParsingException(f"Failed to initialize Docling engine: {str(e)}")
                return self._pdf_converter

    def _fallback_pdf_extract(self, temp_path: str, file_bytes: bytes, original_filename: str) -> Dict[str, Any]:
        """Last-resort fallback parser using pypdfium2 / pypdf when Docling engine encounters native DLL / format errors."""
        page_texts = []
        try:
            import pypdfium2 as pdfium
            pdf = pdfium.PdfDocument(temp_path)
            for page in pdf:
                text_page = page.get_textpage()
                page_texts.append(text_page.get_text_range())
        except Exception:
            try:
                import pypdf
                reader = pypdf.PdfReader(temp_path)
                for page in reader.pages:
                    page_texts.append(page.extract_text() or "")
            except Exception as e:
                raise DocumentParsingException(f"All PDF extraction engines failed: {str(e)}")

        full_text = "\n\n".join(page_texts).strip()
        lines = [line.strip() for line in full_text.splitlines() if line.strip()]
        
        # Simple heuristic section detection for fallback
        known_headings = {
            "education", "experience", "work experience", "skills", "technical skills",
            "projects", "certifications", "summary", "professional summary", "contact"
        }
        sections = []
        structured_elements = []
        for line in lines:
            normalized = line.lower().strip(":").strip()
            if normalized in known_headings:
                sections.append({"title": line, "level": 1, "page_no": 1})
                structured_elements.append({"type": "section_header", "label": "section_header", "text": line, "level": 1, "page_no": 1})
            else:
                structured_elements.append({"type": "paragraph", "label": "paragraph", "text": line, "page_no": 1})

        return {
            "filename": original_filename,
            "file_type": "application/pdf",
            "file_size_bytes": len(file_bytes),
            "page_count": max(1, len(page_texts)),
            "character_count": len(full_text),
            "table_count": 0,
            "section_count": len(sections),
            "sections": sections,
            "tables": [],
            "structured_elements": structured_elements,
            "markdown": full_text,
            "plain_text": full_text,
            "resumeText": full_text,
        }

    def parse_document(self, file_bytes: bytes, original_filename: str) -> Dict[str, Any]:
        """
        Parse an uploaded resume file (PDF or DOCX) and return structured extraction data.
        """
        if not file_bytes or len(file_bytes) == 0:
            raise DocumentParsingException("Uploaded file is empty (0 bytes).")

        filename_lower = original_filename.lower()
        suffix = Path(original_filename).suffix.lower()

        # Check for legacy .doc format
        if suffix == ".doc":
            raise UnsupportedFormatError(
                "Legacy Microsoft Word format (.doc) is not supported by Docling. "
                "Please save or export your document as .docx or .pdf and upload again."
            )

        if suffix not in [".pdf", ".docx"]:
            raise UnsupportedFormatError(
                f"Unsupported file format '{suffix}'. "
                "Please upload a PDF (.pdf) or Microsoft Word (.docx) document."
            )

        # Infer mime type
        mime_type = "application/pdf" if suffix == ".pdf" else "application/vnd.openxmlformats-officedocument.wordprocessingml.document"

        converter = self._get_converter(suffix)

        # Write bytes to a temporary file with the matching extension so Docling detects format
        temp_file = tempfile.NamedTemporaryFile(delete=False, suffix=suffix)
        temp_path = temp_file.name
        try:
            temp_file.write(file_bytes)
            temp_file.flush()
            temp_file.close()

            # Execute Docling conversion
            conv_res = None
            try:
                conv_res = converter.convert(temp_path)
            except Exception as e:
                logger.warning(f"Initial Docling conversion attempt failed: {e}")
                if suffix == ".pdf":
                    try:
                        from docling.backend.pypdfium2_backend import PyPdfiumDocumentBackend
                        fallback_converter = self._get_converter(".pdf", force_ocr=False, force_backend=PyPdfiumDocumentBackend)
                        conv_res = fallback_converter.convert(temp_path)
                        logger.info("Docling PDF conversion succeeded with PyPdfiumDocumentBackend fallback.")
                    except Exception as retry_err:
                        logger.error(f"PyPdfiumDocumentBackend fallback failed: {retry_err}", exc_info=True)
                        return self._fallback_pdf_extract(temp_path, file_bytes, original_filename)
                else:
                    raise DocumentParsingException(f"Docling extraction failed: {str(e)}")

            if not conv_res or not hasattr(conv_res, "document") or conv_res.document is None:
                raise DocumentParsingException("Docling finished conversion but returned no document model.")

            doc = conv_res.document

            # 1. Plain text export (unmodified)
            plain_text = ""
            try:
                if hasattr(doc, "export_to_text"):
                    plain_text = doc.export_to_text()
                elif hasattr(doc, "export_to_markdown"):
                    plain_text = doc.export_to_markdown()
            except Exception:
                try:
                    plain_text = doc.export_to_markdown()
                except Exception:
                    plain_text = ""

            # If PDF yielded less than 20 characters, it may be a scanned image-only PDF — trigger OCR fallback
            if suffix == ".pdf" and len(plain_text.strip()) < 20:
                try:
                    ocr_converter = self._get_converter(".pdf", force_ocr=True)
                    conv_res_ocr = ocr_converter.convert(temp_path)
                    if conv_res_ocr and hasattr(conv_res_ocr, "document") and conv_res_ocr.document:
                        doc = conv_res_ocr.document
                        try:
                            if hasattr(doc, "export_to_text"):
                                plain_text = doc.export_to_text()
                            elif hasattr(doc, "export_to_markdown"):
                                plain_text = doc.export_to_markdown()
                        except Exception:
                            plain_text = ""
                except Exception as ocr_err:
                    logger.warning(f"OCR fallback attempt failed: {ocr_err}")

            # 2. Markdown export (preserves layout, lists, tables)
            markdown_text = ""
            try:
                if hasattr(doc, "export_to_markdown"):
                    markdown_text = doc.export_to_markdown()
            except Exception:
                markdown_text = plain_text

            if not plain_text and markdown_text:
                plain_text = markdown_text

            # 3. Compute page count
            page_count = 1
            if hasattr(doc, "pages") and doc.pages:
                if isinstance(doc.pages, dict):
                    page_count = len(doc.pages)
                elif isinstance(doc.pages, (list, tuple)):
                    page_count = len(doc.pages)

            # 4. Extract structured items, sections, and tables
            sections: List[Dict[str, Any]] = []
            tables: List[Dict[str, Any]] = []
            structured_elements: List[Dict[str, Any]] = []

            # Extract tables directly if available
            if hasattr(doc, "tables") and doc.tables:
                for idx, tbl in enumerate(doc.tables):
                    tbl_md = ""
                    tbl_html = ""
                    try:
                        if hasattr(tbl, "export_to_markdown"):
                            tbl_md = tbl.export_to_markdown()
                        elif hasattr(tbl, "to_markdown"):
                            tbl_md = tbl.to_markdown()
                    except Exception:
                        pass

                    try:
                        if hasattr(tbl, "export_to_html"):
                            tbl_html = tbl.export_to_html()
                        elif hasattr(tbl, "to_html"):
                            tbl_html = tbl.to_html()
                    except Exception:
                        pass

                    num_rows = 0
                    num_cols = 0
                    if hasattr(tbl, "data") and tbl.data:
                        if hasattr(tbl.data, "grid"):
                            num_rows = len(tbl.data.grid)
                            num_cols = len(tbl.data.grid[0]) if num_rows > 0 else 0
                        elif hasattr(tbl.data, "num_rows"):
                            num_rows = tbl.data.num_rows
                            num_cols = getattr(tbl.data, "num_cols", 0)

                    tables.append({
                        "index": idx + 1,
                        "markdown": tbl_md,
                        "html": tbl_html,
                        "rows": num_rows,
                        "cols": num_cols,
                    })

            # Iterate through document items to preserve sequential reading order
            try:
                if hasattr(doc, "iterate_items"):
                    for item, level in doc.iterate_items():
                        label_name = getattr(item, "label", "text")
                        if hasattr(label_name, "value"):
                            label_name = label_name.value
                        label_str = str(label_name).lower()

                        item_text = getattr(item, "text", "")
                        page_no = None
                        bbox = None
                        if hasattr(item, "prov") and item.prov:
                            try:
                                page_no = item.prov[0].page_no
                                if hasattr(item.prov[0], "bbox"):
                                    b = item.prov[0].bbox
                                    bbox = {
                                        "l": getattr(b, "l", None),
                                        "t": getattr(b, "t", None),
                                        "r": getattr(b, "r", None),
                                        "b": getattr(b, "b", None),
                                        "coord_origin": str(getattr(b, "coord_origin", "BOTTOMLEFT"))
                                    }
                            except Exception:
                                pass

                        # Check item types
                        if "title" in label_str or "section_header" in label_str or "header" in label_str:
                            sections.append({
                                "title": item_text.strip(),
                                "level": level,
                                "page_no": page_no,
                                "bbox": bbox,
                            })
                            structured_elements.append({
                                "type": "section_header",
                                "label": label_str,
                                "text": item_text,
                                "level": level,
                                "page_no": page_no,
                                "bbox": bbox,
                            })
                        elif "table" in label_str:
                            tbl_md = ""
                            tbl_html = ""
                            if hasattr(item, "export_to_markdown"):
                                try:
                                    tbl_md = item.export_to_markdown()
                                except Exception:
                                    pass
                            if hasattr(item, "export_to_html"):
                                try:
                                    tbl_html = item.export_to_html()
                                except Exception:
                                    pass
                            structured_elements.append({
                                "type": "table",
                                "label": label_str,
                                "markdown": tbl_md,
                                "html": tbl_html,
                                "page_no": page_no,
                            })
                        elif "list" in label_str:
                            structured_elements.append({
                                "type": "list_item",
                                "label": label_str,
                                "text": item_text,
                                "level": level,
                                "page_no": page_no,
                            })
                        elif "caption" in label_str or "footnote" in label_str:
                            structured_elements.append({
                                "type": "caption",
                                "label": label_str,
                                "text": item_text,
                                "page_no": page_no,
                            })
                        else:
                            if item_text and item_text.strip():
                                structured_elements.append({
                                    "type": "paragraph",
                                    "label": label_str,
                                    "text": item_text,
                                    "page_no": page_no,
                                })
            except Exception as e:
                logger.warning(f"Error while iterating items: {e}")

            # Calculate counts
            character_count = len(plain_text)
            table_count = len(tables)
            section_count = len(sections)

            # Use plain_text or markdown_text as primary resumeText
            primary_text = plain_text if (plain_text and len(plain_text.strip()) > 0) else markdown_text

            return {
                "filename": original_filename,
                "file_type": mime_type,
                "file_size_bytes": len(file_bytes),
                "page_count": page_count,
                "character_count": character_count,
                "table_count": table_count,
                "section_count": section_count,
                "sections": sections,
                "tables": tables,
                "structured_elements": structured_elements,
                "markdown": markdown_text,
                "plain_text": plain_text,
                "resumeText": primary_text,
            }

        finally:
            if os.path.exists(temp_path):
                try:
                    os.remove(temp_path)
                except Exception as e:
                    logger.warning(f"Failed to remove temporary file {temp_path}: {e}")


def main():
    """CLI entrypoint for standalone execution or subprocess invocation."""
    if len(sys.argv) < 2:
        print(json.dumps({
            "success": False,
            "error": "Usage: python document_parser.py <file_path_or_json_payload>"
        }))
        sys.exit(1)

    target_path = sys.argv[1]
    original_filename = sys.argv[2] if len(sys.argv) > 2 else os.path.basename(target_path)

    if not os.path.exists(target_path):
        print(json.dumps({
            "success": False,
            "error": f"File not found: {target_path}"
        }))
        sys.exit(1)

    try:
        with open(target_path, "rb") as f:
            file_bytes = f.read()

        parser = ResumeDocumentParser()
        result = parser.parse_document(file_bytes=file_bytes, original_filename=original_filename)

        print(json.dumps({
            "success": True,
            "data": result
        }))
        sys.exit(0)
    except UnsupportedFormatError as e:
        print(json.dumps({
            "success": False,
            "error": str(e),
            "errorType": "UnsupportedFormatError"
        }))
        sys.exit(2)
    except Exception as e:
        print(json.dumps({
            "success": False,
            "error": str(e),
            "errorType": "DocumentParsingException"
        }))
        sys.exit(1)


if __name__ == "__main__":
    main()
