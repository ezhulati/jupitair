#!/usr/bin/env node

/**
 * CRITICAL CONTRAST FIX SCRIPT
 * 
 * This script finds and fixes ALL instances of poor contrast:
 * - Gray cards with gray/dark text
 * - Light text on light backgrounds
 * - Dark text on dark backgrounds
 * 
 * RULES:
 * - If text is dark/gray, background must be white
 * - If text is white, background must be dark
 * - NO gray cards with gray text - EVER
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, extname } from 'path';

const PROJECT_ROOT = '/Users/ez/Desktop/AI Library/Apps/jupitair/jupitair/jupitair/src';

// Problematic patterns to find and fix
const CONTRAST_ISSUES = [
  // Gray cards with gray text - BIGGEST PROBLEM
  {
    pattern: /PremiumCard\s+variant="glass"/g,
    replacement: 'PremiumCard variant="elevated"',
    description: 'Gray glass cards causing contrast issues'
  },
  {
    pattern: /Card\s+[^>]*class="[^"]*bg-gray-/g,
    replacement: match => match.replace(/bg-gray-\d+/, 'bg-white'),
    description: 'Gray Card backgrounds'
  },
  
  // Text color issues on light backgrounds
  {
    pattern: /text-gray-600(?=.*(?:bg-white|bg-gray-50|bg-gray-100))/g,
    replacement: 'text-gray-800',
    description: 'Light gray text on light backgrounds'
  },
  {
    pattern: /text-gray-500(?=.*(?:bg-white|bg-gray-50|bg-gray-100))/g,
    replacement: 'text-gray-700',
    description: 'Very light gray text on light backgrounds'
  },
  {
    pattern: /text-gray-400(?=.*(?:bg-white|bg-gray-50|bg-gray-100))/g,
    replacement: 'text-gray-600',
    description: 'Ultra light gray text on light backgrounds'
  },
  
  // Specific component fixes
  {
    pattern: /<div class="[^"]*bg-gray-50[^"]*rounded-xl[^"]*p-6[^"]*space-y-4">/g,
    replacement: '<div class="bg-white rounded-xl p-6 space-y-4 border border-gray-200 shadow-sm">',
    description: 'Gray info boxes'
  }
];

// Design system rules to enforce
const DESIGN_RULES = `
/**
 * JUPITAIR HVAC DESIGN SYSTEM - CONTRAST RULES
 * 
 * CRITICAL RULES - NEVER VIOLATE:
 * 
 * 1. WHITE BACKGROUNDS ONLY:
 *    - bg-white for all cards with dark text
 *    - text-gray-800, text-gray-900 for readability
 * 
 * 2. DARK BACKGROUNDS ONLY:
 *    - bg-gray-800, bg-gray-900 for cards with white text
 *    - text-white, text-gray-100 for readability
 * 
 * 3. COLORED BACKGROUNDS:
 *    - bg-blue-600+ with text-white
 *    - bg-red-600+ with text-white
 *    - bg-green-600+ with text-white
 * 
 * 4. BANNED COMBINATIONS:
 *    - NO bg-gray-50, bg-gray-100, bg-gray-200 with text-gray-600 or lighter
 *    - NO bg-gray-400+ with text-gray-800 or darker
 *    - NO "glass" variants that create gray backgrounds
 * 
 * 5. COMPONENT RULES:
 *    - PremiumCard: use "elevated" (white bg) or "premium" (dark bg) ONLY
 *    - Card: always bg-white with dark text
 *    - Info boxes: bg-white with borders, never gray backgrounds
 */
`;

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

function fixContrastIssues(content, filePath) {
  let fixed = content;
  let changesMade = [];
  
  // Apply all contrast fixes
  for (const issue of CONTRAST_ISSUES) {
    const matches = fixed.match(issue.pattern);
    if (matches) {
      if (typeof issue.replacement === 'function') {
        fixed = fixed.replace(issue.pattern, issue.replacement);
      } else {
        fixed = fixed.replace(issue.pattern, issue.replacement);
      }
      changesMade.push(`✅ Fixed: ${issue.description} (${matches.length} instances)`);
    }
  }
  
  return { fixed, changesMade };
}

function main() {
  console.log('🔍 SCANNING FOR CONTRAST ISSUES...\n');
  
  const files = scanDirectory(PROJECT_ROOT);
  let totalFiles = 0;
  let totalChanges = 0;
  
  for (const filePath of files) {
    try {
      const content = readFileSync(filePath, 'utf8');
      const { fixed, changesMade } = fixContrastIssues(content, filePath);
      
      if (changesMade.length > 0) {
        writeFileSync(filePath, fixed, 'utf8');
        totalFiles++;
        totalChanges += changesMade.length;
        
        console.log(`📄 ${filePath.replace(PROJECT_ROOT, '')}`);
        for (const change of changesMade) {
          console.log(`   ${change}`);
        }
        console.log('');
      }
    } catch (error) {
      console.error(`❌ Error processing ${filePath}: ${error.message}`);
    }
  }
  
  console.log(`\n🎉 CONTRAST FIX COMPLETE!`);
  console.log(`   Files modified: ${totalFiles}`);
  console.log(`   Total changes: ${totalChanges}`);
  
  // Write design system rules
  const rulesPath = join(PROJECT_ROOT, 'styles/design-system-rules.md');
  writeFileSync(rulesPath, DESIGN_RULES);
  console.log(`\n📋 Design system rules written to: ${rulesPath}`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}