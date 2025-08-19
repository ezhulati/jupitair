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

// Professional HVAC style prompt - more specific and professional
const PROFESSIONAL_HVAC_BASE = "Professional photorealistic corporate image, high-end commercial photography style, clean modern aesthetic, North Texas suburban setting, professional HVAC technician in uniform, modern equipment, blue and white corporate colors, no cartoonish elements, serious professional tone";

// Get all blog posts with their content for better context
async function getAllBlogPosts() {
  const blogDir = path.join(__dirname, 'src/content/blog');
  const files = await fs.readdir(blogDir);
  const posts = [];
  
  for (const file of files) {
    if (file.endsWith('.mdx')) {
      const slug = file.replace('.mdx', '');
      const content = await fs.readFile(path.join(blogDir, file), 'utf-8');
      
      // Extract title and description from frontmatter
      const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
      const frontmatter = frontmatterMatch ? frontmatterMatch[1] : '';
      
      const titleMatch = frontmatter.match(/title:\s*["'](.+?)["']/);
      const descMatch = frontmatter.match(/description:\s*["'](.+?)["']/);
      
      const title = titleMatch ? titleMatch[1] : slug.replace(/-/g, ' ');
      const description = descMatch ? descMatch[1] : '';
      
      posts.push({ slug, title, description, content });
    }
  }
  
  return posts;
}

// Create more professional, specific prompts
function createProfessionalPrompt(post) {
  const { slug, title, description } = post;
  
  let specificContext = '';
  const s = slug.toLowerCase();
  
  // Very specific professional contexts
  if (s.includes('ac-blowing-warm-air')) {
    specificContext = 'Professional HVAC technician in uniform testing indoor air temperature with digital thermometer, outdoor AC unit visible, suburban North Texas home, diagnostic equipment, serious professional service';
  } else if (s.includes('ac-leaking-water')) {
    specificContext = 'Professional HVAC technician inspecting AC drain line, water leak assessment, professional diagnostic tools, clean modern home interior, expert problem-solving';
  } else if (s.includes('ac-repair-cost')) {
    specificContext = 'Professional HVAC service truck, technician with clipboard writing estimate, modern North Texas home, professional consultation, clean uniform, trustworthy service';
  } else if (s.includes('furnace') && s.includes('repair')) {
    specificContext = 'Professional HVAC technician servicing modern gas furnace, proper safety equipment, clean utility room, professional diagnostic tools, expert maintenance';
  } else if (s.includes('heat-pump')) {
    specificContext = 'Modern heat pump outdoor unit, professional installation, North Texas suburban home, expert HVAC technician, high-quality equipment, professional service truck';
  } else if (s.includes('duct-cleaning')) {
    specificContext = 'Professional duct cleaning equipment, clean modern ductwork, HVAC technician in uniform, improved indoor air quality demonstration, professional service';
  } else if (s.includes('thermostat')) {
    specificContext = 'Modern smart thermostat installation, professional HVAC technician, clean wall mount, digital temperature control, energy efficiency, home comfort';
  } else if (s.includes('maintenance')) {
    specificContext = 'Professional HVAC maintenance service, technician with diagnostic tools, system tune-up, preventive care, clean modern equipment, expert service';
  } else if (s.includes('filter')) {
    specificContext = 'Professional air filter replacement, clean new HVAC filter, improved air quality, technician demonstration, modern HVAC system, professional service';
  } else if (s.includes('commercial') || s.includes('office')) {
    specificContext = 'Large commercial building, rooftop HVAC units, professional commercial technician, business environment, industrial HVAC equipment, expert commercial service';
  } else if (s.includes('city') || s.includes('plano') || s.includes('frisco') || s.includes('allen')) {
    const city = s.includes('plano') ? 'Plano' : s.includes('frisco') ? 'Frisco' : s.includes('allen') ? 'Allen' : 'North Texas';
    specificContext = `Professional HVAC service in ${city} Texas, suburban neighborhood, service truck, local expert technician, community-focused service, residential homes`;
  } else if (s.includes('emergency')) {
    specificContext = '24/7 emergency HVAC service, professional response truck, urgent repair situation, expert technician, reliable service, night or weekend service call';
  } else if (s.includes('installation')) {
    specificContext = 'Professional HVAC system installation, expert technicians, modern equipment, proper installation techniques, North Texas home, quality workmanship';
  } else if (s.includes('cost') || s.includes('pricing')) {
    specificContext = 'Professional consultation, HVAC estimate discussion, transparent pricing, trustworthy service representative, modern office or home setting, professional documentation';
  } else {
    // Generic professional HVAC context
    specificContext = 'Professional HVAC services, expert technician in clean uniform, modern equipment, North Texas suburban home, reliable service, quality workmanship';
  }
  
  return `${PROFESSIONAL_HVAC_BASE}, ${specificContext}, representing: ${title}`;
}

// Generate professional image
async function generateProfessionalImage(post) {
  try {
    const prompt = createProfessionalPrompt(post);
    console.log(`\n🔧 Regenerating: ${post.slug}`);
    console.log(`📝 Title: ${post.title}`);
    console.log(`🎨 Prompt: ${prompt.substring(0, 120)}...`);
    
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
    
    console.log(`✅ Successfully regenerated: ${post.slug}.jpg`);
    
    return { success: true, slug: post.slug };
    
  } catch (error) {
    console.error(`❌ Error regenerating ${post.slug}:`, error.message);
    return { success: false, slug: post.slug, error: error.message };
  }
}

// Potentially problematic images that commonly get silly results
const LIKELY_PROBLEMATIC_SLUGS = [
  // Technical topics that might get cartoon-like results
  'ac-smells-from-vents',
  'gas-smell-steps',
  'frozen-evaporator-coil',
  'frozen-coil-emergency-steps',
  'noisy-ac-sounds-and-causes',
  'dust-issues-real-causes',
  'co-safety-basics',
  
  // Abstract concepts that might get weird visuals
  'manual-j-plain-english',
  'seer2-texas-guide',
  'merv-ratings-explained',
  'static-pressure-comfort',
  'bill-impact-calculator-explainer',
  
  // Topics that might get unprofessional results
  'thermostat-says-cooling-not-cooling',
  'no-cooling-today-checklist',
  'outdoor-unit-wont-start',
  'furnace-not-igniting'
];

// Main execution function
async function reviewAndFixImages() {
  console.log('🔍 Starting professional image review and regeneration...\n');
  console.log('🎯 Focusing on images that commonly have quality issues\n');
  
  const allPosts = await getAllBlogPosts();
  const results = {
    regenerated: [],
    errors: [],
    total: 0
  };
  
  // Focus on likely problematic images first
  const postsToRegenerate = allPosts.filter(post => 
    LIKELY_PROBLEMATIC_SLUGS.includes(post.slug)
  );
  
  console.log(`📊 Found ${postsToRegenerate.length} potentially problematic images to regenerate`);
  console.log('🚀 Starting regeneration...\n');
  
  for (const post of postsToRegenerate) {
    const result = await generateProfessionalImage(post);
    
    if (result.success) {
      results.regenerated.push(result.slug);
    } else {
      results.errors.push({ slug: result.slug, error: result.error });
    }
    
    results.total++;
    
    // Rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  // Save results
  await fs.writeFile(
    path.join(__dirname, 'image-regeneration-report.json'),
    JSON.stringify(results, null, 2)
  );
  
  console.log('\n🎉 REGENERATION COMPLETE!');
  console.log(`📊 Total processed: ${results.total}`);
  console.log(`✅ Successfully regenerated: ${results.regenerated.length}`);
  console.log(`❌ Errors: ${results.errors.length}`);
  
  if (results.regenerated.length > 0) {
    console.log('\n✨ Regenerated images:');
    results.regenerated.forEach(slug => console.log(`   - ${slug}`));
  }
  
  if (results.errors.length > 0) {
    console.log('\n⚠️  Errors:');
    results.errors.forEach(err => console.log(`   - ${err.slug}: ${err.error}`));
  }
  
  console.log('\n📄 Full report saved to: image-regeneration-report.json');
}

// Manual list mode - specify exact slugs to regenerate
async function regenerateSpecificImages(slugList) {
  console.log('🎯 Regenerating specific images...\n');
  
  const allPosts = await getAllBlogPosts();
  const postsToRegenerate = allPosts.filter(post => slugList.includes(post.slug));
  
  const results = { regenerated: [], errors: [] };
  
  for (const post of postsToRegenerate) {
    const result = await generateProfessionalImage(post);
    
    if (result.success) {
      results.regenerated.push(result.slug);
    } else {
      results.errors.push({ slug: result.slug, error: result.error });
    }
    
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  return results;
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  // Check if specific slugs provided via command line
  const specificSlugs = process.argv.slice(2);
  
  if (specificSlugs.length > 0) {
    console.log(`🎯 Regenerating specific images: ${specificSlugs.join(', ')}`);
    regenerateSpecificImages(specificSlugs);
  } else {
    reviewAndFixImages();
  }
}

export { reviewAndFixImages, regenerateSpecificImages };
