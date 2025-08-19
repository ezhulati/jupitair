#!/usr/bin/env node

import OpenAI from 'openai';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const HVAC_STYLE_BASE = "Professional photorealistic image, high quality, clean modern aesthetic, North Texas setting, blue and white color scheme consistent with HVAC branding";

// Third batch - remaining city hubs and important service blogs
const thirdBatch = [
  'prosper-hvac-knowledge-hub',
  'addison-hvac-knowledge-hub',
  'little-elm-hvac-knowledge-hub',
  'the-colony-hvac-knowledge-hub',
  'ac-leaking-water-what-to-do',
  'frozen-evaporator-coil',
  'pre-summer-tune-up',
  'seer2-texas-guide',
  'replace-vs-repair-ac',
  'outdoor-unit-wont-start',
  'ac-warranty-basics',
  'furnace-maintenance-fall'
];

function createPrompt(slug) {
  const slugLower = slug.toLowerCase();
  
  if (slugLower.includes('prosper-hvac')) {
    return `${HVAC_STYLE_BASE}, Prosper Texas suburban community, modern homes, professional HVAC service, family neighborhood, local expertise`;
  } else if (slugLower.includes('addison-hvac')) {
    return `${HVAC_STYLE_BASE}, Addison Texas residential area, upscale homes, professional HVAC technicians, quality service, established community`;
  } else if (slugLower.includes('little-elm-hvac')) {
    return `${HVAC_STYLE_BASE}, Little Elm Texas lakeside community, growing neighborhood, residential HVAC service, modern developments`;
  } else if (slugLower.includes('the-colony-hvac')) {
    return `${HVAC_STYLE_BASE}, The Colony Texas residential area, family homes, professional HVAC service, suburban community`;
  } else if (slugLower.includes('ac-leaking-water')) {
    return `${HVAC_STYLE_BASE}, AC water leak emergency, condensate drain problem, technician diagnosing water damage, urgent repair, North Texas home`;
  } else if (slugLower.includes('frozen-evaporator')) {
    return `${HVAC_STYLE_BASE}, frozen evaporator coil diagnosis, ice buildup on AC unit, professional thawing process, summer cooling emergency`;
  } else if (slugLower.includes('pre-summer-tune-up')) {
    return `${HVAC_STYLE_BASE}, spring HVAC preparation, pre-summer maintenance, technician performing tune-up, preventive service, North Texas`;
  } else if (slugLower.includes('seer2-texas')) {
    return `${HVAC_STYLE_BASE}, high-efficiency SEER2 rating system, energy star equipment, efficiency comparison, modern AC technology`;
  } else if (slugLower.includes('replace-vs-repair')) {
    return `${HVAC_STYLE_BASE}, HVAC replacement consultation, old vs new system comparison, cost-benefit analysis, professional recommendation`;
  } else if (slugLower.includes('outdoor-unit-wont-start')) {
    return `${HVAC_STYLE_BASE}, outdoor AC unit not starting, condenser diagnosis, electrical troubleshooting, summer heat emergency repair`;
  } else if (slugLower.includes('ac-warranty')) {
    return `${HVAC_STYLE_BASE}, HVAC warranty consultation, warranty documentation, professional installation, equipment protection coverage`;
  } else if (slugLower.includes('furnace-maintenance-fall')) {
    return `${HVAC_STYLE_BASE}, fall furnace preparation, heating system maintenance, winter readiness, professional inspection, North Texas`;
  } else {
    return `${HVAC_STYLE_BASE}, professional HVAC service, modern equipment, skilled technician, North Texas residential service`;
  }
}

async function generateThirdBatch() {
  console.log('🚀 Generating third batch of 12 blog images...');
  
  await fs.mkdir(path.join(__dirname, 'assets'), { recursive: true });
  await fs.mkdir(path.join(__dirname, 'public', 'images', 'blog'), { recursive: true });
  
  let successCount = 0;
  let failCount = 0;
  
  for (const slug of thirdBatch) {
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
      
      await fs.writeFile(path.join(__dirname, 'assets', `blog-${slug}.png`), buffer);
      await fs.writeFile(path.join(__dirname, 'public', 'images', 'blog', `${slug}.jpg`), buffer);
      
      console.log(`✅ Created: ${slug}`);
      successCount++;
      
      // Wait 3 seconds between requests
      await new Promise(resolve => setTimeout(resolve, 3000));
      
    } catch (error) {
      console.error(`❌ Failed: ${slug} - ${error.message}`);
      failCount++;
    }
  }
  
  console.log(`\n✅ Third batch complete! Success: ${successCount}, Failed: ${failCount}`);
}

generateThirdBatch();
