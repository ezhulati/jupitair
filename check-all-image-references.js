#!/usr/bin/env node

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function checkAllImageReferences() {
  console.log('🔍 Checking ALL blog posts for image reference mismatches...\n');
  
  const blogDir = path.join(__dirname, 'src/content/blog');
  const imagesDir = path.join(__dirname, 'public/images/blog');
  
  // Get all blog files and image files
  const blogFiles = await fs.readdir(blogDir);
  const imageFiles = await fs.readdir(imagesDir);
  
  const issues = [];
  let totalChecked = 0;
  
  for (const file of blogFiles.filter(f => f.endsWith('.mdx'))) {
    const slug = file.replace('.mdx', '');
    const content = await fs.readFile(path.join(blogDir, file), 'utf-8');
    
    // Extract heroImage from frontmatter
    const heroImageMatch = content.match(/heroImage:\s*["']([^"']+)["']/);
    
    if (heroImageMatch) {
      const heroImagePath = heroImageMatch[1];
      // Extract just the filename from the path
      const expectedFilename = heroImagePath.split('/').pop();
      
      totalChecked++;
      
      // Check if this file exists
      if (!imageFiles.includes(expectedFilename)) {
        const suggestedFilename = `${slug}.jpg`;
        const suggestedExists = imageFiles.includes(suggestedFilename);
        
        issues.push({
          slug,
          expected: expectedFilename,
          suggested: suggestedFilename,
          suggestedExists,
          heroImagePath
        });
        
        console.log(`❌ ${slug}`);
        console.log(`   Expected: ${expectedFilename}`);
        console.log(`   Suggested: ${suggestedFilename} ${suggestedExists ? '✅ EXISTS' : '❌ MISSING'}`);
        console.log('');
      } else {
        console.log(`✅ ${slug} - ${expectedFilename}`);
      }
    } else {
      console.log(`⚠️  ${slug} - No heroImage found in frontmatter`);
    }
  }
  
  console.log('\n📊 SUMMARY:');
  console.log(`Total blog posts checked: ${totalChecked}`);
  console.log(`Image reference issues: ${issues.length}`);
  
  if (issues.length > 0) {
    console.log('\n🔧 ISSUES TO FIX:');
    issues.forEach(issue => {
      console.log(`- ${issue.slug}: ${issue.expected} → ${issue.suggested} ${issue.suggestedExists ? '(file exists)' : '(needs generation)'}`);
    });
  } else {
    console.log('\n🎉 All image references are correct!');
  }
  
  return issues;
}

checkAllImageReferences();
