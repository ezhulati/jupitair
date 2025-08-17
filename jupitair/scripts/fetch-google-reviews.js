#!/usr/bin/env node

import { writeFileSync, readFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// For now, we'll use mock data. In production, you'd use Google Places API
// To use real API:
// 1. Get Google Places API key
// 2. Find your Google Business place_id
// 3. Use the Places API to fetch reviews

async function fetchGoogleReviews() {
  const API_KEY = process.env.GOOGLE_PLACES_API_KEY;
  const PLACE_ID = process.env.GOOGLE_BUSINESS_ID || 'ChIJAazsg-twakURAJ2zXUWzH-4'; // Jupitair HVAC Place ID
  
  if (!API_KEY) {
    console.log('No API key found, using existing reviews');
    return;
  }
  
  try {
    // In production, uncomment this to fetch real reviews:
    /*
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${PLACE_ID}&fields=reviews,rating,user_ratings_total&key=${API_KEY}`
    );
    
    const data = await response.json();
    
    if (data.status === 'OK' && data.result) {
      const reviews = data.result.reviews || [];
      const rating = data.result.rating || 0;
      const totalRatings = data.result.user_ratings_total || 0;
      
      // Transform Google reviews to our format
      const transformedReviews = reviews.map((review, index) => ({
        id: `google-${review.time}`,
        author: review.author_name,
        rating: review.rating,
        date: new Date(review.time * 1000).toISOString().split('T')[0],
        text: review.text,
        service: extractService(review.text), // You'd need to implement this
        city: extractCity(review.text), // You'd need to implement this
        verified: true,
        profilePhoto: review.profile_photo_url
      }));
      
      // Merge with existing reviews
      const existingData = JSON.parse(
        readFileSync(join(__dirname, '../src/data/reviews.json'), 'utf-8')
      );
      
      // Update with new reviews (avoid duplicates)
      const existingIds = new Set(existingData.reviews.map(r => r.id));
      const newReviews = transformedReviews.filter(r => !existingIds.has(r.id));
      
      const updatedData = {
        lastUpdated: new Date().toISOString(),
        averageRating: rating,
        totalReviews: totalRatings,
        reviews: [...newReviews, ...existingData.reviews].slice(0, 50) // Keep latest 50
      };
      
      writeFileSync(
        join(__dirname, '../src/data/reviews.json'),
        JSON.stringify(updatedData, null, 2)
      );
      
      console.log(`Updated reviews: ${newReviews.length} new, ${updatedData.reviews.length} total`);
    }
    */
    
    // For now, just update the timestamp
    const existingData = JSON.parse(
      readFileSync(join(__dirname, '../src/data/reviews.json'), 'utf-8')
    );
    
    existingData.lastUpdated = new Date().toISOString();
    
    writeFileSync(
      join(__dirname, '../src/data/reviews.json'),
      JSON.stringify(existingData, null, 2)
    );
    
    console.log('Reviews data updated successfully');
    
  } catch (error) {
    console.error('Error fetching reviews:', error);
    process.exit(1);
  }
}

// Helper function to extract service type from review text
function extractService(text) {
  const services = [
    'AC Repair',
    'Heating Repair',
    'HVAC Installation',
    'Duct Cleaning',
    'Emergency HVAC',
    'Commercial HVAC',
    'Thermostat Installation',
    'Energy Upgrades'
  ];
  
  const lowercaseText = text.toLowerCase();
  
  for (const service of services) {
    if (lowercaseText.includes(service.toLowerCase())) {
      return service;
    }
  }
  
  // Default fallback
  if (lowercaseText.includes('ac') || lowercaseText.includes('air condition')) {
    return 'AC Repair';
  }
  if (lowercaseText.includes('heat')) {
    return 'Heating Repair';
  }
  
  return 'HVAC Service';
}

// Helper function to extract city from review text
function extractCity(text) {
  const cities = [
    'Frisco',
    'Plano',
    'McKinney',
    'Allen',
    'Prosper',
    'The Colony',
    'Little Elm',
    'Addison'
  ];
  
  const lowercaseText = text.toLowerCase();
  
  for (const city of cities) {
    if (lowercaseText.includes(city.toLowerCase())) {
      return city;
    }
  }
  
  return 'Plano'; // Default city
}

// Run the fetch
fetchGoogleReviews();