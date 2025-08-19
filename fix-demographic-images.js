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

// Specific prompts for North Texas appropriate imagery
const NORTH_TEXAS_APPROPRIATE_PROMPTS = {
  'cold-weather-heat-pumps-ntx': 'Professional heat pump installation in North Texas winter setting, Caucasian or Hispanic HVAC technician representative of local workforce, cold-weather performance demonstration, suburban Dallas-Fort Worth area home, professional service truck, North Texas demographics',
  
  'heat-pump-noise-expectations': 'Professional HVAC technician testing heat pump sound levels, local North Texas workforce representation (Caucasian or Hispanic), quiet operation demonstration, typical suburban neighborhood in DFW area, professional diagnostic equipment',
  
  'furnace-short-cycling': 'Professional furnace diagnostic service, experienced North Texas HVAC technician (Caucasian or Hispanic), modern gas furnace, diagnostic tools, suburban DFW home utility room, professional appearance',
  
  'best-filters-for-cooling': 'Professional air filter demonstration by local North Texas HVAC expert (Caucasian or Hispanic), clean HVAC filters comparison, air quality improvement, typical DFW area home, professional consultation',
  
  'heat-pump-vs-ac-gas-texas': 'Professional HVAC system comparison consultation, North Texas HVAC specialist (Caucasian or Hispanic representative of local workforce), energy efficiency discussion, modern Texas suburban home, professional documentation',
  
  'staging-options-comparison': 'Professional HVAC system consultation, experienced North Texas technician (Caucasian or Hispanic), multi-stage equipment comparison, modern DFW area home, professional system analysis',
  
  'two-stage-vs-variable': 'Professional HVAC equipment consultation, North Texas HVAC expert (Caucasian or Hispanic representative of local demographics), variable-speed system demonstration, suburban Texas home, professional technical explanation'
};

async function regenerateSpecificImage(slug) {
  try {
    const prompt = NORTH_TEXAS_APPROPRIATE_PROMPTS[slug] || 'Professional HVAC services, North Texas technician representative of local workforce demographics, modern equipment, DFW suburban home';
    const fullPrompt = `Professional photorealistic corporate image, high-end commercial photography, clean modern aesthetic, ${prompt}, blue and white corporate colors, serious professional tone, no cartoonish elements, realistic North Texas HVAC industry representation`;
    
    console.log(`\n🔧 Regenerating: ${slug}`);
    console.log(`🎨 Using demographic-appropriate prompt: ${fullPrompt.substring(0, 120)}...`);
    
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
    return { success: true, slug };
    
  } catch (error) {
    console.error(`❌ Error regenerating ${slug}:`, error.message);
    return { success: false, slug, error: error.message };
  }
}

async function main() {
  console.log('🎯 FIXING DEMOGRAPHIC REPRESENTATION IN IMAGES...\n');
  console.log('🏠 Updating to show appropriate North Texas HVAC workforce representation\n');
  
  // Images that need demographic updates
  const imagesToFix = [
    'cold-weather-heat-pumps-ntx',
    'heat-pump-noise-expectations',
    'furnace-short-cycling', 
    'best-filters-for-cooling',
    'heat-pump-vs-ac-gas-texas',
    'staging-options-comparison',
    'two-stage-vs-variable'
  ];
  
  console.log(`📊 Images to update: ${imagesToFix.length}\n`);
  
  const results = { regenerated: [], errors: [] };
  
  for (const slug of imagesToFix) {
    const result = await regenerateSpecificImage(slug);
    
    if (result.success) {
      results.regenerated.push(result.slug);
    } else {
      results.errors.push({ slug: result.slug, error: result.error });
    }
    
    // Rate limiting
    console.log('⏱️  Waiting 2 seconds...');
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  console.log('\n🎉 DEMOGRAPHIC UPDATE COMPLETE!');
  console.log(`✅ Successfully updated: ${results.regenerated.length}/${imagesToFix.length}`);
  console.log(`❌ Errors: ${results.errors.length}`);
  
  if (results.regenerated.length > 0) {
    console.log('\n✨ Updated images:');
    results.regenerated.forEach(slug => console.log(`   - ${slug}`));
  }
  
  if (results.errors.length > 0) {
    console.log('\n⚠️  Errors:');
    results.errors.forEach(err => console.log(`   - ${err.slug}: ${err.error}`));
  }
  
  console.log('\n🏠 All images now show appropriate North Texas HVAC workforce representation!');
}

main();
