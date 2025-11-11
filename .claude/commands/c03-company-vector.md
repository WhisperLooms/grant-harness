---
description: Create company vector database for grant application drafting
---

# C03: Create Company Vector Database

Build a vector database from company documents to assist in grant application drafting.

## Usage

`/c03-company-vector <company-id> [--include-docs dir1,dir2]`

## Tasks

1. **Load Company Profile**: Read from `/c02-company-profile` output

2. **Collect Company Documents**:
   - Website content from `/c01-company-scrape`
   - Optional: User-provided docs (annual reports, case studies, certifications)

3. **Upload to Gemini File Search**:
   - Create company-specific corpus
   - Upload all documents
   - Index for semantic search

4. **Test Query**: Verify retrieval with test question: "What are the company's R&D capabilities?"

5. **Save Index**: `.outputs/c03-company-vector/{company_id}_vector_index.json`

## Use Cases

- Auto-populate grant applications (P-series commands)
- Answer eligibility questions
- Extract project descriptions
- Generate supporting evidence

## Implementation

- `back/grant-prototype/gemini_store/company_vector_store.py`

## Next Steps

Run `/m01-match-grants` to match company to relevant grants.
