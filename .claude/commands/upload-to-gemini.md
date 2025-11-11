---
description: Upload scraped grants to Gemini File API
---

You are helping upload scraped grant data to Gemini File Search for semantic matching.

## Tasks

1. **Verify Prerequisites**
   - Check that `GOOGLE_API_KEY` is set in `.env`
   - Verify grant data files exist in `back/grant-prototype/output/`
   - Check that `gemini_store/file_manager.py` exists

2. **Prepare Upload**
   - Navigate to `back/grant-prototype/`
   - List all grant files to be uploaded
   - Estimate total documents

3. **Upload to Gemini**
   - Run file upload manager:
     ```bash
     cd back/grant-prototype
     uv run python -m gemini_store.file_manager
     ```
   - Monitor upload progress

4. **Update Index**
   - Verify `docs/context/grants/gemini-file-index.json` is updated
   - Check that file IDs and metadata are recorded
   - Count total grants in corpus

5. **Test Query**
   - Run a test query to verify upload:
     ```bash
     cd back/grant-prototype
     uv run python -m gemini_store.query_engine "grants for metal recycling"
     ```
   - Verify relevant results returned

6. **Report Results**
   - List uploaded grants with file IDs
   - Report corpus size
   - Suggest next steps (e.g., match companies)

## Success Criteria

- [ ] All grant files uploaded successfully
- [ ] Index file updated
- [ ] Test query returns relevant results
- [ ] No upload errors

Report upload statistics and corpus information.
