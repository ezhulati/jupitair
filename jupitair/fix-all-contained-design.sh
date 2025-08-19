#!/bin/bash

# COMPREHENSIVE FIX FOR CONTAINED DESIGN ON ALL PAGES
echo "🔧 FIXING CONTAINED DESIGN ON ALL PAGES"
echo "========================================"

JUPITAIR_DIR="/Users/ez/Desktop/AI Library/Apps/jupitair/jupitair/jupitair"
cd "$JUPITAIR_DIR"

FIXED_COUNT=0
TOTAL_FILES=0

# First, find ALL Astro pages
echo "📋 Finding ALL Astro pages..."
ALL_PAGES=$(find src/pages -name "*.astro" -type f)
TOTAL_PAGES=$(echo "$ALL_PAGES" | wc -l)

echo "Found $TOTAL_PAGES pages to check"
echo ""

# Fix each page
for file in $ALL_PAGES; do
    ((TOTAL_FILES++))
    echo "Checking: $(basename "$file")"
    
    # Skip API routes
    if [[ "$file" == *"/api/"* ]]; then
        echo "  ⏭️  Skipping API route"
        continue
    fi
    
    # Create backup
    cp "$file" "${file}.bak"
    
    # Check if file uses contained design
    if ! grep -q "site-container" "$file"; then
        echo "  ❌ Missing contained design - FIXING NOW"
        
        # Replace container mx-auto with site-container
        sed -i '' 's/class="container mx-auto/class="site-container/g' "$file"
        
        # Replace max-w-7xl mx-auto with site-container
        sed -i '' 's/class="max-w-7xl mx-auto/class="site-container/g' "$file"
        
        # Replace common full-width patterns
        sed -i '' 's/class="px-4 sm:px-6 lg:px-8"/class="site-container"/g' "$file"
        
        # Fix section wrappers - ensure sections have proper structure
        # Pattern: <section class="..."> should contain <div class="site-container">
        perl -i -0pe 's/<section([^>]*class="[^"]*")>(\s*)<div class="(?!site-container)([^"]*)">/\1>\2<div class="site-container">/gs' "$file"
        
        # Fix hero sections specifically
        perl -i -0pe 's/<div class="container mx-auto px-4([^"]*)"/<div class="site-container\1"/g' "$file"
        
        # Fix any remaining container patterns
        perl -i -0pe 's/class="([^"]*)\s*container\s+mx-auto\s*([^"]*)"/class="\1 site-container \2"/g' "$file"
        
        # Add section-padding where needed
        perl -i -0pe 's/class="site-container"/class="site-container section-padding"/g' "$file"
        
        # Clean up double spacing
        sed -i '' 's/  */ /g' "$file"
        
        ((FIXED_COUNT++))
        echo "  ✅ FIXED!"
    else
        echo "  ✅ Already has contained design"
    fi
    
    rm "${file}.bak"
done

echo ""
echo "🔍 Now fixing specific problem pages..."
echo ""

# Fix [city]/[service].astro specifically
CITY_SERVICE="/Users/ez/Desktop/AI Library/Apps/jupitair/jupitair/jupitair/src/pages/[city]/[service].astro"
if [ -f "$CITY_SERVICE" ]; then
    echo "Fixing [city]/[service].astro..."
    cp "$CITY_SERVICE" "${CITY_SERVICE}.bak"
    
    # Ensure all sections use site-container
    sed -i '' 's/<div class="max-w-7xl mx-auto/<div class="site-container/g' "$CITY_SERVICE"
    sed -i '' 's/<div class="container mx-auto/<div class="site-container/g' "$CITY_SERVICE"
    sed -i '' 's/class="px-4 sm:px-6 lg:px-8"/class="site-container section-padding"/g' "$CITY_SERVICE"
    
    echo "  ✅ Fixed [city]/[service].astro"
    rm "${CITY_SERVICE}.bak"
fi

# Fix all service pages
echo ""
echo "🔍 Fixing all service pages..."
SERVICE_PAGES=$(find src/pages/services -name "*.astro" -type f)
for file in $SERVICE_PAGES; do
    echo "Fixing: $(basename "$file")"
    cp "$file" "${file}.bak"
    
    # Apply contained design
    sed -i '' 's/<div class="max-w-7xl mx-auto/<div class="site-container/g' "$file"
    sed -i '' 's/<div class="container mx-auto/<div class="site-container/g' "$file"
    sed -i '' 's/class="px-4 sm:px-6 lg:px-8"/class="site-container section-padding"/g' "$file"
    
    # Ensure sections have proper wrapper
    perl -i -0pe 's/<section([^>]*)>\s*<div class="(?!site-container)([^"]*)"/<section\1>\n  <div class="site-container section-padding"/g' "$file"
    
    echo "  ✅ Fixed $(basename "$file")"
    rm "${file}.bak"
done

# Fix city pages like Allen
echo ""
echo "🔍 Fixing all city pages..."
CITY_PAGES=$(find src/pages -maxdepth 2 -name "*.astro" -type f | grep -E "(allen|frisco|plano|mckinney|prosper|the-colony|little-elm|addison)")
for file in $CITY_PAGES; do
    echo "Fixing: $(basename "$file")"
    cp "$file" "${file}.bak"
    
    # Apply contained design
    sed -i '' 's/<div class="max-w-7xl mx-auto/<div class="site-container/g' "$file"
    sed -i '' 's/<div class="container mx-auto/<div class="site-container/g' "$file"
    sed -i '' 's/class="px-4 sm:px-6 lg:px-8"/class="site-container section-padding"/g' "$file"
    
    echo "  ✅ Fixed $(basename "$file")"
    rm "${file}.bak"
done

echo ""
echo "=========================================="
echo "✨ COMPREHENSIVE CONTAINED DESIGN FIX COMPLETE!"
echo ""
echo "📊 Statistics:"
echo "  - Total files checked: $TOTAL_FILES"
echo "  - Files fixed: $FIXED_COUNT"
echo ""
echo "✅ ALL pages should now use contained design!"
echo ""
echo "Next steps:"
echo "1. Check the dev server at http://localhost:4321"
echo "2. Click through every page to verify"
echo "3. All content should be contained, not full-width"