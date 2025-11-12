#!/usr/bin/env python3
"""Upload EMEW corporate documents to Company Corpus."""

from dotenv import load_dotenv
load_dotenv()

import json
from pathlib import Path
from datetime import datetime
from gemini_store.corpus_manager import CorpusManager

def main():
    print("=== EMEW Document Upload ===\n")

    # Initialize corpus manager
    manager = CorpusManager()

    # Ensure corpora are initialized (uses existing if already created)
    config = manager.initialize()

    # Upload EMEW corporate presentation
    emew_pdf = Path(".inputs/companies/c-emew/corporate/emew-general-presentation-2024.pdf")

    if not emew_pdf.exists():
        print(f"[ERROR] File not found: {emew_pdf}")
        return

    print(f"\nUploading: {emew_pdf.name}")
    result = manager.company_corpus.upload_document(
        str(emew_pdf),
        company_id="emew",
        metadata={
            "document_type": "corporate",
            "category": "presentation",
            "year": 2024
        }
    )

    # Save upload metadata
    vector_db_dir = Path(".inputs/companies/c-emew/vector-db")
    vector_db_dir.mkdir(parents=True, exist_ok=True)

    metadata_file = vector_db_dir / "corpus-metadata.json"
    metadata = {
        "corpus_id": manager.company_corpus.store_name,
        "uploads": [
            {
                "file_name": emew_pdf.name,
                "file_path": str(emew_pdf),
                "upload_date": datetime.now().isoformat(),
                "metadata": {
                    "company_id": "emew",
                    "document_type": "corporate",
                    "category": "presentation",
                    "year": 2024
                }
            }
        ],
        "last_updated": datetime.now().isoformat()
    }

    metadata_file.write_text(json.dumps(metadata, indent=2))
    print(f"\n[OK] Upload metadata saved to: {metadata_file}")

    # Test query (skip if quota limited)
    # print("\n=== Test Query ===")
    # response = manager.query_company(
    #     "emew",
    #     "What is EMEW's core technology and what industries do they serve?"
    # )
    # print(f"\nResponse:\n{response}\n")

    print("\n[OK] EMEW document upload complete!")
    print(f"[OK] Corpus ID: {manager.company_corpus.store_name}")
    print(f"[OK] Document count: 1 (emew-general-presentation-2024.pdf)")

if __name__ == "__main__":
    main()
