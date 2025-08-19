#!/bin/bash

# Script to fix all service pages with design system
echo "Fixing service pages with design system..."

# List of service pages to fix
pages=(
  "ac-installation"
  "heating-repair"
  "heating-installation"
  "hvac-installation"
  "heat-pump-systems"
  "duct-cleaning"
  "duct-sealing"
  "thermostat-installation"
  "indoor-air-quality"
  "air-purification"
  "commercial-hvac"
  "maintenance"
  "maintenance-plans"
  "residential"
  "zoning-systems"
)

for page in "${pages[@]}"; do
  echo "Processing: $page.astro"
  
  # Common fixes for all pages
  sed -i '' \
    -e 's/import PremiumButton.*//g' \
    -e 's/<PremiumButton/<Button/g' \
    -e 's/py-16 bg-/w-full bg-/g' \
    -e 's/max-w-7xl overflow-x-hidden container mx-auto px-4/container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20/g' \
    -e 's/break-words text-4xl/text-3xl sm:text-4xl lg:text-5xl/g' \
    -e 's/break-words text-3xl/text-2xl sm:text-3xl lg:text-4xl/g' \
    -e 's/break-words text-2xl/text-xl sm:text-2xl/g' \
    -e 's/break-words text-xl/text-lg sm:text-xl/g' \
    -e 's/text-gray-800/text-gray-700/g' \
    -e 's/min-w-0 //g' \
    -e 's/break-words //g' \
    -e 's/text-red-600/text-emergency-600/g' \
    -e 's/bg-red-100/bg-emergency-100/g' \
    -e 's/text-blue-600/text-primary-600/g' \
    -e 's/bg-blue-100/bg-primary-100/g' \
    -e 's/bg-blue-600/bg-primary-600/g' \
    -e 's/text-green-500/text-success-600/g' \
    -e 's/bg-green-100/bg-success-100/g' \
    -e 's/text-yellow-600/text-gray-900/g' \
    -e 's/bg-yellow-100/bg-secondary-100/g' \
    -e 's/text-orange-600/text-secondary-700/g' \
    -e 's/bg-orange-100/bg-secondary-100/g' \
    -e 's/border-blue-500/border-primary-500/g' \
    -e 's/grid md:grid-cols/grid grid-cols-1 md:grid-cols/g' \
    "/Users/ez/Desktop/AI Library/Apps/jupitair/jupitair/jupitair/src/pages/services/$page.astro"
    
  echo "✓ Fixed $page.astro"
done

echo "All service pages fixed!"