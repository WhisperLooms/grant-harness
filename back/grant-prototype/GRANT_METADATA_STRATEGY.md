# Grant Metadata & Corpus Inspection Strategy

## Executive Summary

**Current Status**: NO grants uploaded to Gemini yet (upload script ready but requires GOOGLE_API_KEY)

**Critical Issue Identified**: Upload script only captures basic metadata (grant_id, jurisdiction, document_type). Missing critical searchable fields (funding, dates, status, eligibility).

**Solution**: Enhanced metadata schema + inspection utilities created.

---

## Question 1: Grant Upload Status & Metadata Strategy

### Current Status ⚠️

**Uploads**: ❌ None yet - script created but not executed
**Reason**: Waiting for GOOGLE_API_KEY to be set
**Grant PDFs Ready**: ✅ 20+ files in `.inputs/grants/`
**Metadata Quality**: ⚠️ INSUFFICIENT for production use

### Metadata Problem

**Current metadata (INSUFFICIENT)**:
```json
{
  "grant_id": "igp",
  "program_name": "Industry Growth Program",
  "jurisdiction": "federal",
  "document_type": "guidelines"
}
```

**Missing critical fields**:
- ❌ Open/close dates
- ❌ Funding range (min/max)
- ❌ Status (open/closed/upcoming)
- ❌ Eligibility criteria (revenue limits, sectors, NRF priorities)
- ❌ Application requirements
- ❌ Assessment criteria

**Impact**: Cannot filter queries like:
- "Show me federal grants >$1M closing after March 2026"
- "Find grants for recycling companies with <$20M revenue"
- "List open grants requiring NRF alignment"

### Solution: Enhanced Metadata Schema ✅

**Created**:
1. **Metadata schema**: `.inputs/grants/METADATA_SCHEMA.md` (comprehensive specification)
2. **Sample metadata**: `.inputs/grants/federal/industry-growth-program/metadata.json` (IGP example)
3. **Upload script**: Ready for enhancement to include metadata

**Enhanced metadata includes**:
```json
{
  "grant_id": "igp-commercialisation-growth",
  "program_name": "Industry Growth Program - Commercialisation & Growth",
  "status": "open",
  "dates": {
    "opens": "2024-01-01",
    "closes": null,
    "closes_note": "Rolling applications"
  },
  "funding": {
    "min": 100000,
    "max": 5000000,
    "currency": "AUD",
    "co_funding_required": true,
    "co_funding_percentage": 50
  },
  "eligibility": {
    "revenue_max": 20000000,
    "sectors": ["recycling", "advanced-manufacturing", ...],
    "nrf_alignment_required": true,
    "nrf_priorities": ["Value-add in Resources", ...]
  },
  "tags": ["commercialisation", "nrf-aligned", "rolling-applications"],
  "priority_score": 10
}
```

### Metadata Strategy Going Forward

#### Option 1: Manual Metadata Creation (Week 1 - RECOMMENDED)

For the 20+ existing grant PDFs, manually create `metadata.json` files using grant review summary as source.

**Why**:
- Quick (1-2 hours for 20 grants)
- Accurate (sourced from comprehensive review)
- Validates schema before automation

**Process**:
```bash
# For each grant folder
cd .inputs/grants/federal/bbi/
cp ../industry-growth-program/metadata.json .
# Edit with BBI-specific details from grant review summary
```

#### Option 2: AI Extraction (Phase 2)

Use Gemini to extract metadata from guidelines PDFs automatically.

```python
response = gemini.generate_content(
    contents="""Extract grant metadata as JSON:
    - grant_id, program_name, managing_agency
    - funding min/max, currency, co_funding_percentage
    - opens, closes, status
    - eligibility: revenue_max, sectors, nrf_priorities
    - application_process steps
    """,
    files=[guideline_pdf]
)
metadata = json.loads(response.text)
```

#### Option 3: Scraper Integration (Phase 2)

When building scrapers, extract metadata directly from grant websites.

### Recommendation for Week 1

**Phase 1 Priority**: Upload ALL 20+ grants with comprehensive metadata

**Workflow**:
1. **Day 1**: Create `metadata.json` for 8-10 high-priority grants (from grant review summary)
2. **Day 2**: Enhance upload script to read and include metadata.json in custom_metadata
3. **Day 3**: Execute upload with GOOGLE_API_KEY
4. **Day 4**: Verify uploads using inspection utility
5. **Day 5**: Test semantic search with metadata filters

**Why ALL grants, not just 2 targets?**
- Future-proofs the corpus (all Australian grants in one place)
- Enables discovery queries across full grant landscape
- Validates metadata schema at scale
- Supports future company matching (not just EMEW)
- Minimal extra work (upload script already built)

---

## Question 2: How to Inspect Gemini Corpora

### Inspection Utility Created ✅

**File**: `back/grant-prototype/utils/inspect_gemini_corpus.py`

**Capabilities**:
1. List all files in corpus
2. Show detailed metadata for each file
3. Filter by metadata (e.g., jurisdiction=federal)
4. Export inventory to JSON
5. Compare corpus vs local `.inputs/` folder
6. Generate statistics (file count, total size, grouping)

### Usage Examples

#### Basic Listing

```bash
cd back/grant-prototype

# List all files in Grant Corpus
uv run python -m utils.inspect_gemini_corpus --corpus grant

# List all files in Company Corpus
uv run python -m utils.inspect_gemini_corpus --corpus company
```

**Output**:
```
================================================================================
GEMINI FILE SEARCH CORPUS INSPECTION
================================================================================
Corpus: GRANT Corpus
Store: fileSearchStores/abc123xyz
================================================================================

Found 20 file(s) in corpus

1. IGP-Commercialisation-and-Growth-Guidelines.pdf
   File ID: files/xyz789...
   Size: 527.4 KB
   Uploaded: 2025-11-12T10:30:00Z

2. BBI-Guidelines.pdf
   File ID: files/abc456...
   Size: 532.0 KB
   Uploaded: 2025-11-12T10:31:00Z

...
```

#### Detailed Metadata View

```bash
uv run python -m utils.inspect_gemini_corpus --corpus grant --detailed
```

**Output**:
```
1. IGP-Commercialisation-and-Growth-Guidelines.pdf
   File ID: files/xyz789...
   Size: 527.4 KB
   Uploaded: 2025-11-12T10:30:00Z
   Metadata:
      - grant_id: igp-commercialisation-growth
      - program_name: Industry Growth Program
      - jurisdiction: federal
      - document_type: guidelines
      - status: open
      - funding_min: 100000
      - funding_max: 5000000
```

#### Filter by Metadata

```bash
# Show only federal grants
uv run python -m utils.inspect_gemini_corpus --corpus grant --filter "jurisdiction=federal"

# Show only open grants
uv run python -m utils.inspect_gemini_corpus --corpus grant --filter "status=open"
```

#### Export Inventory

```bash
# Export to JSON for auditing
uv run python -m utils.inspect_gemini_corpus --corpus grant --export corpus-inventory.json
```

**Output JSON**:
```json
{
  "corpus_type": "grant",
  "export_date": "2025-11-12T14:30:00",
  "file_count": 20,
  "files": [
    {
      "name": "files/xyz789...",
      "display_name": "IGP-Commercialisation-and-Growth-Guidelines.pdf",
      "size_bytes": 539648,
      "metadata": {
        "grant_id": "igp-commercialisation-growth",
        "jurisdiction": "federal",
        ...
      }
    }
  ]
}
```

#### Compare with Local Files

```bash
# Check what's been uploaded vs what's in .inputs/
uv run python -m utils.inspect_gemini_corpus --corpus grant --compare
```

**Output**:
```
================================================================================
CORPUS VS LOCAL COMPARISON
================================================================================

Corpus files: 0
Local files: 20

📤 Files in .inputs/ but not uploaded to corpus (20):
   - IGP-Commercialisation-and-Growth-Guidelines.pdf
     federal/industry-growth-program/IGP-Commercialisation-and-Growth-Guidelines.pdf
   - BBI-Guidelines.pdf
     federal/bbi/01-Battery-Breakthrough-Initiative-Guidelines.pdf
   ...
```

#### Get Statistics

```bash
# Show corpus statistics
uv run python -m utils.inspect_gemini_corpus --corpus grant --stats
```

**Output**:
```
================================================================================
CORPUS STATISTICS
================================================================================

Total files: 20
Total size: 8.5 MB

By Jurisdiction:
   federal: 18 files
   state-nsw: 2 files

By Document Type:
   guidelines: 8 files
   application-form: 6 files
   sample-agreement: 4 files
   comparison-guide: 2 files
```

### Alternative: Gemini AI Studio Web Console

**NOT RECOMMENDED** for file-by-file inspection (no metadata view), but useful for quick checks:

1. Visit: https://aistudio.google.com/
2. Log in with Google account (same as GOOGLE_API_KEY)
3. Click "File Search" in left sidebar
4. View "Stores" → Find "grant-harness-grant-corpus"
5. See file count, but **NO metadata viewing**

**Limitation**: Web console doesn't show custom_metadata, only file names and IDs.

**Recommendation**: Use `inspect_gemini_corpus.py` utility for full inspection.

---

## Action Plan: Complete Week 1 Uploads

### Prerequisites

1. **Set GOOGLE_API_KEY**:
   ```bash
   set GOOGLE_API_KEY=your_key_here  # Windows
   export GOOGLE_API_KEY=your_key_here  # Linux/Mac
   ```

2. **Optionally set ABR_GUID** (for company verification):
   ```bash
   set ABR_GUID=your_guid_here
   ```

### Phase 1: Create Metadata Files (2-3 hours)

For each grant in `.inputs/grants/`, create `metadata.json`:

**High Priority** (Week 1 targets):
1. ✅ IGP (done - sample metadata complete)
2. BBI (Battery Breakthrough Initiative)
3. ARP (ARENA Advancing Renewables Program)
4. CSIRO Kick-Start

**Medium Priority** (other downloaded grants):
5. NSW High-Emitting Industries
6. Any other grants in `.inputs/grants/`

**Template**: Use `.inputs/grants/federal/industry-growth-program/metadata.json` as template

**Source**: Extract data from:
- Grant review summary (`.outputs/EMEW-Grant-Review-Summary-2025-11-12.md`)
- Downloaded PDF guidelines
- Official website information

### Phase 2: Enhance Upload Script (1 hour)

Update `back/grant-prototype/scripts/upload_grants_batch.py` to:
1. Read `metadata.json` from each grant folder
2. Convert metadata fields to Gemini custom_metadata format
3. Include all searchable fields in upload
4. Track upload status in `metadata.json` (set `uploaded_to_gemini: true`)

### Phase 3: Execute Upload (30 mins)

```bash
cd back/grant-prototype

# Dry run first (check what will be uploaded)
uv run python -m scripts.upload_grants_batch --dry-run

# Execute upload
uv run python -m scripts.upload_grants_batch

# Result: Uploads 20+ PDFs with comprehensive metadata
```

### Phase 4: Verify Upload (15 mins)

```bash
# List uploaded files
uv run python -m utils.inspect_gemini_corpus --corpus grant

# Check detailed metadata
uv run python -m utils.inspect_gemini_corpus --corpus grant --detailed

# Verify all files uploaded
uv run python -m utils.inspect_gemini_corpus --corpus grant --compare

# Get statistics
uv run python -m utils.inspect_gemini_corpus --corpus grant --stats
```

### Phase 5: Test Semantic Search (30 mins)

```bash
# Test metadata-filtered queries
uv run python -m gemini_store.query_engine \
    --query "Show me federal grants with funding over $1M for recycling companies" \
    --corpus grant

# Verify results use metadata for filtering
```

---

## Benefits of Rich Metadata

### 1. Precise Search Queries

**Without metadata**:
```
Query: "grants for recycling companies"
Result: Returns all grants mentioning "recycling" in text
Problem: No filtering by funding amount, deadline, or eligibility
```

**With metadata**:
```
Query: "grants for recycling companies with funding >$1M, revenue limit >$20M, closing after June 2026"
Result: Filtered by metadata before semantic search
Problem: SOLVED - precise, actionable results
```

### 2. Future-Proof Discovery

When you add 100+ more grants (all Australian grants), metadata enables:
- Quick filtering by jurisdiction, sector, deadline
- Eligibility pre-screening (auto-exclude if revenue too high)
- Priority ranking (open vs closed, funding amount)
- Application planning (group by deadline)

### 3. Multi-Company Matching

When you onboard more companies beyond EMEW:
- Filter grants by company eligibility (revenue, sector, location)
- Auto-exclude ineligible grants before semantic matching
- Prioritize grants by funding amount relative to company size

### 4. Compliance & Auditing

- Track which grants were considered for each company
- Document why grants were excluded (metadata mismatch)
- Export grant inventory for stakeholder reporting
- Verify grant details against official sources (citation field)

---

## Summary

### Question 1: Grant Upload Status

**Status**: NO grants uploaded yet (script ready, waiting for GOOGLE_API_KEY)

**Strategy**:
- ✅ Enhanced metadata schema created (`.inputs/grants/METADATA_SCHEMA.md`)
- ✅ Sample metadata created for IGP
- ⚠️ Need to create metadata for remaining 19 grants (2-3 hours)
- ⚠️ Need to enhance upload script to include metadata (1 hour)
- ⚠️ Need to execute upload (30 mins)

**Recommendation**: Upload ALL 20+ grants with comprehensive metadata, not just 2 targets. Future-proofs corpus for discovery queries.

### Question 2: How to Inspect Corpora

**Solution**: ✅ Inspection utility created

**Usage**:
```bash
cd back/grant-prototype

# Basic listing
uv run python -m utils.inspect_gemini_corpus --corpus grant

# Detailed metadata
uv run python -m utils.inspect_gemini_corpus --corpus grant --detailed

# Compare with local
uv run python -m utils.inspect_gemini_corpus --corpus grant --compare

# Statistics
uv run python -m utils.inspect_gemini_corpus --corpus grant --stats

# Filter by metadata
uv run python -m utils.inspect_gemini_corpus --corpus grant --filter "jurisdiction=federal"

# Export inventory
uv run python -m utils.inspect_gemini_corpus --corpus grant --export inventory.json
```

**Alternative**: Gemini AI Studio web console (limited - no metadata view)

---

## Next Steps

1. **Set GOOGLE_API_KEY** environment variable
2. **Create metadata.json** for remaining 19 grants (use IGP as template)
3. **Enhance upload script** to include metadata fields
4. **Execute upload** with comprehensive metadata
5. **Verify** using inspection utility
6. **Test** semantic search with metadata filters

**Estimated Time**: 4-5 hours total for complete Week 1 grant upload with rich metadata

---

**Last Updated**: 2025-11-12
**Status**: Strategy documented, utilities ready, awaiting execution
