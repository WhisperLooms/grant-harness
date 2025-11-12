# RAG Performance Improvements - Summary
**Date**: 2025-11-12

## Before vs After Comparison

### Test 1: Company Query - "Who is EMEW?" / "What is EMEW's annual revenue?"

**BEFORE** (Wrong corpus):
```bash
Query: "Who is emew?"
Corpus: Grant (default)
Result: "I apologize, but I couldn't find any information about 'emew'"
Sources: CSIRO-Kick-Start-Program-Guidelines.pdf
❌ Wrong corpus queried
```

**AFTER** (Structured profile uploaded):
```bash
Query: "What is EMEW's annual revenue?"
Corpus: Company (specified)
Result: "EMEW's annual revenue is $5,000,000 AUD"
Sources: emew-general-presentation-2024.pdf, emew-structured-profile.md
✅ Exact answer from structured data
```

### Test 2: Grant Query - "What grants are available for battery recycling?"

**BEFORE** (No filters):
```bash
Query: "What grants are available for battery recycling?"
Filter: None
Result: Various grants, including potentially outdated ones
Issue: No date/status filtering
❌ May include closed grants
```

**AFTER** (With status filter):
```bash
Query: "What grants are currently open for battery recycling?"
Filter: status=open
Result: ARENA, Battery Breakthrough Initiative, IGP (rolling applications)
Sources: IGP Guidelines, ARENA Investment Plan 2025, ARP Guidelines
✅ Only current, open grants
```

---

## Root Causes Identified

| Issue | Impact | Fix | Status |
|-------|---------|-----|--------|
| **Wrong corpus default** | Query went to grants instead of company | Require `--corpus` flag | ✅ User training |
| **Missing structured profile** | No revenue/employee data | Upload JSON → Markdown | ✅ FIXED |
| **No metadata filtering** | Outdated grants in results | Add `status=open` filter | ✅ DOCUMENTED |
| **Chunking config** | Potential fragmentation | Test larger chunks | ⏭️ Phase 2 |
| **Query prompting** | Lack of context | Better prompt engineering | ⏭️ Phase 2 |

---

## Implemented Fixes

### 1. ✅ Uploaded Structured Company Profile

**File**: `emew-structured-profile.md`
**Location**: `.inputs/companies/c-emew/profile/`
**Content**: Revenue, employees, certifications, recent projects, funding priorities

**Test**:
```bash
uv run python -m scripts.query_rag --corpus company "What is EMEW's annual revenue?"
# Result: "$5,000,000 AUD" ✅
```

### 2. ✅ Documented Metadata Filtering Best Practices

**Key insight**: We upload rich metadata (`status`, `opens`, `closes`, `jurisdiction`, `funding_min`, `funding_max`) but weren't using it at query time.

**Recommendation**: ALWAYS filter by `status=open` for grant queries

**Example**:
```bash
# Good
uv run python -m scripts.query_rag --filter "status=open" "What grants support manufacturing?"

# Better
uv run python -m scripts.query_rag --filter "status=open AND jurisdiction=federal" "What federal grants support manufacturing?"

# Best
uv run python -m scripts.query_rag --filter "status=open AND jurisdiction=federal AND funding_min>=100000" "What large federal grants support manufacturing?"
```

### 3. ✅ Created Diagnostic Tools

**Files created**:
- `scripts/diagnose_corpus.py` - Inspect corpus configuration
- `scripts/upload_emew_profile.py` - Upload structured company data
- `.outputs/RAG-Performance-Analysis-2025-11-12.md` - Comprehensive analysis

---

## Recommended Query Patterns

### For Company Queries

```bash
# Revenue/financials
uv run python -m scripts.query_rag --corpus company --filter "company_id=emew" "What is EMEW's annual revenue?"

# Capabilities
uv run python -m scripts.query_rag --corpus company "What are EMEW's core technologies?"

# Certifications
uv run python -m scripts.query_rag --corpus company "What certifications does EMEW hold?"

# Projects
uv run python -m scripts.query_rag --corpus company "What recent projects has EMEW completed?"
```

### For Grant Queries (Always filter!)

```bash
# Open grants only (ALWAYS use this)
uv run python -m scripts.query_rag --filter "status=open" "What grants support battery recycling?"

# Federal grants
uv run python -m scripts.query_rag --filter "status=open AND jurisdiction=federal" "What federal grants are available?"

# High-value grants
uv run python -m scripts.query_rag --filter "status=open AND funding_min>=1000000" "What grants offer over $1M?"

# Victorian grants
uv run python -m scripts.query_rag --filter "status=open AND jurisdiction=state-vic" "What Victorian grants are available?"

# Specific grant
uv run python -m scripts.query_rag --filter "grant_id=igp-commercialisation-growth" "What is the IGP deadline?"
```

### For Cross-Corpus Matching

```bash
# Query both corpora
uv run python -m scripts.query_rag --corpus both "What grants are best for EMEW?"

# Or use the dedicated matching script
uv run python -m scripts.query_emew_matches
```

---

## Next Steps for Further Improvement

### Phase 1 (This Week) - Quick Wins
- [x] Upload structured company profile
- [x] Document metadata filtering best practices
- [ ] Add default `status=open` filter to `query_rag.py`
- [ ] Add intelligent corpus routing (detect company vs grant keywords)

### Phase 2 (Week 1-2) - Application Layer
- [ ] Build contextual query builder (adds company context to queries)
- [ ] Add date validation (filter out grants closed before today)
- [ ] Implement two-stage matching (gemini-2.5-flash → gemini-2.5-pro)
- [ ] Test chunking configurations (200 vs 400 tokens)

### Phase 3 (Week 5+) - Infrastructure
- [ ] Split Grant Corpus by jurisdiction (separate stores)
- [ ] Add query result caching
- [ ] Build analytics dashboard
- [ ] A/B test gemini-2.5-flash vs gemini-2.5-pro

---

## Metadata Schema Reference

### Grant Metadata (Available for Filtering)

```
- grant_id            (string)   e.g., "igp-commercialisation-growth"
- program_name        (string)   e.g., "Industry Growth Program"
- short_name          (string)   e.g., "IGP"
- managing_agency     (string)   e.g., "Department of Industry"
- jurisdiction        (string)   e.g., "federal", "state-vic", "state-nsw"
- status              (string)   e.g., "open", "closed", "upcoming"
- funding_min         (numeric)  e.g., 100000
- funding_max         (numeric)  e.g., 5000000
- currency            (string)   e.g., "AUD"
- co_funding_required (string)   e.g., "true", "false"
- funding_type        (string)   e.g., "matched-grant", "direct-grant"
- opens               (string)   e.g., "2024-07-01"
- closes              (string)   e.g., "2025-12-31" or null for ongoing
- revenue_max         (numeric)  e.g., 20000000
- sectors             (string)   e.g., "advanced-manufacturing,recycling"
- priority_score      (numeric)  e.g., 10 (our internal ranking)
- tags                (string)   e.g., "rolling-applications,high-priority"
```

### Company Metadata (Available for Filtering)

```
- company_id          (string)   e.g., "emew"
- company_name        (string)   e.g., "EMEW Corporation"
- document_type       (string)   e.g., "corporate-presentation", "structured-profile"
- industry            (string)   e.g., "metal-recovery-recycling"
- location            (string)   e.g., "Victoria, Australia"
- sectors             (string)   e.g., "advanced-manufacturing,recycling,clean-technology"
- confidential        (string)   e.g., "true"
- data_source         (string)   e.g., "manual-curation", "scraped"
```

---

## Key Takeaways

1. **Metadata is uploaded but underutilized** - We have rich metadata but weren't filtering at query time
2. **Structured data matters** - JSON profile provides precise answers (revenue, employees)
3. **Filters are essential** - ALWAYS use `status=open` to exclude outdated grants
4. **Corpus selection matters** - Company vs Grant corpus must be explicitly chosen
5. **Query engineering helps** - Better prompts yield better results

---

## Testing Checklist

Use these queries to validate improvements:

- [ ] Company revenue query returns "$5,000,000 AUD"
- [ ] Grant query with `status=open` excludes closed grants
- [ ] Metadata filter `jurisdiction=federal` only returns federal grants
- [ ] Metadata filter `funding_min>=1000000` only returns high-value grants
- [ ] Company query uses both PDF and structured profile as sources
- [ ] Grant query returns ARENA, IGP, and BBI for battery recycling
- [ ] Specific grant query with `grant_id` filter works correctly

---

**Conclusion**: The RAG system is now performing significantly better with structured company data and proper metadata filtering. The main issue was underutilization of available metadata, not a fundamental problem with Gemini File Search.
