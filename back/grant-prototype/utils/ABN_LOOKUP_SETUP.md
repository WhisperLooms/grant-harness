# ABN Lookup Setup Guide

## Overview

The ABN Lookup utility validates Australian Business Numbers (ABN) and Australian Company Numbers (ACN) against the official Australian Business Register (ABR).

**Critical for Grant Applications:** Grant applications require accurate legal entity details. This utility ensures company names, ABNs, and ACNs are correct before submission.

## Setup Instructions

### Step 1: Register for ABR GUID

1. **Visit:** https://abr.business.gov.au/Tools/WebServices
2. **Click:** "Register for ABN Lookup web services"
3. **Complete registration form:**
   - Name and organization
   - Email address
   - Intended use (select "Business" or "Research")
   - Accept terms and conditions
4. **Receive GUID via email** (usually within 1-2 business days)

**Note:** ABN Lookup API access is **free** for non-commercial and commercial use.

### Step 2: Set Environment Variable

Once you receive your GUID:

**Windows:**
```bash
set ABR_GUID=your-guid-here-xxxx-xxxx-xxxx
```

**Linux/Mac:**
```bash
export ABR_GUID=your-guid-here-xxxx-xxxx-xxxx
```

**Permanent (Windows):**
```bash
setx ABR_GUID "your-guid-here-xxxx-xxxx-xxxx"
```

**Permanent (Linux/Mac):**
Add to `~/.bashrc` or `~/.zshrc`:
```bash
echo 'export ABR_GUID=your-guid-here-xxxx-xxxx-xxxx' >> ~/.bashrc
source ~/.bashrc
```

### Step 3: Install Dependencies

The utility uses `requests` library (already in dependencies):

```bash
cd back/grant-prototype
uv sync  # Installs all dependencies including requests
```

### Step 4: Test the Utility

```bash
cd back/grant-prototype

# Validate EMEW profile
uv run python -m utils.abn_lookup --validate-emew

# Look up by ABN
uv run python -m utils.abn_lookup --abn "25 000 751 093"

# Look up by ACN
uv run python -m utils.abn_lookup --acn "000 751 093"

# Search by name
uv run python -m utils.abn_lookup --name "EMEW CLEAN"
```

**Expected Output (EMEW validation):**
```
================================================================================
EMEW CLEAN TECHNOLOGIES - ABN VALIDATION
================================================================================

ABN: 25 000 751 093
Expected Name: EMEW CLEAN TECHNOLOGIES PTY LTD

✓ Valid: True
  ABN Exists: True
  ABN Status: Active
  Name Matches: True
  Actual Name: EMEW CLEAN TECHNOLOGIES PTY LTD
  Entity Type: Australian Proprietary Company
  Postcode: 3046
  GST Registered: True
```

## Usage in Code

### Import and Initialize

```python
from utils.abn_lookup import ABNLookup

# Initialize (reads ABR_GUID from environment)
lookup = ABNLookup()

# Or pass GUID directly
lookup = ABNLookup(guid="your-guid-here")
```

### Validate Company Profile

```python
result = lookup.validate_company_profile(
    expected_abn="25 000 751 093",
    expected_name="EMEW CLEAN TECHNOLOGIES PTY LTD"
)

if result['valid']:
    print(f"✓ Valid: {result['actual_name']}")
else:
    print(f"✗ Invalid: {result.get('error', 'Name mismatch')}")
```

### Look Up by ABN

```python
details = lookup.search_by_abn("25 000 751 093")

print(details['EntityName'])  # "EMEW CLEAN TECHNOLOGIES PTY LTD"
print(details['AbnStatus'])   # "Active"
print(details['EntityTypeName'])  # "Australian Proprietary Company"
```

### Look Up by ACN

```python
details = lookup.search_by_acn("000 751 093")
print(details['EntityName'])  # Same as ABN lookup
```

### Search by Name

```python
results = lookup.search_by_name("EMEW CLEAN", max_results=5)

for company in results:
    print(f"{company['Name']} - ABN: {company['Abn']}")
```

## Integration with Company Profiles

### Automated Validation

Add ABN validation to company profile generation:

```python
from utils.abn_lookup import ABNLookup
import json

def generate_company_profile(abn: str, expected_name: str):
    """Generate company profile with ABN validation."""

    lookup = ABNLookup()
    validation = lookup.validate_company_profile(abn, expected_name)

    if not validation['valid']:
        raise ValueError(
            f"ABN validation failed: {validation.get('error', 'Name mismatch')}"
        )

    profile = {
        "id": "company-id",
        "legal_name": validation['actual_name'],
        "abn": ABNLookup.format_abn(abn),
        "acn": ABNLookup.format_acn(abn[2:]),  # Extract ACN from ABN
        "abn_status": validation['abn_status'],
        "abn_verified": True,
        "entity_type": validation['entity_type'],
        "gst_registered": validation['gst_registered'],
        # ... other fields
    }

    return profile
```

### Pre-Submission Validation

Validate company details before generating grant applications:

```python
def validate_before_application(company_profile: dict) -> bool:
    """Validate company profile against ABR before application submission."""

    lookup = ABNLookup()
    result = lookup.validate_company_profile(
        expected_abn=company_profile['abn'],
        expected_name=company_profile['legal_name']
    )

    if not result['valid']:
        print(f"⚠️ WARNING: ABN validation failed")
        print(f"   Expected: {result['expected_name']}")
        print(f"   Actual: {result.get('actual_name', 'Not found')}")
        return False

    if result['abn_status'] != 'Active':
        print(f"⚠️ WARNING: ABN status is {result['abn_status']}, not Active")
        return False

    print(f"✓ ABN validation passed: {result['actual_name']}")
    return True
```

## API Details

### Response Fields

All lookups return these common fields:

| Field | Type | Description |
|-------|------|-------------|
| `Abn` | string | ABN (11 digits, no spaces) |
| `AbnStatus` | string | "Active" or "Cancelled" |
| `EntityName` | string | Legal entity name |
| `EntityTypeName` | string | Type (e.g., "Australian Proprietary Company") |
| `Gst` | string | GST registration date (YYYY-MM-DD) or null |
| `Postcode` | string | Registered postcode |

### Rate Limits

The ABR does not publish specific rate limits, but:
- Reasonable use is expected (not web scraping)
- Batch lookups should be throttled
- For bulk processing, contact ABR for guidance

### Error Handling

```python
try:
    result = lookup.search_by_abn("invalid")
except ValueError as e:
    print(f"Invalid ABN format or not found: {e}")
except requests.HTTPError as e:
    print(f"API request failed: {e}")
```

## Troubleshooting

### Error: "ABR GUID required"

**Cause:** ABR_GUID environment variable not set

**Solution:**
```bash
# Check if set
echo $ABR_GUID  # Linux/Mac
echo %ABR_GUID%  # Windows

# Set it
export ABR_GUID=your-guid-here  # Linux/Mac
set ABR_GUID=your-guid-here  # Windows
```

### Error: "Invalid GUID"

**Cause:** GUID not activated or incorrect

**Solution:**
1. Check email for activation confirmation
2. Verify GUID is exactly as received (no extra spaces)
3. Contact ABR if issues persist: https://abr.business.gov.au/Help/ContactUs

### Error: "ABN not found"

**Cause:** ABN doesn't exist in ABR database

**Solution:**
- Verify ABN is correct (11 digits)
- Check ABN manually at: https://abr.business.gov.au/
- ABN may be cancelled or never registered

## Security Notes

- **DO NOT commit ABR_GUID to version control**
- Store in environment variables or secure configuration
- ABR_GUID is personal/organizational - do not share publicly

## Resources

- **ABN Lookup Website:** https://abr.business.gov.au/
- **Web Services Docs:** https://abr.business.gov.au/Tools/WebServices
- **JSON API Docs:** https://abr.business.gov.au/json/
- **Support:** https://abr.business.gov.au/Help/ContactUs

---

**Last Updated:** 2025-11-12
**Status:** Production-ready utility
