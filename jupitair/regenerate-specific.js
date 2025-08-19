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

// Professional HVAC prompts for specific problematic topics
const PROFESSIONAL_PROMPTS = {
  'gas-smell-steps': 'Professional HVAC safety inspection, expert technician with gas leak detector equipment, residential North Texas home, serious safety protocols, emergency response, professional uniform and safety gear, no flames or dangerous imagery',
  
  'ac-smells-from-vents': 'Professional HVAC air quality assessment, technician inspecting clean modern air vents, indoor air quality testing equipment, fresh clean home interior, professional diagnostic service',
  
  'frozen-evaporator-coil': 'Professional HVAC technician servicing indoor evaporator coil unit, modern utility room, diagnostic equipment, expert maintenance, clean professional appearance',
  
  'noisy-ac-sounds-and-causes': 'Professional HVAC technician using sound diagnostic equipment near outdoor AC unit, quiet suburban North Texas neighborhood, professional service truck, expert problem diagnosis',
  
  'manual-j-plain-english': 'Professional HVAC consultation, expert technician with blueprints and calculation tools, modern home design planning, professional documentation and measurement tools',
  
  'thermostat-says-cooling-not-cooling': 'Professional HVAC technician troubleshooting modern smart thermostat, digital diagnostic tools, comfortable home interior, expert problem-solving'
};

async function regenerateSpecificImage(slug) {
  try {
    const prompt = PROFESSIONAL_PROMPTS[slug] || 'Professional HVAC services, expert technician, modern equipment, North Texas suburban home';
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
  console.log('🎯 Regenerating specific problematic images...\n');
  
  // Start with the most likely problematic ones
  const problematicImages = [
    'gas-smell-steps',
    'ac-smells-from-vents', 
    'frozen-evaporator-coil',
    'noisy-ac-sounds-and-causes',
    'manual-j-plain-english',
    'thermostat-says-cooling-not-cooling'
  ];
  
  let successCount = 0;
  
  for (const slug of problematicImages) {
    const success = await regenerateSpecificImage(slug);
    if (success) successCount++;
    
    // Rate limiting
    console.log('⏱️  Waiting 2 seconds...\n');
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  console.log(`🎉 Regeneration complete! Successfully updated ${successCount}/${problematicImages.length} images`);
}

main();
