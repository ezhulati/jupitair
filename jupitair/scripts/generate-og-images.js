#!/usr/bin/env node

import 'dotenv/config';
import { generateAllOGImages } from '../src/lib/og-image-generator.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  console.log('🚀 Starting OpenGraph image generation...\n');
  
  // Check for API key
  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY.includes('[ADD_YOUR_KEY_HERE]')) {
    console.log('⚠️  WARNING: OpenAI API key not configured!');
    console.log('📝 Add your OpenAI API key to .env file:');
    console.log('   OPENAI_API_KEY=sk-your-actual-key-here\n');
    console.log('📌 Using fallback images for now.\n');
    
    // Create fallback image directory
    const ogDir = path.join(__dirname, '..', 'public', 'og-images');
    if (!fs.existsSync(ogDir)) {
      fs.mkdirSync(ogDir, { recursive: true });
    }
    
    // Create a placeholder message for fallback
    const fallbackPath = path.join(__dirname, '..', 'public', 'images', 'og-default.jpg');
    const fallbackDir = path.dirname(fallbackPath);
    
    if (!fs.existsSync(fallbackDir)) {
      fs.mkdirSync(fallbackDir, { recursive: true });
    }
    
    console.log('✅ Fallback structure created.\n');
    console.log('To generate real images:');
    console.log('1. Get an OpenAI API key from https://platform.openai.com/api-keys');
    console.log('2. Add it to your .env file');
    console.log('3. Run: npm run generate-images\n');
    
    return;
  }
  
  try {
    // Generate all OG images
    await generateAllOGImages();
    
    console.log('\n✨ All OpenGraph images generated successfully!');
    console.log('📁 Images saved to: public/og-images/');
    console.log('🔗 These will be used for social media previews.\n');
    
  } catch (error) {
    console.error('❌ Error during image generation:', error);
    process.exit(1);
  }
}

// Run the script
main().catch(console.error);