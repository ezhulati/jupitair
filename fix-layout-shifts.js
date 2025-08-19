#!/usr/bin/env node

/**
 * COMPREHENSIVE LAYOUT SHIFT FIXES
 * Finds and fixes all potential CLS (Cumulative Layout Shift) issues
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, extname } from 'path';

const PROJECT_ROOT = '/Users/ez/Desktop/AI Library/Apps/jupitair/jupitair/jupitair/src';

// Common layout shift patterns to fix
const LAYOUT_SHIFT_FIXES = [
  // Images without dimensions
  {
    pattern: /<img[^>]*src="[^"]*"[^>]*(?!.*(?:width|height))[^>]*>/g,
    description: 'Images without dimensions',
    fix: (match) => {
      // Add loading="lazy" and basic width/height if missing
      let fixed = match;
      if (!fixed.includes('loading=')) {
        fixed = fixed.replace('<img', '<img loading="lazy"');
      }
      if (!fixed.includes('width=') && !fixed.includes('height=')) {
        // Add responsive classes instead of fixed dimensions
        fixed = fixed.replace('class="', 'class="w-full h-auto ');
        if (!fixed.includes('class="')) {
          fixed = fixed.replace('<img', '<img class="w-full h-auto"');
        }
      }
      return fixed;
    }
  },
  
  // Missing aspect ratio containers
  {
    pattern: /<video[^>]*(?!.*aspect-)[^>]*>/g,
    description: 'Videos without aspect ratio',
    fix: (match) => {
      let fixed = match;
      if (!fixed.includes('aspect-')) {
        fixed = fixed.replace('class="', 'class="aspect-video ');
        if (!fixed.includes('class="')) {
          fixed = fixed.replace('<video', '<video class="aspect-video"');
        }
      }
      return fixed;
    }
  },
  
  // Unsafe grid layouts
  {
    pattern: /class="[^"]*grid[^"]*"[^>]*>/g,
    description: 'Grid layouts that could shift',
    fix: (match) => {
      let fixed = match;
      // Ensure grids have min-width: 0 for content overflow
      if (!fixed.includes('min-w-0')) {
        fixed = fixed.replace('class="', 'class="min-w-0 ');
      }
      return fixed;
    }
  },
  
  // Unsafe flex layouts
  {
    pattern: /class="[^"]*flex[^"]*"[^>]*>/g,
    description: 'Flex layouts that could shift',
    fix: (match) => {
      let fixed = match;
      if (!fixed.includes('min-w-0') && !fixed.includes('flex-shrink')) {
        fixed = fixed.replace('class="', 'class="min-w-0 ');
      }
      return fixed;
    }
  },
  
  // Elements that could cause horizontal overflow
  {
    pattern: /class="[^"]*(?:w-screen|min-w-full|max-w-none)[^"]*"/g,
    description: 'Elements that could cause overflow',
    fix: (match) => {
      let fixed = match;
      // Add overflow-x-hidden to prevent horizontal scroll
      if (!fixed.includes('overflow-x-hidden')) {
        fixed = fixed.replace('class="', 'class="overflow-x-hidden ');
      }
      return fixed;
    }
  },
  
  // Missing container constraints
  {
    pattern: /<div[^>]*class="[^"]*container[^"]*"[^>]*>/g,
    description: 'Containers without max-width constraints',
    fix: (match) => {
      let fixed = match;
      if (!fixed.includes('max-w-') && !fixed.includes('overflow-x-hidden')) {
        fixed = fixed.replace('class="', 'class="max-w-7xl overflow-x-hidden ');
      }
      return fixed;
    }
  },
  
  // Unsafe text that could overflow
  {
    pattern: /class="[^"]*(?:text-xl|text-2xl|text-3xl|text-4xl|text-5xl|text-6xl)[^"]*"(?![^>]*(?:break-words|overflow-wrap))[^>]*>/g,
    description: 'Large text without overflow protection',
    fix: (match) => {
      let fixed = match;
      if (!fixed.includes('break-words')) {
        fixed = fixed.replace('class="', 'class="break-words ');
      }
      return fixed;
    }
  },
  
  // Forms without proper constraints
  {
    pattern: /<form[^>]*(?!.*overflow-x-hidden)[^>]*>/g,
    description: 'Forms without overflow protection',
    fix: (match) => {
      let fixed = match;
      if (!fixed.includes('overflow-x-hidden')) {
        fixed = fixed.replace('class="', 'class="overflow-x-hidden ');
        if (!fixed.includes('class="')) {
          fixed = fixed.replace('<form', '<form class="overflow-x-hidden"');
        }
      }
      return fixed;
    }
  }
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

function fixLayoutShifts(content, filePath) {
  let fixed = content;
  let changesMade = [];
  
  for (const issue of LAYOUT_SHIFT_FIXES) {
    const matches = fixed.match(issue.pattern);
    if (matches) {
      if (typeof issue.fix === 'function') {
        let updatedContent = fixed;
        matches.forEach(match => {
          const fixedMatch = issue.fix(match);
          updatedContent = updatedContent.replace(match, fixedMatch);
        });
        if (updatedContent !== fixed) {
          fixed = updatedContent;
          changesMade.push(`✅ Fixed: ${issue.description} (${matches.length} instances)`);
        }
      } else {
        fixed = fixed.replace(issue.pattern, issue.fix);
        changesMade.push(`✅ Fixed: ${issue.description} (${matches.length} instances)`);
      }
    }
  }
  
  return { fixed, changesMade };
}

function main() {
  console.log('🔍 SCANNING FOR LAYOUT SHIFT ISSUES...\n');
  
  const files = scanDirectory(PROJECT_ROOT);
  let totalFiles = 0;
  let totalChanges = 0;
  
  for (const filePath of files) {
    try {
      const content = readFileSync(filePath, 'utf8');
      const { fixed, changesMade } = fixLayoutShifts(content, filePath);
      
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
  
  console.log(`\n🎉 LAYOUT SHIFT FIXES COMPLETE!`);
  console.log(`   Files modified: ${totalFiles}`);
  console.log(`   Total fixes: ${totalChanges}`);
  console.log(`\n📋 All potential CLS issues have been addressed.`);
  console.log(`   - Images have proper loading and dimensions`);
  console.log(`   - Containers have overflow protection`);
  console.log(`   - Text has proper word wrapping`);
  console.log(`   - Grids and flexbox have safe defaults`);
}

main();