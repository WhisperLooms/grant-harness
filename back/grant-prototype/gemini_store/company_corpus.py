"""
Company Corpus - Company Document Management

Manages the Company Corpus in Gemini File Search:
- Upload company corporate documents (business plans, capabilities, financial reports)
- Tag with metadata (company_id, document_type, year)
- Query for application population

Per ADR-2051, the Company Corpus contains ONLY company-specific documents
to enable precise semantic search for application field population without
grant data contamination.
"""

from pathlib import Path
from typing import Optional, Dict, Any, List
from google import genai
from google.genai import types


class CompanyCorpus:
    """
    Manages company documents in Gemini File Search.

    Responsible for:
    - Creating/accessing Company Corpus store
    - Uploading company documents with metadata
    - Querying for application population

    Attributes:
        client: Gemini API client
        store_name: File Search store identifier
    """

    def __init__(self, client: genai.Client):
        """
        Initialize Company Corpus manager.

        Args:
            client: Configured Gemini API client
        """
        self.client = client
        self.store_name: Optional[str] = None

    def create_or_get_corpus(
        self,
        display_name: str = "grant-harness-company-corpus",
        force_recreate: bool = False
    ) -> str:
        """
        Create Company Corpus store or get existing one.

        Args:
            display_name: Human-readable store name
            force_recreate: Delete existing store and create new one

        Returns:
            str: Store name (e.g., "fileSearchStores/xyz789")
        """
        # Check if store already exists with this display name
        existing_store = None
        for store in self.client.file_search_stores.list():
            if store.display_name == display_name:
                existing_store = store
                break

        if existing_store and force_recreate:
            print(f"[DELETE]  Deleting existing Company Corpus: {existing_store.name}")
            self.client.file_search_stores.delete(
                name=existing_store.name,
                config={'force': True}
            )
            existing_store = None

        if existing_store:
            print(f"[OK] Using existing Company Corpus: {existing_store.name}")
            self.store_name = existing_store.name
            return existing_store.name

        # Create new store
        print(f"[NEW] Creating new Company Corpus: {display_name}")
        file_search_store = self.client.file_search_stores.create(
            config={'display_name': display_name}
        )
        self.store_name = file_search_store.name
        return file_search_store.name

    def upload_document(
        self,
        file_path: str | Path,
        company_id: str,
        metadata: Optional[Dict[str, Any]] = None,
        chunking_config: Optional[Dict[str, Any]] = None
    ) -> str:
        """
        Upload company document to Company Corpus.

        Args:
            file_path: Path to company document (PDF, DOCX, etc.)
            company_id: Company identifier (e.g., "emew")
            metadata: Custom metadata (document_type, year, department)
            chunking_config: Optional chunking settings

        Returns:
            str: Uploaded file name

        Example:
            >>> corpus.upload_document(
            ...     "emew-business-plan-2024.pdf",
            ...     company_id="emew",
            ...     metadata={
            ...         "document_type": "business_plan",
            ...         "year": 2024,
            ...         "department": "corporate"
            ...     }
            ... )
        """
        if not self.store_name:
            raise ValueError("Company Corpus not initialized. Call create_or_get_corpus() first.")

        file_path = Path(file_path)
        if not file_path.exists():
            raise FileNotFoundError(f"File not found: {file_path}")

        print(f"[UPLOAD] Uploading {file_path.name} to Company Corpus ({company_id})...")

        # Prepare custom metadata (ALWAYS include company_id)
        custom_metadata = [
            {"key": "company_id", "string_value": company_id}
        ]

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
            'chunking_config': chunk_config,
            'custom_metadata': custom_metadata
        }

        operation = self.client.file_search_stores.upload_to_file_search_store(
            file=str(file_path),
            file_search_store_name=self.store_name,
            config=config_dict
        )

        # Wait for processing to complete (poll operation status)
        print(f"[WAIT] Processing {file_path.name}...")
        import time
        while not operation.done:
            time.sleep(2)
            operation = self.client.operations.get(operation)

        print(f"[OK] Uploaded: {file_path.name}")
        return file_path.name

    def query(
        self,
        query: str,
        metadata_filter: Optional[str] = None,
        model: str = "gemini-2.0-flash-exp"
    ) -> str:
        """
        Query Company Corpus using semantic search.

        Args:
            query: Natural language question about company
            metadata_filter: Optional metadata filter (e.g., "company_id=emew")
            model: Gemini model to use

        Returns:
            str: LLM response with citations

        Example:
            >>> response = corpus.query(
            ...     "What are EMEW's core capabilities in metal recovery?",
            ...     metadata_filter="company_id=emew"
            ... )
        """
        if not self.store_name:
            raise ValueError("Company Corpus not initialized. Call create_or_get_corpus() first.")

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

        # Extract grounding sources (optional)
        grounding = response.candidates[0].grounding_metadata if response.candidates else None
        if grounding and grounding.grounding_chunks:
            sources = {c.retrieved_context.title for c in grounding.grounding_chunks if hasattr(c, 'retrieved_context')}
            if sources:
                print(f"[INFO] Grounding sources: {', '.join(sources)}")

        return response.text

    def query_for_field(
        self,
        company_id: str,
        field_label: str,
        field_description: Optional[str] = None,
        model: str = "gemini-2.0-flash-exp"
    ) -> Dict[str, Any]:
        """
        Query company documents to populate a specific application field.

        Used in Week 3 for AI-powered application population.

        Args:
            company_id: Company identifier
            field_label: Application field label (e.g., "Company Annual Revenue")
            field_description: Additional context about the field
            model: Gemini model to use

        Returns:
            dict: {
                "value": "Suggested field value",
                "confidence": 0.85,
                "sources": ["business-plan-2024.pdf, page 12"]
            }

        Example:
            >>> result = corpus.query_for_field(
            ...     "emew",
            ...     "Annual Revenue (AUD)",
            ...     "The company's total annual revenue in Australian dollars"
            ... )
            >>> print(result["value"])  # "$8.5M"
            >>> print(result["confidence"])  # 0.92
        """
        # Construct query
        query = f"""
        Based on the company's documents, what is the answer to this question:

        Field: {field_label}
        """

        if field_description:
            query += f"\nDescription: {field_description}"

        query += """

        Provide:
        1. A concise answer (1-3 sentences)
        2. Confidence level (0.0-1.0)
        3. Source documents and page numbers

        Format your response as:
        ANSWER: [your answer]
        CONFIDENCE: [0.0-1.0]
        SOURCES: [document names and page numbers]
        """

        response_text = self.query(
            query,
            metadata_filter=f"company_id={company_id}",
            model=model
        )

        # Parse response (simple parsing, could be improved)
        result = {
            "value": "",
            "confidence": 0.5,
            "sources": []
        }

        # Extract answer, confidence, sources from response
        lines = response_text.split('\n')
        for line in lines:
            if line.startswith('ANSWER:'):
                result["value"] = line.replace('ANSWER:', '').strip()
            elif line.startswith('CONFIDENCE:'):
                try:
                    result["confidence"] = float(line.replace('CONFIDENCE:', '').strip())
                except:
                    pass
            elif line.startswith('SOURCES:'):
                result["sources"] = [line.replace('SOURCES:', '').strip()]

        # If parsing failed, use full response as value
        if not result["value"]:
            result["value"] = response_text

        return result


if __name__ == "__main__":
    # Quick test
    import os
    api_key = os.getenv("GOOGLE_API_KEY")
    if not api_key:
        print("❌ GOOGLE_API_KEY not set")
        exit(1)

    client = genai.Client(api_key=api_key)
    corpus = CompanyCorpus(client)
    store_name = corpus.create_or_get_corpus()
    print(f"Company Corpus ready: {store_name}")
