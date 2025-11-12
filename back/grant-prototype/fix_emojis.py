#!/usr/bin/env python3
"""Fix emoji print statements for Windows compatibility."""

import re
from pathlib import Path

# Emoji to ASCII mapping
EMOJI_MAP = {
    "🗑️": "[DELETE]",
    "🆕": "[NEW]",
    "✅": "[OK]",
    "📋": "[LIST]",
    "📤": "[UPLOAD]",
    "⚠️": "[WARN]",
    "📂": "[FOLDER]",
}

def fix_emojis_in_file(file_path: Path):
    """Replace emojis in a file with ASCII equivalents."""
    content = file_path.read_text(encoding='utf-8')
    original = content

    for emoji, ascii_rep in EMOJI_MAP.items():
        content = content.replace(emoji, ascii_rep)

    if content != original:
        file_path.write_text(content, encoding='utf-8')
        print(f"Fixed: {file_path}")
        return True
    return False

def main():
    gemini_store = Path("gemini_store")
    count = 0
    for py_file in gemini_store.glob("*.py"):
        if fix_emojis_in_file(py_file):
            count += 1
    print(f"\nFixed {count} files")

if __name__ == "__main__":
    main()
