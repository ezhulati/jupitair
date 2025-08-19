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

// Next batch of important blogs
const nextBatch = [
  'furnace-repair-cost-2025',
  'heat-pump-install-cost-2025',
  'frisco-hvac-knowledge-hub',
  'allen-hvac-knowledge-hub',
  'mckinney-hvac-knowledge-hub',
  'ac-maintenance-checklist-spring',
  'furnace-not-igniting',
  'no-cooling-today-checklist',
  'energy-saving-ac-settings-texas',
  'thermostat-compatibility-guide'
];

function createPrompt(slug) {
  const slugLower = slug.toLowerCase();
  
  if (slugLower.includes('furnace-repair-cost')) {
    return `${HVAC_STYLE_BASE}, furnace repair cost consultation, heating system cost estimate, professional technician explaining furnace repair pricing, North Texas winter preparation`;
  } else if (slugLower.includes('heat-pump-install-cost')) {
    return `${HVAC_STYLE_BASE}, heat pump installation cost, modern heat pump system, professional installation estimate, energy efficient equipment, North Texas home`;
  } else if (slugLower.includes('frisco-hvac')) {
    return `${HVAC_STYLE_BASE}, Frisco Texas residential area, modern suburban homes, HVAC service truck, professional technicians, local community service`;
  } else if (slugLower.includes('allen-hvac')) {
    return `${HVAC_STYLE_BASE}, Allen Texas neighborhood, family homes, residential HVAC service, professional installation, local expertise`;
  } else if (slugLower.includes('mckinney-hvac')) {
    return `${HVAC_STYLE_BASE}, McKinney Texas residential area, professional HVAC service, suburban homes, local technicians, community focused service`;
  } else if (slugLower.includes('ac-maintenance')) {
    return `${HVAC_STYLE_BASE}, spring AC maintenance, HVAC tune-up checklist, professional technician performing system maintenance, preventive service, North Texas home`;
  } else if (slugLower.includes('furnace-not-igniting')) {
    return `${HVAC_STYLE_BASE}, furnace ignition problem, heating system not starting, professional diagnosis, winter heating issue, North Texas home`;
  } else if (slugLower.includes('no-cooling-today')) {
    return `${HVAC_STYLE_BASE}, emergency AC repair, hot summer day, urgent cooling system failure, technician working quickly, North Texas heat emergency`;
  } else if (slugLower.includes('energy-saving-ac')) {
    return `${HVAC_STYLE_BASE}, energy efficient air conditioning, smart thermostat settings, cost-saving HVAC technology, sustainable cooling, Texas summer energy savings`;
  } else if (slugLower.includes('thermostat-compatibility')) {
    return `${HVAC_STYLE_BASE}, modern smart thermostat installation, thermostat compatibility guide, digital temperature control, professional wiring, home automation`;
  } else {
    return `${HVAC_STYLE_BASE}, professional HVAC service, modern equipment, skilled technician, North Texas residential service`;
  }
}

async function generateNextBatch() {
  console.log('🚀 Generating next batch of 10 blog images...');
  
  await fs.mkdir(path.join(__dirname, 'assets'), { recursive: true });
  await fs.mkdir(path.join(__dirname, 'public', 'images', 'blog'), { recursive: true });
  
  let successCount = 0;
  let failCount = 0;
  
  for (const slug of nextBatch) {
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
  
  console.log(`\n✅ Next batch complete! Success: ${successCount}, Failed: ${failCount}`);
}

generateNextBatch();
