import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface OGImageConfig {
  title: string;
  description?: string;
  service?: string;
  city?: string;
  slug: string;
  regenerate?: boolean;
}

/**
 * Generate a professional prompt for HVAC service images
 */
function generateImagePrompt(config: OGImageConfig): string {
  const { title, service, city, description } = config;
  
  let prompt = "Professional, photorealistic image for HVAC company website. ";
  
  if (service && service.includes('ac-repair')) {
    prompt += "Modern air conditioning unit being serviced by a professional technician in clean uniform. Bright, clean, professional setting. ";
  } else if (service && service.includes('heating')) {
    prompt += "Modern furnace or heating system in a clean residential setting, warm lighting, professional installation. ";
  } else if (service && service.includes('installation')) {
    prompt += "Brand new HVAC system installation, professional technicians at work, modern equipment, clean job site. ";
  } else if (service && service.includes('duct')) {
    prompt += "Clean air ducts, ventilation system, improved air flow visualization, professional ductwork. ";
  } else if (service && service.includes('emergency')) {
    prompt += "24/7 emergency HVAC service, service van at night, professional technician with tools, urgent response. ";
  } else if (service && service.includes('commercial')) {
    prompt += "Large commercial HVAC rooftop units, modern office building, professional commercial installation. ";
  } else if (service && service.includes('maintenance')) {
    prompt += "HVAC maintenance inspection, technician checking system with diagnostic tools, preventive care. ";
  } else if (city) {
    prompt += `Residential North Texas home with HVAC service van, ${city} suburban setting, professional service. `;
  } else {
    prompt += "Modern HVAC systems, professional installation, North Texas home, service technician, clean and professional. ";
  }
  
  prompt += "High quality, professional photography style, good lighting, sharp focus. No text or logos in image.";
  
  return prompt;
}

/**
 * Download image from URL and save locally
 */
async function downloadImage(url: string, filepath: string): Promise<void> {
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  
  // Ensure directory exists
  const dir = path.dirname(filepath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  // Optimize image for web
  await sharp(buffer)
    .resize(1200, 630, { // Standard OG image size
      fit: 'cover',
      position: 'center'
    })
    .jpeg({ quality: 85 })
    .toFile(filepath);
}

/**
 * Generate or retrieve OpenGraph image for a page
 */
export async function generateOGImage(config: OGImageConfig): Promise<string> {
  const { slug, regenerate = false } = config;
  
  // Define image path
  const imagePath = `/og-images/${slug}.jpg`;
  const fullPath = path.join(process.cwd(), 'public', imagePath);
  
  // Check if image already exists
  if (fs.existsSync(fullPath) && !regenerate) {
    console.log(`✓ OG image already exists: ${imagePath}`);
    return imagePath;
  }
  
  // Skip generation if no API key
  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY.includes('[ADD_YOUR_KEY_HERE]')) {
    console.warn('⚠️  OpenAI API key not configured. Using fallback image.');
    return '/images/og-default.jpg';
  }
  
  try {
    console.log(`🎨 Generating OG image for: ${slug}`);
    
    // Generate prompt
    const prompt = generateImagePrompt(config);
    
    // Generate image with DALL-E
    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt: prompt,
      n: 1,
      size: '1792x1024',
      quality: 'standard',
      style: 'natural',
    });
    
    const imageUrl = response.data[0]?.url;
    if (!imageUrl) {
      throw new Error('No image URL returned from OpenAI');
    }
    
    // Download and save image
    await downloadImage(imageUrl, fullPath);
    
    console.log(`✅ OG image generated and saved: ${imagePath}`);
    return imagePath;
    
  } catch (error) {
    console.error(`❌ Error generating OG image for ${slug}:`, error);
    
    // Return fallback image
    return '/images/og-default.jpg';
  }
}

/**
 * Generate OG images for all pages during build
 */
export async function generateAllOGImages() {
  // Skip if API key not configured
  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY.includes('[ADD_YOUR_KEY_HERE]')) {
    console.log('⏭️  Skipping OG image generation (API key not configured)');
    return;
  }
  
  const pages = [
    // Homepage
    { title: 'Jupitair HVAC - North Texas Premier HVAC Solutions', slug: 'home' },
    
    // Service pages
    { title: 'AC Repair Services', service: 'ac-repair', slug: 'services-ac-repair' },
    { title: 'Heating Repair Services', service: 'heating-repair', slug: 'services-heating-repair' },
    { title: 'HVAC Installation', service: 'hvac-installation', slug: 'services-hvac-installation' },
    { title: 'Duct Cleaning Services', service: 'duct-cleaning', slug: 'services-duct-cleaning' },
    { title: '24/7 Emergency HVAC', service: 'emergency-hvac', slug: 'services-emergency-hvac' },
    { title: 'Commercial HVAC Services', service: 'commercial-hvac', slug: 'services-commercial-hvac' },
    { title: 'HVAC Maintenance', service: 'maintenance', slug: 'services-maintenance' },
    
    // City pages
    { title: 'HVAC Services in Frisco, TX', city: 'Frisco', slug: 'frisco' },
    { title: 'HVAC Services in Plano, TX', city: 'Plano', slug: 'plano' },
    { title: 'HVAC Services in McKinney, TX', city: 'McKinney', slug: 'mckinney' },
    { title: 'HVAC Services in Allen, TX', city: 'Allen', slug: 'allen' },
    { title: 'HVAC Services in The Colony, TX', city: 'The Colony', slug: 'the-colony' },
    { title: 'HVAC Services in Little Elm, TX', city: 'Little Elm', slug: 'little-elm' },
    { title: 'HVAC Services in Prosper, TX', city: 'Prosper', slug: 'prosper' },
    { title: 'HVAC Services in Addison, TX', city: 'Addison', slug: 'addison' },
  ];
  
  console.log(`🎨 Generating OG images for ${pages.length} pages...`);
  
  // Process in batches to respect rate limits
  const batchSize = 3;
  for (let i = 0; i < pages.length; i += batchSize) {
    const batch = pages.slice(i, i + batchSize);
    
    await Promise.all(
      batch.map(page => generateOGImage(page))
    );
    
    // Wait between batches to respect rate limits
    if (i + batchSize < pages.length) {
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  
  console.log('✅ OG image generation complete!');
}