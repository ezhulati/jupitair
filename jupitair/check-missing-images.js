#!/usr/bin/env node

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function checkMissingImages() {
  console.log('🔍 Checking for missing blog images...\n');
  
  // Get all blog posts
  const blogDir = path.join(__dirname, 'src/content/blog');
  const blogFiles = await fs.readdir(blogDir);
  const blogPosts = blogFiles.filter(file => file.endsWith('.mdx')).map(file => file.replace('.mdx', ''));
  
  // Get all existing blog images
  const assetsDir = path.join(__dirname, 'assets');
  const assetFiles = await fs.readdir(assetsDir);
  const blogImages = assetFiles
    .filter(file => file.startsWith('blog-') && file.endsWith('.png'))
    .map(file => file.replace('blog-', '').replace('.png', ''));
  
  // Find missing images
  const missingImages = blogPosts.filter(post => !blogImages.includes(post));
  const extraImages = blogImages.filter(image => !blogPosts.includes(image));
  
  console.log(`📊 Total blog posts: ${blogPosts.length}`);
  console.log(`📊 Total blog images: ${blogImages.length}`);
  console.log(`📊 Missing images: ${missingImages.length}`);
  console.log(`📊 Extra images: ${extraImages.length}\n`);
  
  if (missingImages.length > 0) {
    console.log('❌ Blog posts missing images:');
    missingImages.forEach(post => console.log(`   - ${post}`));
    console.log('');
  }
  
  if (extraImages.length > 0) {
    console.log('⚠️  Extra images (no corresponding blog post):');
    extraImages.forEach(image => console.log(`   - ${image}`));
    console.log('');
  }
  
  if (missingImages.length === 0) {
    console.log('✅ All blog posts have corresponding images!');
  }
  
  return { missingImages, extraImages, blogPosts, blogImages };
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  checkMissingImages();
}

export { checkMissingImages };
