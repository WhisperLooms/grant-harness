"""
ABN Lookup Utility

Integrates with the Australian Business Register (ABR) ABN Lookup API
to validate and retrieve company information by ABN, ACN, or name.

API Documentation: https://abr.business.gov.au/Tools/WebServices
JSON API: https://abr.business.gov.au/json/

SETUP:
1. Register for a free GUID at: https://abr.business.gov.au/Tools/WebServices
2. Set environment variable: ABR_GUID=your_guid_here
3. Use this utility to validate company details

Usage:
    from utils.abn_lookup import ABNLookup

    lookup = ABNLookup()
    result = lookup.search_by_abn("25 000 751 093")
    print(result['EntityName'])  # "EMEW CLEAN TECHNOLOGIES PTY LTD"
"""

import os
import re
import requests
from typing import Optional, Dict, Any, List
from datetime import datetime


class ABNLookup:
    """
    Australian Business Register (ABR) ABN Lookup client.

    Uses the JSON API for simpler integration than SOAP.
    """

    def __init__(self, guid: Optional[str] = None):
        """
        Initialize ABN Lookup client.

        Args:
            guid: ABR GUID for API authentication. If not provided, reads from ABR_GUID env var.

        Raises:
            ValueError: If GUID not provided and not found in environment
        """
        self.guid = guid or os.getenv("ABR_GUID")
        if not self.guid:
            raise ValueError(
                "ABR GUID required. Set ABR_GUID environment variable or pass guid parameter.\n"
                "Register for free at: https://abr.business.gov.au/Tools/WebServices"
            )

        self.base_url = "https://abr.business.gov.au/json"
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Grant-Harness ABN Lookup Utility',
            'Accept': 'application/json'
        })

    @staticmethod
    def clean_abn(abn: str) -> str:
        """Remove spaces from ABN for API calls."""
        return re.sub(r'\s+', '', abn)

    @staticmethod
    def clean_acn(acn: str) -> str:
        """Remove spaces from ACN for API calls."""
        return re.sub(r'\s+', '', acn)

    @staticmethod
    def format_abn(abn: str) -> str:
        """Format ABN with spaces: XX XXX XXX XXX"""
        clean = ABNLookup.clean_abn(abn)
        if len(clean) != 11:
            return abn
        return f"{clean[0:2]} {clean[2:5]} {clean[5:8]} {clean[8:11]}"

    @staticmethod
    def format_acn(acn: str) -> str:
        """Format ACN with spaces: XXX XXX XXX"""
        clean = ABNLookup.clean_acn(acn)
        if len(clean) != 9:
            return acn
        return f"{clean[0:3]} {clean[3:6]} {clean[6:9]}"

    def search_by_abn(self, abn: str) -> Dict[str, Any]:
        """
        Look up company details by ABN.

        Args:
            abn: Australian Business Number (with or without spaces)

        Returns:
            dict: Company details including:
                - Abn: ABN number
                - AbnStatus: Active/Cancelled
                - EntityName: Legal entity name
                - EntityTypeName: Company type (e.g., "Australian Proprietary Company")
                - Gst: GST registration date (if registered)
                - PostCode: Registered postcode

        Raises:
            requests.HTTPError: If API request fails
            ValueError: If ABN not found

        Example:
            >>> lookup = ABNLookup()
            >>> result = lookup.search_by_abn("25 000 751 093")
            >>> print(result['EntityName'])
            'EMEW CLEAN TECHNOLOGIES PTY LTD'
        """
        clean_abn = self.clean_abn(abn)

        if len(clean_abn) != 11 or not clean_abn.isdigit():
            raise ValueError(f"Invalid ABN format: {abn}. ABN must be 11 digits.")

        url = f"{self.base_url}/AbnDetails.aspx"
        params = {
            'abn': clean_abn,
            'callback': 'callback',
            'guid': self.guid
        }

        response = self.session.get(url, params=params, timeout=10)
        response.raise_for_status()

        # Response is JSONP (callback wrapper), extract JSON
        text = response.text
        if text.startswith('callback('):
            text = text[9:-1]  # Remove 'callback(' and trailing ')'

        import json
        data = json.loads(text)

        # Check if ABN was found
        if 'Message' in data and data['Message']:
            raise ValueError(f"ABN {abn} not found: {data['Message']}")

        return data

    def search_by_acn(self, acn: str) -> Dict[str, Any]:
        """
        Look up company details by ACN.

        Args:
            acn: Australian Company Number (with or without spaces)

        Returns:
            dict: Company details (same structure as search_by_abn)

        Raises:
            requests.HTTPError: If API request fails
            ValueError: If ACN not found

        Example:
            >>> lookup = ABNLookup()
            >>> result = lookup.search_by_acn("000 751 093")
            >>> print(result['EntityName'])
            'EMEW CLEAN TECHNOLOGIES PTY LTD'
        """
        clean_acn = self.clean_acn(acn)

        if len(clean_acn) != 9 or not clean_acn.isdigit():
            raise ValueError(f"Invalid ACN format: {acn}. ACN must be 9 digits.")

        url = f"{self.base_url}/AcnDetails.aspx"
        params = {
            'acn': clean_acn,
            'callback': 'callback',
            'guid': self.guid
        }

        response = self.session.get(url, params=params, timeout=10)
        response.raise_for_status()

        # Response is JSONP, extract JSON
        text = response.text
        if text.startswith('callback('):
            text = text[9:-1]

        import json
        data = json.loads(text)

        if 'Message' in data and data['Message']:
            raise ValueError(f"ACN {acn} not found: {data['Message']}")

        return data

    def search_by_name(
        self,
        name: str,
        max_results: int = 10
    ) -> List[Dict[str, Any]]:
        """
        Search for companies by name.

        Args:
            name: Business name (partial match supported)
            max_results: Maximum number of results (default: 10)

        Returns:
            list: List of matching companies with:
                - Abn: ABN number
                - Name: Entity name
                - Score: Match relevance score

        Raises:
            requests.HTTPError: If API request fails

        Example:
            >>> lookup = ABNLookup()
            >>> results = lookup.search_by_name("EMEW CLEAN")
            >>> print(results[0]['Name'])
            'EMEW CLEAN TECHNOLOGIES PTY LTD'
        """
        url = f"{self.base_url}/MatchingNames.aspx"
        params = {
            'name': name,
            'maxResults': max_results,
            'callback': 'callback',
            'guid': self.guid
        }

        response = self.session.get(url, params=params, timeout=10)
        response.raise_for_status()

        # Response is JSONP, extract JSON
        text = response.text
        if text.startswith('callback('):
            text = text[9:-1]

        import json
        data = json.loads(text)

        # Extract names array
        if 'Names' in data:
            return data['Names']
        return []

    def validate_company_profile(
        self,
        expected_abn: str,
        expected_name: str
    ) -> Dict[str, Any]:
        """
        Validate a company profile against ABR records.

        Args:
            expected_abn: Expected ABN
            expected_name: Expected legal entity name

        Returns:
            dict: Validation result with:
                - valid: bool (True if ABN exists and name matches)
                - abn_exists: bool
                - name_matches: bool
                - actual_name: str (name from ABR)
                - abn_status: str (Active/Cancelled)
                - details: dict (full ABR response)

        Example:
            >>> lookup = ABNLookup()
            >>> result = lookup.validate_company_profile(
            ...     "25 000 751 093",
            ...     "EMEW CLEAN TECHNOLOGIES PTY LTD"
            ... )
            >>> assert result['valid'] == True
        """
        try:
            details = self.search_by_abn(expected_abn)

            actual_name = details.get('EntityName', '').upper().strip()
            expected_name_upper = expected_name.upper().strip()

            name_matches = actual_name == expected_name_upper
            abn_status = details.get('AbnStatus', 'Unknown')
            is_active = abn_status == 'Active'

            return {
                'valid': name_matches and is_active,
                'abn_exists': True,
                'abn_status': abn_status,
                'is_active': is_active,
                'name_matches': name_matches,
                'expected_name': expected_name,
                'actual_name': details.get('EntityName', ''),
                'entity_type': details.get('EntityTypeName', ''),
                'postcode': details.get('Postcode', ''),
                'gst_registered': bool(details.get('Gst')),
                'details': details,
                'verified_at': datetime.now().isoformat()
            }

        except ValueError as e:
            return {
                'valid': False,
                'abn_exists': False,
                'error': str(e),
                'expected_name': expected_name,
                'verified_at': datetime.now().isoformat()
            }


def validate_emew_profile():
    """
    Example: Validate EMEW Clean Technologies profile.

    Returns validation result.
    """
    try:
        lookup = ABNLookup()
        result = lookup.validate_company_profile(
            expected_abn="25 000 751 093",
            expected_name="EMEW CLEAN TECHNOLOGIES PTY LTD"
        )

        print("=" * 80)
        print("EMEW CLEAN TECHNOLOGIES - ABN VALIDATION")
        print("=" * 80)
        print()
        print(f"ABN: 25 000 751 093")
        print(f"Expected Name: EMEW CLEAN TECHNOLOGIES PTY LTD")
        print()
        print(f"✓ Valid: {result['valid']}")
        print(f"  ABN Exists: {result['abn_exists']}")
        print(f"  ABN Status: {result['abn_status']}")
        print(f"  Name Matches: {result['name_matches']}")
        print(f"  Actual Name: {result['actual_name']}")
        print(f"  Entity Type: {result['entity_type']}")
        print(f"  Postcode: {result['postcode']}")
        print(f"  GST Registered: {result['gst_registered']}")
        print()

        return result

    except ValueError as e:
        print(f"ERROR: {e}")
        return None


if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser(description="ABN Lookup Utility")
    parser.add_argument('--abn', help='Look up by ABN')
    parser.add_argument('--acn', help='Look up by ACN')
    parser.add_argument('--name', help='Search by name')
    parser.add_argument('--validate-emew', action='store_true', help='Validate EMEW profile')

    args = parser.parse_args()

    if args.validate_emew:
        validate_emew_profile()
    elif args.abn:
        lookup = ABNLookup()
        result = lookup.search_by_abn(args.abn)
        print(result)
    elif args.acn:
        lookup = ABNLookup()
        result = lookup.search_by_acn(args.acn)
        print(result)
    elif args.name:
        lookup = ABNLookup()
        results = lookup.search_by_name(args.name)
        for i, r in enumerate(results, 1):
            print(f"{i}. {r['Name']} (ABN: {r['Abn']})")
    else:
        parser.print_help()
