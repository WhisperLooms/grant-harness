# Issue #1: Grant & Company Ingestion (Week 1)

**Issue Link**: https://github.com/WhisperLooms/grant-harness/issues/1

**Created**: 2025-11-12
**Status**: In Progress

---

## Strategic Context

**Epic/Tier**: Phase 1 - Week 1 (EMEW Bootstrap)
**Priority**: 🔴 NEXT (Critical path for entire project)
**Dependencies**:
- ADR-2050 (crawl4ai for scraping) - Accepted
- ADR-2051 (Dual-Corpus Architecture) - Accepted
- ADR-2052 (Input Data Management) - Accepted
- ADR-2053 (EMEW Bootstrap Strategy) - Accepted
- GOOGLE_API_KEY environment variable configured

**Blocks**:
- Issue #2: Application Form Replication (Week 2)
- Issue #3: AI-Powered Population (Week 3)
- Issue #4: Collaboration & Export (Week 4)

**Strategic Importance**: This is the foundation for the entire Phase 1 prototype. Without successful grant and company data ingestion, the application-first strategy (ADR-0003) cannot be validated.

---

## Layer

**Layer**: Backend (Grant Prototype)
**Workflow Reference**: `.cursor/rules/backend/grant-prototype/ADR.mdc`

---

## Routing Plan

**Complexity**: Medium (requires Gemini API integration, file management, data migration)

**Agent Routing**: Not required - this is straightforward backend implementation suitable for direct execution.

**Key Components**:
1. Gemini File Search API integration
2. Dual-corpus management (Grant + Company)
3. File migration and organization
4. Document upload and metadata tracking

---

## ADR Reference

**No new ADR required** - This is implementation of existing ADRs:
- ADR-2051: Gemini Dual-Corpus Architecture
- ADR-2052: Input Data Management Pattern
- ADR-2053: EMEW Bootstrap Strategy
- ADR-2054: Project & Market Data Management

All architectural decisions already documented. This issue is pure implementation.

---

## Testing Strategy

**Test Framework**: pytest
**Test Mode**: Integration + Smoke

### Test Commands

```bash
# Backend smoke tests
cd back/grant-prototype
set GOOGLE_API_KEY=<your-key>
pytest tests/test_gemini_store.py -v

# Integration tests
pytest tests/integration/test_week1_ingestion.py -v
```

### Pass Criteria

1. ✅ Gemini File Search initialized with dual corpora
2. ✅ EMEW corporate documents uploaded to Company Corpus
3. ✅ 8-10 grants uploaded to Grant Corpus
4. ✅ Semantic queries return relevant results
5. ✅ Metadata tracking files created

### Evidence Locations

- `back/grant-prototype/.inputs/.gemini_config.json` - Corpus IDs
- `back/grant-prototype/.inputs/companies/c-emew/vector-db/` - Company upload metadata
- `back/grant-prototype/.inputs/grants/*/vector-db/` - Grant upload metadata
- `back/grant-prototype/tests/output/` - Test results
- Scratchpad: Test execution logs

---

## Implementation Plan

### Prerequisites: Verify API Key

```bash
# Check environment variable
echo $GOOGLE_API_KEY
```

If not set, configure in `.env`:
```env
GOOGLE_API_KEY=your_key_here
```

### Task 1: Initialize Gemini File Search (Day 1)

**Goal**: Create dual-corpus infrastructure (Grant + Company corpora)

**Files to Create/Modify**:
- `back/grant-prototype/gemini_store/corpus_manager.py` (already exists)
- `back/grant-prototype/gemini_store/grant_corpus.py` (already exists)
- `back/grant-prototype/gemini_store/company_corpus.py` (already exists)
- `back/grant-prototype/.inputs/.gemini_config.json` (NEW - stores corpus IDs)

**Implementation**:
```python
# Test corpus manager initialization
from gemini_store import CorpusManager

manager = CorpusManager()
print(manager.health_check())
# Expected: {'api_key': 'valid', 'grant_corpus': 'ok', 'company_corpus': 'ok'}
```

**Success Criteria**:
- ✅ Two separate Gemini File Search stores created
- ✅ Corpus IDs saved to `.inputs/.gemini_config.json`
- ✅ Health check passes

### Task 2: Migrate EMEW Corporate Documents (Day 1-2)

**Goal**: Move EMEW PDFs from `.docs/context/` to `.inputs/companies/c-emew/corporate/`

**Source**:
```
.docs/context/emew-context/corporate-info/
└── emew General Presentation 2024-11-20 V13.pdf (2.3 MB)
```

**Destination**:
```
back/grant-prototype/.inputs/companies/c-emew/
├── corporate/
│   └── emew-general-presentation-2024.pdf
├── profile/
│   └── emew-website-scrape.json (to be created)
└── vector-db/
    └── corpus-metadata.json (to be created)
```

**Commands**:
```bash
cd back/grant-prototype
cp ../../.docs/context/emew-context/corporate-info/emew\ General\ Presentation\ 2024-11-20\ V13.pdf .inputs/companies/c-emew/corporate/emew-general-presentation-2024.pdf
```

**Success Criteria**:
- ✅ PDF copied to `.inputs/companies/c-emew/corporate/`
- ✅ File readable and valid PDF

### Task 3: Scrape EMEW Website (Day 2)

**Goal**: Extract additional context from https://emew.com.au

**Implementation**:
```python
# Using crawl4ai (ADR-2050)
from scrapers.company_scraper import CompanyScraper

scraper = CompanyScraper()
result = await scraper.scrape_website("https://emew.com.au", company_id="emew")

# Save to .inputs/companies/c-emew/profile/
with open(".inputs/companies/c-emew/profile/emew-website-scrape.json", "w") as f:
    json.dump(result, f, indent=2)
```

**Success Criteria**:
- ✅ Website scraped successfully
- ✅ JSON saved to `.inputs/companies/c-emew/profile/emew-website-scrape.json`
- ✅ Contains: company_name, industry, description, capabilities

### Task 4: Upload EMEW to Company Corpus (Day 2)

**Goal**: Upload corporate documents to Gemini Company Corpus

**Implementation**:
```python
from gemini_store import CorpusManager

manager = CorpusManager()

# Upload PDF
pdf_result = manager.company_corpus.upload_document(
    ".inputs/companies/c-emew/corporate/emew-general-presentation-2024.pdf",
    company_id="emew",
    metadata={
        "document_type": "corporate",
        "category": "presentation",
        "year": 2024
    }
)

# Save upload metadata
with open(".inputs/companies/c-emew/vector-db/corpus-metadata.json", "w") as f:
    json.dump({
        "corpus_id": manager.company_corpus.corpus_id,
        "uploads": [pdf_result],
        "last_updated": datetime.now().isoformat()
    }, f, indent=2)
```

**Success Criteria**:
- ✅ PDF uploaded to Gemini Company Corpus
- ✅ Upload metadata saved
- ✅ Test query: "What is EMEW's core technology?" returns presentation content

### Task 5: Parse Grant Summary (Day 3)

**Goal**: Extract grant list from `.docs/context/emew-context/grant-search/Grants_Summary_2025-10-29.md`

**Implementation**:
```python
# Parse grant summary to extract URLs and metadata
from parsers.grant_summary_parser import parse_grant_summary

grants = parse_grant_summary(".docs/context/emew-context/grant-search/Grants_Summary_2025-10-29.md")

# Expected grants (8-10):
# - Battery Breakthrough Initiative (BBI)
# - Industry Growth Program (IGP)
# - Victorian Market Accelerator (VMA)
# - Breakthrough Victoria Fund (BTV)
# - Advancing Renewables Program (ARP)
# - International Partnerships Critical Minerals
# - Recycling Modernisation Fund
# - Energy Innovation Fund
```

**Success Criteria**:
- ✅ Grant list extracted with URLs
- ✅ Metadata captured: jurisdiction, funding range, deadline
- ✅ 8-10 grants identified

### Task 6: Download Grant PDFs (Day 3-4)

**Goal**: Download grant guideline PDFs for identified grants

**Implementation**:
```python
from downloaders.grant_downloader import GrantDownloader

downloader = GrantDownloader()

for grant in grants:
    # Download grant PDFs
    pdf_paths = await downloader.download_grant_documents(
        grant_url=grant["url"],
        jurisdiction=grant["jurisdiction"],
        grant_name=grant["name"]
    )

    # Save to .inputs/grants/{jurisdiction}/{grant-name}/
    # Example: .inputs/grants/federal/battery-breakthrough/guidelines.pdf
```

**Folder Structure**:
```
back/grant-prototype/.inputs/grants/
├── federal/
│   ├── battery-breakthrough/
│   │   ├── guidelines.pdf
│   │   └── metadata.json
│   ├── industry-growth-program/
│   │   ├── guidelines.pdf
│   │   └── metadata.json
│   └── advancing-renewables/
│       ├── guidelines.pdf
│       └── metadata.json
└── state-vic/
    ├── victorian-market-accelerator/
    │   ├── guidelines.pdf
    │   └── metadata.json
    └── breakthrough-victoria/
        ├── guidelines.pdf
        └── metadata.json
```

**Success Criteria**:
- ✅ 8-10 grant PDFs downloaded
- ✅ Organized by jurisdiction
- ✅ Metadata JSON created for each grant

### Task 7: Upload Grants to Grant Corpus (Day 4)

**Goal**: Upload grant documents to Gemini Grant Corpus

**Implementation**:
```python
from gemini_store import CorpusManager
import os
import json

manager = CorpusManager()

# Walk through .inputs/grants/ directory
for jurisdiction in os.listdir(".inputs/grants"):
    if jurisdiction == "market-research":
        continue  # Skip market research for now

    jurisdiction_path = f".inputs/grants/{jurisdiction}"
    for grant_name in os.listdir(jurisdiction_path):
        grant_path = f"{jurisdiction_path}/{grant_name}"

        # Load metadata
        with open(f"{grant_path}/metadata.json") as f:
            metadata = json.load(f)

        # Upload PDF
        pdf_path = f"{grant_path}/guidelines.pdf"
        if os.path.exists(pdf_path):
            result = manager.grant_corpus.upload_document(
                pdf_path,
                metadata={
                    "document_type": "grant",
                    "grant_id": metadata["grant_id"],
                    "jurisdiction": jurisdiction,
                    "funding_min": metadata.get("funding_min"),
                    "funding_max": metadata.get("funding_max"),
                    "deadline_date": metadata.get("deadline")
                }
            )

            # Save upload metadata
            os.makedirs(f"{grant_path}/vector-db", exist_ok=True)
            with open(f"{grant_path}/vector-db/upload-metadata.json", "w") as f:
                json.dump(result, f, indent=2)
```

**Success Criteria**:
- ✅ All grant PDFs uploaded to Grant Corpus
- ✅ Upload metadata saved in each grant's `vector-db/` folder
- ✅ Test query: "grants for battery recycling" returns relevant grants

### Task 8: Semantic Matching (Day 5)

**Goal**: Match EMEW to grants using dual-corpus semantic search

**Implementation**:
```python
from gemini_store import CorpusManager
from matching.grant_matcher import GrantMatcher

manager = CorpusManager()
matcher = GrantMatcher(manager)

# Run matching
matches = matcher.match_company_to_grants(
    company_id="emew",
    top_k=10
)

# Export results
matcher.export_matches_csv(matches, "emew_matches.csv")

# Expected top 2:
# 1. Battery Breakthrough Initiative (BBI)
# 2. Industry Growth Program (IGP)
```

**Success Criteria**:
- ✅ Matching returns 10 results
- ✅ Top 2 matches align with manual research (BBI + IGP)
- ✅ Relevance scores > 0.8 for top matches
- ✅ CSV export created

### Task 9: Select Target Grants for Week 2 (Day 5)

**Goal**: Choose 2 grants for application form replication

**Criteria**:
- High relevance to EMEW (>0.8 score)
- Clear application forms available
- Realistic timeline (not urgent deadline)

**Output**:
```markdown
# Week 2 Target Grants

**Grant 1**: Industry Growth Program (IGP)
- Relevance: 0.92
- Funding: $100K-$5M
- Application form: Available on business.gov.au
- Rationale: Best fit for EMEW's expansion plans

**Grant 2**: Battery Breakthrough Initiative (BBI)
- Relevance: 0.89
- Funding: $500K-$10M
- Application form: Available on arena.gov.au
- Rationale: Perfect alignment with battery recycling focus
```

**Success Criteria**:
- ✅ 2 grants selected
- ✅ Application forms accessible
- ✅ Documented in scratchpad

---

## Success Criteria

### Week 1 Deliverables

- ✅ Gemini File Search dual-corpus initialized
- ✅ EMEW corporate documents in Company Corpus
- ✅ 8-10 grants in Grant Corpus
- ✅ Semantic matching validates manual research (BBI + IGP as top 2)
- ✅ 2 target grants selected for Week 2

### Technical Evidence

- `back/grant-prototype/.inputs/.gemini_config.json` - Corpus configuration
- `back/grant-prototype/.inputs/companies/c-emew/corporate/` - EMEW PDFs
- `back/grant-prototype/.inputs/grants/*/` - Grant documents organized by jurisdiction
- `emew_matches.csv` - Matching results
- Test execution logs in scratchpad

---

## Test Execution Evidence

[To be added during implementation]

---

## Notes

### Known Issues

1. **Gemini File API quotas**: Free tier has limits on uploads/day. May need to spread uploads across multiple days if quota exceeded.
2. **PDF download may fail**: Some government sites have CAPTCHAs or rate limiting. Have backup manual download plan.
3. **Grant summary parsing**: Markdown format may vary. Need robust parser with fallback to manual extraction.

### Backup Plans

- **If Gemini quota exceeded**: Use Vertex AI instead (requires GCP project setup)
- **If PDF downloads fail**: Manually download critical grants (BBI, IGP) first
- **If matching doesn't validate**: Review metadata tagging and adjust search prompts

---

**Last Updated**: 2025-11-12
**Status**: Plan Complete - Ready for Implementation
