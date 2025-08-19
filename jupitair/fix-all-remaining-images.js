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

// Professional HVAC prompts for remaining problematic images
const PROFESSIONAL_PROMPTS = {
  'ac-leaking-water-what-to-do': 'Professional HVAC technician inspecting AC drain line and water leak, diagnostic equipment, clean modern home interior, expert problem assessment, professional uniform',
  
  'ac-lifespan-dfw': 'Modern high-efficiency HVAC system installation in North Texas, professional technicians, quality equipment longevity demonstration, suburban home, expert installation',
  
  'ac-maintenance-checklist-spring': 'Professional HVAC spring maintenance service, technician with inspection checklist, modern outdoor AC unit, preventive care, professional tools',
  
  'ac-repair-cost-north-texas-2025': 'Professional HVAC consultation, service representative with transparent pricing documentation, modern North Texas home, trustworthy estimate discussion',
  
  'ac-warranty-basics': 'Professional HVAC warranty consultation, expert explaining coverage documents, modern office setting, customer service, professional documentation',
  
  'best-filters-for-cooling': 'Professional air filter comparison display, clean HVAC filters, air quality improvement demonstration, expert technician explaining options',
  
  'cold-weather-heat-pumps-ntx': 'Professional heat pump installation in North Texas winter setting, expert technician, cold-weather performance demonstration, suburban home',
  
  'common-ac-parts-failures': 'Professional HVAC technician diagnosing AC components, diagnostic equipment, modern system parts inspection, expert maintenance',
  
  'condenser-cleaning-safe-steps': 'Professional HVAC technician safely cleaning outdoor condenser coil, proper equipment and techniques, suburban North Texas backyard',
  
  'duct-sizing-basics': 'Professional ductwork design consultation, HVAC engineer with blueprints, proper sizing calculations, modern home construction',
  
  'frisco-hvac-knowledge-hub': 'Professional HVAC service in Frisco Texas, suburban neighborhood, service truck, local expert technician, community service',
  
  'frozen-evaporator-coil-enhanced': 'Professional HVAC technician servicing indoor evaporator unit, clean utility room, diagnostic equipment, expert maintenance',
  
  'furnace-repair-cost-2025': 'Professional furnace repair consultation, service representative with cost estimate, modern home utility room, transparent pricing',
  
  'heat-pump-install-cost-2025': 'Professional heat pump installation consultation, expert technician with pricing documentation, modern North Texas home, transparent estimates',
  
  'heat-pump-noise-expectations': 'Professional HVAC technician testing heat pump sound levels, quiet operation demonstration, suburban neighborhood setting',
  
  'heat-pump-vs-ac-gas-texas': 'Professional HVAC consultation comparing systems, expert with comparison charts, modern home setting, energy efficiency discussion',
  
  'humidity-control-texas-summer': 'Professional humidity control system demonstration, indoor air quality equipment, comfortable home interior, expert technician',
  
  'leaky-ducts-symptoms': 'Professional duct inspection service, HVAC technician examining ductwork, diagnostic equipment, air leakage detection',
  
  'replace-vs-repair-ac': 'Professional HVAC consultation, expert technician evaluating AC system options, modern home, decision-making discussion',
  
  'restaurant-makeup-air-basics': 'Professional commercial kitchen HVAC system, industrial air handling equipment, restaurant setting, expert commercial technician',
  
  'staging-options-comparison': 'Professional HVAC system comparison, expert technician explaining multi-stage equipment options, modern home consultation',
  
  'the-colony-hvac-knowledge-hub': 'Professional HVAC service in The Colony Texas, suburban neighborhood, service truck, local expert technician, community focus',
  
  'thermostat-compatibility-guide': 'Professional thermostat installation consultation, expert technician with compatibility documentation, modern home, system integration'
};

// Already regenerated images (skip these)
const ALREADY_REGENERATED = [
  'gas-smell-steps',
  'ac-smells-from-vents', 
  'frozen-evaporator-coil',
  'noisy-ac-sounds-and-causes',
  'manual-j-plain-english',
  'thermostat-says-cooling-not-cooling',
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

async function regenerateSpecificImage(slug) {
  try {
    const prompt = PROFESSIONAL_PROMPTS[slug] || 'Professional HVAC services, expert technician, modern equipment, North Texas suburban home';
    const fullPrompt = `Professional photorealistic corporate image, high-end commercial photography, clean modern aesthetic, ${prompt}, blue and white corporate colors, serious professional tone, no cartoonish elements, no silly imagery`;
    
    console.log(`\n🔧 Regenerating: ${slug}`);
    console.log(`🎨 Using prompt: ${fullPrompt.substring(0, 120)}...`);
    
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
  console.log('🎯 FIXING ALL REMAINING PROBLEMATIC IMAGES...\n');
  console.log('⚠️  This will regenerate images that commonly get silly, cartoon-like, or irrelevant results\n');
  
  // All problematic images from audit
  const allProblematic = [
    'ac-leaking-water-what-to-do',
    'ac-lifespan-dfw',
    'ac-maintenance-checklist-spring',
    'ac-repair-cost-north-texas-2025',
    'ac-smells-from-vents',
    'ac-warranty-basics',
    'best-filters-for-cooling',
    'bill-impact-calculator-explainer',
    'co-safety-basics',
    'cold-weather-heat-pumps-ntx',
    'common-ac-parts-failures',
    'condenser-cleaning-safe-steps',
    'duct-sizing-basics',
    'dust-issues-real-causes',
    'frisco-hvac-knowledge-hub',
    'frozen-coil-emergency-steps',
    'frozen-evaporator-coil-enhanced',
    'frozen-evaporator-coil',
    'furnace-repair-cost-2025',
    'gas-smell-steps',
    'heat-pump-install-cost-2025',
    'heat-pump-noise-expectations',
    'heat-pump-vs-ac-gas-texas',
    'humidity-control-texas-summer',
    'leaky-ducts-symptoms',
    'manual-j-plain-english',
    'merv-ratings-explained',
    'no-cooling-today-checklist',
    'noisy-ac-sounds-and-causes',
    'replace-vs-repair-ac',
    'restaurant-makeup-air-basics',
    'seer2-texas-guide',
    'staging-options-comparison',
    'static-pressure-comfort',
    'the-colony-hvac-knowledge-hub',
    'thermostat-compatibility-guide',
    'thermostat-says-cooling-not-cooling'
  ];
  
  // Filter out already regenerated images
  const remainingToRegenerate = allProblematic.filter(slug => !ALREADY_REGENERATED.includes(slug));
  
  console.log(`📊 Total problematic images: ${allProblematic.length}`);
  console.log(`✅ Already regenerated: ${ALREADY_REGENERATED.length}`);
  console.log(`🔄 Remaining to regenerate: ${remainingToRegenerate.length}\n`);
  
  if (remainingToRegenerate.length === 0) {
    console.log('🎉 All problematic images have already been regenerated!');
    return;
  }
  
  console.log('🚀 Starting regeneration of remaining images...\n');
  
  const results = { regenerated: [], errors: [] };
  
  for (const slug of remainingToRegenerate) {
    const result = await regenerateSpecificImage(slug);
    
    if (result.success) {
      results.regenerated.push(result.slug);
    } else {
      results.errors.push({ slug: result.slug, error: result.error });
    }
    
    // Rate limiting
    console.log('⏱️  Waiting 1.5 seconds...');
    await new Promise(resolve => setTimeout(resolve, 1500));
  }
  
  // Final summary
  const totalRegenerated = ALREADY_REGENERATED.length + results.regenerated.length;
  
  console.log('\n🎉 REGENERATION COMPLETE!');
  console.log(`📊 This session: ${results.regenerated.length}/${remainingToRegenerate.length} successful`);
  console.log(`📊 Total regenerated: ${totalRegenerated}/${allProblematic.length} problematic images`);
  console.log(`❌ Errors this session: ${results.errors.length}`);
  
  if (results.errors.length > 0) {
    console.log('\n⚠️  Errors:');
    results.errors.forEach(err => console.log(`   - ${err.slug}: ${err.error}`));
  }
  
  console.log('\n✨ All problematic images should now be professional, corporate-style imagery!');
}

main();
