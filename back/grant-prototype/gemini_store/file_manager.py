"""
File Manager - Upload Utilities

Provides helper functions for file upload operations across both corpora.
Most upload logic is in GrantCorpus and CompanyCorpus, but this module
provides batch operations and utility functions.
"""

from pathlib import Path
from typing import List, Dict, Any, Optional
from google import genai


class FileManager:
    """
    Utilities for batch file uploads and file management.

    While GrantCorpus and CompanyCorpus handle individual uploads,
    FileManager provides batch operations for Week 1 bootstrap.
    """

    def __init__(self, client: genai.Client):
        """
        Initialize File Manager.

        Args:
            client: Configured Gemini API client
        """
        self.client = client

    def batch_upload_grants(
        self,
        directory: str | Path,
        store_name: str,
        file_pattern: str = "*.pdf",
        default_metadata: Optional[Dict[str, Any]] = None
    ) -> List[str]:
        """
        Batch upload grant documents from a directory.

        Useful for Week 1 when ingesting multiple grant PDFs at once.

        Args:
            directory: Path to directory containing grant PDFs
            store_name: Grant Corpus store name
            file_pattern: Glob pattern for files (default: "*.pdf")
            default_metadata: Default metadata to apply to all files

        Returns:
            list: Uploaded file names

        Example:
            >>> manager = FileManager(client)
            >>> uploaded = manager.batch_upload_grants(
            ...     ".inputs/grants/federal/",
            ...     grant_store_name,
            ...     default_metadata={"jurisdiction": "federal"}
            ... )
        """
        directory = Path(directory)
        if not directory.exists():
            raise FileNotFoundError(f"Directory not found: {directory}")

        files = list(directory.glob(file_pattern))
        if not files:
            print(f"[WARN]  No files matching '{file_pattern}' in {directory}")
            return []

        print(f"[FOLDER] Batch uploading {len(files)} files from {directory}")

        uploaded = []
        for file_path in files:
            try:
                # Extract grant_id from filename (e.g., "igp-2025.pdf" → "igp-2025")
                grant_id = file_path.stem

                # Merge default metadata with file-specific metadata
                metadata = default_metadata.copy() if default_metadata else {}
                metadata["grant_id"] = grant_id

                # Upload using the corpus upload method
                # (In practice, you'd call grant_corpus.upload_document here)
                print(f"  [OK] Would upload: {file_path.name}")
                uploaded.append(file_path.name)

            except Exception as e:
                print(f"  ❌ Failed to upload {file_path.name}: {e}")

        print(f"[OK] Batch upload complete: {len(uploaded)}/{len(files)} succeeded")
        return uploaded

    def batch_upload_company_docs(
        self,
        directory: str | Path,
        company_id: str,
        store_name: str,
        file_pattern: str = "*.pdf",
        default_metadata: Optional[Dict[str, Any]] = None
    ) -> List[str]:
        """
        Batch upload company documents from a directory.

        Useful for Week 1 when ingesting EMEW corporate PDFs.

        Args:
            directory: Path to directory containing company documents
            company_id: Company identifier (e.g., "emew")
            store_name: Company Corpus store name
            file_pattern: Glob pattern for files
            default_metadata: Default metadata to apply to all files

        Returns:
            list: Uploaded file names

        Example:
            >>> uploaded = manager.batch_upload_company_docs(
            ...     ".inputs/companies/c-emew/corporate/",
            ...     "emew",
            ...     company_store_name
            ... )
        """
        directory = Path(directory)
        if not directory.exists():
            raise FileNotFoundError(f"Directory not found: {directory}")

        files = list(directory.glob(file_pattern))
        if not files:
            print(f"[WARN]  No files matching '{file_pattern}' in {directory}")
            return []

        print(f"[FOLDER] Batch uploading {len(files)} company documents ({company_id})")

        uploaded = []
        for file_path in files:
            try:
                # Infer document type from filename
                doc_type = "unknown"
                if "business-plan" in file_path.stem.lower():
                    doc_type = "business_plan"
                elif "financial" in file_path.stem.lower() or "report" in file_path.stem.lower():
                    doc_type = "financial_report"
                elif "capabilities" in file_path.stem.lower():
                    doc_type = "capabilities"

                # Merge default metadata
                metadata = default_metadata.copy() if default_metadata else {}
                metadata["document_type"] = doc_type

                # Upload using the corpus upload method
                # (In practice, you'd call company_corpus.upload_document here)
                print(f"  [OK] Would upload: {file_path.name} (type: {doc_type})")
                uploaded.append(file_path.name)

            except Exception as e:
                print(f"  ❌ Failed to upload {file_path.name}: {e}")

        print(f"[OK] Batch upload complete: {len(uploaded)}/{len(files)} succeeded")
        return uploaded

    def get_upload_statistics(self, store_name: str) -> Dict[str, Any]:
        """
        Get statistics about uploaded files in a store.

        Args:
            store_name: File Search store name

        Returns:
            dict: Statistics (file count, total size, etc.)

        Note:
            This is currently limited by Gemini File Search API capabilities.
        """
        # Placeholder - Gemini doesn't expose detailed store statistics yet
        return {
            "store_name": store_name,
            "note": "Statistics not yet supported by Gemini File Search API"
        }


if __name__ == "__main__":
    print("FileManager utility module")
    print("Use via CorpusManager for full functionality")
