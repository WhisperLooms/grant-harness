"""
Grant Corpus - Grant Document Management

Manages the Grant Corpus in Gemini File Search:
- Upload grant PDFs and guidelines
- Tag with metadata (grant_id, jurisdiction, funding_range, deadline)
- Query for grant discovery and matching

Per ADR-2051, the Grant Corpus contains ONLY grant documents to ensure
precise semantic search without company data contamination.
"""

from pathlib import Path
from typing import Optional, Dict, Any, List
import google.generativeai as genai
from google.generativeai import types


class GrantCorpus:
    """
    Manages grant documents in Gemini File Search.

    Responsible for:
    - Creating/accessing Grant Corpus store
    - Uploading grant PDFs with metadata
    - Querying for grant discovery

    Attributes:
        client: Gemini API client
        store_name: File Search store identifier
    """

    def __init__(self, client: genai.Client):
        """
        Initialize Grant Corpus manager.

        Args:
            client: Configured Gemini API client
        """
        self.client = client
        self.store_name: Optional[str] = None

    def create_or_get_corpus(
        self,
        display_name: str = "grant-harness-grant-corpus",
        force_recreate: bool = False
    ) -> str:
        """
        Create Grant Corpus store or get existing one.

        Args:
            display_name: Human-readable store name
            force_recreate: Delete existing store and create new one

        Returns:
            str: Store name (e.g., "fileSearchStores/abc123")
        """
        # Check if store already exists with this display name
        existing_store = None
        for store in self.client.file_search_stores.list():
            if store.display_name == display_name:
                existing_store = store
                break

        if existing_store and force_recreate:
            print(f"🗑️  Deleting existing Grant Corpus: {existing_store.name}")
            self.client.file_search_stores.delete(
                name=existing_store.name,
                config={'force': True}
            )
            existing_store = None

        if existing_store:
            print(f"✅ Using existing Grant Corpus: {existing_store.name}")
            self.store_name = existing_store.name
            return existing_store.name

        # Create new store
        print(f"🆕 Creating new Grant Corpus: {display_name}")
        file_search_store = self.client.file_search_stores.create(
            config={'display_name': display_name}
        )
        self.store_name = file_search_store.name
        return file_search_store.name

    def upload_document(
        self,
        file_path: str | Path,
        metadata: Optional[Dict[str, Any]] = None,
        chunking_config: Optional[Dict[str, Any]] = None
    ) -> str:
        """
        Upload grant document to Grant Corpus.

        Args:
            file_path: Path to grant PDF/document
            metadata: Custom metadata (grant_id, jurisdiction, funding_min, funding_max, deadline_date)
            chunking_config: Optional chunking settings

        Returns:
            str: Uploaded file name

        Example:
            >>> corpus.upload_document(
            ...     "igp-guidelines.pdf",
            ...     metadata={
            ...         "grant_id": "igp-2025",
            ...         "jurisdiction": "federal",
            ...         "funding_min": 100000,
            ...         "funding_max": 5000000,
            ...         "deadline_date": "2026-03-31"
            ...     }
            ... )
        """
        if not self.store_name:
            raise ValueError("Grant Corpus not initialized. Call create_or_get_corpus() first.")

        file_path = Path(file_path)
        if not file_path.exists():
            raise FileNotFoundError(f"File not found: {file_path}")

        print(f"📤 Uploading {file_path.name} to Grant Corpus...")

        # Prepare custom metadata
        custom_metadata = []
        if metadata:
            for key, value in metadata.items():
                if isinstance(value, str):
                    custom_metadata.append({"key": key, "string_value": value})
                elif isinstance(value, (int, float)):
                    custom_metadata.append({"key": key, "numeric_value": value})

        # Prepare chunking config (default: 200 tokens per chunk, 20 overlap)
        chunk_config = chunking_config or {
            'white_space_config': {
                'max_tokens_per_chunk': 200,
                'max_overlap_tokens': 20
            }
        }

        # Upload to File Search Store
        config_dict = {
            'display_name': file_path.name,
            'chunking_config': chunk_config
        }
        if custom_metadata:
            config_dict['custom_metadata'] = custom_metadata

        operation = self.client.file_search_stores.upload_to_file_search_store(
            file=str(file_path),
            file_search_store_name=self.store_name,
            config=config_dict
        )

        # Wait for processing to complete
        print(f"⏳ Processing {file_path.name}...")
        # Note: The operation is async, but for simplicity we return immediately
        # In production, you might want to poll operation.status

        print(f"✅ Uploaded: {file_path.name}")
        return file_path.name

    def query(
        self,
        query: str,
        metadata_filter: Optional[str] = None,
        model: str = "gemini-2.0-flash-exp"
    ) -> str:
        """
        Query Grant Corpus using semantic search.

        Args:
            query: Natural language question
            metadata_filter: Optional metadata filter (e.g., "jurisdiction=VIC")
            model: Gemini model to use

        Returns:
            str: LLM response with citations

        Example:
            >>> response = corpus.query(
            ...     "Which grants fund battery recycling in Victoria?",
            ...     metadata_filter="jurisdiction=VIC"
            ... )
        """
        if not self.store_name:
            raise ValueError("Grant Corpus not initialized. Call create_or_get_corpus() first.")

        # Prepare tool configuration
        tool_config = types.Tool(
            file_search=types.FileSearch(
                file_search_store_names=[self.store_name]
            )
        )

        if metadata_filter:
            tool_config.file_search.metadata_filter = metadata_filter

        # Generate content with File Search
        response = self.client.models.generate_content(
            model=model,
            contents=query,
            config=types.GenerateContentConfig(
                tools=[tool_config]
            )
        )

        return response.text

    def list_documents(self) -> List[Dict[str, Any]]:
        """
        List all documents in Grant Corpus.

        Returns:
            list: Document metadata (name, display_name, size, etc.)
        """
        if not self.store_name:
            raise ValueError("Grant Corpus not initialized.")

        documents = []
        # Note: The API doesn't directly expose "list files in store"
        # This is a placeholder for when that functionality is available
        # For now, we can only track uploads manually

        print("⚠️  Document listing not yet fully supported by Gemini File Search API")
        print("    Track uploaded documents via metadata or external tracking")

        return documents


if __name__ == "__main__":
    # Quick test
    import os
    api_key = os.getenv("GOOGLE_API_KEY")
    if not api_key:
        print("❌ GOOGLE_API_KEY not set")
        exit(1)

    client = genai.Client(api_key=api_key)
    corpus = GrantCorpus(client)
    store_name = corpus.create_or_get_corpus()
    print(f"Grant Corpus ready: {store_name}")
