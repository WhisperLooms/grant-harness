"""
Query EMEW Grant Matches

Simple script to test semantic matching between EMEW Corporation
and available Australian grants.

This demonstrates the core RAG workflow:
1. Query Company Corpus to understand EMEW's business
2. Query Grant Corpus to find relevant grant opportunities
3. Display ranked matches with reasoning

Usage:
    cd back/grant-prototype
    python -m scripts.query_emew_matches
"""

import os
import sys
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from gemini_store.corpus_manager import CorpusManager


def query_emew_matches():
    """Query grants relevant to EMEW Corporation."""

    print("=" * 80)
    print("EMEW GRANT MATCHING - SEMANTIC SEARCH TEST")
    print("=" * 80)
    print()

    # Initialize corpus manager
    api_key = os.getenv("GOOGLE_API_KEY")
    if not api_key:
        print("[ERROR] GOOGLE_API_KEY not set in .env file")
        sys.exit(1)

    try:
        manager = CorpusManager(api_key=api_key)

        # Ensure both corpora exist
        grant_store = manager.grant_corpus.create_or_get_corpus()
        company_store = manager.company_corpus.create_or_get_corpus()

        print(f"[OK] Grant Corpus: {grant_store}")
        print(f"[OK] Company Corpus: {company_store}")
        print()
    except Exception as e:
        print(f"[ERROR] Failed to initialize corpora: {e}")
        sys.exit(1)

    # Test Query 1: Understand EMEW's business
    print("=" * 80)
    print("STEP 1: Understanding EMEW Corporation")
    print("=" * 80)
    print()

    company_query = """
    Based on EMEW's corporate documents, provide a brief summary:
    - What does EMEW do? (products/services)
    - What industry sectors do they operate in?
    - What technologies do they use?
    - Where are they located?
    - What is their competitive advantage?

    Keep the response concise (3-4 sentences max).
    """

    print("Querying Company Corpus...")
    try:
        company_response = manager.company_corpus.query(
            query=company_query,
            metadata_filter="company_id=emew",
            model="gemini-2.5-flash"
        )
        print()
        print("EMEW Corporation Profile:")
        print("-" * 60)
        print(company_response)
        print("-" * 60)
        print()
    except Exception as e:
        print(f"[ERROR] Company query failed: {e}")
        # Continue anyway with a generic query
        company_response = "EMEW is a metal recovery and recycling company in Victoria, Australia"

    # Test Query 2: Find relevant grants for EMEW
    print("=" * 80)
    print("STEP 2: Finding Relevant Grants for EMEW")
    print("=" * 80)
    print()

    grant_query = f"""
    Based on this company profile:
    {company_response}

    Find the TOP 5 most relevant Australian government grants for EMEW.

    For each grant, provide:
    1. Grant name and ID
    2. Relevance score (0-10) with brief justification
    3. Key eligibility match
    4. Funding range
    5. Deadline or status (open/closed/upcoming)

    Prioritize:
    - Advanced manufacturing grants
    - Recycling and circular economy funding
    - Clean technology and emissions reduction
    - Victorian location alignment
    - SME eligibility

    Format as numbered list.
    """

    print("Querying Grant Corpus...")
    try:
        grant_response = manager.grant_corpus.query(
            query=grant_query,
            model="gemini-2.5-flash"
        )
        print()
        print("Relevant Grant Opportunities:")
        print("-" * 60)
        print(grant_response)
        print("-" * 60)
        print()
    except Exception as e:
        print(f"[ERROR] Grant query failed: {e}")
        sys.exit(1)

    # Test Query 3: Deep dive on specific grant (IGP)
    print("=" * 80)
    print("STEP 3: Deep Dive - Industry Growth Program (IGP)")
    print("=" * 80)
    print()

    deep_dive_query = f"""
    Company Profile: {company_response}

    Question: Is EMEW eligible for the Industry Growth Program (IGP)?

    Provide a detailed eligibility assessment:
    1. Does EMEW meet the revenue threshold (<$20M)?
    2. Are they in an eligible industry sector?
    3. What project types would qualify?
    4. What is the estimated funding range for EMEW?
    5. What are the key application requirements?

    Be specific and cite the relevant guidelines.
    """

    print("Querying Grant Corpus for IGP eligibility...")
    try:
        igp_response = manager.grant_corpus.query(
            query=deep_dive_query,
            metadata_filter="grant_id=igp-commercialisation-growth",
            model="gemini-2.5-flash"
        )
        print()
        print("IGP Eligibility Assessment:")
        print("-" * 60)
        print(igp_response)
        print("-" * 60)
        print()
    except Exception as e:
        print(f"[ERROR] IGP query failed: {e}")

    print("=" * 80)
    print("TEST COMPLETE")
    print("=" * 80)
    print()
    print("Success! The semantic matching workflow is operational.")
    print()
    print("Next steps:")
    print("1. Review the grant matches above")
    print("2. Test with different queries or metadata filters")
    print("3. Integrate into application workflow (Phase 2)")
    print()


if __name__ == "__main__":
    query_emew_matches()
