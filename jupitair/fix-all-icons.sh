#!/bin/bash

echo "Fixing all SVG icons with mr-2 in centered containers..."

# Find all .astro files and fix SVG icons with mr-2 class
find src -name "*.astro" -type f | while read file; do
    # Check if file contains SVG with mr-2
    if grep -q 'svg.*mr-2\|mr-2.*svg' "$file"; then
        # Create backup
        cp "$file" "$file.bak"
        
        # Remove mr-2 from SVG elements inside any context (we'll be conservative)
        # This removes mr-2 from all SVG elements to ensure proper centering
        sed -i '' -E 's/<svg([^>]*) mr-2([^>]*)>/<svg\1\2>/g' "$file"
        sed -i '' -E 's/<svg([^>]*)class="([^"]*) mr-2([^"]*)"/<svg\1class="\2\3"/g' "$file"
        sed -i '' -E 's/<svg([^>]*)class="([^"]*)mr-2 ([^"]*)"/<svg\1class="\2\3"/g' "$file"
        sed -i '' -E 's/<svg([^>]*)class="mr-2 ([^"]*)"/<svg\1class="\1"/g' "$file"
        sed -i '' -E 's/<svg([^>]*)class="([^"]*)mr-2"/<svg\1class="\2"/g' "$file"
        
        # Check if changes were made
        if ! diff -q "$file" "$file.bak" >/dev/null; then
            echo "Fixed: $file"
            rm "$file.bak"
        else
            rm "$file.bak"
        fi
    fi
done

echo "Icon fixing complete!"
