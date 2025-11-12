# Match Company to Grants

**Purpose**: Use cross-corpus semantic search to match company to relevant grants

**Week 1 Task**: Day 5
**Consolidates**: m01 (match), m02 (explain), m03 (rank)

---

## Task

Match EMEW to relevant grants using dual-corpus workflow:

1. Query Company Corpus to extract company profile
2. Query Grant Corpus with company context
3. Rank by relevance
4. Export top 10 matches
5. **Select 2 target grants for Week 2**

## Implementation

```python
from gemini_store import CorpusManager

manager = CorpusManager()

# Cross-corpus matching
matches = manager.match_company_to_grants(
    company_id="emew",
    top_k=10
)

print(matches)

# Expected top 2: Battery Breakthrough Initiative (BBI) + Industry Growth Program (IGP)
```

## Export Matches

```python
import json

# Save matches for Week 2 selection
with open(".inputs/companies/c-emew/emew_matches.json", "w") as f:
    json.dump(matches, f, indent=2)

print("✅ Matches saved! Select 2 grants for Week 2 application replication.")
```

## Success Criteria

- ✅ Top 10 grant matches generated
- ✅ Matches align with manual research (`Grants_Summary_2025-10-29.md`)
- ✅ BBI + IGP appear in top 3
- ✅ 2 grants selected for Week 2

## Related

- **Issue #1**: Week 1 completion
- **Issue #2**: Application Form Replication (Week 2)
- **Next**: Begin Week 2 with `/analyze-form`
