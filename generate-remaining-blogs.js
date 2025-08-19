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

// Remaining 40 blog posts that need images
const remainingBlogPosts = [
  'ac-short-cycling-diagnostics',
  'ac-smells-from-vents',
  'attic-duct-improvements',
  'best-filters-for-cooling',
  'best-schedules-texas-summer',
  'bill-impact-calculator-explainer',
  'co-safety-basics',
  'cold-weather-heat-pumps-ntx',
  'common-ac-parts-failures',
  'condenser-cleaning-safe-steps',
  'dehumidifier-sizing',
  'duct-cleaning-vs-sealing',
  'duct-sizing-basics',
  'ductless-for-garages',
  'dust-issues-real-causes',
  'flame-sensor-cleaning',
  'frozen-coil-emergency-steps',
  'frozen-evaporator-coil-enhanced',
  'furnace-short-cycling',
  'gas-smell-steps',
  'heat-pump-noise-expectations',
  'heat-pump-vs-ac-gas-texas',
  'heat-pump-winter-normal',
  'heat-pumps-in-dfw-fit',
  'humidity-control-texas-summer',
  'leaky-ducts-symptoms',
  'manual-j-plain-english',
  'merv-ratings-explained',
  'noisy-ac-sounds-and-causes',
  'office-pm-plans',
  'reading-hvac-proposals',
  'restaurant-makeup-air-basics',
  'returns-vs-supplies-balance',
  'rtu-maintenance-small-retail',
  'staging-options-comparison',
  'static-pressure-comfort',
  'thermostat-says-cooling-not-cooling',
  'thermostat-sensor-placement',
  'thermostats-for-heat-pumps',
  'two-stage-vs-variable'
];

function createPrompt(slug) {
  const slugLower = slug.toLowerCase();
  
  if (slugLower.includes('ac-short-cycling')) {
    return `${HVAC_STYLE_BASE}, AC short cycling diagnosis, air conditioning unit turning on and off frequently, technician with diagnostic tools, system troubleshooting`;
  } else if (slugLower.includes('ac-smells')) {
    return `${HVAC_STYLE_BASE}, AC air quality issues, strange smells from vents, indoor air quality testing, HVAC technician investigating odor problems`;
  } else if (slugLower.includes('attic-duct')) {
    return `${HVAC_STYLE_BASE}, attic ductwork improvements, insulated ducts in attic space, duct sealing and insulation, energy efficiency upgrade`;
  } else if (slugLower.includes('best-filters')) {
    return `${HVAC_STYLE_BASE}, HVAC air filters comparison, high-quality air filters, filter replacement service, improved air quality, North Texas`;
  } else if (slugLower.includes('best-schedules')) {
    return `${HVAC_STYLE_BASE}, smart thermostat programming, Texas summer cooling schedule, energy-efficient temperature settings, cost-saving strategies`;
  } else if (slugLower.includes('bill-impact-calculator')) {
    return `${HVAC_STYLE_BASE}, energy cost calculation, HVAC efficiency comparison, utility bill analysis, cost savings calculator, professional consultation`;
  } else if (slugLower.includes('co-safety')) {
    return `${HVAC_STYLE_BASE}, carbon monoxide safety, CO detector installation, gas appliance safety, emergency response, family protection`;
  } else if (slugLower.includes('cold-weather-heat-pumps')) {
    return `${HVAC_STYLE_BASE}, winter heat pump operation, cold weather heating, North Texas winter conditions, heat pump efficiency`;
  } else if (slugLower.includes('common-ac-parts')) {
    return `${HVAC_STYLE_BASE}, AC parts replacement, common HVAC component failures, capacitor and contactor replacement, professional repair service`;
  } else if (slugLower.includes('condenser-cleaning')) {
    return `${HVAC_STYLE_BASE}, outdoor condenser unit cleaning, coil cleaning service, HVAC maintenance, improved efficiency, professional cleaning`;
  } else if (slugLower.includes('dehumidifier')) {
    return `${HVAC_STYLE_BASE}, whole-home dehumidifier, humidity control system, indoor air quality, moisture management, North Texas humidity`;
  } else if (slugLower.includes('duct-cleaning-vs-sealing')) {
    return `${HVAC_STYLE_BASE}, ductwork services comparison, duct cleaning vs sealing, air duct maintenance, system efficiency improvement`;
  } else if (slugLower.includes('duct-sizing')) {
    return `${HVAC_STYLE_BASE}, proper duct sizing, airflow calculation, HVAC system design, professional duct installation, optimal performance`;
  } else if (slugLower.includes('ductless')) {
    return `${HVAC_STYLE_BASE}, ductless mini-split system for garage, garage heating and cooling, zone control HVAC, efficient climate control`;
  } else if (slugLower.includes('dust-issues')) {
    return `${HVAC_STYLE_BASE}, indoor dust problems, air filtration improvement, duct cleaning service, dust reduction solutions, cleaner air`;
  } else if (slugLower.includes('flame-sensor')) {
    return `${HVAC_STYLE_BASE}, furnace flame sensor cleaning, heating system maintenance, furnace ignition problems, professional service`;
  } else if (slugLower.includes('frozen-coil-emergency')) {
    return `${HVAC_STYLE_BASE}, frozen AC coil emergency, ice buildup on evaporator, urgent AC repair, summer cooling emergency`;
  } else if (slugLower.includes('frozen-evaporator-coil-enhanced')) {
    return `${HVAC_STYLE_BASE}, frozen evaporator coil diagnosis, ice formation on AC unit, professional thawing process, cooling system repair`;
  } else if (slugLower.includes('furnace-short-cycling')) {
    return `${HVAC_STYLE_BASE}, furnace short cycling diagnosis, heating system turning on and off, furnace troubleshooting, professional repair`;
  } else if (slugLower.includes('gas-smell-steps')) {
    return `${HVAC_STYLE_BASE}, gas leak emergency response, natural gas safety, emergency evacuation, utility service call, safety protocol`;
  } else if (slugLower.includes('heat-pump-noise')) {
    return `${HVAC_STYLE_BASE}, heat pump noise diagnosis, quiet operation, sound levels, professional inspection, normal vs abnormal sounds`;
  } else if (slugLower.includes('heat-pump-vs-ac-gas')) {
    return `${HVAC_STYLE_BASE}, heat pump vs gas furnace comparison, Texas climate considerations, energy efficiency comparison, system selection`;
  } else if (slugLower.includes('heat-pump-winter')) {
    return `${HVAC_STYLE_BASE}, heat pump winter operation, cold weather performance, normal winter behavior, North Texas heating`;
  } else if (slugLower.includes('heat-pumps-in-dfw')) {
    return `${HVAC_STYLE_BASE}, DFW heat pump suitability, Dallas-Fort Worth climate, heat pump installation, local weather considerations`;
  } else if (slugLower.includes('humidity-control')) {
    return `${HVAC_STYLE_BASE}, Texas summer humidity control, whole-home dehumidification, comfort improvement, moisture management system`;
  } else if (slugLower.includes('leaky-ducts')) {
    return `${HVAC_STYLE_BASE}, leaking ductwork symptoms, air loss diagnosis, duct sealing service, energy efficiency improvement`;
  } else if (slugLower.includes('manual-j')) {
    return `${HVAC_STYLE_BASE}, Manual J load calculation, proper HVAC sizing, professional system design, accurate sizing methodology`;
  } else if (slugLower.includes('merv-ratings')) {
    return `${HVAC_STYLE_BASE}, MERV filter ratings comparison, air filter efficiency, filtration levels, filter selection guide`;
  } else if (slugLower.includes('noisy-ac-sounds')) {
    return `${HVAC_STYLE_BASE}, AC noise diagnosis, air conditioning sounds, system troubleshooting, quiet operation, professional inspection`;
  } else if (slugLower.includes('office-pm-plans')) {
    return `${HVAC_STYLE_BASE}, commercial office HVAC maintenance, preventive maintenance plans, business HVAC service, professional maintenance`;
  } else if (slugLower.includes('reading-hvac-proposals')) {
    return `${HVAC_STYLE_BASE}, HVAC proposal evaluation, contractor estimates, system quotes comparison, professional consultation`;
  } else if (slugLower.includes('restaurant-makeup-air')) {
    return `${HVAC_STYLE_BASE}, restaurant makeup air systems, commercial kitchen ventilation, air balance, professional installation`;
  } else if (slugLower.includes('returns-vs-supplies')) {
    return `${HVAC_STYLE_BASE}, HVAC airflow balance, return vs supply air, proper air circulation, system performance optimization`;
  } else if (slugLower.includes('rtu-maintenance')) {
    return `${HVAC_STYLE_BASE}, rooftop unit maintenance, commercial RTU service, small retail HVAC, professional maintenance plans`;
  } else if (slugLower.includes('staging-options')) {
    return `${HVAC_STYLE_BASE}, HVAC staging options comparison, single vs multi-stage systems, efficiency comparison, system selection`;
  } else if (slugLower.includes('static-pressure')) {
    return `${HVAC_STYLE_BASE}, static pressure testing, airflow measurement, duct system performance, professional testing equipment`;
  } else if (slugLower.includes('thermostat-says-cooling')) {
    return `${HVAC_STYLE_BASE}, thermostat troubleshooting, cooling system not responding, HVAC diagnosis, temperature control problems`;
  } else if (slugLower.includes('thermostat-sensor')) {
    return `${HVAC_STYLE_BASE}, thermostat sensor placement, accurate temperature reading, optimal sensor location, professional installation`;
  } else if (slugLower.includes('thermostats-for-heat-pumps')) {
    return `${HVAC_STYLE_BASE}, heat pump thermostat compatibility, proper thermostat selection, heat pump controls, professional installation`;
  } else if (slugLower.includes('two-stage-vs-variable')) {
    return `${HVAC_STYLE_BASE}, two-stage vs variable speed HVAC, system efficiency comparison, comfort levels, energy savings comparison`;
  } else {
    return `${HVAC_STYLE_BASE}, professional HVAC service, modern equipment, skilled technician, North Texas residential service`;
  }
}

async function generateRemainingImages() {
  console.log(`🚀 Generating remaining ${remainingBlogPosts.length} blog images...`);
  
  await fs.mkdir(path.join(__dirname, 'assets'), { recursive: true });
  await fs.mkdir(path.join(__dirname, 'public', 'images', 'blog'), { recursive: true });
  
  let successCount = 0;
  let failCount = 0;
  
  for (let i = 0; i < remainingBlogPosts.length; i++) {
    const slug = remainingBlogPosts[i];
    try {
      console.log(`\n🎨 Generating (${i + 1}/${remainingBlogPosts.length}): ${slug}...`);
      
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
      
      // Wait 3 seconds between requests to avoid rate limits
      if (i < remainingBlogPosts.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
      
    } catch (error) {
      console.error(`❌ Failed: ${slug} - ${error.message}`);
      failCount++;
    }
  }
  
  console.log(`\n✅ Remaining blog images complete! Success: ${successCount}, Failed: ${failCount}`);
  console.log(`📊 Total blog images: ${successCount + 26} out of 66 blog posts`);
}

generateRemainingImages();
