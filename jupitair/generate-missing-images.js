#!/usr/bin/env node

import OpenAI from 'openai';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// HVAC-related style prompt for consistency
const HVAC_STYLE_BASE = "Professional photorealistic image, high quality, clean modern aesthetic, North Texas setting, blue and white color scheme consistent with HVAC branding";

async function checkMissingImages() {
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
  
  return { missingImages, blogPosts, blogImages };
}

// Create contextual prompt based on blog topic
function createBlogPrompt(slug, title = '') {
  let contextPrompt = '';
  
  if (slug.includes('ac') || slug.includes('cooling')) {
    contextPrompt = 'Modern air conditioning system, outdoor unit, technician working, North Texas suburban home, professional HVAC service';
  } else if (slug.includes('heat') || slug.includes('furnace')) {
    contextPrompt = 'Modern heating system, furnace installation, warm comfortable home interior, professional HVAC technician';
  } else if (slug.includes('duct')) {
    contextPrompt = 'Clean air ducts, ductwork system, professional duct cleaning, improved indoor air quality';
  } else if (slug.includes('maintenance')) {
    contextPrompt = 'HVAC maintenance, professional technician with tools, system tune-up, preventive service';
  } else if (slug.includes('repair')) {
    contextPrompt = 'HVAC repair service, skilled technician diagnosing system, professional tools, problem-solving';
  } else if (slug.includes('filter')) {
    contextPrompt = 'Clean HVAC air filters, filter replacement, improved air quality, maintenance service';
  } else if (slug.includes('thermostat')) {
    contextPrompt = 'Modern smart thermostat, digital temperature control, energy efficiency, home comfort';
  } else if (slug.includes('lifespan')) {
    contextPrompt = 'Modern HVAC system, professional installation, long-lasting equipment, North Texas home, quality assurance';
  } else if (slug.includes('commercial') || slug.includes('office') || slug.includes('retail')) {
    contextPrompt = 'Commercial HVAC system, large building, rooftop units, professional commercial service';
  } else {
    contextPrompt = 'Professional HVAC services, modern equipment, skilled technician, North Texas home';
  }
  
  return `${HVAC_STYLE_BASE}, ${contextPrompt}, related to: ${title || slug.replace(/-/g, ' ')}`;
}

// Generate image with OpenAI DALL-E
async function generateImage(prompt, filename) {
  try {
    console.log(`Generating image for ${filename}...`);
    console.log(`Prompt: ${prompt.substring(0, 100)}...`);
    
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      size: "1792x1024", // Wide format good for featured images
      quality: "hd",
      n: 1,
    });

    const imageUrl = response.data[0].url;
    
    // Download and save to assets folder
    const imageResponse = await fetch(imageUrl);
    const imageBuffer = await imageResponse.arrayBuffer();
    const buffer = Buffer.from(imageBuffer);
    
    // Save to assets directory
    const assetsPath = path.join(__dirname, 'assets', filename);
    await fs.writeFile(assetsPath, buffer);
    
    console.log(`✅ Generated and saved: ${filename}`);
    
    return { success: true, filename, path: assetsPath };
    
  } catch (error) {
    console.error(`❌ Error generating image for ${filename}:`, error);
    return { success: false, filename, error: error.message };
  }
}

// Main execution function
async function generateMissingImages() {
  console.log('🔍 Checking for missing blog images...\n');
  
  const { missingImages, blogPosts, blogImages } = await checkMissingImages();
  
  console.log(`📊 Total blog posts: ${blogPosts.length}`);
  console.log(`📊 Total blog images: ${blogImages.length}`);
  console.log(`📊 Missing images: ${missingImages.length}\n`);
  
  if (missingImages.length === 0) {
    console.log('✅ All blog posts have corresponding images!');
    return;
  }
  
  console.log('❌ Blog posts missing images:');
  missingImages.forEach(post => console.log(`   - ${post}`));
  console.log('\n🚀 Generating missing images...\n');
  
  const results = [];
  
  // Generate missing images
  for (const slug of missingImages) {
    const prompt = createBlogPrompt(slug);
    const filename = `blog-${slug}.png`;
    
    const result = await generateImage(prompt, filename);
    results.push(result);
    
    // Rate limiting - wait 1 second between requests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  // Summary
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);
  
  console.log('\n✅ Generation complete!');
  console.log(`📊 Successfully generated: ${successful.length} images`);
  if (failed.length > 0) {
    console.log(`❌ Failed: ${failed.length} images`);
    failed.forEach(f => console.log(`   - ${f.filename}: ${f.error}`));
  }
  
  return results;
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  generateMissingImages();
}

export { generateMissingImages, checkMissingImages };
