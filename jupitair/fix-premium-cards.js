#!/usr/bin/env node

/**
 * FIX ALL PREMIUM CARDS CONTRAST ISSUES
 * Changes dark text to white text on PremiumCard variant="premium" 
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, extname } from 'path';

const PROJECT_ROOT = '/Users/ez/Desktop/AI Library/Apps/jupitair/jupitair/jupitair/src';

// Text color fixes for premium cards (dark backgrounds)
const PREMIUM_CARD_FIXES = [
  { pattern: /text-gray-900/g, replacement: 'text-white', desc: 'Dark gray to white' },
  { pattern: /text-gray-800/g, replacement: 'text-white', desc: 'Gray to white' },
  { pattern: /text-blue-600/g, replacement: 'text-white', desc: 'Blue to white' },
  { pattern: /text-gray-600/g, replacement: 'text-gray-200', desc: 'Gray 600 to gray 200' },
  { pattern: /text-gray-500/g, replacement: 'text-gray-300', desc: 'Gray 500 to gray 300' }
];

function scanDirectory(dir) {
  const files = [];
  const items = readdirSync(dir);
  
  for (const item of items) {
    const fullPath = join(dir, item);
    const stat = statSync(fullPath);
    
    if (stat.isDirectory()) {
      files.push(...scanDirectory(fullPath));
    } else if (extname(item) === '.astro') {
      files.push(fullPath);
    }
  }
  
  return files;
}

function fixPremiumCardContrast(content, filePath) {
  let fixed = content;
  let changes = [];
  
  // Only process files that have premium variant cards
  if (!content.includes('variant="premium"')) {
    return { fixed, changes };
  }
  
  // Split content into premium card sections and non-premium sections
  const parts = content.split(/(PremiumCard variant="premium"[^>]*>.*?<\/PremiumCard>)/s);
  
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    
    // If this part contains a premium card, apply text fixes
    if (part.includes('variant="premium"')) {
      let fixedPart = part;
      
      for (const fix of PREMIUM_CARD_FIXES) {
        const matches = fixedPart.match(fix.pattern);
        if (matches) {
          fixedPart = fixedPart.replace(fix.pattern, fix.replacement);
          changes.push(`${fix.desc}: ${matches.length} instances`);
        }
      }
      
      parts[i] = fixedPart;
    }
  }
  
  fixed = parts.join('');
  return { fixed, changes };
}

function main() {
  console.log('🔍 FIXING PREMIUM CARD CONTRAST ISSUES...\n');
  
  const files = scanDirectory(PROJECT_ROOT);
  let totalFiles = 0;
  let totalChanges = 0;
  
  for (const filePath of files) {
    try {
      const content = readFileSync(filePath, 'utf8');
      const { fixed, changes } = fixPremiumCardContrast(content, filePath);
      
      if (changes.length > 0) {
        writeFileSync(filePath, fixed, 'utf8');
        totalFiles++;
        totalChanges += changes.length;
        
        console.log(`📄 ${filePath.replace(PROJECT_ROOT, '')}`);
        for (const change of changes) {
          console.log(`   ✅ ${change}`);
        }
        console.log('');
      }
    } catch (error) {
      console.error(`❌ Error processing ${filePath}: ${error.message}`);
    }
  }
  
  console.log(`\n🎉 PREMIUM CARD FIXES COMPLETE!`);
  console.log(`   Files modified: ${totalFiles}`);
  console.log(`   Total fixes: ${totalChanges}`);
  console.log(`\n📋 All premium cards now have proper white text on dark backgrounds`);
}

main();