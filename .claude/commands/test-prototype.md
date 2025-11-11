---
description: Run full test suite for grant-prototype
---

You are helping run the complete test suite for the Grant-Harness Phase 1 prototype.

## Tasks

1. **Unit Tests**
   - Navigate to `back/grant-prototype/`
   - Run pytest with coverage:
     ```bash
     cd back/grant-prototype
     uv run pytest tests/ -v --cov=. --cov-report=term-missing
     ```
   - Report test results and coverage percentage

2. **Scraper Tests**
   - Run scraper-specific tests:
     ```bash
     uv run pytest tests/test_scrapers.py -v
     ```
   - Verify all scrapers pass validation tests
   - Check error handling tests

3. **Gemini Store Tests**
   - Run Gemini integration tests:
     ```bash
     uv run pytest tests/test_gemini_store.py -v
     ```
   - Verify upload and query functionality
   - Check API error handling

4. **Matching Tests**
   - Run matching engine tests:
     ```bash
     uv run pytest tests/test_matching.py -v
     ```
   - Verify EMEW test case passes
   - Check relevance score calculations

5. **Code Quality Checks**
   - Run black formatter check:
     ```bash
     black --check .
     ```
   - Run ruff linter:
     ```bash
     ruff check .
     ```
   - Run mypy type checker (if configured):
     ```bash
     mypy .
     ```

6. **Integration Test**
   - If all unit tests pass, run full integration:
     1. Scrape 5 test grants
     2. Upload to Gemini
     3. Match EMEW profile
     4. Verify end-to-end workflow

7. **Report Results**
   - Summarize test statistics:
     - Total tests run
     - Passed/Failed counts
     - Code coverage percentage
     - Linter warnings
   - List any failing tests with details
   - Suggest fixes for failures

## Success Criteria

- [ ] All unit tests passing
- [ ] Code coverage > 80%
- [ ] No linter errors
- [ ] Integration test succeeds
- [ ] EMEW match score > 0.8

Report comprehensive test results and code quality metrics.
