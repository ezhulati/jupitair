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

// Sony DSLR photography base
const SONY_DSLR_BASE = "Sony DSLR camera, 50mm lens, hyper-realistic, sharp focus, professional photography, high resolution, natural lighting, no text, no overlays, no graphics, no words, photojournalistic style";

// Get all blog posts with their complete content
async function getAllBlogPostsWithContent() {
  const blogDir = path.join(__dirname, 'src/content/blog');
  const files = await fs.readdir(blogDir);
  const posts = [];
  
  for (const file of files) {
    if (file.endsWith('.mdx')) {
      const slug = file.replace('.mdx', '');
      const content = await fs.readFile(path.join(blogDir, file), 'utf-8');
      
      // Extract frontmatter and content
      const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)/);
      const frontmatter = frontmatterMatch ? frontmatterMatch[1] : '';
      const bodyContent = frontmatterMatch ? frontmatterMatch[2] : content;
      
      const titleMatch = frontmatter.match(/title:\s*["'](.+?)["']/);
      const descMatch = frontmatter.match(/description:\s*["'](.+?)["']/);
      
      const title = titleMatch ? titleMatch[1] : slug.replace(/-/g, ' ');
      const description = descMatch ? descMatch[1] : '';
      
      posts.push({ 
        slug, 
        title, 
        description, 
        content: bodyContent.substring(0, 2000), // First 2000 chars for context
        frontmatter 
      });
    }
  }
  
  return posts;
}

// Create highly contextual prompts based on actual article content
function createContextualPrompt(post) {
  const { slug, title, description, content } = post;
  
  // Analyze content for specific technical topics
  const lowerContent = content.toLowerCase();
  const lowerTitle = title.toLowerCase();
  
  let specificContext = '';
  
  // AC & Cooling Issues
  if (slug === 'ac-blowing-warm-air') {
    specificContext = 'HVAC technician using digital thermometer to test warm air coming from AC vent, residential North Texas home interior, hand holding thermometer near air register, suburban Dallas home setting, professional diagnostic work';
  }
  else if (slug === 'ac-leaking-water-what-to-do') {
    specificContext = 'Water puddle beneath indoor AC unit, HVAC technician examining drain line with flashlight, condensate drain problem, wet floor around air handler, diagnostic inspection, North Texas suburban home utility room';
  }
  else if (slug === 'ac-lifespan-dfw') {
    specificContext = 'Modern high-efficiency AC condenser unit in North Texas backyard, well-maintained HVAC system, suburban DFW home, quality outdoor unit installation, long-lasting equipment, professional installation';
  }
  else if (slug === 'ac-maintenance-checklist-spring') {
    specificContext = 'HVAC technician performing spring maintenance on outdoor AC unit, cleaning condenser coils, checking refrigerant lines, preventive maintenance checklist in hand, suburban North Texas home';
  }
  else if (slug === 'ac-repair-cost-north-texas-2025') {
    specificContext = 'HVAC service truck in North Texas driveway, technician with clipboard calculating repair estimate, modern suburban home, professional consultation, cost documentation';
  }
  else if (slug === 'ac-short-cycling-diagnostics') {
    specificContext = 'HVAC technician using multimeter to diagnose AC electrical issues, short cycling problem, diagnostic equipment near outdoor condenser unit, electrical testing, North Texas setting';
  }
  else if (slug === 'ac-smells-from-vents') {
    specificContext = 'HVAC technician inspecting air vent with flashlight, checking for odor sources, residential air register examination, indoor air quality assessment, clean home interior';
  }
  else if (slug === 'ac-warranty-basics') {
    specificContext = 'HVAC warranty documents and paperwork on table, modern AC unit in background, warranty coverage explanation, professional consultation, North Texas home setting';
  }
  
  // City-Specific Services  
  else if (slug.includes('addison-hvac')) {
    specificContext = 'Professional HVAC service truck in Addison Texas suburban neighborhood, technician servicing residential AC unit, local community service, North Texas setting';
  }
  else if (slug.includes('allen-hvac')) {
    specificContext = 'HVAC technician working on AC system in Allen Texas residential area, suburban neighborhood service, North Texas community, professional local service';
  }
  else if (slug.includes('frisco-hvac')) {
    specificContext = 'Professional HVAC service in Frisco Texas subdivision, modern suburban homes, local technician, North Texas residential service';
  }
  else if (slug.includes('plano-hvac')) {
    specificContext = 'HVAC technician servicing air conditioning in Plano Texas home, suburban residential service, local North Texas community, professional service truck';
  }
  else if (slug.includes('mckinney-hvac')) {
    specificContext = 'Professional HVAC maintenance in McKinney Texas residential area, suburban home service, local technician, North Texas setting';
  }
  else if (slug.includes('prosper-hvac')) {
    specificContext = 'HVAC service technician in Prosper Texas neighborhood, residential AC service, suburban community, North Texas local service';
  }
  else if (slug.includes('little-elm-hvac')) {
    specificContext = 'Professional HVAC technician servicing home in Little Elm Texas, residential neighborhood, local community service, North Texas area';
  }
  else if (slug.includes('the-colony-hvac')) {
    specificContext = 'HVAC technician working on air conditioning system in The Colony Texas, suburban residential service, North Texas community setting';
  }
  
  // Heating & Furnace Issues
  else if (slug === 'furnace-maintenance-fall') {
    specificContext = 'HVAC technician performing fall furnace maintenance, gas furnace inspection in utility room, burner cleaning, seasonal tune-up, North Texas home preparation';
  }
  else if (slug === 'furnace-not-igniting') {
    specificContext = 'HVAC technician diagnosing furnace ignition problem, gas furnace not starting, igniter inspection, flame sensor checking, utility room diagnostic work';
  }
  else if (slug === 'furnace-repair-cost-2025') {
    specificContext = 'HVAC technician examining gas furnace for repair estimate, diagnostic equipment, cost assessment, furnace components inspection, professional evaluation';
  }
  else if (slug === 'furnace-short-cycling') {
    specificContext = 'Gas furnace cycling on and off frequently, HVAC technician monitoring thermostat and furnace operation, short cycling diagnostic, heating system problem';
  }
  else if (slug === 'gas-smell-steps') {
    specificContext = 'HVAC technician using gas leak detector near furnace, safety inspection, gas odor investigation, professional safety protocols, emergency response equipment';
  }
  else if (slug === 'flame-sensor-cleaning') {
    specificContext = 'Close-up of HVAC technician cleaning furnace flame sensor rod, small component maintenance, precision cleaning, furnace internal components';
  }
  
  // Heat Pump Systems
  else if (slug === 'cold-weather-heat-pumps-ntx') {
    specificContext = 'Heat pump outdoor unit operating in cold North Texas weather, winter performance, frost on coils, cold climate operation, suburban home heating';
  }
  else if (slug === 'heat-pump-install-cost-2025') {
    specificContext = 'Professional heat pump installation in progress, technicians installing outdoor unit, North Texas residential installation, modern heat pump system, installation crew';
  }
  else if (slug === 'heat-pump-noise-expectations') {
    specificContext = 'HVAC technician using sound meter to measure heat pump noise levels, outdoor unit sound testing, quiet operation verification, suburban neighborhood setting';
  }
  else if (slug === 'heat-pump-vs-ac-gas-texas') {
    specificContext = 'Side-by-side comparison setup showing heat pump and traditional AC with gas furnace, North Texas home, system comparison, energy efficiency demonstration';
  }
  else if (slug === 'heat-pump-winter-normal') {
    specificContext = 'Heat pump defrost cycle in action, outdoor unit with frost melting, winter operation, normal cold weather performance, North Texas winter setting';
  }
  else if (slug === 'heat-pumps-in-dfw-fit') {
    specificContext = 'Modern heat pump installation in typical DFW suburban home, North Texas climate suitability, residential heat pump system, professional installation';
  }
  else if (slug === 'thermostats-for-heat-pumps') {
    specificContext = 'Smart thermostat designed for heat pump control, digital display showing heat pump settings, wall-mounted thermostat, modern home interior';
  }
  
  // Duct Work & Airflow
  else if (slug === 'attic-duct-improvements') {
    specificContext = 'HVAC technician working in North Texas attic, inspecting ductwork, duct sealing and insulation, attic duct system, summer heat conditions';
  }
  else if (slug === 'duct-cleaning-vs-sealing') {
    specificContext = 'Split image concept: duct cleaning equipment and duct sealing materials, ductwork maintenance comparison, HVAC system improvement options';
  }
  else if (slug === 'duct-sizing-basics') {
    specificContext = 'HVAC engineer measuring ductwork with tape measure, duct sizing calculations, proper ductwork installation, system design work';
  }
  else if (slug === 'ductless-for-garages') {
    specificContext = 'Ductless mini-split system installed in North Texas garage, wall-mounted indoor unit, garage workshop setting, spot cooling solution';
  }
  else if (slug === 'leaky-ducts-symptoms') {
    specificContext = 'HVAC technician using duct blaster equipment to test for air leaks, ductwork pressure testing, energy efficiency diagnostic';
  }
  else if (slug === 'returns-vs-supplies-balance') {
    specificContext = 'HVAC technician measuring airflow at supply and return vents, airflow balancing work, residential vent system, proper air circulation';
  }
  
  // Filters & Air Quality
  else if (slug === 'best-filters-for-cooling') {
    specificContext = 'Array of different HVAC air filters displayed for comparison, various MERV ratings, filter selection guide, air quality improvement options';
  }
  else if (slug === 'merv-ratings-explained') {
    specificContext = 'Close-up comparison of air filters with different MERV ratings, filter density variations, air filtration comparison, technical filter details';
  }
  else if (slug === 'dust-issues-real-causes') {
    specificContext = 'Dusty air filter being removed from HVAC system, excessive dust accumulation, dirty filter replacement, indoor air quality issues';
  }
  else if (slug === 'humidity-control-texas-summer') {
    specificContext = 'Digital hygrometer showing humidity levels in North Texas home, summer humidity control, indoor comfort measurement, HVAC humidity management';
  }
  else if (slug === 'dehumidifier-sizing') {
    specificContext = 'Whole-house dehumidifier installation in HVAC system, humidity control equipment, North Texas summer humidity solution';
  }
  
  // Thermostat & Controls
  else if (slug === 'thermostat-compatibility-guide') {
    specificContext = 'Various smart thermostats displayed with HVAC compatibility charts, thermostat selection guide, modern digital controls, installation compatibility';
  }
  else if (slug === 'thermostat-says-cooling-not-cooling') {
    specificContext = 'Digital thermostat display showing cooling mode but HVAC technician testing warm air from vent, troubleshooting cooling problem';
  }
  else if (slug === 'thermostat-sensor-placement') {
    specificContext = 'HVAC technician installing or adjusting thermostat sensor placement, proper thermostat positioning, wall installation, temperature sensing optimization';
  }
  else if (slug === 'best-schedules-texas-summer') {
    specificContext = 'Smart thermostat programming screen showing summer cooling schedule, energy-saving temperature settings, programmable thermostat optimization';
  }
  
  // Energy Efficiency & Performance
  else if (slug === 'energy-saving-ac-settings-texas') {
    specificContext = 'Digital thermostat set to energy-saving temperature, North Texas energy efficiency, summer cooling cost savings, optimal AC settings';
  }
  else if (slug === 'seer2-texas-guide') {
    specificContext = 'High-efficiency AC unit EnergyGuide label showing SEER2 rating, energy efficiency comparison, North Texas energy standards';
  }
  else if (slug === 'bill-impact-calculator-explainer') {
    specificContext = 'Energy bill comparison documents showing HVAC efficiency savings, calculator and utility bills, cost analysis, energy usage comparison';
  }
  else if (slug === 'staging-options-comparison') {
    specificContext = 'Multi-stage HVAC system control board, variable speed equipment comparison, advanced HVAC technology, system staging display';
  }
  else if (slug === 'two-stage-vs-variable') {
    specificContext = 'HVAC equipment comparison showing two-stage and variable speed systems, advanced cooling technology, efficiency comparison';
  }
  
  // Troubleshooting & Emergency
  else if (slug === 'frozen-evaporator-coil') {
    specificContext = 'Ice-covered evaporator coil in HVAC system, frozen AC coil problem, ice buildup on cooling coil, HVAC technician inspecting frozen equipment';
  }
  else if (slug === 'frozen-evaporator-coil-enhanced') {
    specificContext = 'Detailed view of frozen evaporator coil with significant ice accumulation, HVAC technician examining severe freezing problem, diagnostic equipment';
  }
  else if (slug === 'frozen-coil-emergency-steps') {
    specificContext = 'HVAC emergency service, technician responding to frozen coil problem, urgent repair situation, ice-covered HVAC equipment';
  }
  else if (slug === 'no-cooling-today-checklist') {
    specificContext = 'HVAC technician with diagnostic checklist troubleshooting AC not cooling, emergency service call, problem-solving process';
  }
  else if (slug === 'outdoor-unit-wont-start') {
    specificContext = 'HVAC technician diagnosing outdoor AC condenser that won\'t start, electrical testing, condenser unit troubleshooting, repair diagnostic';
  }
  else if (slug === 'noisy-ac-sounds-and-causes') {
    specificContext = 'HVAC technician using stethoscope or listening device to diagnose AC noise sources, sound diagnostic, equipment noise troubleshooting';
  }
  
  // Maintenance & Tune-ups
  else if (slug === 'pre-summer-tune-up') {
    specificContext = 'HVAC technician performing comprehensive AC tune-up, spring maintenance service, system preparation for summer, preventive maintenance';
  }
  else if (slug === 'condenser-cleaning-safe-steps') {
    specificContext = 'HVAC technician safely cleaning outdoor condenser coils, pressure washing condenser unit, coil cleaning maintenance, professional cleaning technique';
  }
  else if (slug === 'common-ac-parts-failures') {
    specificContext = 'Various failed AC components laid out for examination, common HVAC parts that need replacement, component failure analysis';
  }
  
  // Commercial HVAC
  else if (slug === 'office-pm-plans') {
    specificContext = 'HVAC technician servicing commercial office building rooftop unit, commercial maintenance, office building HVAC system, professional commercial service';
  }
  else if (slug === 'restaurant-makeup-air-basics') {
    specificContext = 'Commercial kitchen HVAC makeup air system, restaurant ventilation equipment, commercial kitchen air handling, industrial HVAC application';
  }
  else if (slug === 'rtu-maintenance-small-retail') {
    specificContext = 'HVAC technician maintaining rooftop unit on small retail building, commercial RTU service, retail store HVAC maintenance';
  }
  
  // Safety & Technical
  else if (slug === 'co-safety-basics') {
    specificContext = 'Carbon monoxide detector and HVAC safety inspection, CO safety equipment, gas appliance safety check, professional safety protocols';
  }
  else if (slug === 'manual-j-plain-english') {
    specificContext = 'HVAC engineer performing load calculations with blueprints and calculation tools, Manual J sizing work, professional system design';
  }
  else if (slug === 'static-pressure-comfort') {
    specificContext = 'HVAC technician measuring static pressure with manometer, airflow diagnostic testing, system pressure measurement, comfort optimization';
  }
  
  // Decision Making & Planning
  else if (slug === 'replace-vs-repair-ac') {
    specificContext = 'HVAC consultation showing old AC unit compared to new efficient system, repair vs replacement decision, cost comparison analysis';
  }
  else if (slug === 'reading-hvac-proposals') {
    specificContext = 'HVAC proposal documents and estimates spread on table, contractor consultation, proposal comparison, professional documentation';
  }
  
  // Default fallback
  else {
    specificContext = `Professional HVAC technician working on ${title.toLowerCase()}, North Texas residential service, modern HVAC equipment, expert technical work`;
  }
  
  return `${SONY_DSLR_BASE}, ${specificContext}, North Texas setting, professional HVAC service, realistic workplace photography`;
}

// Generate contextual image with DALL-E
async function generateContextualImage(post) {
  try {
    const prompt = createContextualPrompt(post);
    
    console.log(`\n🔧 Generating: ${post.slug}`);
    console.log(`📖 Title: ${post.title}`);
    console.log(`🎨 Contextual prompt: ${prompt.substring(0, 150)}...`);
    
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      size: "1792x1024", // Wide format for hero images
      quality: "hd",
      n: 1,
    });

    const imageUrl = response.data[0].url;
    
    // Download and save
    const imageResponse = await fetch(imageUrl);
    const imageBuffer = await imageResponse.arrayBuffer();
    const buffer = Buffer.from(imageBuffer);
    
    // Save to correct location
    const imagePath = path.join(__dirname, 'public/images/blog', `${post.slug}.jpg`);
    await fs.writeFile(imagePath, buffer);
    
    console.log(`✅ Generated: ${post.slug}.jpg`);
    
    return { success: true, slug: post.slug };
    
  } catch (error) {
    console.error(`❌ Error generating ${post.slug}:`, error.message);
    return { success: false, slug: post.slug, error: error.message };
  }
}

// Main execution function
async function regenerateAllContextualImages() {
  console.log('📸 REGENERATING ALL BLOG IMAGES WITH SONY DSLR QUALITY & CONTEXTUAL CONTENT\n');
  console.log('🎯 Each image will be based on the actual article content\n');
  console.log('📝 Reading and analyzing all blog posts...\n');
  
  const allPosts = await getAllBlogPostsWithContent();
  console.log(`Found ${allPosts.length} blog posts to process\n`);
  
  const results = { regenerated: [], errors: [], total: allPosts.length };
  
  console.log('🚀 Starting contextual image generation...\n');
  
  for (const post of allPosts) {
    const result = await generateContextualImage(post);
    
    if (result.success) {
      results.regenerated.push(result.slug);
    } else {
      results.errors.push({ slug: result.slug, error: result.error });
    }
    
    // Rate limiting - wait between requests
    console.log('⏱️  Waiting 2 seconds...');
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  // Generate fixed images for broken references
  const brokenReferences = ['frozen-evaporator-coil-detailed'];
  for (const brokenSlug of brokenReferences) {
    const matchingPost = allPosts.find(p => p.slug.includes('frozen-evaporator-coil'));
    if (matchingPost) {
      const brokenPost = { ...matchingPost, slug: brokenSlug };
      const result = await generateContextualImage(brokenPost);
      if (result.success) {
        results.regenerated.push(result.slug);
      }
    }
  }
  
  // Final summary
  console.log('\n🎉 CONTEXTUAL IMAGE GENERATION COMPLETE!');
  console.log(`📊 Total processed: ${results.total}`);
  console.log(`✅ Successfully generated: ${results.regenerated.length}`);
  console.log(`❌ Errors: ${results.errors.length}`);
  
  if (results.errors.length > 0) {
    console.log('\n⚠️  Errors:');
    results.errors.forEach(err => console.log(`   - ${err.slug}: ${err.error}`));
  }
  
  console.log('\n📸 All images now feature:');
  console.log('  • Sony DSLR 50mm lens hyper-realistic quality');
  console.log('  • No text or overlays');
  console.log('  • Content-specific contextual imagery');
  console.log('  • Professional North Texas HVAC representation');
  
  // Save results
  await fs.writeFile(
    path.join(__dirname, 'contextual-regeneration-report.json'),
    JSON.stringify(results, null, 2)
  );
  
  return results;
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  regenerateAllContextualImages();
}

export { regenerateAllContextualImages };
