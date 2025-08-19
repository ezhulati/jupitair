#!/usr/bin/env node

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load the generated images log
async function loadGeneratedImages() {
  try {
    const logPath = path.join(__dirname, 'generated-images-log.json');
    const content = await fs.readFile(logPath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    console.error('Error loading generated images log:', error);
    return { blogImages: [], pageImages: [] };
  }
}

// Update blog post frontmatter with featured image
async function updateBlogPostMeta(blogPost, imageData) {
  try {
    const blogPath = path.join(__dirname, 'src/content/blog', `${blogPost.slug}.mdx`);
    let content = await fs.readFile(blogPath, 'utf-8');
    
    // Extract frontmatter
    const frontmatterMatch = content.match(/^(---\n)([\s\S]*?)\n(---\n)/);
    if (!frontmatterMatch) {
      console.log(`No frontmatter found in ${blogPost.slug}, skipping...`);
      return;
    }
    
    let frontmatter = frontmatterMatch[2];
    
    // Remove existing featuredImage if present
    frontmatter = frontmatter.replace(/featuredImage:.*\n?/g, '');
    frontmatter = frontmatter.replace(/ogImage:.*\n?/g, '');
    frontmatter = frontmatter.replace(/twitterImage:.*\n?/g, '');
    
    // Add new image metadata
    const imageMetadata = `featuredImage: "${imageData.cloudinaryUrl}"
ogImage: "${imageData.cloudinaryUrl}"
twitterImage: "${imageData.cloudinaryUrl}"`;
    
    // Insert at the end of frontmatter (before the closing ---)
    frontmatter = frontmatter.trim() + '\n' + imageMetadata;
    
    // Reconstruct the file
    const newContent = content.replace(
      /^(---\n)([\s\S]*?)\n(---\n)/,
      `$1${frontmatter}\n$3`
    );
    
    await fs.writeFile(blogPath, newContent);
    console.log(`✅ Updated meta tags for blog: ${blogPost.slug}`);
    
  } catch (error) {
    console.error(`❌ Error updating blog ${blogPost.slug}:`, error);
  }
}

// Update page component with featured image props
async function updatePageMeta(page, imageData) {
  try {
    const pageMappings = {
      'home': 'src/pages/index.astro',
      'about': 'src/pages/about.astro',
      'contact': 'src/pages/contact.astro',
      'services': 'src/pages/services.astro',
      'commercial': 'src/pages/commercial.astro',
      'ac-repair': 'src/pages/services/ac-repair.astro',
      'ac-installation': 'src/pages/services/ac-installation.astro',
      'heating-repair': 'src/pages/services/heating-repair.astro',
      'heating-installation': 'src/pages/services/heating-installation.astro',
      'heat-pump-systems': 'src/pages/services/heat-pump-systems.astro',
      'duct-cleaning': 'src/pages/services/duct-cleaning.astro',
      'duct-sealing': 'src/pages/services/duct-sealing.astro',
      'air-purification': 'src/pages/services/air-purification.astro',
      'commercial-hvac': 'src/pages/services/commercial-hvac.astro'
    };
    
    const pagePath = pageMappings[page.slug];
    if (!pagePath) {
      // Handle dynamic pages differently
      console.log(`Skipping dynamic/unmapped page: ${page.slug}`);
      return;
    }
    
    const fullPath = path.join(__dirname, pagePath);
    
    // Check if file exists
    try {
      await fs.access(fullPath);
    } catch {
      console.log(`Page file not found: ${pagePath}, skipping...`);
      return;
    }
    
    let content = await fs.readFile(fullPath, 'utf-8');
    
    // Look for existing SEO component and update it
    const seoComponentMatch = content.match(/<EnhancedSEO[\s\S]*?\/>/);
    
    if (seoComponentMatch) {
      let seoComponent = seoComponentMatch[0];
      
      // Remove existing image props
      seoComponent = seoComponent.replace(/\s*featuredImage="[^"]*"/g, '');
      seoComponent = seoComponent.replace(/\s*ogImage="[^"]*"/g, '');
      
      // Add new image props before the closing />
      seoComponent = seoComponent.replace(
        /\s*\/>$/, 
        `\n  featuredImage="${imageData.cloudinaryUrl}"\n  ogImage="${imageData.cloudinaryUrl}"\n/>`
      );
      
      content = content.replace(/<EnhancedSEO[\s\S]*?\/>/, seoComponent);
      
      await fs.writeFile(fullPath, content);
      console.log(`✅ Updated meta tags for page: ${page.slug}`);
    } else {
      console.log(`No SEO component found in ${page.slug}, skipping meta update...`);
    }
    
  } catch (error) {
    console.error(`❌ Error updating page ${page.slug}:`, error);
  }
}

// Main function to update all meta tags
async function updateAllMetaTags() {
  console.log('🏷️  Starting meta tag updates...\n');
  
  const imageData = await loadGeneratedImages();
  
  if (!imageData.blogImages.length && !imageData.pageImages.length) {
    console.log('No generated images found. Run generate-all-images.js first.');
    return;
  }
  
  // Update blog posts
  console.log('📝 Updating blog post meta tags...\n');
  for (const blogImage of imageData.blogImages) {
    await updateBlogPostMeta({ slug: blogImage.slug }, blogImage);
  }
  
  // Update pages
  console.log('\n🏠 Updating page meta tags...\n');
  for (const pageImage of imageData.pageImages) {
    await updatePageMeta({ slug: pageImage.slug }, pageImage);
  }
  
  console.log('\n✅ Meta tag updates complete!');
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  updateAllMetaTags();
}

export { updateAllMetaTags };
