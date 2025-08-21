#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import cloudinary from 'cloudinary';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.PUBLIC_CLOUDINARY_CLOUD_NAME || 'dwnmuolg8',
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Function to upload image to Cloudinary
async function uploadImage(imagePath, publicId) {
  try {
    const result = await cloudinary.v2.uploader.upload(imagePath, {
      public_id: publicId,
      folder: 'jupitair/blog',
      overwrite: true,
      resource_type: 'image',
      transformation: [
        { quality: 'auto:best', fetch_format: 'auto' }
      ]
    });
    return result;
  } catch (error) {
    console.error(`Error uploading ${imagePath}:`, error.message);
    return null;
  }
}

// Function to update MDX file with Cloudinary URL
function updateMDXFile(filePath, oldImagePath, cloudinaryId) {
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // Update heroImage path to use Cloudinary ID
  const oldPattern = `heroImage: "${oldImagePath}"`;
  const newPattern = `heroImage: "${cloudinaryId}"`;
  
  content = content.replace(oldPattern, newPattern);
  
  // Also add a flag to indicate it's a Cloudinary image
  if (!content.includes('heroImageIsCloudinary:')) {
    content = content.replace(
      'heroImageAlt:',
      'heroImageIsCloudinary: true\nheroImageAlt:'
    );
  }
  
  fs.writeFileSync(filePath, content, 'utf-8');
}

async function main() {
  console.log('🚀 Starting Cloudinary upload process...\n');
  
  // Check for API credentials
  if (!process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    console.error('❌ Missing Cloudinary API credentials in environment variables.');
    console.log('Please set CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET in your .env.local file');
    process.exit(1);
  }
  
  const blogImagesDir = path.join(__dirname, '../public/images/blog');
  const blogContentDir = path.join(__dirname, '../src/content/blog');
  
  // Get all image files
  const imageFiles = fs.readdirSync(blogImagesDir)
    .filter(file => file.endsWith('.jpg') || file.endsWith('.png'));
  
  console.log(`Found ${imageFiles.length} images to upload\n`);
  
  const uploadResults = [];
  
  // Upload each image
  for (const imageFile of imageFiles) {
    const imagePath = path.join(blogImagesDir, imageFile);
    const publicId = path.basename(imageFile, path.extname(imageFile));
    
    console.log(`Uploading ${imageFile}...`);
    const result = await uploadImage(imagePath, publicId);
    
    if (result) {
      console.log(`✅ Uploaded: ${result.public_id}`);
      console.log(`   URL: ${result.secure_url}`);
      console.log(`   Size: ${(result.bytes / 1024).toFixed(2)} KB\n`);
      
      uploadResults.push({
        filename: imageFile,
        publicId: result.public_id,
        url: result.secure_url,
        oldPath: `/images/blog/${imageFile}`
      });
    } else {
      console.log(`❌ Failed to upload ${imageFile}\n`);
    }
  }
  
  // Update MDX files
  console.log('\n📝 Updating MDX files...\n');
  
  const mdxFiles = fs.readdirSync(blogContentDir)
    .filter(file => file.endsWith('.mdx'));
  
  for (const mdxFile of mdxFiles) {
    const mdxPath = path.join(blogContentDir, mdxFile);
    const content = fs.readFileSync(mdxPath, 'utf-8');
    
    // Find which image this MDX file uses
    const heroImageMatch = content.match(/heroImage:\s*"([^"]+)"/);
    if (heroImageMatch) {
      const currentImage = heroImageMatch[1];
      
      // Find corresponding upload result
      const uploadResult = uploadResults.find(r => r.oldPath === currentImage);
      
      if (uploadResult) {
        console.log(`Updating ${mdxFile} to use Cloudinary image...`);
        updateMDXFile(mdxPath, currentImage, uploadResult.publicId);
        console.log(`✅ Updated ${mdxFile}\n`);
      }
    }
  }
  
  console.log('\n✨ Cloudinary upload complete!');
  console.log(`Uploaded ${uploadResults.length} images successfully.`);
  
  // Save mapping file for reference
  const mappingFile = path.join(__dirname, 'cloudinary-mapping.json');
  fs.writeFileSync(mappingFile, JSON.stringify(uploadResults, null, 2));
  console.log(`\n📄 Mapping saved to ${mappingFile}`);
}

// Run the script
main().catch(console.error);