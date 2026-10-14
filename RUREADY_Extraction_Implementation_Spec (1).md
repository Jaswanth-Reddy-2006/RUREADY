# RUREADY Resume Extraction — Implementation Specification (for Antigravity)

**Status of this document:** an engineering specification written without access to the repository. Nothing in it has been implemented, run, or measured. Every statement about the existing codebase is an *assumption to verify in Phase 1*. Where this document says "inspect," Antigravity must read the real code and determine real file names, module boundaries, and schema shapes. Do not assume paths.

**Terminology.** *Verify* = confirm against the actual repo, installed library version, or real resumes before relying on it. *Gate* = a condition that must hold before the next phase starts.

---

## 0. Mission, scope, and hard rules

**Mission.** Make resume extraction from PDF and DOCX uploads as reliable as practical, with three guarantees enforced by code rather than by hope:

1. **No silent content loss** — every piece of source text is either assigned to a field or explicitly recorded as unassigned.
2. **No fabricated values** — every non-null extracted value is traceable to a source span (or is a deterministic, recorded transformation of one).
3. **No unflagged wrong-field assignments** — ambiguity is surfaced and left unresolved rather than guessed.

**In scope (all phases):** personal information and contact links; professional summary; experience; education; projects; certifications; achievements and awards; publications; spoken languages; skills; custom sections; layout handling (two-column, tables, sidebars, floating headers, icons, page breaks); evidence/provenance; adapter into the canonical schema; regression and end-to-end validation.

**Out of scope / protected (do not change):**
- ATS scoring formulas and the six-pillar structure.
- Competitive job matching and relevance gating logic.
- Improvement-recommendation logic.
- The analysis-first UI flow.
- Resume Builder editing, templates, saved data format, and export.
- Existing API contracts and database schema (additive, non-destructive changes only, and only with the approvals listed in §9).
- No model training or fine-tuning. No replacement of Docling without measured evidence and explicit user approval (§3.C1 defines the evidence standard).
- No unrelated refactoring or unrelated service changes.

**Non-negotiable engineering rules:**
- Docling's structured document is the primary source; keep it, do not flatten it before the IR is built.
- Fix the **earliest incorrect stage** for each defect. Do not patch downstream stages to compensate for upstream loss.
- No per-resume special cases. Every rule must be expressed as general logic, data (dictionaries/taxonomies), or a documented heuristic with a test.
- Nothing is reported as implemented, passing, or validated until it has actually been run, with the command and result recorded.
- Distinguish **real-resume validation** from **synthetic fixtures** in every report.

---

## 1. Target architecture and data flow

```
Upload (PDF/DOCX)
  → U0  Intake & format routing
  → C1  Docling conversion + source supplements        [keeps DoclingDocument]
  → L2  Line IR construction (+ boilerplate removal)
  → O3  Reading-order & region validation
  → S4  Section segmentation (+ custom-section preservation)
  → E5  Entry grouping (shared grammar)
  → F6  Field extraction & normalization (per section type)
         ├─ contacts (document-wide)
         ├─ skills (dictionary + structure)
         └─ dates / URLs / grades / locations (shared normalizers)
  → V7  Verification gate (grounding, coverage, exclusivity, field validators)
  → A8  Adapter → existing canonical resume schema   (+ sidecar extraction report)
  → P9  Persistence & frontend consumption (unchanged contracts)
```

Two outputs leave V7/A8: the **canonical resume** (same shape downstream consumers already read) and the **extraction report sidecar** (provenance, confidence, unassigned content, flags). Downstream consumers (ATS, matching, builder) read only the canonical resume.

**Global error-handling principles (apply to every stage):**
- A stage that cannot confidently resolve something passes it **forward unresolved with a flag**, never a guess.
- A stage that throws an exception is caught at the pipeline boundary. The upload never fails because of the new pipeline: fall back to the legacy extraction output (while the legacy path exists behind the flag), record the failure in the report, and surface it in logs/metrics.
- Every stage appends to a `stage_log` (rule IDs fired, counts, warnings) so errors are attributable to a stage.
- No PII in application logs. The sidecar contains source text and must be treated as sensitive resume data.

---

## 2. Stage specifications

### U0 — Intake and format routing
- **Responsibility:** accept the upload through the *existing* upload path, detect PDF vs DOCX by content (not only extension), reject unsupported/corrupt files exactly as the current app does.
- **Input:** uploaded bytes + filename. **Output:** routed file handle + `source_meta` (format, page count, file hash, byte size).
- **Failure modes:** wrong extension, encrypted PDF, corrupt file, legacy `.doc`.
- **Next-stage handling:** preserve current error behavior and messages; do not introduce new user-visible failure modes.

### C1 — Docling conversion and source supplements
- **Responsibility:** produce the Docling structured document and keep it available to later stages. Collect source-level information Docling may not expose.
- **Input:** routed file. **Output:** `DoclingDocument` (retained, not flattened) + `source_supplements`:
  - PDF: link annotations (URI + rectangle + page), embedded text-layer presence per page, page sizes.
  - DOCX: hyperlink relationships (target + run text), text boxes/shapes, header/footer content, structured document tags, table structure.
- **Verify in Phase 1/3:** installed Docling version; which backend processes PDF vs DOCX; whether items expose provenance (page, bounding box, character span), labels (e.g., section header, list item, text, table), table cell structure, hyperlinks; OCR configuration; what the current code actually consumes (structured document vs exported Markdown/text).
- **Failure modes:** hyperlinks lost; text boxes/headers dropped; DOCX has no geometric layout; scanned PDFs yield empty or garbled text; multi-column order wrong; icon glyphs become private-use characters.
- **Next-stage handling:** each lost-information finding is recorded as an S1 defect with evidence. Supplements are *additive* — they never overwrite Docling text; they attach metadata (e.g., `href` on a line, floating-text lines flagged `position_unknown`). Pages with no usable text layer are flagged `ocr_required`; if OCR is configured, its output is flagged `source_quality=low`.
- **Evidence standard for replacing or augmenting Docling:** only if Phase 2 attribution shows, on the labeled corpus, that a specific class of information is unrecoverably lost at C1 on a meaningful share of resumes in a stratum *and* supplements cannot recover it. Replacement is a separate decision for the user, based on a side-by-side measurement on the same corpus. Antigravity must not replace it on its own.

### L2 — Line IR construction
- **Responsibility:** convert the Docling document + supplements into an ordered list of **Lines**, the single unit all later stages operate on.
- **Input:** `DoclingDocument` + supplements. **Output:** `LineIR[]` (see §3), page-level metadata, `boilerplate_removed[]`.
- **Operations:** flatten paragraphs/list items/table cells into lines with coordinates (table cells keep row/col indices and are tagged `in_table`); attach `href` from annotations/relationships by rectangle intersection or run mapping; compute layout features (font size/boldness/caps where available, left x, right x, indent, vertical gap to previous line); repair soft line wraps and hyphenation at line ends *only inside* a paragraph (keep original `raw_text`); strip private-use icon glyphs from `text` but keep them in `raw_text`; detect and remove repeated headers/footers/page numbers (same text/position across ≥2 pages), recording each removal.
- **Failure modes:** over-eager hyphen repair joins distinct words; boilerplate detection removes a legitimate repeated line (e.g., a name repeated per page is *kept once* in the header block); lost links.
- **Next-stage handling:** `raw_text` is always preserved; every removal is logged in `boilerplate_removed` with its source ID so coverage accounting can explain it.

### O3 — Reading-order and region validation
- **Responsibility:** decide whether Docling's order is trustworthy; assign regions; re-sort **only when required and when it demonstrably improves structure**.
- **Input:** `LineIR[]`. **Output:** `LineIR[]` with `order_index`, `region` (`header`, `sidebar`, `main`, `floating`, `footer`), `column_id`, and an `order_report`.
- **Algorithm:**
  1. *Column detection (PDF/geometry available):* cluster line x-intervals on each page; a multi-column page exists when two or more x-bands each contain substantial text, have a clear horizontal gap, and overlap substantially in y-range.
  2. *Order checks:* (a) within a column, order is monotonic top-to-bottom; (b) columns appear contiguously (column-major), not interleaved; (c) each heading is followed by content from the same column; (d) date-only/right-aligned lines sit adjacent (by y) to the line they belong to.
  3. *Decision:* if checks pass → keep Docling order. If they fail → compute a candidate order (column-major, by region) and **accept it only if** its check score is strictly better; otherwise keep Docling order and flag `order_uncertain`.
  4. *Region assignment:* header = content above the first heading on page 1 and top-of-page floating blocks; sidebar = a narrow column that spans most of the page height and is consistently offset; footer = removed boilerplate.
  5. *No geometry (DOCX):* use document order and table structure; floating text boxes are appended as `floating` region lines flagged `position_unknown`.
- **Failure modes:** false column detection on a single-column resume with a wide right-aligned date column; sidebar mistaken for a table; interleaved lines when columns are close.
- **Next-stage handling:** all re-sorts are recorded with before/after indices; S4 operates *within* region/column boundaries so sidebar sections never merge with main-column sections.

### S4 — Section segmentation
- **Responsibility:** partition lines into sections; preserve unrecognized sections.
- **Input:** ordered lines + regions. **Output:** `Section[]` (kind, raw heading, line IDs, classification evidence, confidence, parent).
- **Heading detection (score-based, not regex-only):** a line is heading-like when it satisfies several of: Docling section-header label; bold/caps/larger-than-body font; short (few words); no terminal sentence punctuation; vertical gap above; followed by content; consistent styling with other headings in the same resume (learn the document's heading style from unambiguous headings first, then apply it).
- **Classification:** match the normalized heading against a **versioned taxonomy data file** (synonyms + fuzzy tolerance), covering at least: summary/objective/profile/about; experience (work/professional/employment history/internships); education/academics; projects/personal projects/academic projects; skills/technical skills/core competencies/tools & technologies; certifications/licenses/courses; achievements/awards/honors/accomplishments; publications/papers/research; languages; plus extras (volunteering, interests, references, extracurricular, positions of responsibility, declaration). Seed the taxonomy from whatever constants exist in the current code, then extend.
- **Rules:**
  - Heading-like + taxonomy match → that kind.
  - Heading-like + no match → **custom section** keeping its original title and content verbatim; if content fingerprints strongly match a known kind (e.g., dated role/company entries → experience-like), record `suggested_kind` as a hint but keep `kind=custom` unless confidence is high *and* the section would otherwise be dropped.
  - Taxonomy-matching text that is not heading-like stays as body content.
  - Content before the first heading → implicit `header_block`.
  - "Languages" is disambiguated by content (see §4.9), never by heading alone.
  - Sub-headings (e.g., category labels inside Skills) create child groups, not new top-level sections.
- **Failure modes:** a bold company name mistaken for a heading; a heading in an unusual language/style; a sidebar heading inheriting main-column content; a one-line section with no content.
- **Next-stage handling:** an empty section is kept with its heading and a flag. Ambiguous headings carry `confidence=low` and their candidate kinds; E5 uses the content grammar to resolve, otherwise they stay custom.

### E5 — Entry grouping (shared grammar)
- **Responsibility:** group a section's lines into entries and preserve relationships between header fields, dates, locations, descriptions, and bullets.
- **Input:** `Section`. **Output:** `Entry[]` (header cluster lines, body lines, bullets, boundary reason, continuation links).
- **Line roles:** `BULLET`, `BULLET_CONTINUATION`, `DATE_ONLY`, `HEADLINE` (short, often bold, no terminal period), `PROSE`, `META` (location/employment type/label lines), `LINK_LINE`.
- **Boundary rules:**
  - A *header cluster* is up to ~3 consecutive non-bullet lines (plus any right-aligned date/location paired by y-position) preceding the body.
  - A new entry starts when a new header cluster appears after a body, or when a date-range anchor appears outside the current cluster, or (for list-like sections) at each list item.
  - Right-aligned dates are bound to the left text on the same visual row using bounding boxes (or table row/cell in DOCX); never to the next entry.
  - Bullet continuation: an unmarked line following a bullet, aligned with the bullet's text indent, with no headline/date cues, belongs to that bullet.
  - **Page breaks are not boundaries.** If the first content line on a new page is a bullet/prose with no headline or date, it continues the previous entry (`continuation_of=<entry id>`). Repeated headers/footers are already gone (L2).
  - Entries without separators are split by the repeated header-cluster pattern in that section, not by whitespace.
- **Failure modes:** two entries merged (company name looks like a bullet continuation); one entry split (date on its own line); bullets from entry B attached to A.
- **Next-stage handling:** every boundary decision stores `boundary_reason` (rule ID). When the boundary is uncertain, keep *one* entry containing both candidate blocks and flag `grouping_uncertain` rather than splitting arbitrarily.

### F6 — Field extraction and normalization
- **Responsibility:** turn each entry/section into typed field values with provenance. Rules per type are in §4.
- **Input:** `Entry[]`/`Section[]` + `LineIR`. **Output:** `FieldValue[]` (see §3) per entry, plus document-level fields.
- **Failure modes:** title/company swap; location read as company; date read as phone; skill token in a bullet read as a listed skill; spoken language read as programming language.
- **Next-stage handling:** low-confidence values are *not* given to the adapter as canonical values; they stay in the raw/unresolved field or the sidecar (§5.3).

### V7 — Verification gate
- **Responsibility:** enforce grounding, coverage, exclusivity, and field validators before anything reaches the canonical resume. See §5.
- **Input:** all `FieldValue`s + coverage ledger. **Output:** `VerifiedResume` (IR-level), `ExtractionReport`.
- **Failure modes:** a check rejects a legitimate value (over-strict normalization comparison); a check passes an ungrounded value (bug).
- **Next-stage handling:** rejected values are nulled and recorded with the failing check; the *rejection rate by rule* is a first-class metric (a rule with a high rejection rate is a bug signal).

### A8 — Adapter into the canonical schema
- **Responsibility:** map `VerifiedResume` into the existing canonical schema, **same shape and types as today**, and write the sidecar.
- **Input:** `VerifiedResume`. **Output:** canonical resume object + sidecar.
- **Rules:** additive only; where the canonical schema lacks a place for something (e.g., custom sections, credential IDs, raw headline), determine in Phase 1 whether it already has a free-form field. If a schema extension is necessary, follow §9.3 (approval + builder-tolerance proof). Canonical fields receive only `explicit`, `normalized`, or `derived` values with confidence `high` or `medium` (§5.3).
- **Failure modes:** a field that downstream expects non-null becomes null (previously guessed by the legacy mapper); array ordering changes; type changes.
- **Next-stage handling:** the adapter has a *contract test* against the old output shape for every field downstream reads. Any field where the new pipeline deliberately returns null where legacy guessed a value is listed in the migration report.

### P9 — Persistence and frontend consumption
- **Responsibility:** the existing save/load path and UI display, unchanged.
- **Rules:** the sidecar is stored additively (separate nullable column/JSON or separate table — Antigravity chooses after inspecting the data layer) and is not read by ATS, matching, or the builder. Existing saved resumes are *not* re-parsed or migrated. No frontend change is required for phase 1; if a "needs review" indicator is desired later, it is a separate, user-approved change.

---

## 3. Intermediate representation and provenance model

Implement as typed structures in whatever language/type system the repo uses (verify). Names below are logical; adopt the repo's naming conventions.

**SourceDoc:** `doc_id`, `format`, `page_count`, `file_hash`, `docling_version`, `backend`, `ocr_used`, `pages[] {index, width, height, has_text_layer}`.

**Line:**
- `line_id` (stable within a parse), `page`, `bbox` (nullable for DOCX), `order_index`, `original_order_index`
- `text` (cleaned), `raw_text` (exactly as extracted)
- `docling_ref` (item reference/label), `docling_label`
- `font_size`, `is_bold`, `is_caps`, `indent`, `list_marker`, `vertical_gap_before`
- `region`, `column_id`, `in_table` + `table_id/row/col`
- `links[] {href, display_text, source: annotation|relationship, char_range}`
- `role` (from E5), `flags[]`

**Section:** `section_id`, `kind`, `raw_heading`, `heading_line_id`, `line_ids[]`, `classification {rule_id, evidence[], confidence, candidates[]}`, `parent_id`, `region`.

**Entry:** `entry_id`, `section_id`, `kind`, `header_line_ids[]`, `body_line_ids[]`, `bullet_groups[] {line_ids[]}`, `boundary_reason`, `continuation_of`, `flags[]`.

**FieldValue (the provenance record — one per extracted value):**
- `path` (e.g., `experience[2].title`, `contact.email[0]`, `skills[17]`)
- `value` (what the pipeline emits), `raw` (the exact source text it came from)
- `spans[] {line_id, char_start, char_end}`
- `method` ∈ `explicit` | `normalized` | `derived` | `inferred`
  - *explicit:* the value is the source text (after whitespace/ligature/hyphen repair only).
  - *normalized:* a deterministic, reversible-or-recorded transformation of source text (URL scheme added, host lowercased, phone to E.164 with display form kept, skill alias → canonical ID, date text → structured date).
  - *derived:* computed from explicit values without new information (e.g., `is_current=true` because the end text is "Present").
  - *inferred:* depends on context/convention rather than the text itself (e.g., title/company ordering decided by the section's convention vote; a summary taken from an unlabeled paragraph).
- `rule_id`, `confidence` ∈ `high` | `medium` | `low`, `ambiguity[]` (candidate alternatives with their spans), `transform_note`.

**CoverageLedger:** per-token accounting. Tokens are produced from `raw_text` after a documented normalization (case-fold, strip punctuation/bullet markers/icon glyphs). Each token is labeled: `assigned(path)`, `structural` (heading text, bullet marker, separator), `boilerplate_removed(ref)`, or `unassigned`. Totals and the unassigned list are stored.

**ExtractionReport (sidecar):** `source_meta`, `stage_log`, `order_report`, `sections[]` summary (kind, heading, confidence), `field_provenance[]` (all `FieldValue`s), `rejections[]` (value, failing check), `unassigned_content[]` (text + location), `flags[]`, `metrics {coverage, unassigned_rate, field_counts_by_method, low_confidence_count}`, `pipeline_version`, `dictionary_version`, `taxonomy_version`.

**Versioning:** dictionary, taxonomy, and rule sets are versioned data/logic; every report records the versions so that results are reproducible and regressions attributable.

---

## 4. Extraction and mapping rules

General rules for all types: extract only what the source states; missing → null/empty; never copy a default; one source span maps to one field (declared exceptions in §5.4); preserve raw alongside normalized.

### 4.1 Personal information and contact links (document-wide)
- **Scope:** scan the *entire* line set (all regions, including floating and sidebar, and link annotations), with a positional prior favoring the header block; do not restrict to the first section.
- **Name:** from the header block: the topmost, largest/boldest line that is not a contact item, not a section heading, not a job-title lexicon hit, and has a plausible 2–4-token name shape. Docling's title/section-header label is a supporting cue. Email-local-part similarity is a *weak confirmation only*. If two candidates remain, emit the best with `medium` and record the alternative; if none, null.
- **Email:** pattern + validator (single `@`, valid domain structure, trailing punctuation stripped). Collect from visible text *and* `mailto:` targets. Multiple emails: primary = first in header block; others retained in the sidecar (or the schema's multi-contact field if one exists).
- **Phone:** use a maintained phone-number parsing library (check existing dependencies first) with **India as the default region**; accept explicit country codes. Reject numbers adjacent to date/range patterns, `CGPA`/`GPA`/`%`/`Roll`/`ID` labels, or inside year ranges. Store E.164 as `normalized`, original display text as `raw`; collect `tel:` targets as supporting evidence.
- **URLs:** detect scheme-less domains too (e.g., `linkedin.com/in/x`), but do not treat dictionary tokens such as `Node.js`, `Next.js`, `ASP.NET`, or filenames as domains (check against the skills dictionary and use a TLD allowlist). Repair URLs broken across lines; strip trailing punctuation. Bind link annotations to display text ("LinkedIn", icons) via rectangle intersection: the **href is the value**, the display text is kept as `raw`/label.
- **Classification (explicit table, data-driven):**
  - `linkedin.com/in/<handle>` (any country subdomain) → LinkedIn profile; `/pub/` legacy → profile (medium); `/company/`, `/school/` → not a personal profile (sidecar).
  - `github.com/<user>` → GitHub profile; `github.com/<user>/<repo>` → repository (attach to the enclosing project entry if inside one; otherwise sidecar). Reserved GitHub paths (e.g., `orgs`, `topics`, `features`) → not a profile. `<user>.github.io` → portfolio candidate. `gist.github.com` → other link.
  - Other personal domain: portfolio **only** if it appears in the header block or beside a label such as "Portfolio/Website/Blog"; otherwise attach to the owning entry as a link.
  - Certificate-platform URLs (Credly, Coursera, etc.) → attach to the enclosing certification entry.
- **Normalization:** add `https://` if missing, lowercase the host, strip a trailing slash, keep path case and meaningful query; keep the original as `raw`. No network resolution or short-link expansion.
- **Location:** a `City, State/Country`-shaped fragment in the header block (or on the same row as contacts) validated by shape and adjacency; no geocoding; keep raw. If it cannot be validated, null.

### 4.2 Professional summary
- Only from a section classified as summary/objective/profile/about (explicit heading): the contiguous prose lines until the next heading, joined; bullets inside are preserved as bullets. Do not merge with adjacent sections.
- A paragraph in the header block with no heading is a *candidate* (`inferred`, `medium`): it goes to the sidecar, and into the canonical summary only if Phase 1 shows the legacy pipeline already did the same and the schema/consumers depend on it (record the decision).

### 4.3 Experience
- Per entry: extract **date range first** (shared date normalizer), then location, then separate the remaining header text into role-like and organization-like pieces.
- **Role-like cues:** role lexicon (engineer, developer, intern, analyst, manager, lead, consultant, associate, trainee, researcher, …) in a versioned data file. **Organization-like cues:** suffixes (Inc, Ltd, Pvt, LLC, Technologies, Solutions, Labs, University, Institute, Bank, …), all-caps/title-case proper nouns, preceded by `at`/`@`. **Separators:** `|`, `–`, `—`, ` - `, `at`, `@`, line break, parentheses. Comma is ambiguous with location and is used last.
- **Assignment procedure:** (1) exactly one role-like and one org-like piece → assign (`high` if cues agree with line order/separator; else `medium`); (2) otherwise apply the **section convention**: infer title-first vs company-first from the resume's own unambiguous entries and apply to ambiguous ones (`medium`, method `inferred`, recorded as such); (3) otherwise keep the whole headline as an unresolved `headline_raw` and leave title/company null (`low`). Employment-type tokens (Full-time, Internship, Contract) stay with the title text unless the schema has a field for them.
- **Description/bullets:** prose lines directly under the header cluster → description; bullet lines (with continuations) → bullets, in order. Multi-line bullets are one bullet.
- **Dates:** see §4.12. Never invent an end date; "Present/Current/Till date/Ongoing" → `is_current=true` with `end=null`.
- **Relationship preservation:** the entry object is the unit — title, company, dates, location, description, and bullets are bound by `entry_id`, never recomputed independently.

### 4.4 Education (in scope; build immediately after Experience reuses the E5 grammar)
- **Degree** from a degree lexicon (B.Tech/B.E./BSc/BCA/M.Tech/MSc/MBA/Bachelor of…/Master of…/Diploma/Intermediate/Class X/XII/SSC/HSC/CBSE/ICSE…), plus a specialization after `in`/parentheses. **Institution** from suffix lexicon (University, Institute, College, School, Academy, IIT/NIT/IIIT-style names) as a cue, not a requirement.
- **Grades:** `CGPA`, `GPA`, `Percentage`, `%`, `x/10`, `x/4`: store the number and the label **exactly as written**; never rescale or convert; scale only if stated.
- **Dates:** a range or a single year (expected graduation); location if present; honors/coursework lines → details, not degree.
- Table/timeline education (date column + content column) is handled by the table classifier (§5/§6 layout rules).

### 4.5 Projects
- Title = headline of the header cluster. Technology stack = (a) a labeled line (`Tech Stack`, `Technologies`, `Built with`, `Stack`, `Tools`) or (b) a trailing `|`/`–`/parenthesized list in the title line. The **raw stack text is always preserved**; recognized technologies are additionally mapped to canonical skill IDs for the skills evidence layer (§4.7); unrecognized tokens are kept.
- Links: any URL inside the entry (bound via links/text), classified (repository, demo, other) by label/URL.
- Description (prose) and bullets as in Experience. Dates are optional.

### 4.6 Certifications, achievements, awards, publications
- **Certifications:** support single-line (`Name – Issuer (Mon YYYY)`), two-line, bulleted, and table-row forms. Fields: name; issuer (after `by`/`from`/`issued by`/`–`/`|`, or a known-issuer lexicon as a *weak* cue); date; **credential ID only when labeled** (`Credential ID`, `ID`, `License No.`); URL (bound link). One certification per list item/row. Deduplicate exact repeats, recording both spans.
- **Achievements/awards:** each list item or paragraph block is one entry; indented/continuation lines attach to it; do **not** split on commas or sentences; attach date/link if present; if the section is one prose paragraph, it stays one entry.
- **Publications:** always keep the **raw citation**. Parse authors (name lists with commas/`and`, initials), title (quotes or labeled), venue (`In`, `Proceedings`, journal markers), year, DOI/URL only when the pattern matches at ≥ `medium`; otherwise leave parsed fields null and keep the raw citation.

### 4.7 Skills (dictionary + structure + provenance)
- **Dictionary (versioned data file):** per entry: canonical `id`, display name, `category`, `aliases[]`, `case_sensitive`, `ambiguity_class` (e.g., `ambiguous_requires_context`), optional `parent/ecosystem`, `source/license note`. Seed from permissible open sources (verify licenses) and from technologies already present in the repo; grow it from the *unrecognized-listed-token* report.
- **Matching:** token-boundary aware; must correctly handle `C++`, `C#`, `.NET`, `Node.js`, `Next.js`, `CI/CD`, `Java` vs `JavaScript`, version suffixes (`Python 3.11`), and parenthesized groups (`Python (NumPy, Pandas)` → Python, NumPy, Pandas).
- **Ambiguous terms** (`C`, `Go`, `R`, `Swift`, `Rust`, `Express`, `Spring`, …): accepted only when case-correct **and** in list/category context (delimited list, labeled category such as "Languages:", or adjacent to other known technologies). Outside such context they are not matched ("go to market", "C-level", "R&D", "express delivery").
- **Structure:** parse `Category: a, b, c` rows, table rows (row label = category), sub-heading groups, and comma/pipe/bullet/slash/middle-dot delimiters. Keep the **raw category label** and map to a canonical category separately.
- **Evidence tiers (provenance, in the sidecar):** `listed` (in the skills section), `project_declared` (a labeled stack line in a project/experience entry), `in_context` (named in prose). Never infer implied skills (React ≠ JavaScript).
- **Canonical skills list default:** `listed` ∪ `project_declared`. `in_context` mentions stay in the sidecar. *Verify in Phase 1* whether the existing ATS/matching read skills from this list and/or from raw text; if the canonical list changes materially compared to legacy, report the downstream diff (§9.2) and ask the user before shipping.
- **Deduplication:** one canonical entry per skill ID; all evidence spans retained; aliases collapse (`node`, `nodejs`, `Node.js` → one).
- **Unrecognized tokens** inside a skills section are **kept** as unrecognized listed skills (no canonical ID) rather than dropped, and reported for dictionary review.

### 4.8 Custom sections
- Preserve raw heading and content (text + bullets) verbatim as an ordered list of entries/lines with provenance. If the canonical schema has no place for custom sections, follow §9.3. Until then they live in the sidecar so nothing is lost silently, and the limitation is documented.

### 4.9 Languages (spoken vs programming)
- Per item decision: item ∈ spoken-language lexicon (ISO language names, including Hindi, Telugu, Urdu, Tamil, Kannada, Malayalam, Marathi, Bengali, Gujarati, Punjabi, Odia, etc.) **or** accompanied by a proficiency expression (native, fluent, professional, basic, mother tongue, A1–C2, read/write/speak) → spoken. Item ∈ skill dictionary → programming (route to skills). Mixed lists are split per item. Heading `Programming Languages`/`Languages & Frameworks` → skills. A bare "Languages" heading is decided by content majority with item-level exceptions; a tie → flag `ambiguous_languages_section` and keep items unrouted in the sidecar.

### 4.10 Location and other header details
Handled in §4.1; anything else in the header block (e.g., nationality, DOB, headline/tagline) is retained as `header_extra` in the sidecar unless the schema has a corresponding field and the rule is `explicit`.

### 4.11 Missing, ambiguous, or incorrectly extracted information
- Missing → null/empty, never a default.
- Ambiguous → keep the alternatives in the sidecar `ambiguity[]`, leave the canonical field null or in the raw field, and count it in metrics.
- Previously "guessed" legacy values: where the new pipeline deliberately returns null, list them in the migration report; do not silently restore a guess.

### 4.12 Shared normalizers
- **Dates:** parse forms such as `Jan 2023`, `January 2023`, `01/2023`, `2023-01`, `2023`, `Jun'22`, `Summer 2022`, ranges with `-`, `–`, `—`, `to`, `till`; markers `Present/Current/Now/Ongoing/Till date`. Output `{year, month?}` per endpoint + `raw` + `is_current`. Ambiguous `dd/mm` vs `mm/dd` full dates are normalized only when unambiguous; otherwise keep raw. Validate start ≤ end; a violation is a flag, not a "fix". Durations in parentheses are kept as text and not used to compute dates.
- **Normalizer rule:** a normalizer may only transform text that has a source span, must record `transform_note`, and must be deterministic.

---

## 5. Evidence-first verification system

### 5.1 What "traceable" means
Every non-null canonical value has a `FieldValue` with `spans[]` pointing to `line_id` + character offsets in `raw_text`, a `method`, a `rule_id`, and a `confidence`. A reviewer must be able to answer, for any value, *which text produced this and by which rule*.

### 5.2 Legitimate transformations
Allowed, and recorded as `normalized`/`derived`: URL scheme completion and host lowercasing; phone to E.164 (display form kept); alias → canonical skill ID; date text → structured date; whitespace/ligature/hyphenation repair; `is_current` from "Present"; grade label detection. Everything else must be `explicit` or flagged `inferred`.

### 5.3 Confidence and what goes where
- `high`: an unambiguous closed-form match (pattern + validator), or ≥ 2 independent cues agree.
- `medium`: one strong cue and no conflicting cue.
- `low`: weak or conflicting cues.
- **Canonical resume receives `high` and `medium` values of method `explicit`/`normalized`/`derived`.** `inferred` values go to canonical only when the legacy pipeline already populated that field the same way *and* the schema/consumers depend on it (record the decision), and are always labeled in the sidecar. `low` values are never in canonical fields: they go to the raw/unresolved field or the sidecar.
- Medium-confidence assignments are counted and reported; their share is a tracked quality metric.

### 5.4 Verification checks in V7
1. **Grounding check:** every output string must be a substring of its span text after the *documented* normalization (whitespace, case, ligatures, hyphenation, icon glyph removal). Exceptions are only the §5.2 transformations, each checked by its own validator against the span. Failure → null + `rejection` record. This is the primary hallucination guard; it is a **hard gate**, not a metric to optimize.
2. **Exclusivity check:** a span may support one field of one entry. Declared exceptions: a technology appearing in both a skills list and a project stack (two evidence records, one canonical ID); a URL displayed once but classified once.
3. **Field validators (wrong-field guard):** each field type has a validator — email grammar; phone digit/country-code rules; URL host/path class; date parseability; "company" must not parse as a date, phone, URL, or bullet; "title" must not equal an organization-only string; grades must contain a number; skills must not be sentence-length. Failure → reclassify as unresolved, not forced.
4. **Coverage check:** ledger totals: `assigned + structural + boilerplate_removed + unassigned == total`. The **unassigned content** list is stored in the sidecar. `unassigned_rate` is a tracked metric. Silent loss is defined as source tokens missing from all four buckets and must be **zero**.
5. **Consistency checks:** start ≤ end; entry counts per section match header-cluster counts; no entry without a header cluster; duplicate entries flagged.

### 5.5 Failure behavior
V7 never throws on a data problem; it nulls/flags and continues. A V7 *code* exception is caught at the pipeline boundary (§1).

### 5.6 Compatibility
The sidecar is separate from the canonical schema (§9.3). Downstream consumers read the canonical resume only.

---

## 6. Handling difficult layouts (consolidated)

| Situation | Mechanism | Stage |
|---|---|---|
| Two-column / sidebar | Column detection, region assignment, per-region sectioning, order validated and re-sorted only if it measurably improves structure | O3, S4 |
| Whole resume inside a layout table (DOCX templates) | Classify the table: layout table → unwrap cells in column order; skills table → row label = category; timeline table → row = entry | L2, O3, E5 |
| Floating contact header / text boxes | Document-wide contact scan; floating text kept as `floating` region lines flagged `position_unknown` | C1, F6 |
| Icons instead of labels | Strip glyphs from values, keep in `raw_text`; classify by pattern | L2, F6 |
| Hyperlinks shown as "LinkedIn"/icon | Bind annotation/relationship href to the line; href is the value | C1, L2, F6 |
| Dates/locations on a separate line or right-aligned | Pair by y-position or table cell; boundary rules in E5 | E5 |
| Page break inside an entry | Continuation rule + boilerplate removal | L2, E5 |
| Unusual headings | Taxonomy + fuzzy match; otherwise a preserved custom section | S4 |
| Content before first heading | Implicit header block | S4 |
| Entries with no separators | Repeated header-cluster pattern | E5 |
| Scanned / image-only | OCR path flagged `source_quality=low`; nothing fabricated; reported as its own stratum | C1 |
| Skills by category / tables | Structural skills parser | F6 |

---

## 7. Implementation phases (Antigravity executes sequentially)

General per-phase protocol: work in small commits; run the full relevant test set at the end of each phase; write a phase report (what changed, commands run, results, open issues) to a progress log in the repo's docs or notes location (follow existing convention); do **not** start the next phase until the gate passes, except where noted.

### Phase 1 — Audit the current implementation and establish a baseline
**Tasks**
- Map the upload → structured-resume path: entry points, Docling invocation/config, section detection, structured mapping, normalization, the canonical schema, persistence, frontend consumption.
- Record versions: Docling and its backends; runtime; package lockfiles.
- Determine: does the structured Docling document reach the mapper or is it flattened? Are hyperlinks preserved? What does the schema allow (raw/unresolved fields, custom sections, credential IDs, multiple contacts)? Which fields do ATS, matching, and the builder actually read?
- Inventory existing tests, fixtures, and how to run unit, integration, typecheck, and build commands. Run them all **before any change** and record results.
- **Corpus:** collect available resumes (previously tested resumes and the Sathvik Goud resume if accessible). Store them *outside* the repo (or in a git-ignored, access-controlled location), anonymize where needed, and **freeze a holdout set now** before any rule is tuned. Stratify by layout and format. Report the count per stratum honestly; if the corpus is small, say so.
- **Downstream snapshots:** for each corpus resume, record the *current* canonical output, ATS result, matching result, and Resume Builder load state, as the regression baseline.
- **Baseline extraction metrics** for the current pipeline (§8.3 definitions) and baseline latency (p50/p95).

**Likely modules to inspect (by responsibility):** upload/route handler; document conversion service/wrapper; section detection; resume mapper; normalizer; schema/type definitions; resume persistence model; ATS analysis; matching/relevance gating; builder load/save; test directories.

**Dependencies:** none.
**Acceptance (gate):** a written baseline report containing the pipeline map, versions, schema capabilities, pass/fail of existing tests, corpus inventory by stratum, frozen holdout, downstream snapshots, and baseline metrics.
**Tests before proceeding:** all existing tests, typecheck, and build run and recorded (failures that pre-exist are documented, not "fixed" silently).

### Phase 2 — Attribute each confirmed defect to its earliest incorrect stage
**Tasks**
- For each corpus resume, compare: source file → Docling raw output (text, labels, boxes, links) → sections → entries → mapped fields → canonical → UI. Label every error with the **first stage where the correct value became unrecoverable** (S0 source lacks it; C1 conversion; L2/O3 order/segmentation; S4 section; E5 entry; F6 mapping; V7/A8 normalization/adapter; P9 persistence/UI).
- Produce a **defect register**: ID, resume, field, expected vs actual, evidence (excerpt reference), first bad stage, proposed fix location, severity.
- Produce a Pareto of errors by stage; order fixes by it, earliest stage first.

**Dependencies:** Phase 1.
**Acceptance:** every observed error has a stage label and evidence; no defect is "fixed" yet. The register is the basis for regression tests.
**Tests:** none new; the register must be reviewable and reproducible (commands to regenerate stage snapshots are saved).

### Phase 3 — Preserve Docling's structured representation where needed
**Tasks**
- If the pipeline flattens early, change the conversion boundary so the `DoclingDocument` (labels, provenance, tables, links) is retained and passed on, **while leaving the existing output unchanged** (the legacy mapper continues to run on what it consumes today).
- Implement source supplements: PDF link annotations; DOCX hyperlinks, text boxes, headers/footers, tables. Verify per format what is lost, with before/after evidence.
- Flag scanned/low-text pages (`ocr_required`), and check the configured OCR behavior.
- Add a debug-only way to dump stage snapshots for a resume (not enabled in production; no PII in logs).

**Dependencies:** Phase 2 identifies which C1 defects exist.
**Acceptance:** for each C1 defect in the register, the supplement recovers the information (evidence shown), or the blocker is documented with the measurement required for the Docling-evidence standard (§2/C1).
**Tests:** existing tests unchanged and passing; new tests for link binding (visible text vs href), DOCX hyperlinks/text boxes, scanned flagging, and a test proving legacy output is byte-for-byte unchanged when the new path is off.

### Phase 4 — Implement the intermediate representation
**Tasks**
- Implement Line IR, regions, the coverage-ledger skeleton, and the ExtractionReport structure (§3).
- Implement L2 (line construction, link binding, soft-wrap/hyphen repair, glyph stripping, boilerplate removal) and O3 (column detection, order checks, guarded re-sort, region assignment).
- Add the **feature flag** and the **shadow-run harness**: new pipeline runs alongside legacy, both outputs stored for comparison, no user-visible change.

**Dependencies:** Phase 3.
**Acceptance:** IR builds for every corpus resume without exceptions; `raw_text` reconstructs the source text content; order-report flags match manual inspection on the multi-column samples; legacy path unchanged with the flag off.
**Tests:** unit tests for line construction; golden IR snapshots for representative layouts; order-validation tests (single-column must *not* be re-sorted; two-column must be); boilerplate-removal tests including a page-break case; a property test that every `Line` maps back to a source item.

### Phase 5 — Section detection and entry grouping
**Tasks**
- Implement S4 with the versioned taxonomy, score-based heading detection, custom-section preservation, header block, sub-headings.
- Implement E5 with the shared entry grammar: header clusters, right-aligned date pairing, bullet continuation, page-break continuation, uncertain-grouping behavior.
- Table classification (layout/skills/timeline).

**Dependencies:** Phase 4.
**Acceptance:** on the labeled corpus, section assignment accuracy and entry-grouping accuracy are measured and recorded versus baseline; no stratum regresses; every unclassified heading is preserved as a custom section; no entry spans two roles in labeled samples (or is flagged `grouping_uncertain`).
**Tests:** heading-detection tests incl. false-positive (bold company name) and false-negative (unusual heading) cases; entry-grouping tests for: dates on a separate line, right-aligned dates, unseparated entries, multi-bullet entries, an entry split by a page break, sidebar-vs-main separation; custom-section preservation tests.

### Phase 6 — Complete field-specific mapping
**Tasks**
- Implement F6 mapping and normalization for summary, experience, education, projects, certifications, achievements/awards, publications, languages, custom sections per §4, including the shared date normalizer and raw/unresolved fallbacks.

**Dependencies:** Phase 5.
**Acceptance:** per-type field accuracy measured and recorded versus baseline on the tuning corpus; ambiguous title/company cases produce raw-headline + flags (not guesses); no content is attached to a neighbor entry in the labeled samples.
**Tests:** table-driven tests for each field rule (title/company orderings and separators; date forms incl. "Present", partial dates, ambiguous numeric dates; degree/grade formats; certification one-line/two-line/table forms with credential IDs; publication citation parsing with raw fallback; achievements not split on commas); regression tests for each register defect assigned to these stages.

### Phase 7 — Contact information and dictionary-based skills
(May be developed in parallel after Phase 4, but is gated here.)
**Tasks**
- Implement §4.1 (contacts, links, classification table, phone library with default region, URL repair/normalization) and §4.7 (dictionary data file, alias handling, ambiguous-term context rules, structure parsing, tiers, deduplication, unrecognized listed tokens) and §4.9 (spoken vs programming).
- Build the dictionary-review report (unrecognized listed tokens) as a developer tool.

**Dependencies:** Phase 4 for IR; Phase 5 for section context (skills structure).
**Acceptance:** contact/skills metrics at or above the provisional thresholds (§8.4) or documented gap with evidence; ambiguity suite passes.
**Tests:** unit tests per classification row (LinkedIn profile vs company page; GitHub profile vs repo vs reserved path; `github.io`; scheme-less URLs; line-broken URLs; href-vs-display text); phone tests (India default, +country codes, rejection near dates/CGPA/year ranges); email edge cases; skills tests for `C++`/`C#`/`.NET`/`Node.js`, `Java` vs `JavaScript`, `Go`/`C`/`R` in and out of context, duplicates/aliases, category rows, parenthesized groups, project-declared vs in-context; spoken-vs-programming tests.

### Phase 8 — Verification, provenance, and unassigned-content tracking
**Tasks**
- Implement V7: grounding, exclusivity, field validators, coverage ledger, consistency checks; populate provenance for every value; build the rejection log and metrics.
- Property tests asserting invariants over the whole corpus.

**Dependencies:** Phases 6–7.
**Acceptance:** **grounding violations in canonical output = 0** over the corpus (by construction and measured); **silent loss = 0** (every token accounted for); unassigned rate and rejection rates measured and recorded; each rejection traceable to a rule.
**Tests:** deliberately corrupted-value tests proving the gate rejects ungrounded values; a "poisoned" mapper test (a rule that emits a value not in the source must be caught by V7); ledger arithmetic tests; exclusivity tests; wrong-field tests (e.g., date emitted as company is rejected).

### Phase 9 — Integrate through the canonical schema
**Tasks**
- Implement A8: map to the existing schema (additive only), write the sidecar to its additive storage (§9.3), keep the legacy path as fallback behind the flag.
- Contract tests asserting canonical output shape equals what downstream consumers read.
- Run **shadow mode** over the corpus and real uploads (if available) and produce the diff report: fields changed, null-where-legacy-guessed list, downstream ATS/matching snapshot differences.
- Verify the actual upload flow in the app: PDF and DOCX upload → parsed data displayed correctly in the analysis-first UI → saved → reopened → loaded into Resume Builder → template render → export.

**Dependencies:** Phase 8.
**Acceptance:** with the flag on, existing tests, typecheck, and build pass; all downstream differences are explained by corrected extraction (reviewed and documented); the end-to-end upload works for PDF and DOCX; with the flag off, behavior equals the baseline snapshots.
**Tests:** adapter contract tests; API-contract tests; persistence round-trip tests; end-to-end upload tests (real PDF and DOCX); builder load/save/export smoke tests; snapshot comparison of ATS/matching outputs before vs after (formulas untouched, inputs may legitimately differ).

### Phase 10 — Regression tests and real-resume validation
**Tasks**
- Convert every defect in the register into a permanent regression test.
- Build the metamorphic test suite (same content in different layouts / reordered sections / heading synonyms / inserted page breaks → identical structured output).
- Run the full metrics report on the tuning set, and on the **frozen holdout** (once per phase gate; never tune on it).
- Report results per field and per layout stratum, with counts.

**Dependencies:** Phase 9.
**Acceptance:** thresholds in §8.4 met in every stratum with enough samples, or exact shortfalls documented; no regression versus baseline in any stratum; the regression suite is in CI.
**Tests:** the full suite: unit, integration, regression, metamorphic, end-to-end.

### Phase 11 — Resolve remaining failures and verify the complete application
**Tasks**
- Use the stage-attribution Pareto to fix remaining failures at their earliest stage, adding a test for each.
- **Fresh batch:** obtain ≥ 30 *unseen* resumes (if obtainable) and measure with no code changes.
- Final full-application verification: all existing test suites, typecheck, build, the E2E upload flows, ATS/matching snapshot comparison, builder/export checks.
- Write the final report (§10.3). Decide the flag rollout recommendation (keep in shadow, enable for new uploads, or default on) and present it to the user; do not default-enable without the user's decision.

**Dependencies:** Phase 10.
**Acceptance:** §8.5 definition of done.
**Tests:** everything above, re-run clean.

---

## 8. Validation and completion criteria

### 8.1 Corpus
- Strata (report per stratum and overall): single-column; two-column/sidebar; table-based; scanned/image-only; designer-exported (Canva etc.); Word-exported DOCX; LaTeX; fresher vs experienced; Indian vs international formats.
- Ground truth: field-level labels with an annotation guide written *first* (including skill-tier and entry-boundary definitions). Two annotators on an overlapping subset; compute agreement; adjudicate. Labels are created from the source file, not from pipeline output.
- Splits: **tuning set** (used for development) and **frozen holdout** (created in Phase 1; evaluated at phase gates only; if it is used for tuning it is "burned" and a new holdout must be drawn). A **fresh unseen batch** is evaluated once in Phase 11.
- If real resumes are few: report exact counts and confidence intervals; do not present strata with very small N as statistically established; synthetic layout variants may *supplement* but are labeled synthetic and never counted as real-resume validation.
- Privacy: raw resumes are not committed; fixtures in the repo are synthetic or anonymized.

### 8.2 Stage attribution
Every error in every evaluation run carries a first-bad-stage label (taxonomy in Phase 2). The evaluation report includes the per-stage Pareto and the list of errors with no stage label (must be zero).

### 8.3 Metric definitions
- **Field-level precision/recall/F1:** a predicted value is correct if it equals the gold value after the same normalization. Scalar fields: per-resume match. List fields (emails, phones, skills): set-level on canonical IDs. Report per field and per stratum.
- **URL-type accuracy:** share of URLs assigned the correct class (LinkedIn profile, GitHub profile, repository, portfolio, other).
- **Entry-grouping accuracy:** (a) entry-boundary F1 per section type; (b) **bullet-assignment accuracy** = bullets attached to the correct entry ÷ total bullets; (c) entries with merged or split content are counted as errors.
- **Section-assignment accuracy:** correct section kind (or correct custom preservation) ÷ gold sections.
- **Wrong-field rate:** values that are present in the source and emitted, but under the wrong field/entry ÷ total emitted values.
- **Hallucination rate:** emitted canonical values without a grounded source span ÷ total emitted values (should be zero by construction; measured independently of the V7 gate by a separate evaluator script that does not reuse V7 code).
- **Content coverage:** `1 − unassigned_tokens ÷ total_tokens` per resume; **silent-loss count:** tokens in none of the ledger buckets (must be zero).
- **Unassigned-content rate:** unassigned tokens ÷ total tokens; examine the content, not just the rate.
- **Latency:** p50/p95 of the full pipeline versus the baseline; budget for added post-Docling processing set after the baseline is measured (propose a small fraction of Docling's time; confirm after measuring).

### 8.4 Thresholds
Provisional until the Phase 1 baseline exists; **recalibrate with the user after the baseline, then freeze.** Never present these as achieved.

| Metric | Provisional target |
|---|---|
| Hallucination rate (canonical) | 0 (hard gate) |
| Silent loss (tokens in no ledger bucket) | 0 (hard gate) |
| Wrong-field rate | ≤ 1% |
| Email P / R | ≥ 99.5% / ≥ 98% |
| Phone P / R | ≥ 98% / ≥ 95% |
| URL-type accuracy | ≥ 98% |
| Listed-skill P / R | ≥ 95% / ≥ 90% |
| Ambiguous-term precision (adversarial set) | ≥ 95% |
| Entry-grouping accuracy (single-column) | ≥ 95% |
| Entry-grouping accuracy (complex layouts) | ≥ 90% |
| Experience title/company/date field accuracy | ≥ 92% |
| Unassigned-content rate | set relative to baseline; must decrease or stay equal with explained content |
| Regression | no stratum worse than baseline on any metric |
| Scanned stratum | judged on no-hallucination + correct flagging, not on the same recall |

### 8.5 Definition of done
All of the following, each with recorded evidence (commands and outputs):
1. Phases 1–11 completed and phase reports exist.
2. Existing unit/integration tests, new regression tests, typecheck, and build pass.
3. Every defect in the register is fixed with a regression test, or documented with exact blocker, evidence, and remaining work.
4. Holdout and tuning-set metrics meet §8.4 in every stratum with sufficient samples; shortfalls are documented.
5. A fresh batch (≥ 30 unseen resumes if obtainable) meets the thresholds **without any code change** during that evaluation.
6. Metamorphic tests pass.
7. Hallucination = 0 and silent loss = 0 on the corpus.
8. Shadow-mode diffs on ATS/matching/builder are all explained as corrections; formulas and logic are unchanged (verified by a diff of those modules showing no change).
9. End-to-end PDF and DOCX upload verified in the running app: correct display, save, reload, builder load, template render, export.
10. A known-limitations section lists what is not solved (e.g., scanned quality, custom-section rendering in the builder, ambiguous title/company cases) with evidence.
11. No claim of "100% accuracy" anywhere.

---

## 9. Integration safeguards

### 9.1 Protected surfaces
Do not modify the logic or formulas of: ATS scoring (six pillars), competitive matching and relevance gating, improvement recommendations, analysis-first UI flow, Resume Builder editing/templates/export. If a necessary change touches a protected module, stop and ask the user. Final verification includes a diff showing these modules unchanged (or listing the exact approved change).

### 9.2 Behavioral change control
- **Feature flag + shadow mode** (Phase 4/9): legacy remains the default until the user approves rollout.
- **Downstream snapshots** (Phase 1) are compared with the new pipeline's results (Phase 9/11). More accurate input may change scores; every difference must be explained by a corrected extraction (e.g., skills no longer inferred from prose, a corrected date range). Unexplained differences block the phase.
- **Performance:** measure against baseline latency; do not add heavy dependencies without need; reuse existing libraries first (date parsing, phone parsing, PDF utilities); justify and record any new dependency and its license.

### 9.3 Data and schema changes
- **Additive, non-destructive only.** No dropping/renaming columns or fields; no data rewrites; no re-parsing of existing saved resumes.
- Sidecar storage: a nullable additive column/JSON or a separate table keyed by resume ID, chosen after inspecting the data layer, with the same access control and deletion lifecycle as the resume record.
- If custom sections, credential IDs, raw headline, or multi-contact fields require a canonical-schema extension: first prove (by reading the builder, templates, exporter, and API validators and by running them with extended data) that unknown additive fields are ignored or rendered safely; then **ask the user to approve**. If proof is not possible, keep that content in the sidecar and document the limitation.
- API contracts: existing request/response shapes unchanged; new data only in additive optional fields, if at all.

### 9.4 Privacy and logging
No resume text or PII in logs, test names, commit messages, or fixtures committed to the repo. The sidecar is sensitive. Corpus files stay outside version control.

### 9.5 Determinism and rollback
The pipeline is deterministic (no randomness; versioned dictionary/taxonomy). Rollback = turn the flag off; legacy path remains until the user explicitly approves removal.

---

## 10. Instructions for Antigravity — proceed through all phases

### 10.1 Operating protocol
1. **Start with Phase 1.** Inspect the real repository; determine actual file names and module boundaries; do not rely on any path or name in this document.
2. Run the existing tests, typecheck, and build **before changing anything**, and record results as the baseline.
3. Work **one phase at a time** and, within a phase, **one defect at a time**: identify the earliest incorrect stage → fix it there → add a regression test → run the relevant tests → continue.
4. **Do not stop after producing a plan or after one field category.** Continue through Phase 11 until all in-scope defects are addressed and the available validation passes.
5. Do not mark a phase complete unless its acceptance criteria and tests have actually passed. Record the command run and its result for each claim.
6. Never claim real-resume validation if only synthetic fixtures were tested; state which samples were real and which were synthetic.
7. Keep commits small and scoped to the phase; do not touch unrelated services; no destructive database operations; no force-pushes.
8. If this specification contradicts what the code shows, prefer the smallest change that satisfies the guarantees in §0, and document the deviation and its reason in the phase report.

### 10.2 When to stop and ask the user
Only for: (a) a canonical-schema or database change (§9.3); (b) any change to a protected surface (§9.1); (c) a material ATS/matching diff that is not clearly a correction (§9.2); (d) introducing a heavy new dependency; (e) evidence that Docling itself is the bottleneck and replacement should be evaluated; (f) corpus access/privacy decisions; (g) recalibrating thresholds after the baseline; (h) rollout of the flag to default-on. For blockers, document exact blocker + evidence + remaining work, and **continue with any phase work that does not depend on the blocked decision.**

### 10.3 Reporting format (after each phase and at the end)
- What changed (modules by responsibility, not just filenames).
- Commands run and their results (tests, typecheck, build, E2E).
- Metrics versus baseline, per stratum, with sample counts; labeled real vs synthetic.
- Defects fixed (register IDs) and defects remaining with exact blockers.
- Downstream diff summary (ATS/matching/builder).
- Known limitations and risks.
- The next phase and its readiness.

**Final report** additionally includes: the complete defect register with status, the final metrics tables (tuning, holdout, fresh batch), the end-to-end validation results, the rollout recommendation, and the explicit list of what remains unsolved. It must not state or imply perfect accuracy.
