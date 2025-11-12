# RAG Performance Analysis & Recommendations
**Date**: 2025-11-12
**Issue**: Poor query results - outdated grants, missing company data

---

## Root Cause Analysis

### Issue 1: Default Corpus Selection
**Problem**: `query_rag.py` defaults to Grant Corpus
**Impact**: Query "Who is emew?" searched grants instead of company corpus
**Evidence**: User had to manually specify `--corpus company` to get correct results

**Fix**:
- Update CLI to prompt for corpus selection in interactive mode
- Add intelligent corpus routing based on query keywords

### Issue 2: Missing Structured Company Profile
**Problem**: Only PDF uploaded, not JSON profile
**Location**: `.docs/context/test-companies/emew-profile.json` NOT in Company Corpus
**Impact**: Missing structured data:
  - Annual revenue: $5M
  - Employee count: 25
  - Looking for: 5 specific funding types
  - Recent projects: 3 detailed projects
  - Certifications: ISO 9001, ISO 14001

**Fix**: Convert JSON profile to Markdown and upload to Company Corpus

### Issue 3: No Query-Time Metadata Filtering
**Problem**: Queries don't filter by `status=open` or date ranges
**Impact**: Outdated/closed grants appear in results
**Evidence**: We upload `status`, `opens`, `closes` metadata but don't use it

**Fix**: Add default filters to all grant queries

### Issue 4: Gemini File Search Ranking
**Problem**: Default ranking may not prioritize metadata fields
**Impact**: Relevance based purely on text similarity, not business logic
**Reference**: https://ai.google.dev/gemini-api/docs/file-search

**Fix Options**:
1. Use metadata filters to pre-filter results
2. Add semantic ranking in application layer
3. Use gemini-2.5-pro for better reasoning

### Issue 5: Chunking Configuration
**Current**: Default white_space_config (200 tokens per chunk, 20 overlap)
**Problem**: May fragment critical metadata across chunks

**Reference**: https://ai.google.dev/api/file-search/file-search-stores#request-body_5

**Available options**:
```python
chunking_config = {
    'white_space_config': {
        'max_tokens_per_chunk': 200,    # 100-1000 tokens
        'max_overlap_tokens': 20         # 0-100 tokens
    }
}
```

**Fix**: Test larger chunks (400-500 tokens) for grant guidelines

---

## Recommended Solutions

### Priority 1: Improve Query Default Behavior

**Update `query_rag.py` to intelligently route queries:**

```python
def detect_corpus_from_query(query: str) -> str:
    """Detect which corpus to query based on keywords."""
    company_keywords = ['company', 'emew', 'business', 'revenue', 'employees']
    grant_keywords = ['grant', 'funding', 'eligibility', 'deadline', 'application']

    query_lower = query.lower()

    if any(kw in query_lower for kw in company_keywords):
        return 'company'
    elif any(kw in query_lower for kw in grant_keywords):
        return 'grant'
    else:
        return 'both'  # Query both corpora for ambiguous questions
```

**Add default metadata filter for grants:**

```python
def query_grants_with_filters(manager, query, user_filter=None):
    """Query grants with intelligent default filters."""

    # Default: Only show open grants
    default_filter = "status=open"

    # Combine with user filter if provided
    final_filter = f"{default_filter} AND {user_filter}" if user_filter else default_filter

    return manager.grant_corpus.query(
        query=query,
        metadata_filter=final_filter,
        model="gemini-2.5-flash"
    )
```

### Priority 2: Upload Structured Company Profile

**Create `scripts/upload_emew_profile.py`:**

```python
"""Convert emew-profile.json to Markdown and upload to Company Corpus."""

import json
from pathlib import Path

def json_to_markdown(profile: dict) -> str:
    """Convert JSON profile to structured Markdown."""

    md = f"""# {profile['name']}

## Company Overview
- **Industry**: {profile['industry']}
- **Website**: {profile['website']}
- **State**: {profile['state']}
- **Established**: {profile['established']}
- **Annual Revenue**: ${profile['annual_revenue']:,} AUD
- **Employee Count**: {profile['employee_count']}

## Description
{profile['description']}

## Sectors
{', '.join(profile['sectors'])}

## Certifications
{', '.join(profile['certifications'])}

## Looking For
{chr(10).join(f'- {item}' for item in profile['looking_for'])}

## Recent Projects
{chr(10).join(f'- {item}' for item in profile['recent_projects'])}

## Target Markets
{chr(10).join(f'- {item}' for item in profile['target_markets'])}

## Competitive Advantages
{chr(10).join(f'- {item}' for item in profile['competitive_advantages'])}
"""
    return md

# Load JSON profile
profile_path = Path(".docs/context/test-companies/emew-profile.json")
with open(profile_path) as f:
    profile = json.load(f)

# Convert to Markdown
md_content = json_to_markdown(profile)

# Save to .inputs/
output_path = Path(".inputs/companies/c-emew/profile/emew-structured-profile.md")
output_path.parent.mkdir(parents=True, exist_ok=True)
output_path.write_text(md_content)

# Upload to Company Corpus
# (Use CompanyCorpus.upload_document() method)
```

### Priority 3: Improve Gemini File Search Configuration

**Option A: Tune Chunking (Test in Phase 2)**

For grant guidelines (long structured docs):
```python
chunking_config = {
    'white_space_config': {
        'max_tokens_per_chunk': 400,  # Increase from 200
        'max_overlap_tokens': 40       # Increase from 20
    }
}
```

For company profiles (shorter structured docs):
```python
chunking_config = {
    'white_space_config': {
        'max_tokens_per_chunk': 200,  # Keep default
        'max_overlap_tokens': 20
    }
}
```

**Option B: Create Separate Stores by Grant Type**

Instead of one monolithic Grant Corpus:
- `grant-harness-federal-grants` - Federal programs only
- `grant-harness-state-vic-grants` - Victorian state grants
- `grant-harness-state-nsw-grants` - NSW state grants

Benefits:
- Faster queries (smaller corpus)
- Better metadata filtering
- Jurisdiction-specific tuning

**Option C: Use gemini-2.5-pro for Complex Matching**

Current: `gemini-2.5-flash` ($0.075/$0.30 per 1M tokens)
Option: `gemini-2.5-pro` ($1.25/$5.00 per 1M tokens) for final matching

```python
def match_company_to_grants(manager, company_id):
    """Two-stage matching: Flash for retrieval, Pro for ranking."""

    # Stage 1: Retrieve candidate grants with Flash (fast, cheap)
    candidates = manager.grant_corpus.query(
        query=f"Find grants relevant to {company_id}",
        metadata_filter="status=open",
        model="gemini-2.5-flash"  # Fast retrieval
    )

    # Stage 2: Deep analysis with Pro (slow, accurate)
    detailed_match = manager.grant_corpus.query(
        query=f"Rank these grants for {company_id}: {candidates}",
        model="gemini-2.5-pro"  # Better reasoning
    )

    return detailed_match
```

### Priority 4: Add Application-Layer Date Validation

Even with `status=open` metadata, add validation:

```python
from datetime import datetime, date

def filter_open_grants(grants: list) -> list:
    """Filter grants by current date."""
    today = date.today()

    open_grants = []
    for grant in grants:
        # Check if grant has closing date
        if grant.get('closes'):
            close_date = date.fromisoformat(grant['closes'])
            if close_date < today:
                continue  # Skip closed grants

        # Check if grant has opening date
        if grant.get('opens'):
            open_date = date.fromisoformat(grant['opens'])
            if open_date > today:
                continue  # Skip not-yet-open grants

        open_grants.append(grant)

    return open_grants
```

### Priority 5: Improve Query Prompt Engineering

**Current query**: "What grants are available for battery recycling?"

**Better query**: "What OPEN Australian government grants with a closing date after 2025-11-12 are available for battery recycling companies like EMEW in Victoria?"

Add context to queries:
```python
def build_contextual_query(base_query, company_profile):
    """Add company context to grant queries."""

    context = f"""
    Company Context:
    - Name: {company_profile['name']}
    - Location: {company_profile['state']}
    - Sectors: {', '.join(company_profile['sectors'])}
    - Revenue: ${company_profile['annual_revenue']:,}
    - Looking for: {', '.join(company_profile['looking_for'])}

    Question: {base_query}

    Requirements:
    - Only suggest OPEN grants (not closed or upcoming)
    - Filter by company location ({company_profile['state']})
    - Consider company size (revenue ${company_profile['annual_revenue']:,})
    - Match to sectors: {', '.join(company_profile['sectors'])}
    """

    return context
```

---

## Implementation Plan

### Immediate Fixes (This Session)

1. ✅ **Create diagnostic script** - `diagnose_corpus.py`
2. ⏭️ **Upload structured company profile** - Convert JSON → Markdown → Upload
3. ⏭️ **Update query_rag.py** - Add intelligent corpus routing
4. ⏭️ **Add default status=open filter** - All grant queries

### Week 1 Improvements (Before Week 2)

1. Test different chunking configs
2. Add application-layer date validation
3. Implement contextual query building
4. Test gemini-2.5-pro vs gemini-2.5-flash

### Phase 2 Enhancements (Week 5+)

1. Split Grant Corpus by jurisdiction (separate stores)
2. Implement two-stage matching (Flash → Pro)
3. Add query result caching
4. Build query analytics dashboard

---

## Testing Queries

**Test these queries with status=open filter:**

```bash
# Test 1: Open grants only
uv run python -m scripts.query_rag "What grants are currently open for battery recycling?" --filter "status=open"

# Test 2: Federal grants only
uv run python -m scripts.query_rag "What federal grants support advanced manufacturing?" --filter "jurisdiction=federal AND status=open"

# Test 3: High funding only
uv run python -m scripts.query_rag "What grants offer over $1M funding?" --filter "status=open AND funding_min>=1000000"

# Test 4: Company corpus with structured profile
uv run python -m scripts.query_rag "What is EMEW's annual revenue?" --corpus company --filter "company_id=emew"
```

**Expected improvements:**
- No outdated grants in results
- More accurate company profile responses
- Better jurisdiction filtering
- Funding range filtering works

---

## References

- **Gemini File Search Docs**: https://ai.google.dev/gemini-api/docs/file-search
- **File Search Store Config**: https://ai.google.dev/api/file-search/file-search-stores#request-body_5
- **Chunking Config**: https://ai.google.dev/api/file-search/file-search-stores#whitespacechunkingconfig
- **Metadata Filtering**: https://ai.google.dev/gemini-api/docs/file-search#metadata-filtering

---

## Summary

**Root causes identified:**
1. ❌ Wrong corpus queried (user error - need better defaults)
2. ❌ Missing structured company profile (JSON not uploaded)
3. ❌ No metadata filtering at query time (status=open not enforced)
4. ⚠️ Default chunking may not be optimal (test needed)
5. ⚠️ Query prompts lack context (need prompt engineering)

**Quick wins:**
- Add `status=open` to all grant queries
- Upload `emew-profile.json` as Markdown
- Improve query routing logic
- Add contextual query building

**Long-term improvements:**
- Test chunking configurations
- Split corpus by jurisdiction
- Two-stage matching (Flash → Pro)
- Application-layer date validation
