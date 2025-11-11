---
description: Match a company profile to relevant grants
---

You are helping match a company to relevant government grants using AI-powered semantic matching.

## Usage

`/match-grants <company-profile-path>`

Example: `/match-grants docs/context/test-companies/emew-profile.json`

## Tasks

1. **Validate Input**
   - Check that company profile file exists
   - Verify JSON structure matches Company schema
   - Extract key matching criteria (sectors, location, revenue, etc.)

2. **Check Prerequisites**
   - Verify grants are uploaded to Gemini (check `gemini-file-index.json`)
   - Check that `matching/grant_matcher.py` exists
   - Verify `GOOGLE_API_KEY` is set

3. **Run Matching**
   - Execute grant matcher:
     ```bash
     cd back/grant-prototype
     uv run python -m matching.grant_matcher <company-profile-path>
     ```
   - Monitor matching process

4. **Analyze Results**
   - Count matched grants
   - Check relevance scores (should be > 0.8 for good matches)
   - Verify reasoning and key criteria met
   - Check funding ranges match company size

5. **Validate Citations**
   - Ensure all matches include citations from grant documents
   - Verify citation format is correct
   - Check that citations are relevant to match reasoning

6. **Report Results**
   - List top 10 matched grants with:
     - Grant title and agency
     - Relevance score
     - Reasoning summary
     - Potential funding amount
     - Key criteria met
   - Highlight any perfect matches (score > 0.95)
   - Suggest improvements if scores are low

## Success Criteria

- [ ] Company profile loaded successfully
- [ ] Matches generated with reasoning
- [ ] Relevance scores > 0.8 for top matches
- [ ] Citations included
- [ ] Output saved to JSON

Report detailed match results with recommendations.
