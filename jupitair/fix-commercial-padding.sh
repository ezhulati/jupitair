#!/bin/bash

# Fix padding in commercial pages and contact page to be consistent with the site-wide balanced padding

echo "🔧 Standardizing padding in commercial and contact pages..."

# Standard section padding for regular sections
STANDARD_PADDING="pt-16 pb-20 sm:pt-20 sm:pb-24 lg:pt-24 lg:pb-28"

# Files to update
FILES=(
  "src/pages/commercial.astro"
  "src/pages/commercial/restaurant-hvac.astro"
  "src/pages/commercial/retail-hvac.astro"
  "src/pages/commercial/office-hvac.astro"
  "src/pages/commercial/emergency-service.astro"
  "src/pages/commercial/new-installation.astro"
  "src/pages/commercial/chiller-systems.astro"
  "src/pages/commercial/rtu-replacement.astro"
  "src/pages/commercial/preventive-maintenance.astro"
  "src/pages/contact.astro"
  "src/pages/services/commercial-hvac.astro"
)

for FILE in "${FILES[@]}"; do
  if [ -f "$FILE" ]; then
    echo "📝 Processing $FILE..."
    
    # Create backup
    cp "$FILE" "$FILE.bak"
    
    # Fix main section paddings (py-16, py-12, etc.)
    sed -i '' 's/py-16/$STANDARD_PADDING/g' "$FILE"
    sed -i '' 's/py-12/$STANDARD_PADDING/g' "$FILE"
    sed -i '' 's/py-8 sm:py-12 lg:py-16/$STANDARD_PADDING/g' "$FILE"
    
    # Fix split paddings that need balancing
    sed -i '' 's/pt-12 pb-16/$STANDARD_PADDING/g' "$FILE"
    sed -i '' 's/pt-16 pb-16/$STANDARD_PADDING/g' "$FILE"
    sed -i '' 's/pt-8 pb-12/$STANDARD_PADDING/g' "$FILE"
    
    # Specific fix for sections that should have standard padding
    sed -i '' "s/class=\"site-container section-padding py-16\"/class=\"site-container section-padding $STANDARD_PADDING\"/g" "$FILE"
    sed -i '' "s/py-8 sm:py-12 lg:py-16/$STANDARD_PADDING/g" "$FILE"
    
    # Fix trust bar sections (should be smaller)
    sed -i '' 's/class="bg-gradient-to-r from-gray-900 to-gray-800 py-4"/class="bg-gradient-to-r from-gray-900 to-gray-800 py-6 sm:py-8"/g' "$FILE"
    
    # Clean up any duplicate classes
    sed -i '' 's/pt-16 pb-20 sm:pt-20 sm:pb-24 lg:pt-24 lg:pb-28 pt-16 pb-20 sm:pt-20 sm:pb-24 lg:pt-24 lg:pb-28/pt-16 pb-20 sm:pt-20 sm:pb-24 lg:pt-24 lg:pb-28/g' "$FILE"
    
    echo "✅ Updated $FILE"
  else
    echo "⚠️ File not found: $FILE"
  fi
done

echo ""
echo "✨ Padding standardization complete!"
echo "📊 Summary:"
echo "  - Standard sections: $STANDARD_PADDING"
echo "  - Trust bars: py-6 sm:py-8"
echo ""
echo "🔍 Review the changes and test the site to ensure proper spacing."