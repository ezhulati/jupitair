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

async function generateSpecificImage() {
  try {
    const prompt = 'Professional photorealistic corporate image, high-end commercial photography, clean modern aesthetic, Professional HVAC technician servicing indoor evaporator coil unit with visible frost/ice buildup, modern utility room, diagnostic equipment, expert maintenance, clean professional appearance, detailed view of coil fins, blue and white corporate colors, serious professional tone, no cartoonish elements';
    
    console.log(`🔧 Generating: frozen-evaporator-coil-detailed.jpg`);
    console.log(`🎨 Using prompt: ${prompt.substring(0, 120)}...`);
    
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      size: "1792x1024",
      quality: "hd",
      n: 1,
    });

    const imageUrl = response.data[0].url;
    
    // Download and save
    const imageResponse = await fetch(imageUrl);
    const imageBuffer = await imageResponse.arrayBuffer();
    const buffer = Buffer.from(imageBuffer);
    
    // Save to correct location with the exact filename the blog expects
    const imagePath = path.join(__dirname, 'public/images/blog', 'frozen-evaporator-coil-detailed.jpg');
    await fs.writeFile(imagePath, buffer);
    
    console.log(`✅ Successfully generated: frozen-evaporator-coil-detailed.jpg`);
    console.log(`📁 Saved to: ${imagePath}`);
    
    return true;
    
  } catch (error) {
    console.error(`❌ Error generating image:`, error.message);
    return false;
  }
}

generateSpecificImage();
