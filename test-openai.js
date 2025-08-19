#!/usr/bin/env node

import OpenAI from 'openai';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

console.log('Testing OpenAI connection...');
console.log('API key exists:', !!process.env.OPENAI_API_KEY);
console.log('API key starts with:', process.env.OPENAI_API_KEY?.substring(0, 20));

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function testConnection() {
  try {
    console.log('Attempting to generate a simple test image...');
    
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: "A simple test image of a blue house",
      size: "1024x1024",
      quality: "standard",
      n: 1,
    });

    console.log('✅ OpenAI API connection successful!');
    console.log('Generated image URL:', response.data[0].url);
    
  } catch (error) {
    console.error('❌ OpenAI API connection failed:', error.message);
    console.error('Error code:', error.code);
    console.error('Error type:', error.type);
  }
}

testConnection();
