---
description: Scrape grants from specified sources
---

You are helping scrape government grants from specified sources.

## Usage

`/scrape-grants [sources...]`

Where `[sources...]` can be:
- `federal` - GrantConnect (Federal)
- `vic` - Sustainability Victoria
- `nsw` - NSW Grants Portal
- `qld` - Business Queensland
- `all` - All sources

## Tasks

1. **Validate Sources**
   - Check that requested sources are valid
   - List which scrapers will be run

2. **Check Scraper Implementation**
   - Navigate to `back/grant-prototype/scrapers/`
   - Verify that requested scraper files exist:
     - `federal_grants.py` for federal
     - `vic_grants.py` for vic
     - `nsw_grants.py` for nsw
     - `qld_grants.py` for qld
   - Report if any scrapers are not yet implemented

3. **Run Scrapers**
   - For each valid source, run the scraper:
     ```bash
     cd back/grant-prototype
     uv run python -m scrapers.{source}_grants
     ```
   - Monitor output for errors

4. **Validate Output**
   - Check for output files in `back/grant-prototype/output/`
   - Verify JSON structure matches Grant schema
   - Count grants scraped per source

5. **Report Results**
   - List scraped grants with counts
   - Report any errors or warnings
   - Suggest next steps (e.g., upload to Gemini)

## Success Criteria

- [ ] All requested scrapers executed
- [ ] Output files generated
- [ ] Grant data validated
- [ ] No critical errors

Report detailed results with grant counts and any issues.
