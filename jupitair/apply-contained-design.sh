#!/bin/bash

echo "====================================="
echo "APPLYING CONTAINED DESIGN TO ALL PAGES"
echo "====================================="
echo ""

# Function to fix a file
fix_file() {
    local file="$1"
    local filename=$(basename "$file")
    
    echo "Processing: $filename"
    
    # Replace all section containers with contained design
    sed -i '' \
        -e 's/<section class="py-[0-9]* bg-/<section class="section-full bg-/g' \
        -e 's/<section class="w-full bg-/<section class="section-full bg-/g' \
        -e 's/container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8/site-container/g' \
        -e 's/max-w-7xl overflow-x-hidden container mx-auto px-4/site-container/g' \
        -e 's/max-w-7xl container mx-auto px-4/site-container/g' \
        -e 's/container mx-auto px-4 max-w-7xl/site-container/g' \
        -e 's/class="py-12 sm:py-16 lg:py-20"/class="section-padding"/g' \
        -e 's/py-12 sm:py-16 lg:py-20/section-padding/g' \
        "$file"
    
    # Fix hero sections to have proper padding
    if grep -q "PremiumHero\|Hero\|hero" "$file"; then
        sed -i '' \
            -e '/<PremiumHero/,/\/>/s/height="lg"/height="lg" class="hero-section"/g' \
            -e '/<Hero/,/\/>/s/\/>/class="hero-section" \/>/g' \
            "$file"
    fi
    
    echo "✓ Fixed $filename"
}

# Counter
total=0
fixed=0

echo "FIXING LAYOUTS..."
echo "-----------------"
for file in /Users/ez/Desktop/AI\ Library/Apps/jupitair/jupitair/jupitair/src/layouts/*.astro; do
    if [ -f "$file" ]; then
        fix_file "$file"
        ((fixed++))
    fi
    ((total++))
done

echo ""
echo "FIXING COMPONENTS..."
echo "--------------------"
for file in /Users/ez/Desktop/AI\ Library/Apps/jupitair/jupitair/jupitair/src/components/**/*.astro; do
    if [ -f "$file" ]; then
        fix_file "$file"
        ((fixed++))
    fi
    ((total++))
done

echo ""
echo "FIXING PAGES..."
echo "---------------"

# Main pages
for file in /Users/ez/Desktop/AI\ Library/Apps/jupitair/jupitair/jupitair/src/pages/*.astro; do
    if [ -f "$file" ]; then
        fix_file "$file"
        ((fixed++))
    fi
    ((total++))
done

# Service pages
for file in /Users/ez/Desktop/AI\ Library/Apps/jupitair/jupitair/jupitair/src/pages/services/*.astro; do
    if [ -f "$file" ]; then
        fix_file "$file"
        ((fixed++))
    fi
    ((total++))
done

# Commercial pages
for file in /Users/ez/Desktop/AI\ Library/Apps/jupitair/jupitair/jupitair/src/pages/commercial/*.astro; do
    if [ -f "$file" ]; then
        fix_file "$file"
        ((fixed++))
    fi
    ((total++))
done

# City pages
for file in /Users/ez/Desktop/AI\ Library/Apps/jupitair/jupitair/jupitair/src/pages/allen/*.astro \
           /Users/ez/Desktop/AI\ Library/Apps/jupitair/jupitair/jupitair/src/pages/frisco/*.astro \
           /Users/ez/Desktop/AI\ Library/Apps/jupitair/jupitair/jupitair/src/pages/mckinney/*.astro \
           /Users/ez/Desktop/AI\ Library/Apps/jupitair/jupitair/jupitair/src/pages/plano/*.astro; do
    if [ -f "$file" ]; then
        fix_file "$file"
        ((fixed++))
    fi
    ((total++))
done

# Blog pages
for file in /Users/ez/Desktop/AI\ Library/Apps/jupitair/jupitair/jupitair/src/pages/blog/*.astro \
           /Users/ez/Desktop/AI\ Library/Apps/jupitair/jupitair/jupitair/src/pages/blog/**/*.astro; do
    if [ -f "$file" ]; then
        fix_file "$file"
        ((fixed++))
    fi
    ((total++))
done

echo ""
echo "====================================="
echo "CONTAINED DESIGN APPLICATION COMPLETE"
echo "====================================="
echo "Total files processed: $total"
echo "Files fixed: $fixed"
echo ""
echo "All pages now use:"
echo "• Contained max-width design (1440px on large screens)"
echo "• Proper hero padding accounting for fixed header"
echo "• Consistent section padding"
echo "• Mobile-first responsive containers"
echo "====================================="