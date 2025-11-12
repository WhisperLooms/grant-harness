# Initialize Gemini File Search

**Purpose**: Initialize dual-corpus Gemini File Search system (Grant + Company corpora)

**Prerequisites**:
- GOOGLE_API_KEY environment variable set
- Python dependencies installed (`uv sync`)

**When to use**: ONCE at the start of Week 1, before any document uploads

---

## Task

Initialize the Gemini File Search infrastructure with dual-corpus architecture (ADR-2051):

1. **Create Grant Corpus**: For all grant documents (discovery/matching)
2. **Create Company Corpus**: For company documents (application population)
3. **Save configuration**: Store corpus names in `.inputs/.gemini_config.json`
4. **Verify setup**: Run health check to ensure both corpora accessible

## Implementation

```bash
cd back/grant-prototype

# Initialize both corpora
python -m gemini_store.corpus_manager

# Expected output:
# 🆕 Creating new Grant Corpus: grant-harness-grant-corpus
# 🆕 Creating new Company Corpus: grant-harness-company-corpus
# ✅ Gemini File Search initialized:
#    Grant Corpus: fileSearchStores/abc123
#    Company Corpus: fileSearchStores/def456
#    Config saved to: .inputs/.gemini_config.json

# Verify health
python -c "from gemini_store import CorpusManager; m = CorpusManager(); print(m.health_check())"

# Expected: {'api_key': 'valid', 'grant_corpus': 'ok', 'company_corpus': 'ok'}
```

## What Gets Created

- **Grant Corpus store** in Gemini File Search
- **Company Corpus store** in Gemini File Search
- **`.inputs/.gemini_config.json`** with corpus names (git-ignored)

## Troubleshooting

**Error: GOOGLE_API_KEY not found**
```bash
export GOOGLE_API_KEY=your_key_here
```

**Error: Store already exists**
- Corpora persist across runs (expected behavior)
- To recreate: Use `force_recreate=True` in Python

**Error: Authentication Failed**
- Verify API key at https://aistudio.google.com/app/apikey

## Related

- **ADR-2051**: Gemini Dual-Corpus Architecture
- **Issue #1**: Grant & Company Ingestion (Week 1)
- **Next command**: `/ingest-company` or `/ingest-grants`

## Success Criteria

- ✅ Both corpora created and accessible
- ✅ Health check shows 'ok' for both corpora
- ✅ `.inputs/.gemini_config.json` exists with corpus names
