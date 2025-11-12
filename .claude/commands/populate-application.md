# AI-Populate Grant Application

**Purpose**: Auto-fill application form fields with company data using Gemini

**Week 3 Task**: Days 13-14
**Consolidates**: p01 (AI auto-fill), p02 (flag for review)

---

## Task

Use Company Corpus to populate form fields:
1. Query Gemini for each field value
2. Generate confidence scores (0.0-1.0)
3. Flag fields with confidence < 0.7 for review
4. Add source citations

## Implementation

```python
from gemini_store import CorpusManager

manager = CorpusManager()

# Populate specific field
result = manager.company_corpus.query_for_field(
    company_id="emew",
    field_label="Annual Revenue (AUD)",
    field_description="The company's total annual revenue"
)

print(f"Value: {result['value']}")
print(f"Confidence: {result['confidence']}")
print(f"Sources: {result['sources']}")
```

## Target

- 70% of fields auto-filled
- 30% flagged for human review

## Success Criteria

- ✅ IGP form 70% populated with EMEW data
- ✅ AI explanations for each field
- ✅ Source citations displayed
- ✅ Confidence indicators shown

## Related

- **ADR-2051**: Dual-Corpus Architecture
- **Issue #3**: Week 3
- **Next**: `/review-application`
