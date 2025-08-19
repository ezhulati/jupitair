#!/usr/bin/env node

/**
 * COMPREHENSIVE GRAY CARDS FIX SCRIPT
 * Finds and replaces ALL instances of PremiumCard variant="glass" with variant="elevated"
 * This eliminates the gray background issue shown in the screenshot
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, extname } from 'path';

const PROJECT_ROOT = '/Users/ez/Desktop/AI Library/Apps/jupitair/jupitair/jupitair/src';

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

function fixGrayCards(content, filePath) {
  let fixed = content;
  let changes = 0;
  
  // Replace ALL instances of variant="glass" with variant="elevated"
  const pattern = /variant="glass"/g;
  const matches = content.match(pattern);
  
  if (matches) {
    fixed = content.replace(pattern, 'variant="elevated"');
    changes = matches.length;
  }
  
  return { fixed, changes };
}

function main() {
  console.log('🔍 SCANNING FOR GRAY CARDS (variant="glass")...\n');
  
  const files = scanDirectory(PROJECT_ROOT);
  let totalFiles = 0;
  let totalChanges = 0;
  
  for (const filePath of files) {
    try {
      const content = readFileSync(filePath, 'utf8');
      const { fixed, changes } = fixGrayCards(content, filePath);
      
      if (changes > 0) {
        writeFileSync(filePath, fixed, 'utf8');
        totalFiles++;
        totalChanges += changes;
        
        console.log(`📄 ${filePath.replace(PROJECT_ROOT, '')}`);
        console.log(`   ✅ Fixed ${changes} gray card(s)`);
        console.log('');
      }
    } catch (error) {
      console.error(`❌ Error processing ${filePath}: ${error.message}`);
    }
  }
  
  console.log(`\n🎉 GRAY CARDS FIX COMPLETE!`);
  console.log(`   Files modified: ${totalFiles}`);
  console.log(`   Cards fixed: ${totalChanges}`);
  console.log(`\n📋 All PremiumCard variant="glass" changed to variant="elevated"`);
  console.log(`   This eliminates gray backgrounds with poor contrast.`);
}

main();