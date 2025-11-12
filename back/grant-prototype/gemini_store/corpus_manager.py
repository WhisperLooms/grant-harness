"""
Corpus Manager - Dual-Corpus Coordination

Implements ADR-2051: Gemini Dual-Corpus Architecture
- Grant Corpus: All grant documents (used for discovery/matching)
- Company Corpus: Company-specific documents (used for application population)

This separation enables:
1. Precise semantic search ("Which grants fund battery recycling?")
2. Efficient application population ("What are EMEW's core capabilities?")
3. Better relevance scores without cross-contamination
"""

import os
from pathlib import Path
from typing import Optional, Dict, Any
from google import genai

from .grant_corpus import GrantCorpus
from .company_corpus import CompanyCorpus


class CorpusManager:
    """
    Manages dual-corpus Gemini File Search system.

    Coordinates Grant Corpus and Company Corpus operations,
    ensuring proper isolation while enabling cross-corpus matching workflows.

    Attributes:
        grant_corpus (GrantCorpus): Manages grant documents
        company_corpus (CompanyCorpus): Manages company documents
        client (genai.Client): Gemini API client

    Example:
        >>> manager = CorpusManager()
        >>> manager.initialize()  # Creates both corpora
        >>> manager.grant_corpus.upload_document("igp-guidelines.pdf")
        >>> manager.company_corpus.upload_document("emew-business-plan.pdf", company_id="emew")
    """

    def __init__(self, api_key: Optional[str] = None):
        """
        Initialize CorpusManager with Gemini API credentials.

        Args:
            api_key: Google API key (defaults to GOOGLE_API_KEY env var)

        Raises:
            ValueError: If API key not found
        """
        self.api_key = api_key or os.getenv("GOOGLE_API_KEY")
        if not self.api_key:
            raise ValueError(
                "GOOGLE_API_KEY not found. Set it via environment variable or pass to constructor."
            )

        # Create Gemini API client
        self.client = genai.Client(api_key=self.api_key)

        # Initialize corpus managers
        self.grant_corpus = GrantCorpus(self.client)
        self.company_corpus = CompanyCorpus(self.client)

    def initialize(self, force_recreate: bool = False) -> Dict[str, str]:
        """
        Initialize both Grant and Company corpora.

        Creates Gemini File Search stores for each corpus if they don't exist.
        Stores corpus names in `.inputs/.gemini_config.json` for persistence.

        Args:
            force_recreate: If True, delete and recreate existing corpora

        Returns:
            dict: Corpus names {"grant_corpus": "...", "company_corpus": "..."}

        Example:
            >>> manager = CorpusManager()
            >>> corpus_names = manager.initialize()
            >>> print(corpus_names)
            {'grant_corpus': 'fileSearchStores/abc123', 'company_corpus': 'fileSearchStores/def456'}
        """
        config_path = Path(".inputs/.gemini_config.json")
        config_path.parent.mkdir(parents=True, exist_ok=True)

        # Initialize Grant Corpus
        grant_store_name = self.grant_corpus.create_or_get_corpus(
            display_name="grant-harness-grant-corpus",
            force_recreate=force_recreate
        )

        # Initialize Company Corpus
        company_store_name = self.company_corpus.create_or_get_corpus(
            display_name="grant-harness-company-corpus",
            force_recreate=force_recreate
        )

        # Save corpus names to config
        import json
        config = {
            "grant_corpus": grant_store_name,
            "company_corpus": company_store_name
        }
        config_path.write_text(json.dumps(config, indent=2))

        print(f"[OK] Gemini File Search initialized:")
        print(f"   Grant Corpus: {grant_store_name}")
        print(f"   Company Corpus: {company_store_name}")
        print(f"   Config saved to: {config_path}")

        return config

    def list_all_stores(self) -> None:
        """
        List all File Search stores in the project.

        Useful for debugging and understanding corpus state.
        """
        print("[LIST] All Gemini File Search Stores:")
        for store in self.client.file_search_stores.list():
            print(f"   - {store.name} ({store.display_name})")
            # Get store stats if available
            try:
                details = self.client.file_search_stores.get(name=store.name)
                # Count files in store (if API provides this)
                print(f"     Created: {store.create_time}")
            except Exception as e:
                print(f"     (Could not fetch details: {e})")

    def query_grants(
        self,
        query: str,
        metadata_filter: Optional[str] = None,
        model: str = "gemini-2.0-flash-exp"
    ) -> str:
        """
        Query Grant Corpus for relevant grants.

        Uses semantic search to find grants matching the query.

        Args:
            query: Natural language question (e.g., "grants for battery recycling")
            metadata_filter: Optional filter (e.g., "jurisdiction=VIC AND funding_min>100000")
            model: Gemini model to use

        Returns:
            str: LLM response with cited grant information

        Example:
            >>> response = manager.query_grants("grants for metal recycling companies in Victoria")
            >>> print(response)
        """
        return self.grant_corpus.query(query, metadata_filter=metadata_filter, model=model)

    def query_company(
        self,
        company_id: str,
        query: str,
        model: str = "gemini-2.0-flash-exp"
    ) -> str:
        """
        Query Company Corpus for specific company information.

        Args:
            company_id: Company identifier (e.g., "emew")
            query: Question about company (e.g., "What are EMEW's core capabilities?")
            model: Gemini model to use

        Returns:
            str: LLM response with cited company information

        Example:
            >>> response = manager.query_company("emew", "What is EMEW's annual revenue?")
            >>> print(response)
        """
        metadata_filter = f"company_id={company_id}"
        return self.company_corpus.query(query, metadata_filter=metadata_filter, model=model)

    def match_company_to_grants(
        self,
        company_id: str,
        top_k: int = 10,
        model: str = "gemini-2.0-flash-exp"
    ) -> str:
        """
        Match a company to relevant grants using cross-corpus workflow.

        Workflow:
        1. Query Company Corpus to understand company profile
        2. Extract key terms (industry, capabilities, location)
        3. Query Grant Corpus with company context
        4. Rank and return top matches

        Args:
            company_id: Company identifier
            top_k: Number of grant matches to return
            model: Gemini model to use

        Returns:
            str: LLM response with top grant matches and reasoning

        Example:
            >>> matches = manager.match_company_to_grants("emew", top_k=5)
            >>> print(matches)
        """
        # Step 1: Get company profile summary
        company_summary = self.query_company(
            company_id,
            "Summarize this company's industry, key capabilities, products, and geographic location in 3-4 sentences."
        )

        # Step 2: Query grants with company context
        grant_query = f"""
        Based on this company profile:
        {company_summary}

        Find the top {top_k} most relevant Australian government grants. For each grant, explain:
        1. Why it matches this company (specific criteria met)
        2. Funding range and deadline
        3. Key eligibility requirements

        Rank by relevance.
        """

        matches = self.query_grants(grant_query, model=model)

        return matches

    def health_check(self) -> Dict[str, Any]:
        """
        Verify Gemini File Search setup is healthy.

        Checks:
        - API key valid
        - Both corpora exist
        - Can query both corpora

        Returns:
            dict: Health status for each component

        Example:
            >>> health = manager.health_check()
            >>> print(health)
            {'api_key': 'valid', 'grant_corpus': 'ok', 'company_corpus': 'ok'}
        """
        status = {
            "api_key": "unknown",
            "grant_corpus": "unknown",
            "company_corpus": "unknown"
        }

        # Check API key
        try:
            # Try listing stores to verify API key works
            list(self.client.file_search_stores.list())
            status["api_key"] = "valid"
        except Exception as e:
            status["api_key"] = f"error: {str(e)}"
            return status  # No point checking corpora if API key fails

        # Check Grant Corpus
        try:
            if self.grant_corpus.store_name:
                self.client.file_search_stores.get(name=self.grant_corpus.store_name)
                status["grant_corpus"] = "ok"
            else:
                status["grant_corpus"] = "not initialized"
        except Exception as e:
            status["grant_corpus"] = f"error: {str(e)}"

        # Check Company Corpus
        try:
            if self.company_corpus.store_name:
                self.client.file_search_stores.get(name=self.company_corpus.store_name)
                status["company_corpus"] = "ok"
            else:
                status["company_corpus"] = "not initialized"
        except Exception as e:
            status["company_corpus"] = f"error: {str(e)}"

        return status


if __name__ == "__main__":
    # Quick test/demo
    manager = CorpusManager()
    print("Initializing Gemini File Search...")
    corpus_names = manager.initialize()
    print("\nHealth check:")
    print(manager.health_check())
