#!/bin/bash

echo "Fixing city and commercial pages with design system..."

# Fix main city template
echo "Processing: [city].astro template"
sed -i '' \
  -e 's/import PremiumButton.*//g' \
  -e 's/<PremiumButton/<Button/g' \
  -e 's/</PremiumButton>/</Button>/g' \
  -e 's/bg-gradient-to-r from-gray-900 to-gray-800 py-4/w-full bg-gradient-to-r from-gray-900 to-gray-800/g' \
  -e 's/max-w-7xl overflow-x-hidden container mx-auto px-4/container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3/g' \
  -e 's/min-w-0 //g' \
  -e 's/break-words //g' \
  "/Users/ez/Desktop/AI Library/Apps/jupitair/jupitair/jupitair/src/pages/[city].astro"
echo "✓ Fixed [city].astro"

# Fix city service template
echo "Processing: [city]/[service].astro template"
if [ -f "/Users/ez/Desktop/AI Library/Apps/jupitair/jupitair/jupitair/src/pages/[city]/[service].astro" ]; then
  sed -i '' \
    -e 's/import PremiumButton.*//g' \
    -e 's/<PremiumButton/<Button/g' \
    -e 's/py-16 bg-/w-full bg-/g' \
    -e 's/max-w-7xl overflow-x-hidden container mx-auto px-4/container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20/g' \
    -e 's/text-gray-800/text-gray-700/g' \
    -e 's/min-w-0 //g' \
    -e 's/break-words //g' \
    "/Users/ez/Desktop/AI Library/Apps/jupitair/jupitair/jupitair/src/pages/[city]/[service].astro"
  echo "✓ Fixed [city]/[service].astro"
fi

# Fix specific city service pages
city_services=(
  "allen/ac-repair"
  "frisco/ac-repair"
  "mckinney/ac-repair"
  "plano/ac-repair"
)

for page in "${city_services[@]}"; do
  if [ -f "/Users/ez/Desktop/AI Library/Apps/jupitair/jupitair/jupitair/src/pages/$page.astro" ]; then
    echo "Processing: $page.astro"
    sed -i '' \
      -e 's/import PremiumButton.*//g' \
      -e 's/<PremiumButton/<Button/g' \
      -e 's/py-16 bg-/w-full bg-/g' \
      -e 's/max-w-7xl overflow-x-hidden container mx-auto px-4/container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20/g' \
      -e 's/text-4xl/text-3xl sm:text-4xl lg:text-5xl/g' \
      -e 's/text-3xl/text-2xl sm:text-3xl lg:text-4xl/g' \
      -e 's/text-2xl/text-xl sm:text-2xl/g' \
      -e 's/text-xl/text-lg sm:text-xl/g' \
      -e 's/text-gray-800/text-gray-700/g' \
      -e 's/min-w-0 //g' \
      -e 's/break-words //g' \
      "/Users/ez/Desktop/AI Library/Apps/jupitair/jupitair/jupitair/src/pages/$page.astro"
    echo "✓ Fixed $page.astro"
  fi
done

# Fix commercial pages
commercial_pages=(
  "commercial"
  "commercial/chiller-systems"
  "commercial/emergency-service"
  "commercial/new-installation"
  "commercial/office-hvac"
  "commercial/preventive-maintenance"
  "commercial/restaurant-hvac"
  "commercial/retail-hvac"
  "commercial/rtu-replacement"
)

for page in "${commercial_pages[@]}"; do
  if [ -f "/Users/ez/Desktop/AI Library/Apps/jupitair/jupitair/jupitair/src/pages/$page.astro" ]; then
    echo "Processing: $page.astro"
    sed -i '' \
      -e 's/import PremiumButton.*//g' \
      -e 's/<PremiumButton/<Button/g' \
      -e 's/py-16 bg-/w-full bg-/g' \
      -e 's/py-12 bg-/w-full bg-/g' \
      -e 's/py-20 bg-/w-full bg-/g' \
      -e 's/max-w-7xl overflow-x-hidden container mx-auto px-4/container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20/g' \
      -e 's/text-4xl/text-3xl sm:text-4xl lg:text-5xl/g' \
      -e 's/text-3xl/text-2xl sm:text-3xl lg:text-4xl/g' \
      -e 's/text-2xl/text-xl sm:text-2xl/g' \
      -e 's/text-xl/text-lg sm:text-xl/g' \
      -e 's/text-gray-800/text-gray-700/g' \
      -e 's/text-blue-600/text-primary-600/g' \
      -e 's/bg-blue-600/bg-primary-600/g' \
      -e 's/bg-blue-100/bg-primary-100/g' \
      -e 's/text-red-600/text-emergency-600/g' \
      -e 's/bg-red-600/bg-emergency-600/g' \
      -e 's/bg-red-100/bg-emergency-100/g' \
      -e 's/min-w-0 //g' \
      -e 's/break-words //g' \
      -e 's/grid md:grid-cols/grid grid-cols-1 md:grid-cols/g' \
      -e 's/grid lg:grid-cols/grid grid-cols-1 lg:grid-cols/g' \
      "/Users/ez/Desktop/AI Library/Apps/jupitair/jupitair/jupitair/src/pages/$page.astro"
    echo "✓ Fixed $page.astro"
  fi
done

# Fix other utility pages
utility_pages=(
  "about"
  "contact"
  "services"
  "privacy"
  "terms"
  "sitemap"
  "success"
  "404"
)

for page in "${utility_pages[@]}"; do
  if [ -f "/Users/ez/Desktop/AI Library/Apps/jupitair/jupitair/jupitair/src/pages/$page.astro" ]; then
    echo "Processing: $page.astro"
    sed -i '' \
      -e 's/import PremiumButton.*//g' \
      -e 's/<PremiumButton/<Button/g' \
      -e 's/py-16 bg-/w-full bg-/g' \
      -e 's/py-12 bg-/w-full bg-/g' \
      -e 's/max-w-7xl overflow-x-hidden container mx-auto px-4/container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20/g' \
      -e 's/text-4xl/text-3xl sm:text-4xl lg:text-5xl/g' \
      -e 's/text-3xl/text-2xl sm:text-3xl lg:text-4xl/g' \
      -e 's/text-2xl/text-xl sm:text-2xl/g' \
      -e 's/text-gray-800/text-gray-700/g' \
      -e 's/min-w-0 //g' \
      -e 's/break-words //g' \
      "/Users/ez/Desktop/AI Library/Apps/jupitair/jupitair/jupitair/src/pages/$page.astro"
    echo "✓ Fixed $page.astro"
  fi
done

echo "All city, commercial, and utility pages fixed!"