#!/bin/bash

echo "🔧 ELIMINATING ALL CARD SCROLLBARS..."

# Find all files with PremiumCard or Card components
FILES=$(grep -r "PremiumCard\|<Card" src/pages --include="*.astro" -l)

for FILE in $FILES; do
  echo "📝 Processing $FILE..."
  
  # Add overflow-visible class to all PremiumCard components
  sed -i '' 's/<PremiumCard/<PremiumCard class="overflow-visible" /g' "$FILE"
  sed -i '' 's/<Card/<Card class="overflow-visible" /g' "$FILE"
  
  # Remove any height constraints
  sed -i '' 's/h-\[.*\]//g' "$FILE"
  sed -i '' 's/max-h-\[.*\]//g' "$FILE"
  sed -i '' 's/min-h-\[.*\]//g' "$FILE"
done

echo "✅ All card scrollbars eliminated!"