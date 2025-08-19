#!/usr/bin/env python3
import os
import re
import glob

# Change to the project directory
os.chdir("/Users/mbp-ez/Desktop/AI Library/Apps/jupitair/jupitair/jupitair")

# Get all files that might have phone buttons (excluding blog posts which we already fixed)
file_patterns = [
    "src/pages/*.astro",
    "src/pages/**/*.astro", 
    "src/components/layout/*.astro",
    "src/components/forms/*.astro"
]

files = []
for pattern in file_patterns:
    files.extend(glob.glob(pattern, recursive=True))

# Remove already fixed files and exclude API/config files
excluded_files = [
    'src/layouts/BlogLayout.astro',  # Already good
    'src/layouts/EnhancedBlogLayout.astro',  # Already fixed
    'src/components/blog/BlogCTA.astro'  # Already fixed
]

files = [f for f in files if f not in excluded_files and not f.endswith('.ts')]

print(f"Checking {len(files)} files for hardcoded phone buttons...")

phone_pattern = re.compile(r'href="tel:9403905676".*?>.*?Call.*?940.*?390.*?5676.*?</.*?>', re.DOTALL | re.IGNORECASE)

for file_path in files:
    print(f"Processing: {file_path}")
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Track changes
    changed = False
    
    # Look for hardcoded phone buttons/links
    if 'tel:9403905676' in content and 'Call (940) 390-5676' in content:
        print(f"  - Found hardcoded phone button in {file_path}")
        
        # Check if PhoneLink is already imported
        if 'PhoneLink' not in content:
            # Add PhoneLink import after other UI imports
            if "import Button from '../ui/Button.astro';" in content:
                content = re.sub(
                    r"(import Button from '../ui/Button\.astro';)",
                    r"\1\nimport PhoneLink from '../ui/PhoneLink.astro';",
                    content
                )
                changed = True
                print(f"  - Added PhoneLink import")
            elif "import Button from './ui/Button.astro';" in content:
                content = re.sub(
                    r"(import Button from './ui/Button\.astro';)",
                    r"\1\nimport PhoneLink from './ui/PhoneLink.astro';",
                    content
                )
                changed = True
                print(f"  - Added PhoneLink import (relative)")
        
        # Find and replace hardcoded phone buttons with PhoneLink
        # Look for Button components with tel: links
        button_pattern = r'<Button\s+href="tel:9403905676"[^>]*>((?:(?!<\/Button>).)*)<svg[^>]*>[^<]*</svg>[^<]*Call \(940\) 390-5676[^<]*</Button>'
        if re.search(button_pattern, content, re.DOTALL):
            content = re.sub(
                button_pattern,
                '<PhoneLink variant="premium" size="lg" context="page" />',
                content,
                flags=re.DOTALL
            )
            changed = True
            print(f"  - Replaced Button with PhoneLink")
    
    # Save changes if any were made
    if changed:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"  - UPDATED: {file_path}")
    else:
        print(f"  - No changes needed")

print("Done processing files!")