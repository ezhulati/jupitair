#!/usr/bin/env node

import fs from 'fs';

const baseUrl = 'http://localhost:4322';
const results = {
  working: [],
  notFound: [],
  errors: []
};

// URLs from sitemap and additional routes to check
const urlsToCheck = [
  // Main pages
  '/',
  '/about',
  '/services',
  '/contact',
  '/schedule',
  '/privacy',
  '/terms',
  '/style-guide',
  '/success',
  '/sitemap',
  '/commercial',
  
  // Service pages
  '/services/ac-repair',
  '/services/emergency-ac-repair', 
  '/services/ac-installation',
  '/services/ac-maintenance',
  '/services/furnace-repair',
  '/services/furnace-installation',
  '/services/heat-pump-repair',
  '/services/heat-pump-installation',
  '/services/ductless-mini-split-installation',
  '/services/duct-repair-sealing',
  '/services/thermostat-installation',
  '/services/indoor-air-quality',
  '/services/residential',
  
  // Commercial pages
  '/commercial/chiller-systems',
  '/commercial/emergency-service',
  '/commercial/new-installation',
  '/commercial/office-hvac',
  '/commercial/preventive-maintenance',
  '/commercial/restaurant-hvac',
  '/commercial/retail-hvac',
  '/commercial/rtu-replacement',
  
  // City pages - Frisco
  '/frisco',
  '/frisco/ac-repair',
  '/frisco/emergency-ac-repair',
  '/frisco/ac-installation',
  '/frisco/ac-maintenance', 
  '/frisco/furnace-repair',
  '/frisco/furnace-installation',
  
  // City pages - Plano
  '/plano',
  '/plano/ac-repair',
  '/plano/emergency-ac-repair',
  '/plano/ac-installation',
  '/plano/ac-maintenance',
  '/plano/furnace-repair', 
  '/plano/furnace-installation',
  
  // City pages - McKinney
  '/mckinney',
  '/mckinney/ac-repair',
  '/mckinney/emergency-ac-repair',
  '/mckinney/ac-installation',
  '/mckinney/ac-maintenance',
  '/mckinney/furnace-repair',
  '/mckinney/furnace-installation',
  
  // City pages - Allen
  '/allen',
  '/allen/ac-repair',
  '/allen/emergency-ac-repair',
  '/allen/ac-installation', 
  '/allen/ac-maintenance',
  '/allen/furnace-repair',
  '/allen/furnace-installation',
  
  // City pages - Prosper
  '/prosper',
  '/prosper/ac-repair',
  '/prosper/emergency-ac-repair',
  
  // Blog pages
  '/blog',
  '/blog/ac-blowing-warm-air',
  '/blog/ac-leaking-water-what-to-do',
  '/blog/ac-lifespan-dfw',
  '/blog/ac-maintenance-checklist-spring',
  '/blog/ac-repair-cost-north-texas-2025',
  
  // API endpoints
  '/api/contact',
  '/api/booking',
  '/api/availability',
  '/api/reviews-aggregator',
  '/api/test-email',
  '/api/test-form',
  '/api/test-zoho',
  
  // OAuth pages
  '/oauth/callback',
  '/oauth/setup',
  
  // Other potential routes
  '/robots.txt',
  '/sitemap.xml',
  '/404',
  
  // Test some dynamic city routes
  '/little-elm',
  '/the-colony',
  '/addison',
  
  // Test some assets that might be missing
  '/favicon.ico',
  '/icon-192.png',
  '/icon-512.png',
  '/manifest.json',
  
  // Test some service routes that might not exist
  '/services/duct-cleaning',
  '/services/air-purification',
  '/services/zoning-systems',
  
  // Test cloudinary demo pages
  '/cloudinary-demo',
  '/cloudinary-test'
];

async function checkUrl(url) {
  const fullUrl = `${baseUrl}${url}`;
  try {
    console.log(`Checking: ${fullUrl}`);
    const response = await fetch(fullUrl, {
      method: 'HEAD',
      timeout: 5000
    });
    
    if (response.status === 404) {
      results.notFound.push({
        url: url,
        status: 404,
        fullUrl: fullUrl
      });
      console.log(`❌ 404: ${url}`);
    } else if (response.status >= 200 && response.status < 300) {
      results.working.push({
        url: url, 
        status: response.status,
        fullUrl: fullUrl
      });
      console.log(`✅ ${response.status}: ${url}`);
    } else {
      results.errors.push({
        url: url,
        status: response.status, 
        fullUrl: fullUrl
      });
      console.log(`⚠️  ${response.status}: ${url}`);
    }
  } catch (error) {
    results.errors.push({
      url: url,
      error: error.message,
      fullUrl: fullUrl
    });
    console.log(`💥 Error: ${url} - ${error.message}`);
  }
}

async function checkAllUrls() {
  console.log(`Starting 404 check for ${urlsToCheck.length} URLs...\n`);
  
  // Check URLs in batches to avoid overwhelming the server
  const batchSize = 5;
  for (let i = 0; i < urlsToCheck.length; i += batchSize) {
    const batch = urlsToCheck.slice(i, i + batchSize);
    await Promise.all(batch.map(checkUrl));
    
    // Small delay between batches
    if (i + batchSize < urlsToCheck.length) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }
  
  // Generate report
  console.log('\n' + '='.repeat(80));
  console.log('404 ERROR REPORT');
  console.log('='.repeat(80));
  
  console.log(`\n📊 SUMMARY:`);
  console.log(`   ✅ Working: ${results.working.length}`);
  console.log(`   ❌ 404 Not Found: ${results.notFound.length}`);
  console.log(`   ⚠️  Other Errors: ${results.errors.length}`);
  console.log(`   📝 Total Checked: ${urlsToCheck.length}`);
  
  if (results.notFound.length > 0) {
    console.log(`\n❌ 404 ERRORS (${results.notFound.length}):`);
    results.notFound.forEach((item, index) => {
      console.log(`   ${index + 1}. ${item.url}`);
    });
  }
  
  if (results.errors.length > 0) {
    console.log(`\n⚠️  OTHER ERRORS (${results.errors.length}):`);
    results.errors.forEach((item, index) => {
      if (item.status) {
        console.log(`   ${index + 1}. ${item.url} (${item.status})`);
      } else {
        console.log(`   ${index + 1}. ${item.url} (${item.error})`);
      }
    });
  }
  
  // Save detailed results to file
  const reportData = {
    timestamp: new Date().toISOString(),
    summary: {
      total: urlsToCheck.length,
      working: results.working.length,
      notFound: results.notFound.length,
      errors: results.errors.length
    },
    results: results
  };
  
  fs.writeFileSync('404-report.json', JSON.stringify(reportData, null, 2));
  console.log(`\n💾 Detailed report saved to: 404-report.json`);
  
  console.log('\n' + '='.repeat(80));
}

// Use built-in fetch (available in Node.js 18+)
async function main() {
  try {
    await checkAllUrls();
  } catch (error) {
    console.error('Error:', error.message);
  }
}

main();
