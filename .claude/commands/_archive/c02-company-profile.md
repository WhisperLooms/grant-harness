---
description: Build structured company profile from scraped data
---

# C02: Build Company Profile

Transform raw scraped data into a standardized company profile for grant matching.

## Usage

`/c02-company-profile <company-id> [--manual-data key=value] [--output-format json|yaml]`

## Tasks

1. **Load Scraped Data**: Read from `.outputs/c01-company-scrape/{company_id}/company_raw_data.json`

2. **Create Standardized Profile**: Map to standard Company schema (Pydantic model)

3. **Enrich Profile**:
   - Calculate grant eligibility scores
   - Identify target grant programs based on sectors
   - Extract key matching criteria (R&D capability, export, sustainability)

4. **Save Profile**: Output to `.outputs/c02-company-profile/{company_id}_profile.json`

## Profile Schema

```json
{
  "company_id": "emew_20251112",
  "profile_version": "1.0",
  "created_at": "2025-11-12T14:30:22Z",
  "company_name": "EMEW Corporation",
  "state": "VIC",
  "sectors": ["recycling", "manufacturing"],
  "annual_revenue": 5000000,
  "employee_count": 25,
  "looking_for": ["R&D funding", "Export grants", "Circular economy"],
  "eligibility_indicators": {
    "australian_business": true,
    "abn_verified": true,
    "sme": true,
    "export_ready": true,
    "r_and_d_active": true,
    "sustainability_focus": true
  },
  "matching_keywords": ["metal recovery", "electrowinning", "recycling", "manufacturing", "export", "R&D"]
}
```

## Implementation

- `back/grant-prototype/profilers/company_profiler.py`

## Next Steps

Run `/c03-company-vector` to create vector database for matching.
