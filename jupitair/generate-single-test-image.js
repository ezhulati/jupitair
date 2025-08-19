#!/usr/bin/env node

import OpenAI from 'openai';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

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

async function generateSingleTestImage() {
  try {
    console.log('🚀 Starting single test image generation...');
    
    // Create assets directory
    const assetsDir = path.join(__dirname, 'assets');
    await fs.mkdir(assetsDir, { recursive: true });
    console.log('✅ Assets directory created');
    
    const prompt = "Professional photorealistic image, high quality, clean modern aesthetic, North Texas setting, blue and white color scheme consistent with HVAC branding, Modern air conditioning system, outdoor unit, technician working, North Texas suburban home, professional HVAC service, related to: AC Repair Services";
    const filename = 'test-blog-ac-repair.png';
    
    console.log('📝 Generating image with prompt:', prompt.substring(0, 100) + '...');
    
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      size: "1792x1024",
      quality: "hd",
      n: 1,
    });

    console.log('✅ Image generated successfully!');
    const imageUrl = response.data[0].url;
    console.log('🔗 Image URL:', imageUrl);
    
    // Download image
    console.log('⬇️  Downloading image...');
    const imageResponse = await fetch(imageUrl);
    const imageBuffer = await imageResponse.arrayBuffer();
    const buffer = Buffer.from(imageBuffer);
    
    // Save locally
    const assetsPath = path.join(assetsDir, filename);
    await fs.writeFile(assetsPath, buffer);
    console.log('💾 Saved locally to:', assetsPath);
    
    // Upload to Cloudinary
    console.log('☁️  Uploading to Cloudinary...');
    const cloudinaryResult = await cloudinary.uploader.upload(assetsPath, {
      folder: 'jupitair-hvac',
      public_id: filename.replace('.png', ''),
      overwrite: true,
      resource_type: 'image'
    });
    
    console.log('✅ Uploaded to Cloudinary!');
    console.log('🔗 Cloudinary URL:', cloudinaryResult.secure_url);
    
    const result = {
      localPath: assetsPath,
      cloudinaryUrl: cloudinaryResult.secure_url,
      publicId: cloudinaryResult.public_id
    };
    
    // Save test results
    await fs.writeFile(
      path.join(__dirname, 'test-image-result.json'), 
      JSON.stringify(result, null, 2)
    );
    
    console.log('🎉 Single test image generation complete!');
    return result;
    
  } catch (error) {
    console.error('❌ Error in single test image generation:', error);
    throw error;
  }
}

generateSingleTestImage();
