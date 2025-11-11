---
description: Deep-dive explanation of specific grant match reasoning
---

# M02: Explain Grant Match

Provide detailed explanation of why a specific grant matches (or doesn't match) a company.

## Usage

`/m02-match-explain <company-id> <grant-id> [--show-citations]`

## Tasks

1. **Load Match Data**: Read match result from `/m01-match-grants` output

2. **Analyze Match Components**:
   - Sector alignment (company sectors vs grant sectors)
   - Eligibility criteria (company meets/fails each criterion)
   - Funding fit (company size vs grant funding range)
   - Geographic fit (company location vs grant jurisdiction)
   - Timing fit (company readiness vs grant timeline)

3. **Generate Detailed Explanation**:
```
Match Explanation: EMEW Corporation ’ Recycling Modernisation Fund (GC2026001)

Overall Relevance Score: 0.92 (Excellent Match)

 STRONG ALIGNMENTS:
1. Sector Match (100%):
   - Company: recycling, manufacturing
   - Grant: recycling, advanced manufacturing
   - Perfect overlap in core sectors

2. Eligibility (95%):
    Australian business (ABN verified)
    SME (25 employees, $5M revenue)
    R&D active (RMIT partnership)
    Export ready (3 countries)
     Co-contribution: Requires 50% ($2.5M) - verify available

3. Funding Fit (90%):
   - Grant range: $500K - $10M
   - Company scale: Likely to seek $3-5M
   - Good fit for company size

4. Technology Match (95%):
   - Grant focus: Advanced recycling technologies
   - Company tech: Electrowinning, metal recovery
   - Strong technical alignment

  CONSIDERATIONS:
1. Competition (Medium):
   - Popular program, competitive assessment
   - Company's CSIRO partnership strengthens application

2. Timeline (Tight):
   - Opens: 2026-01-15 (8 weeks prep time)
   - Closes: 2026-04-30
   - Recommend: Start preparation now

3. Co-Contribution Requirement:
   - Need $2.5M matching funds
   - Verify: Cash reserves or investor commitment

 POTENTIAL GAPS:
None identified - Excellent match

RECOMMENDATION: HIGH PRIORITY
- Apply with focus on: Export expansion, R&D innovation, circular economy impact
- Highlight: University partnerships, existing export traction, proven technology
- Timeline: Begin application drafting within 2 weeks
```

4. **Show Citations** (if `--show-citations`):
   Link match reasoning to specific text from:
   - Company profile
   - Grant eligibility criteria
   - Grant assessment criteria

5. **Save Explanation**: `.outputs/m02-match-explain/{company_id}_{grant_id}_explanation.md`

## Implementation

- `back/grant-prototype/matching/match_explainer.py`

## Next Steps

If match is strong, run `/a01-app-identify` to start application process.
