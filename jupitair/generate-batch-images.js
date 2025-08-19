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

// Priority blog posts to generate first
const priorityBlogPosts = [
  'ac-repair-cost-north-texas-2025',
  'furnace-repair-cost-2025', 
  'heat-pump-install-cost-2025',
  'plano-hvac-knowledge-hub',
  'frisco-hvac-knowledge-hub',
  'allen-hvac-knowledge-hub',
  'mckinney-hvac-knowledge-hub',
  'ac-blowing-warm-air',
  'furnace-not-igniting',
  'no-cooling-today-checklist',
  'ac-maintenance-checklist-spring',
  'pre-summer-tune-up',
  'energy-saving-ac-settings-texas',
  'seer2-texas-guide',
  'thermostat-compatibility-guide'
];

// Create contextual prompt based on blog topic
function createBlogPrompt(slug) {
  let contextPrompt = '';
  const slugLower = slug.toLowerCase();
  
  if (slugLower.includes('ac') && slugLower.includes('repair')) {
    contextPrompt = 'HVAC technician repairing air conditioning system, outdoor AC unit, diagnostic tools, North Texas suburban home, professional service truck';
  } else if (slugLower.includes('furnace') && slugLower.includes('repair')) {
    contextPrompt = 'Professional technician repairing furnace, heating system maintenance, indoor unit, winter heating, North Texas home';
  } else if (slugLower.includes('heat-pump')) {
    contextPrompt = 'Modern heat pump system installation, outdoor unit, professional HVAC technician, energy efficient equipment, North Texas setting';
  } else if (slugLower.includes('cost') || slugLower.includes('pricing')) {
    contextPrompt = 'HVAC cost consultation, professional estimate, homeowner meeting with technician, modern equipment, transparent pricing';
  } else if (slugLower.includes('plano')) {
    contextPrompt = 'Plano Texas neighborhood, suburban homes, HVAC service truck, professional technician, local service area';
  } else if (slugLower.includes('frisco')) {
    contextPrompt = 'Frisco Texas residential area, modern homes, air conditioning service, professional HVAC team';
  } else if (slugLower.includes('allen')) {
    contextPrompt = 'Allen Texas suburb, family home, HVAC installation, professional service, local expertise';
  } else if (slugLower.includes('mckinney')) {
    contextPrompt = 'McKinney Texas residential neighborhood, HVAC service, professional technicians, community focused';
  } else if (slugLower.includes('blowing-warm')) {
    contextPrompt = 'Air conditioning not cooling, technician diagnosing AC problem, troubleshooting, summer heat, North Texas';
  } else if (slugLower.includes('not-igniting')) {
    contextPrompt = 'Furnace ignition problem, heating system diagnosis, professional repair, winter preparation, North Texas home';
  } else if (slugLower.includes('no-cooling')) {
    contextPrompt = 'Emergency AC repair, hot summer day, technician working urgently, cooling system failure, North Texas heat';
  } else if (slugLower.includes('maintenance')) {
    contextPrompt = 'HVAC maintenance service, system tune-up, professional checklist, preventive care, well-maintained equipment';
  } else if (slugLower.includes('energy-saving')) {
    contextPrompt = 'Energy efficient HVAC system, smart thermostat, cost savings, modern technology, sustainable comfort';
  } else if (slugLower.includes('seer')) {
    contextPrompt = 'High-efficiency air conditioning unit, SEER rating label, energy star equipment, professional installation';
  } else if (slugLower.includes('thermostat')) {
    contextPrompt = 'Modern smart thermostat installation, digital temperature control, programmable settings, energy efficiency';
  } else {
    contextPrompt = 'Professional HVAC services, modern equipment, skilled technician, North Texas home, reliable service';
  }
  
  return `${HVAC_STYLE_BASE}, ${contextPrompt}, representing: ${slug.replace(/-/g, ' ')}`;
}

// Generate image with OpenAI DALL-E
async function generateImage(prompt, filename, slug) {
  try {
    console.log(`🎨 Generating image for ${slug}...`);
    console.log(`📝 Prompt: ${prompt.substring(0, 80)}...`);
    
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
    
    // Also save to public/images/blog directory
    const publicPath = path.join(__dirname, 'public', 'images', 'blog', filename.replace('.png', '.jpg'));
    await fs.writeFile(publicPath, buffer);
    
    console.log(`✅ Generated and saved: ${filename}`);
    
    return {
      slug,
      filename,
      assetsPath,
      publicPath,
      success: true
    };
    
  } catch (error) {
    console.error(`❌ Error generating image for ${slug}:`, error.message);
    return {
      slug,
      filename,
      success: false,
      error: error.message
    };
  }
}

// Main execution function
async function generateBatchImages() {
  console.log('🚀 Starting batch image generation for priority blog posts...\n');
  
  // Ensure directories exist
  const assetsDir = path.join(__dirname, 'assets');
  const blogImagesDir = path.join(__dirname, 'public', 'images', 'blog');
  await fs.mkdir(assetsDir, { recursive: true });
  await fs.mkdir(blogImagesDir, { recursive: true });
  
  const results = {
    success: [],
    failed: [],
    total: priorityBlogPosts.length
  };
  
  console.log(`📊 Generating ${priorityBlogPosts.length} priority blog images...\n`);
  
  for (const slug of priorityBlogPosts) {
    const prompt = createBlogPrompt(slug);
    const filename = `blog-${slug}.png`;
    
    const result = await generateImage(prompt, filename, slug);
    
    if (result.success) {
      results.success.push(result);
    } else {
      results.failed.push(result);
    }
    
    // Rate limiting - wait 2 seconds between requests to avoid hitting limits
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  // Save results to JSON for reference
  await fs.writeFile(
    path.join(__dirname, 'batch-generation-log.json'), 
    JSON.stringify(results, null, 2)
  );
  
  console.log('\n✅ Batch image generation complete!');
  console.log(`📊 Generated: ${results.success.length}/${results.total} images`);
  if (results.failed.length > 0) {
    console.log(`⚠️  Failed: ${results.failed.length} images`);
    console.log('❌ Failed images:', results.failed.map(f => f.slug).join(', '));
  }
  
  return results;
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  generateBatchImages();
}

export { generateBatchImages };
