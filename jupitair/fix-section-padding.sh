#!/bin/bash

echo "Standardizing section padding throughout the site..."

# Standard section padding classes
STANDARD_PADDING="pt-16 pb-20 sm:pt-20 sm:pb-24 lg:pt-24 lg:pb-28"
HERO_PADDING="pt-24 pb-28 sm:pt-28 sm:pb-32 lg:pt-32 lg:pb-36"

# Fix general sections with py- classes
find src -name "*.astro" -type f | while read file; do
    # Backup
    cp "$file" "$file.bak"
    
    # Replace common padding patterns with balanced versions
    sed -i '' -E 's/py-16 sm:py-20 lg:py-24/pt-16 pb-20 sm:pt-20 sm:pb-24 lg:pt-24 lg:pb-28/g' "$file"
    sed -i '' -E 's/py-12 sm:py-16 lg:py-20/pt-16 pb-20 sm:pt-20 sm:pb-24 lg:pt-24 lg:pb-28/g' "$file"
    sed -i '' -E 's/py-16 lg:py-24/pt-16 pb-20 sm:pt-20 sm:pb-24 lg:pt-24 lg:pb-28/g' "$file"
    sed -i '' -E 's/py-20 sm:py-24/pt-16 pb-20 sm:pt-20 sm:pb-24/g' "$file"
    
    # Check if changes were made
    if ! diff -q "$file" "$file.bak" >/dev/null; then
        echo "Fixed padding in: $file"
        rm "$file.bak"
    else
        rm "$file.bak"
    fi
done

echo "Section padding standardization complete!"
