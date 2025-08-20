#!/usr/bin/env node

import OpenAI from 'openai';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

if (!process.env.OPENAI_API_KEY) {
  console.error('❌ OPENAI_API_KEY not found in environment variables');
  process.exit(1);
}

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Blog post to image prompt mapping
const blogImageMappings = [
  {
    filename: 'ac-blowing-warm-air.jpg',
    mdxFile: 'ac-blowing-warm-air.mdx',
    basePrompt: 'Professional HVAC service photo: Close-up of AC vents with visible cool air flow visualization, modern home interior, professional technician inspecting unit in background, photorealistic, clean composition, no text or logos'
  },
  {
    filename: 'ac-leaking-water-what-to-do.jpg',
    mdxFile: 'ac-leaking-water-what-to-do.mdx',
    basePrompt: 'Professional HVAC service photo: Indoor AC unit with water droplets forming underneath, clean modern home setting, maintenance tools nearby, photorealistic, clear detail of condensation issue, no text'
  },
  {
    filename: 'ac-lifespan-dfw.jpg',
    mdxFile: 'ac-lifespan-dfw.mdx',
    basePrompt: 'Professional HVAC photo: Modern outdoor AC condenser unit in Texas residential setting, well-maintained yard, golden hour lighting showing age progression concept, photorealistic, no text'
  },
  {
    filename: 'ac-maintenance-checklist-spring.jpg',
    mdxFile: 'ac-maintenance-checklist-spring.mdx',
    basePrompt: 'Professional HVAC maintenance photo: Technician performing spring AC maintenance, checking refrigerant levels, clean filters visible, tools organized, Texas home exterior, photorealistic, no text'
  },
  {
    filename: 'ac-repair-cost-north-texas-2025.jpg',
    mdxFile: 'ac-repair-cost-north-texas-2025.mdx',
    basePrompt: 'Professional HVAC service photo: Modern AC unit being serviced by technician, North Texas suburban home, professional tools and equipment visible, photorealistic, clean composition, no text or pricing'
  },
  {
    filename: 'ac-short-cycling-diagnostics.jpg',
    mdxFile: 'ac-short-cycling-diagnostics.mdx',
    basePrompt: 'Professional HVAC diagnostic photo: Digital thermostat showing temperature fluctuations, technician with diagnostic equipment, AC unit in background, photorealistic, technical but clean, no text'
  },
  {
    filename: 'ac-smells-from-vents.jpg',
    mdxFile: 'ac-smells-from-vents.mdx',
    basePrompt: 'Professional HVAC photo: Clean air vent close-up with subtle air flow visualization, modern home interior, fresh and clean atmosphere suggested, photorealistic, no text'
  },
  {
    filename: 'ac-warranty-basics.jpg',
    mdxFile: 'ac-warranty-basics.mdx',
    basePrompt: 'Professional HVAC photo: New AC unit installation, manufacturer label visible but generic, professional installation scene, tools and equipment, photorealistic, no specific brand text'
  },
  {
    filename: 'allen-hvac-knowledge-hub.jpg',
    mdxFile: 'allen-hvac-knowledge-hub.mdx',
    basePrompt: 'Professional photo: Allen Texas suburban neighborhood aerial view, modern homes with AC units visible, tree-lined streets, golden hour, photorealistic cityscape, no text'
  },
  {
    filename: 'addison-hvac-knowledge-hub.jpg',
    mdxFile: 'addison-hvac-knowledge-hub.mdx',
    basePrompt: 'Professional photo: Addison Texas commercial and residential mix, modern buildings with visible HVAC systems, urban North Texas setting, photorealistic, no text'
  },
  {
    filename: 'attic-duct-improvements.jpg',
    mdxFile: 'attic-duct-improvements.mdx',
    basePrompt: 'Professional HVAC photo: Clean attic space with properly insulated ductwork, silver flexible ducts, proper sealing visible, good lighting, photorealistic, no text'
  },
  {
    filename: 'best-filters-for-cooling.jpg',
    mdxFile: 'best-filters-for-cooling.mdx',
    basePrompt: 'Professional HVAC photo: Array of different MERV-rated air filters, clean and new, showing thickness variations, professional lighting, photorealistic, no brand names or text'
  },
  {
    filename: 'best-schedules-texas-summer.jpg',
    mdxFile: 'best-schedules-texas-summer.mdx',
    basePrompt: 'Professional photo: Digital programmable thermostat on wall, Texas summer scene visible through nearby window, comfortable home interior, photorealistic, no specific text on display'
  },
  {
    filename: 'bill-impact-calculator-explainer.jpg',
    mdxFile: 'bill-impact-calculator-explainer.mdx',
    basePrompt: 'Professional photo: Modern smart thermostat with energy usage display, efficient AC unit in background, subtle money-saving theme, photorealistic, no specific numbers or text'
  },
  {
    filename: 'co-safety-basics.jpg',
    mdxFile: 'co-safety-basics.mdx',
    basePrompt: 'Professional safety photo: Carbon monoxide detector installed near HVAC system, clean modern home, safety equipment visible, serious professional tone, photorealistic, no text'
  },
  {
    filename: 'cold-weather-heat-pumps-ntx.jpg',
    mdxFile: 'cold-weather-heat-pumps-ntx.mdx',
    basePrompt: 'Professional HVAC photo: Modern heat pump unit operating in winter, light frost on unit, North Texas home exterior, functioning efficiently in cold, photorealistic, no text'
  },
  {
    filename: 'common-ac-parts-failures.jpg',
    mdxFile: 'common-ac-parts-failures.mdx',
    basePrompt: 'Professional HVAC photo: Technician replacing capacitor in AC unit, various common replacement parts organized nearby, professional service scene, photorealistic, no text'
  },
  {
    filename: 'condenser-cleaning-safe-steps.jpg',
    mdxFile: 'condenser-cleaning-safe-steps.mdx',
    basePrompt: 'Professional HVAC maintenance photo: Technician carefully cleaning outdoor condenser coils with proper equipment, safety gear visible, professional technique, photorealistic, no text'
  },
  {
    filename: 'dehumidifier-sizing.jpg',
    mdxFile: 'dehumidifier-sizing.mdx',
    basePrompt: 'Professional HVAC photo: Whole-house dehumidifier installed with HVAC system, clean mechanical room, humidity meter showing optimal levels, photorealistic, no specific text'
  },
  {
    filename: 'duct-cleaning-vs-sealing.jpg',
    mdxFile: 'duct-cleaning-vs-sealing.mdx',
    basePrompt: 'Professional HVAC photo: Split scene showing duct cleaning equipment on one side and duct sealing materials on other, professional tools, photorealistic, no text'
  },
  {
    filename: 'duct-sizing-basics.jpg',
    mdxFile: 'duct-sizing-basics.mdx',
    basePrompt: 'Professional HVAC photo: Various sizes of ductwork in attic or mechanical room, proper installation visible, measuring tools present, photorealistic, no text'
  },
  {
    filename: 'ductless-for-garages.jpg',
    mdxFile: 'ductless-for-garages.mdx',
    basePrompt: 'Professional HVAC photo: Ductless mini-split unit installed in clean garage workshop, modern residential garage, comfortable workspace, photorealistic, no text'
  },
  {
    filename: 'dust-issues-real-causes.jpg',
    mdxFile: 'dust-issues-real-causes.mdx',
    basePrompt: 'Professional HVAC photo: Dusty air filter being replaced, clean new filter for comparison, home interior visible, air quality focus, photorealistic, no text'
  },
  {
    filename: 'energy-saving-ac-settings-texas.jpg',
    mdxFile: 'energy-saving-ac-settings-texas.mdx',
    basePrompt: 'Professional photo: Smart thermostat showing 78°F setting, Texas summer scene outside window, comfortable interior, energy-efficient home, photorealistic, no specific text'
  },
  {
    filename: 'flame-sensor-cleaning.jpg',
    mdxFile: 'flame-sensor-cleaning.mdx',
    basePrompt: 'Professional HVAC photo: Technician cleaning flame sensor on furnace, close-up of component, proper tools and technique, safety-focused, photorealistic, no text'
  },
  {
    filename: 'frisco-hvac-knowledge-hub.jpg',
    mdxFile: 'frisco-hvac-knowledge-hub.mdx',
    basePrompt: 'Professional photo: Frisco Texas modern suburban development, upscale homes with AC units, manicured lawns, North Texas architecture, photorealistic aerial view, no text'
  },
  {
    filename: 'frozen-coil-emergency-steps.jpg',
    mdxFile: 'frozen-coil-emergency-steps.mdx',
    basePrompt: 'Professional HVAC photo: Frozen evaporator coil with ice buildup, technician safely addressing issue, emergency service scenario, photorealistic, no text'
  },
  {
    filename: 'frozen-evaporator-coil.jpg',
    mdxFile: 'frozen-evaporator-coil.mdx',
    basePrompt: 'Professional HVAC photo: Ice formation on evaporator coil, clear detail of frozen components, indoor unit access panel open, photorealistic, no text'
  },
  {
    filename: 'frozen-evaporator-coil-enhanced.jpg',
    mdxFile: 'frozen-evaporator-coil-enhanced.mdx',
    basePrompt: 'Professional HVAC photo: Detailed view of frozen evaporator coil with ice crystals, technician with tools beginning repair, photorealistic close-up, no text'
  },
  {
    filename: 'furnace-maintenance-fall.jpg',
    mdxFile: 'furnace-maintenance-fall.mdx',
    basePrompt: 'Professional HVAC photo: Technician performing fall furnace maintenance, checking heat exchanger, autumn leaves visible outside, photorealistic, no text'
  },
  {
    filename: 'furnace-not-igniting.jpg',
    mdxFile: 'furnace-not-igniting.mdx',
    basePrompt: 'Professional HVAC photo: Furnace ignition system close-up, technician troubleshooting with multimeter, professional diagnostic scene, photorealistic, no text'
  },
  {
    filename: 'furnace-repair-cost-2025.jpg',
    mdxFile: 'furnace-repair-cost-2025.mdx',
    basePrompt: 'Professional HVAC photo: Modern furnace being serviced, technician with professional tools, North Texas home basement or utility room, photorealistic, no pricing text'
  },
  {
    filename: 'furnace-short-cycling.jpg',
    mdxFile: 'furnace-short-cycling.mdx',
    basePrompt: 'Professional HVAC photo: Furnace control board with diagnostic lights, technician checking cycling issues, technical but clean scene, photorealistic, no text'
  },
  {
    filename: 'gas-smell-steps.jpg',
    mdxFile: 'gas-smell-steps.mdx',
    basePrompt: 'Professional safety photo: Gas shutoff valve near furnace, safety equipment visible, serious professional emergency response theme, photorealistic, no text'
  },
  {
    filename: 'heat-pump-install-cost-2025.jpg',
    mdxFile: 'heat-pump-install-cost-2025.mdx',
    basePrompt: 'Professional HVAC photo: New heat pump system installation in progress, modern equipment, North Texas home, professional installation crew, photorealistic, no pricing'
  },
  {
    filename: 'heat-pump-noise-expectations.jpg',
    mdxFile: 'heat-pump-noise-expectations.mdx',
    basePrompt: 'Professional HVAC photo: Quiet modern heat pump unit operating, residential setting with peaceful environment suggested, sound meter nearby, photorealistic, no text'
  },
  {
    filename: 'heat-pump-vs-ac-gas-texas.jpg',
    mdxFile: 'heat-pump-vs-ac-gas-texas.mdx',
    basePrompt: 'Professional HVAC photo: Split view showing heat pump on one side and traditional AC with gas furnace on other, Texas home setting, photorealistic comparison, no text'
  },
  {
    filename: 'heat-pump-winter-normal.jpg',
    mdxFile: 'heat-pump-winter-normal.mdx',
    basePrompt: 'Professional HVAC photo: Heat pump operating in winter with light steam from defrost cycle, normal operation indicators, photorealistic, no text'
  },
  {
    filename: 'heat-pumps-in-dfw-fit.jpg',
    mdxFile: 'heat-pumps-in-dfw-fit.mdx',
    basePrompt: 'Professional HVAC photo: Modern heat pump installation at typical DFW area home, Texas architectural style, optimal placement shown, photorealistic, no text'
  },
  {
    filename: 'humidity-control-texas-summer.jpg',
    mdxFile: 'humidity-control-texas-summer.mdx',
    basePrompt: 'Professional HVAC photo: Dehumidification system with AC, humidity gauge showing optimal levels, Texas summer comfort theme, photorealistic, no text'
  },
  {
    filename: 'leaky-ducts-symptoms.jpg',
    mdxFile: 'leaky-ducts-symptoms.mdx',
    basePrompt: 'Professional HVAC photo: Visible duct leak with disconnected section, attic setting, energy loss visualization concept, photorealistic, no text'
  },
  {
    filename: 'little-elm-hvac-knowledge-hub.jpg',
    mdxFile: 'little-elm-hvac-knowledge-hub.mdx',
    basePrompt: 'Professional photo: Little Elm Texas lakeside community, residential homes with AC units, scenic North Texas setting, photorealistic aerial view, no text'
  },
  {
    filename: 'manual-j-plain-english.jpg',
    mdxFile: 'manual-j-plain-english.mdx',
    basePrompt: 'Professional HVAC photo: Technician measuring home for load calculation, blueprints and measuring tools visible, professional assessment scene, photorealistic, no text'
  },
  {
    filename: 'mckinney-hvac-knowledge-hub.jpg',
    mdxFile: 'mckinney-hvac-knowledge-hub.mdx',
    basePrompt: 'Professional photo: McKinney Texas historic downtown and modern suburbs blend, mix of home styles with HVAC systems, photorealistic cityscape, no text'
  },
  {
    filename: 'merv-ratings-explained.jpg',
    mdxFile: 'merv-ratings-explained.mdx',
    basePrompt: 'Professional HVAC photo: Selection of air filters showing different thicknesses and densities, MERV comparison visual, clean presentation, photorealistic, no text labels'
  },
  {
    filename: 'no-cooling-today-checklist.jpg',
    mdxFile: 'no-cooling-today-checklist.mdx',
    basePrompt: 'Professional HVAC photo: Homeowner checking thermostat with AC not working, circuit breaker panel visible, troubleshooting scenario, photorealistic, no text'
  },
  {
    filename: 'noisy-ac-sounds-and-causes.jpg',
    mdxFile: 'noisy-ac-sounds-and-causes.mdx',
    basePrompt: 'Professional HVAC photo: Technician listening to AC unit with stethoscope or diagnostic tool, identifying noise source, photorealistic, no text'
  },
  {
    filename: 'office-pm-plans.jpg',
    mdxFile: 'office-pm-plans.mdx',
    basePrompt: 'Professional commercial HVAC photo: Office building rooftop units being maintained, professional service team, scheduled maintenance scene, photorealistic, no text'
  },
  {
    filename: 'outdoor-unit-wont-start.jpg',
    mdxFile: 'outdoor-unit-wont-start.mdx',
    basePrompt: 'Professional HVAC photo: Outdoor AC condenser unit with technician checking electrical connections, diagnostic process, photorealistic, no text'
  },
  {
    filename: 'plano-hvac-knowledge-hub.jpg',
    mdxFile: 'plano-hvac-knowledge-hub.mdx',
    basePrompt: 'Professional photo: Plano Texas Legacy West area and residential neighborhoods, modern development with HVAC systems visible, photorealistic aerial view, no text'
  },
  {
    filename: 'pre-summer-tune-up.jpg',
    mdxFile: 'pre-summer-tune-up.mdx',
    basePrompt: 'Professional HVAC photo: Spring AC maintenance scene, technician cleaning coils and checking refrigerant, preparation for Texas summer, photorealistic, no text'
  },
  {
    filename: 'prosper-hvac-knowledge-hub.jpg',
    mdxFile: 'prosper-hvac-knowledge-hub.mdx',
    basePrompt: 'Professional photo: Prosper Texas new development area, modern upscale homes with AC units, growing community feel, photorealistic aerial view, no text'
  },
  {
    filename: 'reading-hvac-proposals.jpg',
    mdxFile: 'reading-hvac-proposals.mdx',
    basePrompt: 'Professional photo: Homeowner reviewing HVAC proposal documents with contractor, kitchen table setting, decision-making scene, photorealistic, no readable text'
  },
  {
    filename: 'replace-vs-repair-ac.jpg',
    mdxFile: 'replace-vs-repair-ac.mdx',
    basePrompt: 'Professional HVAC photo: Old AC unit next to new modern unit for comparison, showing age and efficiency difference, photorealistic, no text'
  },
  {
    filename: 'restaurant-makeup-air-basics.jpg',
    mdxFile: 'restaurant-makeup-air-basics.mdx',
    basePrompt: 'Professional commercial HVAC photo: Restaurant kitchen with makeup air unit and exhaust hood system, commercial kitchen ventilation, photorealistic, no text'
  },
  {
    filename: 'returns-vs-supplies-balance.jpg',
    mdxFile: 'returns-vs-supplies-balance.mdx',
    basePrompt: 'Professional HVAC photo: Supply and return vents in room showing proper placement, airflow pattern visualization concept, photorealistic, no text'
  },
  {
    filename: 'rtu-maintenance-small-retail.jpg',
    mdxFile: 'rtu-maintenance-small-retail.mdx',
    basePrompt: 'Professional commercial HVAC photo: Rooftop unit on small retail building, technician performing maintenance, commercial service scene, photorealistic, no text'
  },
  {
    filename: 'seer2-texas-guide.jpg',
    mdxFile: 'seer2-texas-guide.mdx',
    basePrompt: 'Professional HVAC photo: High-efficiency modern AC unit with energy star rating concept, Texas home setting, efficiency theme, photorealistic, no text or numbers'
  },
  {
    filename: 'staging-options-comparison.jpg',
    mdxFile: 'staging-options-comparison.mdx',
    basePrompt: 'Professional HVAC photo: Variable speed AC unit control panel, showing multi-stage operation concept, modern technology, photorealistic, no text'
  },
  {
    filename: 'static-pressure-comfort.jpg',
    mdxFile: 'static-pressure-comfort.mdx',
    basePrompt: 'Professional HVAC photo: Technician using manometer to measure static pressure in duct system, technical measurement scene, photorealistic, no text'
  },
  {
    filename: 'the-colony-hvac-knowledge-hub.jpg',
    mdxFile: 'the-colony-hvac-knowledge-hub.mdx',
    basePrompt: 'Professional photo: The Colony Texas lakeside community, mix of residential and commercial buildings with HVAC systems, photorealistic aerial view, no text'
  },
  {
    filename: 'thermostat-compatibility-guide.jpg',
    mdxFile: 'thermostat-compatibility-guide.mdx',
    basePrompt: 'Professional HVAC photo: Various thermostat models displayed, from basic to smart, showing evolution of technology, photorealistic, no brand text'
  },
  {
    filename: 'thermostat-says-cooling-not-cooling.jpg',
    mdxFile: 'thermostat-says-cooling-not-cooling.mdx',
    basePrompt: 'Professional HVAC photo: Digital thermostat display showing cooling mode, technician checking system, troubleshooting scene, photorealistic, no specific text'
  },
  {
    filename: 'thermostat-sensor-placement.jpg',
    mdxFile: 'thermostat-sensor-placement.mdx',
    basePrompt: 'Professional HVAC photo: Proper thermostat placement on interior wall, away from vents and windows, optimal location shown, photorealistic, no text'
  },
  {
    filename: 'thermostats-for-heat-pumps.jpg',
    mdxFile: 'thermostats-for-heat-pumps.mdx',
    basePrompt: 'Professional HVAC photo: Heat pump compatible thermostat on wall, modern smart thermostat design, heat pump system visible, photorealistic, no text'
  },
  {
    filename: 'two-stage-vs-variable.jpg',
    mdxFile: 'two-stage-vs-variable.mdx',
    basePrompt: 'Professional HVAC photo: Modern variable speed AC unit showcasing advanced technology, comparison with standard unit, photorealistic, no text'
  }
];

async function readBlogContent(mdxFile) {
  try {
    const contentPath = path.join(__dirname, '..', 'src', 'content', 'blog', mdxFile);
    const content = await fs.readFile(contentPath, 'utf-8');
    
    // Extract title and description from frontmatter
    const titleMatch = content.match(/title:\s*["'](.+?)["']/);
    const descMatch = content.match(/description:\s*["'](.+?)["']/);
    
    const title = titleMatch ? titleMatch[1] : '';
    const description = descMatch ? descMatch[1] : '';
    
    // Extract first paragraph of content
    const contentStart = content.indexOf('---', 10) + 3;
    const firstParagraph = content.substring(contentStart, contentStart + 500).replace(/<[^>]*>/g, '').trim();
    
    return { title, description, firstParagraph };
  } catch (error) {
    console.warn(`Could not read content for ${mdxFile}:`, error.message);
    return { title: '', description: '', firstParagraph: '' };
  }
}

async function generateImage(imageConfig) {
  const { filename, mdxFile, basePrompt } = imageConfig;
  
  console.log(`📸 Generating image: ${filename}`);
  
  // Read blog content for context
  const { title, description } = await readBlogContent(mdxFile);
  
  // Enhance prompt with blog context
  const enhancedPrompt = `${basePrompt}. Context: ${title ? `Article about "${title}". ` : ''}Professional HVAC service in North Texas. High quality, photorealistic, commercial photography style, clean composition, proper lighting, no text or watermarks.`;
  
  try {
    const response = await client.images.generate({
      model: 'dall-e-3', // Using dall-e-3 as gpt-image-1 might not be available
      prompt: enhancedPrompt,
      size: '1792x1024', // Using supported size for dall-e-3
      quality: 'hd',
      n: 1,
      response_format: 'b64_json'
    });
    
    const b64 = response.data[0].b64_json;
    const outputPath = path.join(__dirname, '..', 'public', 'images', 'blog', filename);
    
    await fs.writeFile(outputPath, Buffer.from(b64, 'base64'));
    console.log(`✅ Saved: ${filename}`);
    
    return { success: true, filename };
  } catch (error) {
    console.error(`❌ Failed to generate ${filename}:`, error.message);
    return { success: false, filename, error: error.message };
  }
}

async function main() {
  console.log('🚀 Starting blog image regeneration with OpenAI...');
  console.log(`📁 Processing ${blogImageMappings.length} images\n`);
  
  const results = [];
  const batchSize = 3; // Process 3 images at a time to avoid rate limits
  
  for (let i = 0; i < blogImageMappings.length; i += batchSize) {
    const batch = blogImageMappings.slice(i, Math.min(i + batchSize, blogImageMappings.length));
    
    console.log(`\n📦 Processing batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(blogImageMappings.length/batchSize)}`);
    
    const batchResults = await Promise.all(
      batch.map(config => generateImage(config))
    );
    
    results.push(...batchResults);
    
    // Add delay between batches to respect rate limits
    if (i + batchSize < blogImageMappings.length) {
      console.log('⏳ Waiting 2 seconds before next batch...');
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  
  // Summary
  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  
  console.log('\n' + '='.repeat(50));
  console.log('📊 Image Generation Summary:');
  console.log(`✅ Successful: ${successful}/${blogImageMappings.length}`);
  if (failed > 0) {
    console.log(`❌ Failed: ${failed}`);
    console.log('\nFailed images:');
    results.filter(r => !r.success).forEach(r => {
      console.log(`  - ${r.filename}: ${r.error}`);
    });
  }
  console.log('='.repeat(50));
}

// Run the script
main().catch(console.error);