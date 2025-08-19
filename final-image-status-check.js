#!/usr/bin/env node

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function checkFinalImageStatus() {
  console.log('🔍 Final Image Generation Status Check\n');
  
  // Get all blog posts
  const blogDir = path.join(__dirname, 'src/content/blog');
  const blogFiles = await fs.readdir(blogDir);
  const blogPosts = blogFiles.filter(file => file.endsWith('.mdx')).map(file => file.replace('.mdx', ''));
  
  // Get all existing blog images (correct location: public/images/blog/)
  const blogImagesDir = path.join(__dirname, 'public/images/blog');
  const imageFiles = await fs.readdir(blogImagesDir);
  const blogImages = imageFiles
    .filter(file => file.endsWith('.jpg'))
    .map(file => file.replace('.jpg', ''));
  
  // Find missing images
  const missingImages = blogPosts.filter(post => !blogImages.includes(post));
  const extraImages = blogImages.filter(image => !blogPosts.includes(image));
  
  console.log(`📊 FINAL STATUS REPORT:`);
  console.log(`📝 Total blog posts: ${blogPosts.length}`);
  console.log(`🖼️  Total blog images: ${blogImages.length}`);
  console.log(`❌ Missing images: ${missingImages.length}`);
  console.log(`➕ Extra images: ${extraImages.length}\n`);
  
  if (missingImages.length === 0) {
    console.log('✅ SUCCESS: All blog posts have corresponding images!');
    console.log('🎉 Image generation is COMPLETE!\n');
  } else {
    console.log('❌ MISSING: Blog posts without images:');
    missingImages.forEach(post => console.log(`   - ${post}`));
    console.log('');
  }
  
  if (extraImages.length > 0) {
    console.log('ℹ️  Extra images (no corresponding blog post):');
    extraImages.forEach(image => console.log(`   - ${image}`));
    console.log('');
  }
  
  // Generate summary
  const status = {
    totalPosts: blogPosts.length,
    totalImages: blogImages.length,
    missingCount: missingImages.length,
    extraCount: extraImages.length,
    isComplete: missingImages.length === 0,
    missingImages,
    extraImages,
    imageLocation: 'public/images/blog/',
    imageFormat: '.jpg'
  };
  
  // Save status report
  await fs.writeFile(
    path.join(__dirname, 'image-generation-final-report.json'), 
    JSON.stringify(status, null, 2)
  );
  
  console.log('📄 Final report saved to: image-generation-final-report.json');
  
  return status;
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  checkFinalImageStatus();
}

export { checkFinalImageStatus };
