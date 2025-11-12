#!/usr/bin/env python3
"""Upload IGP grant documents to Grant Corpus."""

from dotenv import load_dotenv
load_dotenv()

import json
from pathlib import Path
from datetime import datetime
from gemini_store.corpus_manager import CorpusManager

def main():
    print("=== IGP Grant Document Upload ===\n")

    # Initialize corpus manager
    manager = CorpusManager()

    # Ensure Grant Corpus is initialized
    config = manager.initialize()

    # IGP document paths
    igp_dir = Path(".inputs/grants/federal/industry-growth-program")
    guidelines_pdf = igp_dir / "IGP-Commercialisation-and-Growth-Guidelines.pdf"
    application_pdf = igp_dir / "IGP-Commercialisation-and-Growth-Application-Form.pdf"

    # Load metadata
    metadata_file = igp_dir / "metadata.json"
    with open(metadata_file) as f:
        grant_metadata = json.load(f)

    print(f"Grant: {grant_metadata['grant_name']}")
    print(f"Funding: ${grant_metadata['funding_range']['min']:,} - ${grant_metadata['funding_range']['max']:,}")
    print(f"Jurisdiction: {grant_metadata['jurisdiction']}\n")

    # Upload guidelines PDF
    if guidelines_pdf.exists():
        print(f"Uploading: {guidelines_pdf.name}")
        manager.grant_corpus.upload_document(
            str(guidelines_pdf),
            metadata={
                "grant_id": grant_metadata["grant_id"],
                "grant_name": grant_metadata["grant_name"],
                "document_type": "grant_guidelines",
                "jurisdiction": grant_metadata["jurisdiction"],
                "agency": grant_metadata["agency"],
                "funding_min": grant_metadata["funding_range"]["min"],
                "funding_max": grant_metadata["funding_range"]["max"]
            }
        )
        print()

    # Upload application form PDF
    if application_pdf.exists():
        print(f"Uploading: {application_pdf.name}")
        manager.grant_corpus.upload_document(
            str(application_pdf),
            metadata={
                "grant_id": grant_metadata["grant_id"],
                "grant_name": grant_metadata["grant_name"],
                "document_type": "application_form",
                "jurisdiction": grant_metadata["jurisdiction"],
                "agency": grant_metadata["agency"],
                "funding_min": grant_metadata["funding_range"]["min"],
                "funding_max": grant_metadata["funding_range"]["max"]
            }
        )
        print()

    # Save upload tracking
    vector_db_dir = igp_dir / "vector-db"
    vector_db_dir.mkdir(parents=True, exist_ok=True)

    upload_metadata = {
        "corpus_id": manager.grant_corpus.store_name,
        "uploads": [
            {
                "file_name": guidelines_pdf.name,
                "upload_date": datetime.now().isoformat(),
                "metadata": {
                    "grant_id": grant_metadata["grant_id"],
                    "document_type": "grant_guidelines"
                }
            },
            {
                "file_name": application_pdf.name,
                "upload_date": datetime.now().isoformat(),
                "metadata": {
                    "grant_id": grant_metadata["grant_id"],
                    "document_type": "application_form"
                }
            }
        ],
        "last_updated": datetime.now().isoformat()
    }

    upload_metadata_file = vector_db_dir / "upload-metadata.json"
    upload_metadata_file.write_text(json.dumps(upload_metadata, indent=2))

    print(f"[OK] Upload metadata saved to: {upload_metadata_file}")
    print(f"[OK] IGP documents uploaded to Grant Corpus!")
    print(f"[OK] Corpus ID: {manager.grant_corpus.store_name}")

if __name__ == "__main__":
    main()
