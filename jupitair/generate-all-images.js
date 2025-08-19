#!/usr/bin/env node

import OpenAI from 'openai';
import { v2 as cloudinary } from 'cloudinary';
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

// Initialize Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// HVAC-related style prompt for consistency
const HVAC_STYLE_BASE = "Professional photorealistic image, high quality, clean modern aesthetic, North Texas setting, blue and white color scheme consistent with HVAC branding";

// Get all blog posts
async function getBlogPosts() {
  const blogDir = path.join(__dirname, 'src/content/blog');
  const files = await fs.readdir(blogDir);
  return files.filter(file => file.endsWith('.mdx')).map(file => ({
    slug: file.replace('.mdx', ''),
    path: path.join(blogDir, file)
  }));
}

// Get all page routes for featured images
async function getAllPageRoutes() {
  const routes = [
    // Main pages
    { slug: 'home', title: 'Jupitair HVAC - Premier HVAC Services in North Texas', description: 'Professional HVAC services including AC repair, installation, and maintenance' },
    { slug: 'about', title: 'About Jupitair HVAC', description: 'Professional HVAC company serving North Texas with expert technicians' },
    { slug: 'contact', title: 'Contact Jupitair HVAC', description: 'Get in touch with North Texas premier HVAC service provider' },
    { slug: 'services', title: 'HVAC Services', description: 'Comprehensive HVAC services including repair, installation, maintenance' },
    
    // Service pages
    { slug: 'ac-repair', title: 'AC Repair Services', description: 'Expert air conditioning repair services in North Texas' },
    { slug: 'ac-installation', title: 'AC Installation', description: 'Professional air conditioning system installation' },
    { slug: 'heating-repair', title: 'Heating Repair', description: 'Furnace and heating system repair services' },
    { slug: 'heating-installation', title: 'Heating Installation', description: 'New heating system installation services' },
    { slug: 'heat-pump-systems', title: 'Heat Pump Systems', description: 'Heat pump installation and repair services' },
    { slug: 'duct-cleaning', title: 'Duct Cleaning', description: 'Professional air duct cleaning services' },
    { slug: 'duct-sealing', title: 'Duct Sealing', description: 'Expert duct sealing for improved efficiency' },
    { slug: 'air-purification', title: 'Air Purification', description: 'Indoor air quality and purification systems' },
    { slug: 'commercial-hvac', title: 'Commercial HVAC', description: 'Commercial HVAC services for businesses' },
    
    // Commercial pages
    { slug: 'commercial', title: 'Commercial HVAC Services', description: 'Professional commercial HVAC solutions' },
    { slug: 'office-hvac', title: 'Office HVAC', description: 'HVAC services for office buildings' },
    { slug: 'retail-hvac', title: 'Retail HVAC', description: 'HVAC solutions for retail spaces' },
    { slug: 'restaurant-hvac', title: 'Restaurant HVAC', description: 'Specialized HVAC for restaurants' },
    { slug: 'chiller-systems', title: 'Chiller Systems', description: 'Commercial chiller system services' },
    { slug: 'rtu-replacement', title: 'RTU Replacement', description: 'Rooftop unit replacement services' },
    { slug: 'preventive-maintenance', title: 'Preventive Maintenance', description: 'Commercial HVAC preventive maintenance' },
    { slug: 'emergency-service', title: 'Emergency HVAC Service', description: '24/7 emergency commercial HVAC service' },
    
    // City pages
    { slug: 'plano-hvac', title: 'Plano HVAC Services', description: 'Professional HVAC services in Plano, Texas' },
    { slug: 'frisco-hvac', title: 'Frisco HVAC Services', description: 'Expert HVAC services in Frisco, Texas' },
    { slug: 'allen-hvac', title: 'Allen HVAC Services', description: 'Reliable HVAC services in Allen, Texas' },
    { slug: 'mckinney-hvac', title: 'McKinney HVAC Services', description: 'Professional HVAC services in McKinney, Texas' },
    { slug: 'prosper-hvac', title: 'Prosper HVAC Services', description: 'Expert HVAC services in Prosper, Texas' },
    { slug: 'addison-hvac', title: 'Addison HVAC Services', description: 'Professional HVAC services in Addison, Texas' },
    { slug: 'little-elm-hvac', title: 'Little Elm HVAC Services', description: 'Reliable HVAC services in Little Elm, Texas' },
    { slug: 'the-colony-hvac', title: 'The Colony HVAC Services', description: 'Expert HVAC services in The Colony, Texas' }
  ];
  
  return routes;
}

// Extract blog content and create prompt
async function createBlogPrompt(blogPost) {
  try {
    const content = await fs.readFile(blogPost.path, 'utf-8');
    
    // Extract title and description from frontmatter
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
    const frontmatter = frontmatterMatch ? frontmatterMatch[1] : '';
    
    const titleMatch = frontmatter.match(/title:\s*["'](.+)["']/);
    const descMatch = frontmatter.match(/description:\s*["'](.+)["']/);
    
    const title = titleMatch ? titleMatch[1] : blogPost.slug.replace(/-/g, ' ');
    const description = descMatch ? descMatch[1] : '';
    
    // Create contextual prompt based on blog topic
    let contextPrompt = '';
    const slug = blogPost.slug.toLowerCase();
    
    if (slug.includes('ac') || slug.includes('cooling')) {
      contextPrompt = 'Modern air conditioning system, outdoor unit, technician working, North Texas suburban home, professional HVAC service';
    } else if (slug.includes('heat') || slug.includes('furnace')) {
      contextPrompt = 'Modern heating system, furnace installation, warm comfortable home interior, professional HVAC technician';
    } else if (slug.includes('duct')) {
      contextPrompt = 'Clean air ducts, ductwork system, professional duct cleaning, improved indoor air quality';
    } else if (slug.includes('maintenance')) {
      contextPrompt = 'HVAC maintenance, professional technician with tools, system tune-up, preventive service';
    } else if (slug.includes('repair')) {
      contextPrompt = 'HVAC repair service, skilled technician diagnosing system, professional tools, problem-solving';
    } else if (slug.includes('filter')) {
      contextPrompt = 'Clean HVAC air filters, filter replacement, improved air quality, maintenance service';
    } else if (slug.includes('thermostat')) {
      contextPrompt = 'Modern smart thermostat, digital temperature control, energy efficiency, home comfort';
    } else if (slug.includes('commercial') || slug.includes('office') || slug.includes('retail')) {
      contextPrompt = 'Commercial HVAC system, large building, rooftop units, professional commercial service';
    } else {
      contextPrompt = 'Professional HVAC services, modern equipment, skilled technician, North Texas home';
    }
    
    return `${HVAC_STYLE_BASE}, ${contextPrompt}, related to: ${title}`;
  } catch (error) {
    console.error(`Error reading blog post ${blogPost.slug}:`, error);
    return `${HVAC_STYLE_BASE}, professional HVAC services, modern equipment`;
  }
}

// Create page-specific prompt
function createPagePrompt(page) {
  let contextPrompt = '';
  const slug = page.slug.toLowerCase();
  
  if (slug === 'home') {
    contextPrompt = 'Modern North Texas home with HVAC system, professional service truck, happy family, comfortable indoor environment';
  } else if (slug === 'about') {
    contextPrompt = 'Professional HVAC technicians, company trucks, team photo, North Texas office building, expertise and reliability';
  } else if (slug === 'contact') {
    contextPrompt = 'Professional customer service, phone consultation, HVAC office, friendly staff, North Texas location';
  } else if (slug.includes('commercial')) {
    contextPrompt = 'Large commercial building, rooftop HVAC units, professional technicians, business environment';
  } else if (slug.includes('ac') || slug.includes('cooling')) {
    contextPrompt = 'Modern air conditioning installation, outdoor condenser unit, cool comfortable home, professional service';
  } else if (slug.includes('heat') || slug.includes('furnace')) {
    contextPrompt = 'Modern heating system, warm cozy home interior, furnace installation, winter comfort';
  } else if (slug.includes('duct')) {
    contextPrompt = 'Clean ductwork system, professional duct service, improved air quality, modern home interior';
  } else if (slug.includes('emergency')) {
    contextPrompt = '24/7 emergency service, service truck at night, urgent HVAC repair, professional response';
  } else if (slug.includes('-hvac') || slug.includes('plano') || slug.includes('frisco')) {
    const city = slug.split('-')[0] || slug;
    contextPrompt = `${city.charAt(0).toUpperCase() + city.slice(1)} Texas neighborhood, suburban homes, HVAC service truck, local professional service`;
  } else {
    contextPrompt = 'Professional HVAC services, modern equipment, North Texas setting, expert technicians';
  }
  
  return `${HVAC_STYLE_BASE}, ${contextPrompt}, representing: ${page.title}`;
}

// Generate image with OpenAI DALL-E
async function generateImage(prompt, filename) {
  try {
    console.log(`Generating image for ${filename}...`);
    console.log(`Prompt: ${prompt.substring(0, 100)}...`);
    
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      size: "1792x1024", // Wide format good for featured images
      quality: "hd",
      n: 1,
    });

    const imageUrl = response.data[0].url;
    
    // Download and save to assets folder
    const imageResponse = await fetch(imageUrl);
    const imageBuffer = await imageResponse.arrayBuffer();
    const buffer = Buffer.from(imageBuffer);
    
    // Save to assets directory
    const assetsPath = path.join(__dirname, 'assets', filename);
    await fs.writeFile(assetsPath, buffer);
    
    console.log(`✅ Generated and saved locally: ${filename}`);
    
    // For now, use local path as the URL (can be updated with Cloudinary later)
    const localUrl = `/assets/${filename}`;
    
    return {
      localPath: assetsPath,
      cloudinaryUrl: localUrl, // Using local path for now
      publicId: filename.replace('.png', '')
    };
    
  } catch (error) {
    console.error(`❌ Error generating image for ${filename}:`, error);
    return null;
  }
}

// Main execution function
async function generateAllImages() {
  console.log('🚀 Starting comprehensive image generation...\n');
  
  // Ensure assets directory exists
  const assetsDir = path.join(__dirname, 'assets');
  await fs.mkdir(assetsDir, { recursive: true });
  
  const results = {
    blogImages: [],
    pageImages: [],
    errors: []
  };
  
  try {
    // Generate blog images
    console.log('📝 Generating blog post images...\n');
    const blogPosts = await getBlogPosts();
    
    for (const post of blogPosts) {
      const prompt = await createBlogPrompt(post);
      const filename = `blog-${post.slug}.png`;
      
      const result = await generateImage(prompt, filename);
      if (result) {
        results.blogImages.push({
          slug: post.slug,
          ...result
        });
      } else {
        results.errors.push(`Failed to generate image for blog: ${post.slug}`);
      }
      
      // Rate limiting - wait 1 second between requests
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    // Generate page featured images
    console.log('\n🏠 Generating page featured images...\n');
    const pages = await getAllPageRoutes();
    
    for (const page of pages) {
      const prompt = createPagePrompt(page);
      const filename = `featured-${page.slug}.png`;
      
      const result = await generateImage(prompt, filename);
      if (result) {
        results.pageImages.push({
          slug: page.slug,
          title: page.title,
          ...result
        });
      } else {
        results.errors.push(`Failed to generate image for page: ${page.slug}`);
      }
      
      // Rate limiting - wait 1 second between requests
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    // Save results to JSON for reference
    await fs.writeFile(
      path.join(__dirname, 'generated-images-log.json'), 
      JSON.stringify(results, null, 2)
    );
    
    console.log('\n✅ Image generation complete!');
    console.log(`📊 Generated ${results.blogImages.length} blog images`);
    console.log(`📊 Generated ${results.pageImages.length} page images`);
    if (results.errors.length > 0) {
      console.log(`⚠️  ${results.errors.length} errors occurred`);
    }
    
  } catch (error) {
    console.error('❌ Fatal error during image generation:', error);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  generateAllImages();
}

export { generateAllImages };
