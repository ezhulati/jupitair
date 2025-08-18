#!/usr/bin/env node

import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function createFallbackImage() {
  const width = 1200;
  const height = 630;
  
  // Create a simple SVG with branding
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#0066CC;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#004499;stop-opacity:1" />
        </linearGradient>
      </defs>
      
      <!-- Background -->
      <rect width="${width}" height="${height}" fill="url(#bg)"/>
      
      <!-- Logo area -->
      <rect x="50" y="50" width="100" height="100" rx="20" fill="white" opacity="0.9"/>
      <text x="100" y="115" font-family="Arial, sans-serif" font-size="60" font-weight="bold" text-anchor="middle" fill="#0066CC">JH</text>
      
      <!-- Main text -->
      <text x="${width/2}" y="${height/2 - 40}" font-family="Arial, sans-serif" font-size="72" font-weight="bold" text-anchor="middle" fill="white">
        Jupitair HVAC
      </text>
      
      <text x="${width/2}" y="${height/2 + 20}" font-family="Arial, sans-serif" font-size="36" text-anchor="middle" fill="white" opacity="0.9">
        North Texas Premier HVAC Solutions
      </text>
      
      <text x="${width/2}" y="${height/2 + 70}" font-family="Arial, sans-serif" font-size="28" text-anchor="middle" fill="white" opacity="0.8">
        24/7 Emergency Service • (940) 390-5676
      </text>
      
      <!-- Service badges -->
      <g transform="translate(${width/2 - 250}, ${height - 120})">
        <rect x="0" y="0" width="150" height="40" rx="20" fill="white" opacity="0.2"/>
        <text x="75" y="27" font-family="Arial, sans-serif" font-size="18" text-anchor="middle" fill="white">AC Repair</text>
      </g>
      
      <g transform="translate(${width/2 - 75}, ${height - 120})">
        <rect x="0" y="0" width="150" height="40" rx="20" fill="white" opacity="0.2"/>
        <text x="75" y="27" font-family="Arial, sans-serif" font-size="18" text-anchor="middle" fill="white">Heating</text>
      </g>
      
      <g transform="translate(${width/2 + 100}, ${height - 120})">
        <rect x="0" y="0" width="150" height="40" rx="20" fill="white" opacity="0.2"/>
        <text x="75" y="27" font-family="Arial, sans-serif" font-size="18" text-anchor="middle" fill="white">Installation</text>
      </g>
    </svg>
  `;
  
  // Ensure directories exist
  const imagesDir = path.join(__dirname, '..', 'public', 'images');
  const ogImagesDir = path.join(__dirname, '..', 'public', 'og-images');
  
  if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
  }
  
  if (!fs.existsSync(ogImagesDir)) {
    fs.mkdirSync(ogImagesDir, { recursive: true });
  }
  
  // Create the fallback image
  const outputPath = path.join(imagesDir, 'og-default.jpg');
  
  await sharp(Buffer.from(svg))
    .jpeg({ quality: 90 })
    .toFile(outputPath);
  
  console.log('✅ Fallback OG image created at:', outputPath);
  
  // Also create a copy as the default in og-images
  const defaultPath = path.join(ogImagesDir, 'default.jpg');
  await sharp(Buffer.from(svg))
    .jpeg({ quality: 90 })
    .toFile(defaultPath);
  
  console.log('✅ Default OG image created at:', defaultPath);
}

createFallbackImage().catch(console.error);