#!/bin/bash

echo "Fixing h1 heading hierarchy across all pages..."

# Fix index.astro - Change first h2 to h1
sed -i '' 's/<h2 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">/<h1 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">/' src/pages/index.astro
sed -i '' 's/<\/h2>/<\/h1>/' src/pages/index.astro | head -1

# Fix contact.astro - Change main heading to h1
sed -i '' 's/<h2 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">/<h1 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">/' src/pages/contact.astro
sed -i '' 's/<\/h2>/<\/h1>/' src/pages/contact.astro | head -1

# Fix about.astro - Change main heading to h1
sed -i '' 's/<h2 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">/<h1 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">/' src/pages/about.astro
sed -i '' 's/<\/h2>/<\/h1>/' src/pages/about.astro | head -1

# Fix services.astro - Change main heading to h1
sed -i '' 's/<h2 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">/<h1 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">/' src/pages/services.astro
sed -i '' 's/<\/h2>/<\/h1>/' src/pages/services.astro | head -1

# Fix commercial.astro - Change main heading to h1
sed -i '' 's/<h2 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">/<h1 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">/' src/pages/commercial.astro
sed -i '' 's/<\/h2>/<\/h1>/' src/pages/commercial.astro | head -1

# Fix privacy.astro - Change main heading to h1
sed -i '' 's/<h2 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-8">/<h1 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-8">/' src/pages/privacy.astro
sed -i '' 's/<\/h2>/<\/h1>/' src/pages/privacy.astro | head -1

# Fix terms.astro - Change main heading to h1
sed -i '' 's/<h2 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-8">/<h1 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-8">/' src/pages/terms.astro
sed -i '' 's/<\/h2>/<\/h1>/' src/pages/terms.astro | head -1

# Fix city pages - Change main heading to h1
for file in src/pages/\[city\].astro src/pages/\[city\]/\[service\].astro; do
  if [ -f "$file" ]; then
    # Find first h2 and change to h1
    sed -i '' '0,/<h2/{s/<h2/<h1/;}' "$file"
    sed -i '' '0,/<\/h2>/{s/<\/h2>/<\/h1>/;}' "$file"
  fi
done

# Fix commercial pages - Change main heading to h1
for file in src/pages/commercial/*.astro; do
  if [ -f "$file" ]; then
    # Find first h2 and change to h1
    sed -i '' '0,/<h2/{s/<h2/<h1/;}' "$file"
    sed -i '' '0,/<\/h2>/{s/<\/h2>/<\/h1>/;}' "$file"
  fi
done

echo "Heading hierarchy fixes completed!"