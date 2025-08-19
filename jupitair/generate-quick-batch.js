#!/usr/bin/env node

import OpenAI from 'openai';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const HVAC_STYLE_BASE = "Professional photorealistic image, high quality, clean modern aesthetic, North Texas setting, blue and white color scheme consistent with HVAC branding";

// Just 3 key blogs to start
const keyBlogs = [
  'ac-repair-cost-north-texas-2025',
  'plano-hvac-knowledge-hub',
  'ac-blowing-warm-air'
];

function createPrompt(slug) {
  if (slug.includes('ac-repair-cost')) {
    return `${HVAC_STYLE_BASE}, HVAC cost consultation, professional technician with clipboard discussing AC repair pricing with homeowner, North Texas suburban home, transparent pricing discussion`;
  } else if (slug.includes('plano-hvac')) {
    return `${HVAC_STYLE_BASE}, Plano Texas suburban neighborhood, HVAC service truck, professional technician working on residential AC unit, local community service`;
  } else if (slug.includes('ac-blowing-warm')) {
    return `${HVAC_STYLE_BASE}, HVAC technician diagnosing air conditioning problem, AC unit not cooling properly, diagnostic tools, hot summer day, North Texas home`;
  }
  return `${HVAC_STYLE_BASE}, professional HVAC service, modern equipment, North Texas setting`;
}

async function generateQuickBatch() {
  console.log('🚀 Generating 3 key blog images...');
  
  // Ensure directories exist
  await fs.mkdir(path.join(__dirname, 'assets'), { recursive: true });
  await fs.mkdir(path.join(__dirname, 'public', 'images', 'blog'), { recursive: true });
  
  for (const slug of keyBlogs) {
    try {
      console.log(`\n🎨 Generating: ${slug}...`);
      
      const response = await openai.images.generate({
        model: "dall-e-3",
        prompt: createPrompt(slug),
        size: "1792x1024",
        quality: "hd",
        n: 1,
      });

      const imageUrl = response.data[0].url;
      const imageResponse = await fetch(imageUrl);
      const buffer = Buffer.from(await imageResponse.arrayBuffer());
      
      // Save to both locations
      await fs.writeFile(path.join(__dirname, 'assets', `blog-${slug}.png`), buffer);
      await fs.writeFile(path.join(__dirname, 'public', 'images', 'blog', `${slug}.jpg`), buffer);
      
      console.log(`✅ Created: ${slug}`);
      
      // Wait 3 seconds between requests
      await new Promise(resolve => setTimeout(resolve, 3000));
      
    } catch (error) {
      console.error(`❌ Failed: ${slug} - ${error.message}`);
    }
  }
  
  console.log('\n✅ Quick batch complete!');
}

generateQuickBatch();
