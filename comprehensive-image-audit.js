#!/usr/bin/env node

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function comprehensiveImageAudit() {
  console.log('🔍 COMPREHENSIVE IMAGE AUDIT - Checking ALL 66 blog posts...\n');
  
  // Get all blog posts
  const blogDir = path.join(__dirname, 'src/content/blog');
  const blogFiles = await fs.readdir(blogDir);
  const blogPosts = blogFiles.filter(file => file.endsWith('.mdx')).map(file => file.replace('.mdx', ''));
  
  // Check images directory
  const imagesDir = path.join(__dirname, 'public/images/blog');
  let imageFiles = [];
  
  try {
    imageFiles = await fs.readdir(imagesDir);
  } catch (error) {
    console.log('❌ Images directory not found or empty!');
    return;
  }
  
  console.log(`📊 Found ${blogPosts.length} blog posts`);
  console.log(`📊 Found ${imageFiles.length} image files\n`);
  
  const issues = {
    missing: [],
    tooSmall: [],
    wrongFormat: [],
    needsRegeneration: []
  };
  
  // Check each blog post
  for (const slug of blogPosts) {
    const expectedImage = `${slug}.jpg`;
    const imagePath = path.join(imagesDir, expectedImage);
    
    try {
      const stats = await fs.stat(imagePath);
      const sizeKB = Math.round(stats.size / 1024);
      
      // Check for problematic indicators
      if (sizeKB < 50) {
        issues.tooSmall.push({ slug, size: sizeKB });
        console.log(`⚠️  ${slug}: Image too small (${sizeKB}KB) - likely broken`);
      } else if (sizeKB > 1000) {
        console.log(`✅ ${slug}: Good size (${sizeKB}KB)`);
      } else {
        console.log(`📏 ${slug}: Medium size (${sizeKB}KB)`);
      }
      
      // Add to regeneration list if it's a topic prone to silly results
      if (isProblematicTopic(slug)) {
        issues.needsRegeneration.push(slug);
        console.log(`🎯 ${slug}: Flagged for regeneration (problematic topic)`);
      }
      
    } catch (error) {
      issues.missing.push(slug);
      console.log(`❌ ${slug}: IMAGE MISSING`);
    }
  }
  
  // Check for wrong format files
  const nonJpgImages = imageFiles.filter(file => !file.endsWith('.jpg'));
  if (nonJpgImages.length > 0) {
    console.log(`\n⚠️  Non-JPG files found: ${nonJpgImages.join(', ')}`);
  }
  
  // Summary
  console.log('\n📋 AUDIT RESULTS:');
  console.log(`❌ Missing images: ${issues.missing.length}`);
  console.log(`📏 Too small (likely broken): ${issues.tooSmall.length}`);
  console.log(`🎯 Need regeneration (problematic topics): ${issues.needsRegeneration.length}`);
  
  if (issues.missing.length > 0) {
    console.log('\n❌ MISSING IMAGES:');
    issues.missing.forEach(slug => console.log(`   - ${slug}`));
  }
  
  if (issues.tooSmall.length > 0) {
    console.log('\n📏 TOO SMALL/BROKEN IMAGES:');
    issues.tooSmall.forEach(item => console.log(`   - ${item.slug} (${item.size}KB)`));
  }
  
  if (issues.needsRegeneration.length > 0) {
    console.log('\n🎯 PROBLEMATIC TOPICS TO REGENERATE:');
    issues.needsRegeneration.forEach(slug => console.log(`   - ${slug}`));
  }
  
  // Save comprehensive report
  const report = {
    totalPosts: blogPosts.length,
    totalImages: imageFiles.length,
    issues,
    allPosts: blogPosts,
    timestamp: new Date().toISOString()
  };
  
  await fs.writeFile(
    path.join(__dirname, 'comprehensive-audit-report.json'),
    JSON.stringify(report, null, 2)
  );
  
  console.log('\n📄 Full report saved to: comprehensive-audit-report.json');
  
  return report;
}

// Identify topics that commonly get silly or inappropriate results
function isProblematicTopic(slug) {
  const problematicKeywords = [
    'smell', 'noise', 'sound', 'frozen', 'emergency', 'steps', 'checklist',
    'basics', 'plain-english', 'explained', 'guide', 'calculator', 'comfort',
    'issues', 'causes', 'problems', 'troubleshoot', 'fix', 'repair',
    'safety', 'gas', 'co', 'carbon', 'leak', 'dust', 'filter',
    'rating', 'efficiency', 'cost', 'pricing', 'warranty', 'lifespan'
  ];
  
  return problematicKeywords.some(keyword => slug.toLowerCase().includes(keyword));
}

// Run the audit
comprehensiveImageAudit();
