#!/bin/bash

# Comprehensive script to fix ALL button icon spacing issues
# Ensures inline SVG icons have proper mr-2 spacing when preceding text

echo "🔧 Comprehensive Button Icon Spacing Fix"
echo "========================================="
echo ""

JUPITAIR_DIR="/Users/ez/Desktop/AI Library/Apps/jupitair/jupitair/jupitair"
cd "$JUPITAIR_DIR"

# Counter for changes
FIXED_COUNT=0
FILES_CHECKED=0

echo "📋 Searching for all Button components with inline SVG icons..."
echo ""

# Find all Astro files with Button components
BUTTON_FILES=$(grep -r "<Button" src/ --include="*.astro" -l 2>/dev/null)

for file in $BUTTON_FILES; do
    ((FILES_CHECKED++))
    
    # Check if file contains SVG elements within Button components
    if grep -q "<svg.*viewBox" "$file" 2>/dev/null; then
        echo "🔍 Checking: $(basename "$file")"
        
        # Create backup
        cp "$file" "${file}.bak"
        
        # Count changes before
        BEFORE_COUNT=$(grep -o '<svg class="w-[0-9] h-[0-9]"' "$file" 2>/dev/null | wc -l)
        
        # Fix patterns:
        # 1. Add mr-2 to SVG elements that don't have margin classes
        # Pattern: <svg class="w-X h-X" (without mr-X)
        sed -i '' -E 's/<svg class="(w-[0-9]+ h-[0-9]+)"([^>]*>)/<svg class="\1 mr-2"\2/g' "$file"
        
        # 2. Fix SVGs that already have other classes but no margin
        sed -i '' -E 's/<svg class="(w-[0-9]+ h-[0-9]+) ([^"]*)"([^>]*>)/<svg class="\1 mr-2 \2"\3/g' "$file"
        
        # 3. Prevent double mr-2 (cleanup)
        sed -i '' -E 's/mr-2 mr-2/mr-2/g' "$file"
        
        # Check if changes were made
        if ! diff -q "${file}.bak" "$file" > /dev/null 2>&1; then
            echo "  ✅ Fixed icon spacing in: $(basename "$file")"
            ((FIXED_COUNT++))
            rm "${file}.bak"
        else
            echo "  ⏭️  No changes needed"
            rm "${file}.bak"
        fi
    fi
done

echo ""
echo "📋 Checking specific components that commonly have icons..."
echo ""

# Check Hero components specifically
HERO_FILES=$(find src/components/layout -name "*.astro" -type f)
for file in $HERO_FILES; do
    if grep -q '<Button.*href="tel:' "$file" 2>/dev/null; then
        echo "🔍 Checking hero component: $(basename "$file")"
        
        # Backup
        cp "$file" "${file}.bak"
        
        # Fix phone icon buttons in Hero components
        sed -i '' -E 's/(<svg class=")(w-[0-9]+ h-[0-9]+)(" fill="none" stroke="currentColor")/\1\2 mr-2\3/g' "$file"
        
        # Cleanup double mr-2
        sed -i '' -E 's/mr-2 mr-2/mr-2/g' "$file"
        
        if ! diff -q "${file}.bak" "$file" > /dev/null 2>&1; then
            echo "  ✅ Fixed phone icon in: $(basename "$file")"
            ((FIXED_COUNT++))
            rm "${file}.bak"
        else
            echo "  ⏭️  No changes needed"
            rm "${file}.bak"
        fi
    fi
done

echo ""
echo "📋 Checking all blog CTAs..."
echo ""

# Fix blog post CTAs
BLOG_FILES=$(find src/content/blog -name "*.mdx" -type f)
for file in $BLOG_FILES; do
    if grep -q '<Button.*href="tel:' "$file" 2>/dev/null; then
        echo "🔍 Checking blog: $(basename "$file")"
        
        # Backup
        cp "$file" "${file}.bak"
        
        # Fix phone icon in blog CTAs
        sed -i '' -E 's/(<svg class=")(w-[0-9]+ h-[0-9]+)(" fill="none" stroke="currentColor")/\1\2 mr-2\3/g' "$file"
        
        # Cleanup double mr-2
        sed -i '' -E 's/mr-2 mr-2/mr-2/g' "$file"
        
        if ! diff -q "${file}.bak" "$file" > /dev/null 2>&1; then
            echo "  ✅ Fixed blog CTA in: $(basename "$file")"
            ((FIXED_COUNT++))
            rm "${file}.bak"
        else
            rm "${file}.bak"
        fi
    fi
done

echo ""
echo "========================================="
echo "✨ Comprehensive Fix Complete!"
echo ""
echo "📊 Statistics:"
echo "  - Files checked: $FILES_CHECKED"
echo "  - Files fixed: $FIXED_COUNT"
echo ""
echo "✅ All button icons should now have proper spacing!"
echo ""
echo "Next steps:"
echo "1. Check the dev server at http://localhost:4321"
echo "2. Test on mobile and desktop views"
echo "3. Verify phone buttons have proper icon spacing"