#!/usr/bin/env node

import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { v2 as cloudinary } from 'cloudinary';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure Cloudinary
if (process.env.CLOUDINARY_URL) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

// Page configurations for OG image generation
const pages = [
  // Homepage
  { 
    title: 'Jupitair HVAC - Premier HVAC Services in North Texas', 
    subtitle: 'North Texas Premier HVAC Solutions',
    description: 'Professional heating and cooling services with same-day response',
    slug: 'home',
    type: 'homepage'
  },
  
  // Service pages
  { 
    title: 'AC Repair Services in North Texas', 
    subtitle: 'Expert AC Repair',
    description: 'Fast, reliable air conditioning repair with same-day service',
    slug: 'services-ac-repair',
    type: 'service',
    service: 'ac-repair'
  },
  { 
    title: 'Emergency AC Repair - 24/7 Service', 
    subtitle: 'Emergency AC Repair',
    description: '24/7 emergency air conditioning repair throughout North Texas',
    slug: 'services-emergency-ac-repair',
    type: 'service',
    service: 'emergency-ac-repair'
  },
  { 
    title: 'AC Installation Services', 
    subtitle: 'Professional AC Installation',
    description: 'Energy-efficient air conditioning installation with warranty',
    slug: 'services-ac-installation',
    type: 'service',
    service: 'ac-installation'
  },
  { 
    title: 'Heating Repair Services', 
    subtitle: 'Expert Heating Repair',
    description: 'Professional furnace and heat pump repair services',
    slug: 'services-heating-repair',
    type: 'service',
    service: 'heating-repair'
  },
  { 
    title: 'HVAC Installation North Texas', 
    subtitle: 'Complete HVAC Installation',
    description: 'Professional HVAC system installation and replacement',
    slug: 'services-hvac-installation',
    type: 'service',
    service: 'hvac-installation'
  },
  { 
    title: 'Duct Cleaning Services', 
    subtitle: 'Professional Duct Cleaning',
    description: 'Improve air quality with professional duct cleaning',
    slug: 'services-duct-cleaning',
    type: 'service',
    service: 'duct-cleaning'
  },
  
  // City pages
  { 
    title: 'HVAC Services in Frisco, TX', 
    subtitle: 'Frisco HVAC Services',
    description: 'Professional HVAC services in Frisco, Texas',
    slug: 'frisco',
    type: 'city',
    city: 'Frisco'
  },
  { 
    title: 'HVAC Services in Plano, TX', 
    subtitle: 'Plano HVAC Services',
    description: 'Professional HVAC services in Plano, Texas',
    slug: 'plano',
    type: 'city',
    city: 'Plano'
  },
  { 
    title: 'HVAC Services in McKinney, TX', 
    subtitle: 'McKinney HVAC Services',
    description: 'Professional HVAC services in McKinney, Texas',
    slug: 'mckinney',
    type: 'city',
    city: 'McKinney'
  },
  { 
    title: 'HVAC Services in Allen, TX', 
    subtitle: 'Allen HVAC Services',
    description: 'Professional HVAC services in Allen, Texas',
    slug: 'allen',
    type: 'city',
    city: 'Allen'
  },
  { 
    title: 'HVAC Services in Prosper, TX', 
    subtitle: 'Prosper HVAC Services',
    description: 'Professional HVAC services in Prosper, Texas',
    slug: 'prosper',
    type: 'city',
    city: 'Prosper'
  },
  { 
    title: 'HVAC Services in The Colony, TX', 
    subtitle: 'The Colony HVAC Services',
    description: 'Professional HVAC services in The Colony, Texas',
    slug: 'the-colony',
    type: 'city',
    city: 'The Colony'
  },
  { 
    title: 'HVAC Services in Little Elm, TX', 
    subtitle: 'Little Elm HVAC Services',
    description: 'Professional HVAC services in Little Elm, Texas',
    slug: 'little-elm',
    type: 'city',
    city: 'Little Elm'
  },
  { 
    title: 'HVAC Services in Addison, TX', 
    subtitle: 'Addison HVAC Services',
    description: 'Professional HVAC services in Addison, Texas',
    slug: 'addison',
    type: 'city',
    city: 'Addison'
  }
];

async function generateCloudinaryOGImage(config) {
  const { title, subtitle, description, slug, type } = config;
  
  try {
    console.log(`🎨 Generating Cloudinary OG image for: ${slug}`);
    
    // Create a text overlay transformation
    const transformation = {
      width: 1200,
      height: 630,
      crop: 'fill',
      background: 'auto:predominant',
      overlay: {
        text: {
          text: subtitle || title,
          font_family: 'Arial',
          font_size: 48,
          font_weight: 'bold',
          color: 'white'
        }
      },
      gravity: 'center',
      y: -50
    };
    
    // Add subtitle overlay if available
    if (subtitle && description) {
      transformation.overlay = [
        {
          text: {
            text: subtitle,
            font_family: 'Arial',
            font_size: 52,
            font_weight: 'bold',
            color: 'white'
          },
          gravity: 'center',
          y: -80
        },
        {
          text: {
            text: description,
            font_family: 'Arial',
            font_size: 28,
            color: 'white'
          },
          gravity: 'center',
          y: 40
        }
      ];
    }
    
    // Generate a gradient background based on type
    let backgroundGradient = 'linear_gradient:45deg:blue:cyan';
    if (type === 'service') {
      backgroundGradient = 'linear_gradient:45deg:blue:darkblue';
    } else if (type === 'city') {
      backgroundGradient = 'linear_gradient:45deg:green:darkgreen';
    }
    
    const imageUrl = cloudinary.url(`og-background-${type}`, {
      ...transformation,
      background: backgroundGradient,
      format: 'jpg',
      quality: 'auto'
    });
    
    console.log(`✅ Generated Cloudinary OG image: ${imageUrl}`);
    return imageUrl;
    
  } catch (error) {
    console.error(`❌ Error generating Cloudinary image for ${slug}:`, error);
    return null;
  }
}

async function createSimpleFallbackImages() {
  const ogDir = path.join(__dirname, '..', 'public', 'og-images');
  const imagesDir = path.join(__dirname, '..', 'public', 'images');
  
  // Create directories
  if (!fs.existsSync(ogDir)) {
    fs.mkdirSync(ogDir, { recursive: true });
  }
  if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
  }
  
  // Create a simple HTML file for each page that can be used as fallback
  for (const page of pages) {
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body {
      margin: 0;
      width: 1200px;
      height: 630px;
      background: linear-gradient(135deg, #0066CC 0%, #004499 100%);
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      font-family: 'Arial', sans-serif;
      color: white;
      text-align: center;
      padding: 40px;
      box-sizing: border-box;
    }
    .title {
      font-size: 48px;
      font-weight: bold;
      margin-bottom: 20px;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
    }
    .subtitle {
      font-size: 28px;
      margin-bottom: 30px;
      opacity: 0.9;
    }
    .logo {
      position: absolute;
      top: 40px;
      left: 40px;
      font-size: 24px;
      font-weight: bold;
    }
    .badge {
      position: absolute;
      bottom: 40px;
      right: 40px;
      background: rgba(255,255,255,0.2);
      padding: 10px 20px;
      border-radius: 25px;
      font-size: 18px;
    }
  </style>
</head>
<body>
  <div class="logo">Jupitair HVAC</div>
  <div class="title">${page.subtitle || page.title}</div>
  <div class="subtitle">${page.description}</div>
  <div class="badge">North Texas • Licensed & Insured</div>
</body>
</html>`;
    
    const htmlPath = path.join(ogDir, `${page.slug}.html`);
    fs.writeFileSync(htmlPath, htmlContent);
  }
  
  console.log('✅ Created fallback HTML templates for OG images');
}

async function main() {
  console.log('🚀 Starting Featured Image & OpenGraph generation...\n');
  
  // Create necessary directories
  const ogDir = path.join(__dirname, '..', 'public', 'og-images');
  const imagesDir = path.join(__dirname, '..', 'public', 'images');
  
  if (!fs.existsSync(ogDir)) {
    fs.mkdirSync(ogDir, { recursive: true });
  }
  if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
  }
  
  // Check if Cloudinary is configured
  const hasCloudinary = process.env.CLOUDINARY_CLOUD_NAME && 
                       process.env.CLOUDINARY_API_KEY && 
                       process.env.CLOUDINARY_API_SECRET;
  
  if (hasCloudinary) {
    console.log('🌤️  Cloudinary configured - generating dynamic OG images');
    
    try {
      const imagePromises = pages.map(page => generateCloudinaryOGImage(page));
      const results = await Promise.all(imagePromises);
      
      // Create a manifest file with image URLs
      const manifest = {};
      pages.forEach((page, index) => {
        if (results[index]) {
          manifest[page.slug] = results[index];
        }
      });
      
      const manifestPath = path.join(ogDir, 'manifest.json');
      fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
      
      console.log('✅ Generated Cloudinary OG images and manifest');
      
    } catch (error) {
      console.error('❌ Error with Cloudinary generation:', error);
      console.log('📌 Falling back to HTML templates');
      await createSimpleFallbackImages();
    }
    
  } else {
    console.log('⚠️  Cloudinary not configured - creating fallback images');
    await createSimpleFallbackImages();
  }
  
  console.log('\n✨ Featured image generation complete!');
  console.log('📁 Images available in: public/og-images/');
  console.log('🔗 These will be used for social media previews.\n');
}

// Run the script
main().catch((error) => {
  console.error('❌ Script failed:', error);
  // Don't exit with error - just log and continue
  console.log('📌 Continuing build with fallback approach.\n');
});