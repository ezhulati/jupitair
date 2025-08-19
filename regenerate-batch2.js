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

// Professional HVAC prompts for second batch of potentially problematic topics
const PROFESSIONAL_PROMPTS_BATCH2 = {
  'co-safety-basics': 'Professional HVAC safety inspection, certified technician with carbon monoxide detection equipment, residential North Texas home, safety monitoring devices, professional safety protocols, clean uniform',
  
  'dust-issues-real-causes': 'Professional HVAC air quality specialist inspecting clean air filtration system, modern home interior, air quality testing equipment, improved indoor environment, professional diagnostic service',
  
  'frozen-coil-emergency-steps': 'Professional emergency HVAC service, expert technician responding to system issue, modern suburban home, professional service truck, urgent but controlled repair situation',
  
  'outdoor-unit-wont-start': 'Professional HVAC technician diagnosing outdoor AC condenser unit, suburban North Texas backyard, diagnostic equipment and tools, expert troubleshooting, professional service',
  
  'furnace-not-igniting': 'Professional HVAC technician servicing modern gas furnace in clean utility room, safety equipment, diagnostic tools, expert maintenance, professional appearance',
  
  'no-cooling-today-checklist': 'Professional HVAC emergency service response, expert technician with diagnostic checklist, modern home, professional consultation, reliable service truck',
  
  'seer2-texas-guide': 'Modern high-efficiency HVAC system installation, professional technician, energy efficiency demonstration, North Texas suburban home, professional consultation and documentation',
  
  'merv-ratings-explained': 'Professional air filter demonstration, clean HVAC filters of different types, air quality improvement, expert technician explanation, modern HVAC system components',
  
  'bill-impact-calculator-explainer': 'Professional energy consultation, HVAC efficiency specialist with documentation, modern office or home setting, energy savings analysis, professional presentation',
  
  'static-pressure-comfort': 'Professional HVAC airflow testing, expert technician with diagnostic equipment, modern home interior, comfort optimization, professional system analysis'
};

async function regenerateSpecificImage(slug) {
  try {
    const prompt = PROFESSIONAL_PROMPTS_BATCH2[slug] || 'Professional HVAC services, expert technician, modern equipment, North Texas suburban home';
    const fullPrompt = `Professional photorealistic corporate image, high-end commercial photography, clean modern aesthetic, ${prompt}, blue and white corporate colors, serious professional tone, no cartoonish elements`;
    
    console.log(`🔧 Regenerating: ${slug}`);
    console.log(`🎨 Using prompt: ${fullPrompt.substring(0, 100)}...`);
    
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: fullPrompt,
      size: "1792x1024",
      quality: "hd",
      n: 1,
    });

    const imageUrl = response.data[0].url;
    
    // Download and save
    const imageResponse = await fetch(imageUrl);
    const imageBuffer = await imageResponse.arrayBuffer();
    const buffer = Buffer.from(imageBuffer);
    
    // Save to correct location
    const imagePath = path.join(__dirname, 'public/images/blog', `${slug}.jpg`);
    await fs.writeFile(imagePath, buffer);
    
    console.log(`✅ Successfully regenerated: ${slug}.jpg`);
    return true;
    
  } catch (error) {
    console.error(`❌ Error regenerating ${slug}:`, error.message);
    return false;
  }
}

async function main() {
  console.log('🎯 Regenerating second batch of potentially problematic images...\n');
  
  // Second batch of potentially problematic images
  const batch2Images = [
    'co-safety-basics',
    'dust-issues-real-causes',
    'frozen-coil-emergency-steps',
    'outdoor-unit-wont-start',
    'furnace-not-igniting',
    'no-cooling-today-checklist',
    'seer2-texas-guide',
    'merv-ratings-explained',
    'bill-impact-calculator-explainer',
    'static-pressure-comfort'
  ];
  
  let successCount = 0;
  
  for (const slug of batch2Images) {
    const success = await regenerateSpecificImage(slug);
    if (success) successCount++;
    
    // Rate limiting
    console.log('⏱️  Waiting 2 seconds...\n');
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  console.log(`🎉 Batch 2 regeneration complete! Successfully updated ${successCount}/${batch2Images.length} images`);
  console.log(`📊 Total images improved: ${6 + successCount} (Batch 1: 6, Batch 2: ${successCount})`);
}

main();
