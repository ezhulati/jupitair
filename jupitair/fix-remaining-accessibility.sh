#!/bin/bash

echo "Fixing remaining accessibility issues..."

# Find all Astro files with SVG elements without aria-hidden
files_to_check=$(grep -r '<svg' src --include="*.astro" | grep -v 'aria-hidden' | cut -d: -f1 | sort -u)

if [ -z "$files_to_check" ]; then
    echo "No SVG elements found without aria-hidden"
else
    echo "Files with SVG elements missing aria-hidden:"
    for file in $files_to_check; do
        echo "  - $file"
    done
fi

# Check for empty headings or anchors
echo -e "\nChecking for empty headings and anchors..."
grep -r '<h[1-6][^>]*>[\s]*</h[1-6]>' src --include="*.astro" || echo "No empty headings found"
grep -r '<a[^>]*>[\s]*</a>' src --include="*.astro" || echo "No empty anchors found"

echo -e "\nAccessibility check complete!"
