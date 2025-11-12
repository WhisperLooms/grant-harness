# Ingest Company Documents

**Purpose**: Upload company corporate documents and project files to Gemini Company Corpus

**Week 1 Task**: Days 1-2
**Consolidates**: c01 (scrape), c02 (profile), c04 (docs upload)

---

## Task

Ingest EMEW corporate documents into Gemini Company Corpus:

1. **Migrate PDFs** from `.docs/context/emew-context/corporate-info/` to `.inputs/companies/c-emew/corporate/`
2. **Upload to Gemini** Company Corpus with metadata tagging
3. **Scrape website** (optional): https://emew.com.au for additional context
4. **Generate profile**: Create `emew_profile.json` summary

## Implementation

### Step 1: Migrate Documents

```bash
# Copy EMEW corporate docs to .inputs/
cp .docs/context/emew-context/corporate-info/*.pdf .inputs/companies/c-emew/corporate/

# Verify files copied
ls -1 .inputs/companies/c-emew/corporate/
```

### Step 2: Upload to Gemini

```python
from gemini_store import CorpusManager

manager = CorpusManager()

# Upload each corporate document
import os
from pathlib import Path

corp_dir = Path(".inputs/companies/c-emew/corporate/")
for pdf_file in corp_dir.glob("*.pdf"):
    print(f"Uploading {pdf_file.name}...")

    manager.company_corpus.upload_document(
        str(pdf_file),
        company_id="emew",
        metadata={
            "document_type": "corporate",
            "category": "business_plan",  # or "financial_report", "capabilities"
            "year": 2024
        }
    )

print("✅ All EMEW corporate docs uploaded!")
```

### Step 3: Add Project Documents (Optional)

```python
# If you have project-specific documents
manager.company_corpus.upload_document(
    ".inputs/companies/c-emew/project/battery-recycling-expansion.pdf",
    company_id="emew",
    metadata={
        "document_type": "project",
        "project_id": "battery-recycling-expansion",
        "project_name": "EMEW Battery Recycling Expansion",
        "industry": "battery-recycling",
        "year": 2025
    }
)
```

### Step 4: Verify Upload

```python
# Query to verify documents are accessible
result = manager.query_company(
    "emew",
    "Summarize EMEW's core capabilities and business model in 3 sentences."
)

print(result)
```

## Metadata Schema

```python
# Corporate documents
{
    "company_id": "emew",
    "document_type": "corporate",
    "category": "business_plan | financial_report | capabilities",
    "year": 2024
}

# Project documents (per ADR-2054)
{
    "company_id": "emew",
    "document_type": "project",
    "project_id": "battery-recycling-expansion",
    "industry": "battery-recycling",
    "year": 2025
}
```

## Success Criteria

- ✅ All EMEW corporate PDFs uploaded to Company Corpus
- ✅ Documents tagged with `company_id=emew`
- ✅ Query test returns relevant company information
- ✅ Ready for `/match-company` command

## Related

- **ADR-2051**: Dual-Corpus Architecture
- **ADR-2054**: Project & Market Data Management
- **Issue #1**: Grant & Company Ingestion (Week 1)
- **Next command**: `/ingest-grants`
