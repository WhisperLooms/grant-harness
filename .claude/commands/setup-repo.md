---
description: Set up Grant-Harness repository for development
---

You are helping set up the Grant-Harness repository for development. Follow these steps:

## Tasks

1. **Verify Directory Structure**
   - Check that all required directories exist (back/grant-prototype/, ..docs/, .cursor/rules/, etc.)
   - List any missing directories

2. **Set Up Python Environment**
   - Navigate to `back/grant-prototype/`
   - Run `uv sync` to install dependencies
   - Verify installation by checking for `.venv/` directory

3. **Environment Configuration**
   - Check if `.env` file exists in `back/grant-prototype/`
   - If not, copy from `.env.example`
   - Remind user to add their GOOGLE_API_KEY

4. **Verify Documentation**
   - Check that CLAUDE.md exists at root
   - Check that ADR-0001 and ADR-0002 exist in `.cursor/rules/platform/ADR.mdc`
   - List any missing documentation files

5. **Run Initial Tests**
   - Navigate to `back/grant-prototype/`
   - Run `uv run pytest tests/ -v` (may fail if no tests exist yet)
   - Report results

## Success Criteria

- [ ] All directories exist
- [ ] Python dependencies installed
- [ ] .env file configured
- [ ] Core documentation present
- [ ] Repository ready for Phase 1 development

Report status of each task and any issues encountered.
