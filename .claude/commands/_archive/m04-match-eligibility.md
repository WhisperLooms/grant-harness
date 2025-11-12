---
description: Detailed eligibility assessment for specific grant
---

# M04: Assess Grant Eligibility

Perform detailed eligibility check for a specific company-grant pair.

## Usage

`/m04-match-eligibility <company-id> <grant-id> [--strict]`

## Tasks

1. **Load Grant Eligibility Criteria**: Extract all criteria from grant details

2. **Check Each Criterion**:
```
Eligibility Assessment: EMEW Corporation ’ Recycling Modernisation Fund

MANDATORY CRITERIA (Must meet ALL):
 1. Australian Business Entity
     Status: PASS
     Evidence: ABN 12345678901 (verified)

 2. Small-Medium Enterprise
     Status: PASS
     Evidence: 25 employees, $5M revenue (within SME definition)

 3. Active in Recycling Sector
     Status: PASS
     Evidence: Primary business: metal recovery and recycling

 4. Co-Contribution Capable (50%)
     Status: WARNING - VERIFY
     Evidence: Annual revenue $5M, but need to confirm $2.5M availability
     Action: Verify cash reserves or investor commitment

MERIT CRITERIA (Strengthen Application):
 1. Research & Development Activity
     Score: HIGH
     Evidence: RMIT partnership, CSIRO collaboration, patents pending

 2. Export Capability
     Score: HIGH
     Evidence: Current exports to NZ, Singapore, Malaysia

 3. Innovation & Technology
     Score: HIGH
     Evidence: Proprietary electrowinning technology

 4. Environmental Impact
     Score: VERY HIGH
     Evidence: 100% metal recovery, zero waste to landfill

  5. Previous Grant Success
     Score: MEDIUM
     Evidence: Victorian Export Grant (2022), no federal grants yet

EXCLUSIONS (Must NOT apply to company):
 None apply - No exclusions match company profile

OVERALL ELIGIBILITY: ELIGIBLE 
Confidence: 95%

Risk Factors:
- Co-contribution requirement needs verification (Medium Risk)
- Competitive program, strong application needed (Low Risk)

Recommendation: PROCEED WITH APPLICATION
```

3. **Generate Eligibility Certificate**: `.outputs/m04-match-eligibility/{company_id}_{grant_id}_eligibility.pdf`

## Strict Mode

If `--strict`, flag any criterion with <100% certainty as REQUIRES VERIFICATION.

## Implementation

- `back/grant-prototype/matching/eligibility_checker.py`
