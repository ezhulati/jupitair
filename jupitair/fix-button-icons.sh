#!/bin/bash

# Script to fix button icon spacing issues
# Ensures all SVG icons in Button components have proper spacing

echo "🔧 Fixing button icon spacing issues..."
echo "========================================="

# Counter for changes
FIXED_COUNT=0

# Find all Astro files
FILES=$(find /Users/ez/Desktop/AI\ Library/Apps/jupitair/jupitair/jupitair/src -name "*.astro" -type f)

# First, let's identify patterns where SVG is inside a Button component
echo "📋 Scanning for Button components with inline SVG icons..."

for file in $FILES; do
    # Check if file contains Button component with SVG
    if grep -q "<Button.*>" "$file" && grep -q "<svg.*viewBox" "$file"; then
        echo "Found potential issue in: $(basename "$file")"
        
        # Create temp file for modifications
        temp_file="${file}.tmp"
        cp "$file" "$temp_file"
        
        # Pattern 1: Fix SVG elements that are direct children of Button without proper spacing
        # Look for <svg class="w-X h-X" and add mr-2 if not present
        perl -i -pe 's/<svg class="(w-\d+ h-\d+)(?![^"]*\bmr-\d+)"/<svg class="$1 mr-2"/g' "$temp_file"
        
        # Pattern 2: Fix SVG elements with only dimension classes
        perl -i -pe 's/<svg class="(w-\d+ h-\d+)"(?=.*?fill="none".*?<\/svg>\s*[A-Z])/\<svg class="$1 mr-2"/g' "$temp_file"
        
        # Check if changes were made
        if ! diff -q "$file" "$temp_file" > /dev/null; then
            mv "$temp_file" "$file"
            echo "  ✅ Fixed icon spacing in: $(basename "$file")"
            ((FIXED_COUNT++))
        else
            rm "$temp_file"
        fi
    fi
done

echo ""
echo "🔍 Looking for specific phone button patterns..."

# Fix specific phone icon buttons
for file in $FILES; do
    if grep -q 'href="tel:' "$file"; then
        temp_file="${file}.tmp"
        cp "$file" "$temp_file"
        
        # Fix phone icon SVGs that appear before "Call" text
        # This specifically targets the pattern in the screenshot
        perl -i -0pe 's/(<Button[^>]*href="tel:[^>]*>.*?)(<svg[^>]*class=")(w-\d+ h-\d+)("[^>]*>.*?<\/svg>)(\s*Call)/\1\2\3 mr-2\4\5/gs' "$temp_file"
        
        if ! diff -q "$file" "$temp_file" > /dev/null; then
            mv "$temp_file" "$file"
            echo "  ✅ Fixed phone button in: $(basename "$file")"
            ((FIXED_COUNT++))
        else
            rm "$temp_file"
        fi
    fi
done

echo ""
echo "========================================="
echo "✨ Fixed $FIXED_COUNT files with button icon spacing issues"
echo ""

# Now let's specifically fix the homepage final CTA button
echo "🎯 Fixing homepage final CTA button..."
HOMEPAGE="/Users/ez/Desktop/AI Library/Apps/jupitair/jupitair/jupitair/src/pages/index.astro"

if [ -f "$HOMEPAGE" ]; then
    # Create backup
    cp "$HOMEPAGE" "${HOMEPAGE}.bak"
    
    # Fix the specific phone icon button in final CTA
    perl -i -0pe 's/(<Button href="tel:9403905676" variant="emergency" size="lg">.*?)(<svg class=")(w-5 h-5)(" fill="none")/\1\2\3 mr-2\4/gs' "$HOMEPAGE"
    
    echo "✅ Fixed homepage final CTA phone button"
fi

echo ""
echo "🎉 Button icon spacing fix complete!"
echo ""
echo "Next steps:"
echo "1. Check the dev server to verify the fix"
echo "2. Test on mobile and desktop views"
echo "3. Commit the changes if everything looks good"