#!/usr/bin/env node

import OpenAI from 'openai';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { glob } from 'glob';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

if (!process.env.OPENAI_API_KEY) {
  console.error('❌ OPENAI_API_KEY not found in environment variables');
  process.exit(1);
}

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Cities and services for dynamic pages
const cities = [
  'frisco', 'plano', 'mckinney', 'allen', 
  'prosper', 'the-colony', 'little-elm', 'addison'
];

const services = [
  'ac-repair', 'heating-repair', 'hvac-installation', 
  'ac-installation', 'heating-installation', 'maintenance',
  'duct-cleaning', 'duct-sealing', 'indoor-air-quality',
  'thermostat-installation', 'heat-pump-systems', 'air-purification',
  'zoning-systems', 'commercial-hvac', 'residential'
];

const commercialPages = [
  'chiller-systems', 'emergency-service', 'new-installation',
  'office-hvac', 'preventive-maintenance', 'restaurant-hvac',
  'retail-hvac', 'rtu-replacement'
];

const utilityPages = [
  'contact', 'services', 'privacy', 'terms', 
  'success', 'sitemap', 'style-guide', '404'
];

// Read and extract page content
async function extractPageContent(filePath) {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    
    // Extract title and description
    const titleMatch = content.match(/(?:pageTitle|title)\s*=\s*["'](.+?)["']/);
    const descMatch = content.match(/(?:pageDescription|description)\s*=\s*["'](.+?)["']/);
    
    // Extract heading content
    const h1Match = content.match(/<h1[^>]*>([^<]+)<\/h1>/i);
    const h2Matches = content.match(/<h2[^>]*>([^<]+)<\/h2>/gi);
    
    // Extract service/city context from path
    const pathParts = filePath.split('/');
    const fileName = pathParts[pathParts.length - 1].replace('.astro', '').replace('.mdx', '');
    
    return {
      title: titleMatch ? titleMatch[1] : '',
      description: descMatch ? descMatch[1] : '',
      heading: h1Match ? h1Match[1] : '',
      subheadings: h2Matches ? h2Matches.slice(0, 3).map(h => h.replace(/<[^>]*>/g, '')) : [],
      fileName,
      filePath
    };
  } catch (error) {
    console.warn(`Could not extract content from ${filePath}:`, error.message);
    return { title: '', description: '', heading: '', subheadings: [], fileName: path.basename(filePath, '.astro'), filePath };
  }
}

// Generate contextual prompt based on page type and content
function generateContextualPrompt(pageData, pageType) {
  const { title, description, fileName } = pageData;
  
  // Base prompt components
  let baseContext = "Professional HVAC service photo for North Texas company. ";
  let styleGuide = "Photorealistic, high quality commercial photography, clean composition, professional lighting, no text or watermarks, no logos, no words. ";
  
  // Page-type specific prompts
  if (pageType === 'city') {
    const cityName = fileName.replace(/-/g, ' ');
    return `${baseContext}Aerial view of ${cityName} Texas suburban neighborhood, modern homes with visible AC units on rooftops, well-maintained lawns, tree-lined streets, golden hour lighting, professional real estate photography style. ${styleGuide}`;
  }
  
  if (pageType === 'service') {
    const servicePrompts = {
      'ac-repair': 'Professional HVAC technician servicing outdoor AC condenser unit, diagnostic tools visible, residential setting, summer day in Texas',
      'heating-repair': 'Technician inspecting furnace system in clean utility room, professional tools, warm indoor lighting',
      'hvac-installation': 'New modern HVAC system being professionally installed, team of technicians, quality equipment',
      'ac-installation': 'Brand new AC condenser unit installation in progress, professional crew, Texas residential home',
      'heating-installation': 'Modern furnace installation in clean mechanical room, professional setup',
      'maintenance': 'Technician performing preventive maintenance on HVAC system, checklist and tools visible',
      'duct-cleaning': 'Professional duct cleaning equipment in use, clean air ducts visible, indoor setting',
      'duct-sealing': 'Technician sealing ductwork joints with professional materials, attic setting',
      'indoor-air-quality': 'Modern air purification system integrated with HVAC, clean home interior',
      'thermostat-installation': 'Smart thermostat being installed on wall, modern home interior, professional installation',
      'heat-pump-systems': 'Modern heat pump outdoor unit in residential setting, energy efficient system',
      'air-purification': 'Whole-house air purification system, clean modern home, healthy environment',
      'zoning-systems': 'Multi-zone HVAC control system, modern home with multiple thermostats',
      'commercial-hvac': 'Large commercial rooftop HVAC units on office building, professional service',
      'residential': 'Beautiful suburban home with well-maintained HVAC system, Texas architecture'
    };
    
    const prompt = servicePrompts[fileName] || `Professional HVAC service: ${title}. Modern equipment, technician at work, Texas setting`;
    return `${baseContext}${prompt}. ${styleGuide}`;
  }
  
  if (pageType === 'city-service') {
    const [city, service] = fileName.split('-').join(' ').split(' ');
    return `${baseContext}HVAC service in ${city} Texas area. Professional technician servicing ${service} equipment, local residential neighborhood visible in background, Texas architecture. ${styleGuide}`;
  }
  
  if (pageType === 'commercial') {
    const commercialPrompts = {
      'chiller-systems': 'Large commercial chiller system on rooftop, industrial HVAC equipment, professional maintenance',
      'emergency-service': '24/7 emergency HVAC service van at commercial building, night scene, urgent response',
      'new-installation': 'New commercial HVAC system installation, large rooftop units, professional crew',
      'office-hvac': 'Modern office building HVAC system, rooftop units, professional commercial setting',
      'preventive-maintenance': 'Scheduled maintenance on commercial HVAC, technician with checklist, rooftop scene',
      'restaurant-hvac': 'Restaurant kitchen ventilation and HVAC system, commercial kitchen, exhaust hoods',
      'retail-hvac': 'Retail store HVAC system, rooftop unit, shopping center setting',
      'rtu-replacement': 'Rooftop unit replacement in progress, crane lifting new unit, commercial building'
    };
    
    const prompt = commercialPrompts[fileName] || `Commercial HVAC: ${title}. Professional commercial equipment and service`;
    return `${baseContext}${prompt}. ${styleGuide}`;
  }
  
  if (pageType === 'utility') {
    const utilityPrompts = {
      'contact': 'Professional HVAC office reception area, friendly customer service desk, welcoming environment',
      'services': 'Array of HVAC services showcase, multiple system types, professional presentation',
      'privacy': 'Secure professional office environment, trustworthy business setting',
      'terms': 'Professional business office, contract signing area, corporate environment',
      'success': 'Happy customer with newly installed HVAC system, satisfaction and comfort',
      'sitemap': 'Organized HVAC service center, systematic layout, professional organization',
      'style-guide': 'Modern HVAC showroom with various system displays, clean professional space',
      '404': 'HVAC technician troubleshooting, finding solutions, helpful service'
    };
    
    const prompt = utilityPrompts[fileName] || `Professional HVAC business: ${title}`;
    return `${baseContext}${prompt}. ${styleGuide}`;
  }
  
  // Default prompt
  return `${baseContext}${description || title}. Professional HVAC service in North Texas, modern equipment, quality service. ${styleGuide}`;
}

// Generate and save OG image
async function generateOGImage(pageData, pageType, outputFileName) {
  console.log(`📸 Generating OG image: ${outputFileName}`);
  
  const prompt = generateContextualPrompt(pageData, pageType);
  
  try {
    const response = await client.images.generate({
      model: 'dall-e-3',
      prompt: prompt,
      size: '1792x1024', // Will be perfect for OG images (16:9 ratio)
      quality: 'hd',
      n: 1,
      response_format: 'b64_json'
    });
    
    const b64 = response.data[0].b64_json;
    const outputPath = path.join(__dirname, '..', 'public', 'og-images', outputFileName);
    
    // Ensure directory exists
    await fs.mkdir(path.dirname(outputPath), { recursive: true });
    
    await fs.writeFile(outputPath, Buffer.from(b64, 'base64'));
    console.log(`✅ Saved: ${outputFileName}`);
    
    return { success: true, fileName: outputFileName };
  } catch (error) {
    console.error(`❌ Failed to generate ${outputFileName}:`, error.message);
    return { success: false, fileName: outputFileName, error: error.message };
  }
}

// Process all pages
async function processAllPages() {
  console.log('🚀 Starting OG image generation for all pages...\n');
  
  const results = [];
  const batchSize = 3;
  let totalProcessed = 0;
  
  // Skip pages that already have custom OG images
  const skipPages = ['index.astro', 'about.astro']; // Homepage and About have Cloudinary images
  
  // 1. Process city pages
  console.log('📍 Processing city pages...');
  for (let i = 0; i < cities.length; i += batchSize) {
    const batch = cities.slice(i, Math.min(i + batchSize, cities.length));
    
    const batchPromises = batch.map(async (city) => {
      const filePath = path.join(__dirname, '..', 'src', 'pages', '[city].astro');
      const pageData = await extractPageContent(filePath);
      pageData.fileName = city;
      return generateOGImage(pageData, 'city', `${city}.jpg`);
    });
    
    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);
    totalProcessed += batch.length;
    
    if (i + batchSize < cities.length) {
      console.log('⏳ Waiting 2 seconds...');
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  
  // 2. Process service pages
  console.log('\n🔧 Processing service pages...');
  for (let i = 0; i < services.length; i += batchSize) {
    const batch = services.slice(i, Math.min(i + batchSize, services.length));
    
    const batchPromises = batch.map(async (service) => {
      const possiblePaths = [
        path.join(__dirname, '..', 'src', 'pages', 'services', `${service}.astro`),
        path.join(__dirname, '..', 'src', 'pages', 'services', '[service].astro')
      ];
      
      let pageData;
      for (const filePath of possiblePaths) {
        try {
          pageData = await extractPageContent(filePath);
          if (pageData.title) break;
        } catch (e) {
          continue;
        }
      }
      
      pageData.fileName = service;
      return generateOGImage(pageData, 'service', `services-${service}.jpg`);
    });
    
    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);
    totalProcessed += batch.length;
    
    if (i + batchSize < services.length) {
      console.log('⏳ Waiting 2 seconds...');
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  
  // 3. Process city + service combination pages (72 pages)
  console.log('\n🏙️ Processing city + service combination pages...');
  const cityServiceCombos = [];
  for (const city of cities) {
    for (const service of services.slice(0, 9)) { // Main 9 services for each city
      cityServiceCombos.push({ city, service });
    }
  }
  
  for (let i = 0; i < cityServiceCombos.length; i += batchSize) {
    const batch = cityServiceCombos.slice(i, Math.min(i + batchSize, cityServiceCombos.length));
    
    const batchPromises = batch.map(async ({ city, service }) => {
      const filePath = path.join(__dirname, '..', 'src', 'pages', '[city]', '[service].astro');
      const pageData = await extractPageContent(filePath);
      pageData.fileName = `${city}-${service}`;
      return generateOGImage(pageData, 'city-service', `${city}-${service}.jpg`);
    });
    
    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);
    totalProcessed += batch.length;
    
    console.log(`Progress: ${totalProcessed} images generated...`);
    
    if (i + batchSize < cityServiceCombos.length) {
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  
  // 4. Process commercial pages
  console.log('\n🏢 Processing commercial pages...');
  for (let i = 0; i < commercialPages.length; i += batchSize) {
    const batch = commercialPages.slice(i, Math.min(i + batchSize, commercialPages.length));
    
    const batchPromises = batch.map(async (page) => {
      const filePath = path.join(__dirname, '..', 'src', 'pages', 'commercial', `${page}.astro`);
      const pageData = await extractPageContent(filePath);
      pageData.fileName = page;
      return generateOGImage(pageData, 'commercial', `commercial-${page}.jpg`);
    });
    
    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);
    totalProcessed += batch.length;
    
    if (i + batchSize < commercialPages.length) {
      console.log('⏳ Waiting 2 seconds...');
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  
  // 5. Process utility pages
  console.log('\n📄 Processing utility pages...');
  for (let i = 0; i < utilityPages.length; i += batchSize) {
    const batch = utilityPages.slice(i, Math.min(i + batchSize, utilityPages.length));
    
    const batchPromises = batch.map(async (page) => {
      const filePath = path.join(__dirname, '..', 'src', 'pages', `${page}.astro`);
      const pageData = await extractPageContent(filePath);
      pageData.fileName = page;
      return generateOGImage(pageData, 'utility', `${page}.jpg`);
    });
    
    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);
    totalProcessed += batch.length;
    
    if (i + batchSize < utilityPages.length) {
      console.log('⏳ Waiting 2 seconds...');
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  
  // 6. Process special city pages (allen/ac-repair, etc.)
  console.log('\n🏘️ Processing special city pages...');
  const specialCityPages = [
    'allen/ac-repair',
    'frisco/ac-repair', 
    'mckinney/ac-repair',
    'plano/ac-repair'
  ];
  
  for (let i = 0; i < specialCityPages.length; i += batchSize) {
    const batch = specialCityPages.slice(i, Math.min(i + batchSize, specialCityPages.length));
    
    const batchPromises = batch.map(async (page) => {
      const filePath = path.join(__dirname, '..', 'src', 'pages', `${page}.astro`);
      const pageData = await extractPageContent(filePath);
      const fileName = page.replace('/', '-');
      pageData.fileName = fileName;
      return generateOGImage(pageData, 'city-service', `${fileName}.jpg`);
    });
    
    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);
    totalProcessed += batch.length;
    
    if (i + batchSize < specialCityPages.length) {
      console.log('⏳ Waiting 2 seconds...');
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  
  // Summary
  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  
  console.log('\n' + '='.repeat(50));
  console.log('📊 OG Image Generation Summary:');
  console.log(`✅ Successful: ${successful}/${results.length}`);
  console.log(`📁 Total pages processed: ${totalProcessed}`);
  if (failed > 0) {
    console.log(`❌ Failed: ${failed}`);
    console.log('\nFailed images:');
    results.filter(r => !r.success).forEach(r => {
      console.log(`  - ${r.fileName}: ${r.error}`);
    });
  }
  console.log('='.repeat(50));
  
  // Create manifest file for reference
  const manifest = {
    generated: new Date().toISOString(),
    total: results.length,
    successful,
    failed,
    images: results.map(r => ({
      file: r.fileName,
      success: r.success,
      error: r.error
    }))
  };
  
  await fs.writeFile(
    path.join(__dirname, '..', 'public', 'og-images', 'manifest.json'),
    JSON.stringify(manifest, null, 2)
  );
  
  console.log('\n📝 Manifest saved to /public/og-images/manifest.json');
}

// Run the script
processAllPages().catch(console.error);