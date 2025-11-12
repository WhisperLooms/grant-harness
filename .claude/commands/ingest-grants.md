# Ingest Grant Documents

**Purpose**: Parse existing grant research and upload grant PDFs to Gemini Grant Corpus

**Week 1 Task**: Days 3-4
**Consolidates**: g01 (lists), g02 (docs), g03 (upload)

---

## Task

Ingest grant documents from existing EMEW grant research:

1. **Parse** `Grants_Summary_2025-10-29.md` to extract 8-10 priority grants
2. **Download** grant PDFs from identified URLs
3. **Store** in `.inputs/grants/{jurisdiction}/{grant-name}/`
4. **Upload** to Gemini Grant Corpus with metadata
5. **(Optional)** Add market research documents

## Implementation

### Step 1: Parse Grant Summary

```python
# Read the grant summary markdown
with open(".docs/context/emew-context/grant-search/Grants_Summary_2025-10-29.md") as f:
    content = f.read()

# Extract grant URLs manually or via parser
# Priority grants from summary:
grants = [
    {"id": "bbi", "name": "Battery Breakthrough Initiative", "url": "https://arena.gov.au/funding/battery-breakthrough-initiative/", "jurisdiction": "federal"},
    {"id": "igp", "name": "Industry Growth Program", "url": "https://business.gov.au/grants-and-programs/industry-growth-program", "jurisdiction": "federal"},
    {"id": "vma", "name": "Victorian Market Accelerator", "url": "https://www.sustainability.vic.gov.au/grants", "jurisdiction": "state-vic"},
    # ... add remaining grants from summary
]
```

### Step 2: Download Grant PDFs

```bash
# Create grant directories
mkdir -p .inputs/grants/federal/battery-breakthrough
mkdir -p .inputs/grants/federal/industry-growth-program
mkdir -p .inputs/grants/state-vic/victorian-market-accelerator

# Download grant guidelines PDFs (manual or via script)
# Save as: .inputs/grants/{jurisdiction}/{grant-name}/guidelines.pdf
```

### Step 3: Upload to Gemini

```python
from gemini_store import CorpusManager
from pathlib import Path

manager = CorpusManager()

# Upload Battery Breakthrough Initiative
manager.grant_corpus.upload_document(
    ".inputs/grants/federal/battery-breakthrough/guidelines.pdf",
    metadata={
        "grant_id": "bbi-2025",
        "grant_name": "Battery Breakthrough Initiative",
        "jurisdiction": "federal",
        "funding_min": 100000,
        "funding_max": 30000000,
        "deadline_date": "2026-06-30",
        "industry": "battery-recycling"
    }
)

# Upload Industry Growth Program
manager.grant_corpus.upload_document(
    ".inputs/grants/federal/industry-growth-program/guidelines.pdf",
    metadata={
        "grant_id": "igp-2025",
        "grant_name": "Industry Growth Program",
        "jurisdiction": "federal",
        "funding_min": 100000,
        "funding_max": 5000000,
        "deadline_date": "2026-03-31",
        "industry": "manufacturing"
    }
)

# Repeat for remaining 6-8 grants from summary

print("✅ All grants uploaded to Grant Corpus!")
```

### Step 4: Add Market Research (Optional - ADR-2054)

```python
# Upload market research documents to Grant Corpus
manager.grant_corpus.upload_document(
    ".inputs/grants/market-research/battery-recycling-market-australia-2024.pdf",
    metadata={
        "document_type": "market",
        "industry": "battery-recycling",
        "geography": "australia",
        "year": 2024,
        "report_type": "market_size"
    }
)
```

### Step 5: Verify Upload

```python
# Query to verify grants are accessible
result = manager.query_grants(
    "Which grants fund battery recycling projects in Australia?",
    metadata_filter="industry=battery-recycling"
)

print(result)
```

## Metadata Schema

```python
# Grant documents
{
    "grant_id": "igp-2025",
    "grant_name": "Industry Growth Program",
    "jurisdiction": "federal | state-vic | state-nsw | state-qld",
    "funding_min": 100000,
    "funding_max": 5000000,
    "deadline_date": "2026-03-31",
    "industry": "battery-recycling | manufacturing | renewable-energy"
}

# Market research (per ADR-2054)
{
    "document_type": "market",
    "industry": "battery-recycling",
    "geography": "australia | vic | nsw",
    "year": 2024,
    "report_type": "market_size | competitive_analysis"
}
```

## Success Criteria

- ✅ 8-10 grant PDFs uploaded to Grant Corpus
- ✅ Grants tagged with metadata (grant_id, jurisdiction, funding_range, deadline)
- ✅ Query test returns relevant grants
- ✅ Ready for `/match-company` command

## Related

- **ADR-2051**: Dual-Corpus Architecture
- **ADR-2053**: EMEW Bootstrap Strategy
- **ADR-2054**: Project & Market Data Management
- **Issue #1**: Grant & Company Ingestion (Week 1)
- **Next command**: `/match-company`
