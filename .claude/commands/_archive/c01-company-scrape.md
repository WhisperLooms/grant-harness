---
description: Extract company data from website for grant matching
---

# C01: Scrape Company Website

You are assisting with the Grant-Harness project's company profiling workflow. Your task is to scrape data from a company's website to build a comprehensive profile for grant matching.

## Context

This is the **first step** in the company profiling workflow (c’m). This command extracts information about a company from their website to understand their business, capabilities, and grant eligibility.

## Usage

`/c01-company-scrape <company-url> [--name "Company Name"] [--depth shallow|deep] [--output-dir .outputs/c01-company-scrape]`

**Arguments**:
- `<company-url>` (required): Company website URL (e.g., https://emew.com.au)
- `--name` (optional): Company name override (if not detectable from website)
- `--depth` (optional): `shallow` (homepage + about), `deep` (crawl entire site) (default: shallow)
- `--output-dir` (optional): Custom output directory

## Tasks

### 1. Initialize Crawler

Setup crawl4ai with company-specific extraction:
```python
from crawl4ai import AsyncWebCrawler
from crawl4ai.extraction_strategy import LLMExtractionStrategy

extraction_strategy = LLMExtractionStrategy(
    provider="google/gemini-1.5-pro",
    api_token=os.getenv("GOOGLE_API_KEY"),
    instruction="""
    Extract company information from this page:

    COMPANY BASICS:
    - company_name: Official company name
    - trading_name: Trading or brand name (if different)
    - abn: Australian Business Number (if visible)
    - industry: Primary industry sector
    - founded_year: Year established
    - headquarters_location: City and state

    BUSINESS DETAILS:
    - description: Company description (2-3 paragraphs)
    - products_services: List of main products/services
    - sectors: Relevant sectors (recycling, renewable-energy, manufacturing, ai, other)
    - technologies: Key technologies used
    - certifications: Relevant certifications (ISO, industry-specific)

    SIZE & SCALE:
    - employee_count: Approximate number of employees (or range)
    - annual_revenue: Approximate annual revenue (or range)
    - locations: List of operating locations
    - markets: Geographic markets served (local, national, international)

    CAPABILITIES:
    - research_development: R&D capabilities (yes/no, description)
    - manufacturing: Manufacturing capabilities (yes/no, description)
    - export: Export experience (yes/no, countries)
    - innovation: Recent innovations or patents
    - sustainability: Environmental/sustainability initiatives

    GRANT INDICATORS:
    - expansion_plans: Future expansion or growth plans
    - investment_needs: Areas seeking investment
    - collaborations: Partnerships with universities/research institutes
    - previous_grants: Mention of previous government grants or funding

    CONTACT:
    - website: Main website URL
    - email: General contact email
    - phone: Phone number
    - address: Physical address

    Return as JSON object.
    """
)
```

### 2. Crawl Company Website

**Shallow Crawl (default)**:
- Homepage
- About Us / About page
- Products/Services page
- Capabilities page
- Contact page

**Deep Crawl** (`--depth=deep`):
- All pages up to 3 levels deep
- Include: news, case studies, projects, team pages
- Exclude: terms, privacy, careers (unless relevant)
- Limit: 50 pages max

### 3. Extract Structured Data

For each page crawled:
- Apply LLM extraction strategy
- Aggregate information across pages
- Resolve conflicts (e.g., different employee counts on different pages ’ use most recent/specific)

### 4. Enrich with External Data

If available, supplement with:
- **ABN Lookup** (Australian Business Register API):
  - Verify ABN
  - Get registered business name
  - Get GST status, entity type
- **LinkedIn** (if company page found):
  - Employee count (more accurate)
  - Industry classification
- **News/Media** (Google search for company name + "grant" or "funding"):
  - Previous grant awards
  - Expansion announcements

### 5. Generate Company Profile

Save structured data:
```json
{
  "company_id": "emew_20251112",
  "scraped_at": "2025-11-12T14:30:22Z",
  "source": "https://emew.com.au",
  "basic_info": {
    "company_name": "EMEW Corporation",
    "abn": "12345678901",
    "industry": "Metal Recovery & Recycling",
    "founded_year": 2001,
    "headquarters": "Melbourne, VIC"
  },
  "business_profile": {
    "description": "...",
    "products_services": ["Metal recovery systems", "Electrochemical technology"],
    "sectors": ["recycling", "manufacturing"],
    "technologies": ["Electrowinning", "Heavy metal recovery"],
    "certifications": ["ISO 9001", "ISO 14001"]
  },
  "size_scale": {
    "employee_count": 25,
    "annual_revenue": 5000000,
    "locations": ["Melbourne VIC", "Sydney NSW"],
    "markets": ["Australia", "New Zealand", "Southeast Asia"]
  },
  "capabilities": {
    "research_development": true,
    "r_and_d_description": "Proprietary electrowinning technology",
    "manufacturing": true,
    "export": true,
    "export_countries": ["NZ", "Singapore", "Malaysia"],
    "innovation": "Patent-pending metal recovery process",
    "sustainability": "100% metal recovery, zero waste to landfill"
  },
  "grant_indicators": {
    "expansion_plans": "Planning Southeast Asian expansion",
    "investment_needs": ["R&D for new metals", "Export market development"],
    "collaborations": ["RMIT University", "CSIRO"],
    "previous_grants": ["Victorian Export Grant (2022)"]
  },
  "contact": {
    "website": "https://emew.com.au",
    "email": "info@emew.com.au",
    "phone": "+61 3 1234 5678",
    "address": "123 Industrial Dr, Melbourne VIC 3000"
  },
  "scraped_pages": [
    {"url": "https://emew.com.au", "title": "Home", "word_count": 850},
    {"url": "https://emew.com.au/about", "title": "About Us", "word_count": 1200}
  ]
}
```

### 6. Save Output

- **Primary**: `.outputs/c01-company-scrape/{company_id}/company_raw_data.json`
- **Pages**: `.outputs/c01-company-scrape/{company_id}/pages/` (HTML/text of scraped pages)
- **Index**: Update `.outputs/c01-company-scrape/index.json`

### 7. Generate Summary

```
 Company Scraped Successfully

Company: EMEW Corporation
Website: https://emew.com.au
Pages scraped: 5
Data completeness: 85%

Key Information Extracted:
- Industry: Metal Recovery & Recycling
- Employees: 25
- Revenue: $5M
- Sectors: recycling, manufacturing
- Export: Yes (3 countries)
- R&D: Yes (RMIT, CSIRO partnerships)

Grant Potential: High
- Previous grant recipient
- Active R&D program
- Expansion plans identified
- Sustainability focus

Missing Information (for manual review):
- ABN not found on website
- Exact revenue not disclosed

Output: .outputs/c01-company-scrape/emew_20251112/

Next steps:
1. Review scraped data for accuracy
2. Add missing information manually if needed
3. Run /c02-company-profile to create structured profile
```

## Data Quality Checks

- **Completeness**: Flag if <50% of fields populated
- **Consistency**: Check employee count vs. "small business" claim
- **Accuracy**: Validate ABN format, phone numbers, addresses
- **Relevance**: Ensure description is substantive (>200 chars)

## Error Handling

- **404/Access denied**: Try alternate pages, report partial data
- **JavaScript-heavy sites**: Use playwright MCP as fallback
- **Rate limiting**: Respect `SCRAPER_DOWNLOAD_DELAY`
- **No company data found**: Prompt for manual profile creation

## Implementation Location

- `back/grant-prototype/scrapers/company_scraper.py`
- `back/grant-prototype/scrapers/utils/abn_lookup.py`
- `back/grant-prototype/models/entities.py` (add Company model)

## Testing

Test with known companies:
```bash
cd back/grant-prototype
uv run python -m scrapers.company_scraper https://emew.com.au
```

## Next Steps

After successful scraping, run `/c02-company-profile` to create standardized profile.
