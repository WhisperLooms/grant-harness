# G01: Compile Comprehensive Grant Lists

You are assisting with the Grant-Harness project's grant discovery workflow. Your task is to scrape grant listings from Australian government websites and compile them into a comprehensive CSV file.

## Context

This is the **first step** in the grant workflow (g→c→m→a→p→s). This command discovers available grants and creates a foundational list that subsequent commands will build upon.

## Grant Sources

Refer to `.docs/research/Australian Government Grant Sources.md` for:
- List of 50+ documented grant sources
- URLs and technical scraping details
- Data formats and difficulty ratings

**Phase 1 Priority Sources** (implement first):
1. **GrantConnect** (Federal) - https://www.grants.gov.au/
2. **Sustainability Victoria** - https://www.sustainability.vic.gov.au/grants-and-funding
3. **NSW Grants Portal** - https://www.service.nsw.gov.au/grants
4. **Business Queensland** - https://www.business.qld.gov.au/starting-business/advice-support/grants

## Task Requirements

### Input Parameters

Parse command arguments:
- `--sources` (optional): Comma-separated list of sources to scrape (e.g., `federal,vic,nsw,qld` or `all`)
  - Default: `all` priority sources
- `--from-date` (optional): Only include grants opening on or after this date (format: YYYY-MM-DD)
  - Default: Use `GRANT_FROM_DATE` from `.env` (currently 2026-01-01)
- `--output` (optional): Custom output filename
  - Default: Auto-generate with timestamp

### Implementation Steps

1. **Setup Environment**:
   - Verify crawl4ai is installed: `uv sync`
   - Load environment variables from `.env`
   - Verify `GOOGLE_API_KEY` is set (for Gemini-powered extraction)

2. **Initialize Crawler**:
   ```python
   from crawl4ai import AsyncWebCrawler
   from crawl4ai.extraction_strategy import LLMExtractionStrategy

   crawler = AsyncWebCrawler(verbose=True)
   ```

3. **Configure Extraction Strategy**:
   Use LLM-guided extraction with this instruction:
   ```python
   extraction_strategy = LLMExtractionStrategy(
       provider="google/gemini-1.5-pro",
       api_token=os.getenv("GOOGLE_API_KEY"),
       instruction="""
       Extract ALL grant listings from this page. For each grant, provide:
       - title: Grant program name
       - agency: Administering government agency
       - jurisdiction: Federal, VIC, NSW, QLD, WA, SA, TAS, NT, or ACT
       - sectors: Relevant sectors (recycling, renewable-energy, manufacturing, ai, other)
       - funding_min: Minimum funding amount (integer, or null if not specified)
       - funding_max: Maximum funding amount (integer, or null if not specified)
       - opens: Opening date (YYYY-MM-DD format, or null if not specified)
       - closes: Closing date (YYYY-MM-DD format, or null if not specified)
       - url: Direct link to grant details page
       - status: open, upcoming, or closed

       Return as JSON array of objects.
       """
   )
   ```

4. **Scrape Each Source**:
   - For each selected source, navigate to the grants listing page
   - Handle pagination (crawl4ai supports multi-page crawling)
   - Extract grant data using LLMExtractionStrategy
   - Parse dates using `python-dateutil` to handle Australian date formats
   - Filter grants: Include only those with `opens >= from_date`

5. **Handle Errors**:
   - If crawl4ai fails (timeout, complex JavaScript), log the error
   - Suggest fallback: "Source [name] failed. Consider using playwright MCP for manual extraction."
   - Continue with remaining sources

6. **Combine & Deduplicate**:
   - Merge results from all sources
   - Generate unique `grant_id` (format: `{jurisdiction_code}{year}{sequential_number}`)
     - Examples: `GC2026001`, `VIC2026042`, `NSW2026018`
   - Deduplicate based on title + agency + closing date

7. **Export to CSV**:
   ```csv
   grant_id,title,agency,jurisdiction,sectors,funding_min,funding_max,opens,closes,url,status
   GC2026001,Recycling Modernisation Fund,DCCEEW,Federal,recycling,50000,10000000,2026-01-15,2026-04-30,https://...,upcoming
   VIC2026001,Circular Economy Business Innovation Fund,Sustainability Victoria,VIC,"recycling,manufacturing",25000,250000,2026-02-01,2026-05-31,https://...,upcoming
   ```

8. **Save Output**:
   - Create directory if not exists: `back/grant-prototype/.outputs/g01-grant-lists/`
   - Filename: `g01-grant-list_{timestamp}.csv` (e.g., `g01-grant-list_20251112T143022.csv`)
   - Also save JSON version: `g01-grant-list_{timestamp}.json` (for programmatic use)

9. **Summary Report**:
   Print summary to user:
   ```
   ✓ Grant List Compiled Successfully

   Sources scraped: 4 (federal, vic, nsw, qld)
   Total grants found: 127
   Filtered (from-date): 89 grants
   Date range: 2026-01-01 to 2026-12-31

   Output files:
   - CSV: back/grant-prototype/.outputs/g01-grant-lists/g01-grant-list_20251112T143022.csv
   - JSON: back/grant-prototype/.outputs/g01-grant-lists/g01-grant-list_20251112T143022.json

   Next steps:
   1. Review the CSV file to identify grants of interest
   2. Run /g02-grant-docs <csv-path> to scrape full details
   ```

### Data Validation

Before saving, validate each grant entry:
- Required fields: `grant_id`, `title`, `agency`, `jurisdiction`, `url`, `status`
- Optional fields: All others (allow null/empty)
- Date format: YYYY-MM-DD (validate with dateutil parser)
- Funding amounts: Must be positive integers if specified
- Status: Must be one of ["open", "upcoming", "closed"]

### Error Handling

- **Network errors**: Retry up to 3 times with exponential backoff
- **Extraction failures**: Log warning, skip grant, continue
- **Date parsing errors**: Try multiple Australian date formats, default to null if all fail
- **Missing required fields**: Log error, skip grant entry
- **Rate limiting**: Respect `SCRAPER_DOWNLOAD_DELAY` setting (default 2 seconds)

## Expected Output

A CSV file at `back/grant-prototype/.outputs/g01-grant-lists/g01-grant-list_{timestamp}.csv` with columns:
- grant_id
- title
- agency
- jurisdiction
- sectors (comma-separated string)
- funding_min
- funding_max
- opens
- closes
- url
- status

This CSV will be used as input to `/g02-grant-docs` command.

## Implementation Location

Create or update:
- `back/grant-prototype/scrapers/grant_list_crawler.py` - Main crawler implementation
- `back/grant-prototype/scrapers/sources/{federal,vic,nsw,qld}.py` - Source-specific configurations
- `back/grant-prototype/scrapers/utils/date_parser.py` - Australian date parsing utilities
- `back/grant-prototype/models/entities.py` - Add `Grant` Pydantic model if not exists

## Testing

After implementation, test with:
```bash
cd back/grant-prototype
uv run python -m scrapers.grant_list_crawler --sources federal --from-date 2026-01-01
```

Verify:
- CSV file created with timestamp
- At least 10 grants extracted from GrantConnect
- All required fields populated
- Dates formatted correctly (YYYY-MM-DD)
- Grant IDs are unique
