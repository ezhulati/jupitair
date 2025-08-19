#!/usr/bin/env node

/**
 * 404 Detection Script for Jupitair HVAC Website
 * Crawls the site and identifies all 404 errors
 */

import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';

const BASE_URL = 'http://localhost:4322';

// Comprehensive list of URLs to check
const URLS_TO_CHECK = [
  // Main pages
  '/',
  '/about',
  '/services',
  '/contact',
  '/blog',
  '/commercial',
  '/privacy',
  '/terms',
  
  // City pages
  '/frisco',
  '/plano',
  '/mckinney',
  '/allen',
  '/prosper',
  '/the-colony',
  '/little-elm',
  '/addison',
  
  // Service pages
  '/services/ac-repair',
  '/services/ac-installation',
  '/services/heating-repair',
  '/services/heating-installation',
  '/services/heat-pump-systems',
  '/services/duct-cleaning',
  '/services/duct-sealing',
  '/services/indoor-air-quality',
  '/services/maintenance-plans',
  '/services/thermostat-installation',
  '/services/commercial-hvac',
  '/services/hvac-installation',
  '/services/maintenance',
  '/services/residential',
  
  // Missing services from report
  '/services/air-purification',
  '/services/zoning-systems',
  
  // Commercial pages
  '/commercial/restaurant-hvac',
  '/commercial/retail-hvac',
  '/commercial/office-hvac',
  '/commercial/chiller-systems',
  '/commercial/rtu-replacement',
  '/commercial/new-installation',
  '/commercial/emergency-service',
  '/commercial/preventive-maintenance',
  
  // City + Service combinations (sample)
  '/frisco/ac-repair',
  '/plano/heating-installation',
  '/mckinney/duct-cleaning',
  
  // Assets and meta files
  '/robots.txt',
  '/sitemap.xml',
  '/sitemap',
  '/manifest.json',
  '/favicon.ico',
  '/icon-192.png',
  '/icon-512.png',
  
  // OAuth
  '/oauth/setup',
  '/oauth/callback',
  
  // Test pages
  '/404',
  '/style-guide',
  '/cloudinary-demo',
  '/cloudinary-test',
  '/success',
];

class FourOhFourFinder {
  constructor() {
    this.results = {
      working: [],
      notFound: [],
      errors: [],
      total: 0
    };
  }

  async checkUrl(url) {
    try {
      console.log(`Checking: ${url}`);
      const response = await fetch(`${BASE_URL}${url}`, {
        method: 'HEAD',
        timeout: 10000
      });
      
      const result = {
        url,
        status: response.status,
        statusText: response.statusText
      };

      if (response.status === 404) {
        this.results.notFound.push(result);
        console.log(`❌ 404: ${url}`);
      } else if (response.status >= 200 && response.status < 400) {
        this.results.working.push(result);
        console.log(`✅ OK: ${url} (${response.status})`);
      } else {
        this.results.errors.push(result);
        console.log(`⚠️  Error: ${url} (${response.status})`);
      }
    } catch (error) {
      const result = {
        url,
        status: 'ERROR',
        statusText: error.message
      };
      this.results.errors.push(result);
      console.log(`💥 Failed: ${url} - ${error.message}`);
    }
  }

  async checkAllUrls() {
    console.log(`🔍 Checking ${URLS_TO_CHECK.length} URLs...\n`);
    
    for (const url of URLS_TO_CHECK) {
      await this.checkUrl(url);
    }
    
    this.results.total = URLS_TO_CHECK.length;
  }

  generateReport() {
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        total: this.results.total,
        working: this.results.working.length,
        notFound: this.results.notFound.length,
        errors: this.results.errors.length,
        successRate: `${Math.round((this.results.working.length / this.results.total) * 100)}%`
      },
      results: this.results
    };

    // Save detailed JSON report
    fs.writeFileSync('404-report.json', JSON.stringify(report, null, 2));
    
    // Generate console summary
    console.log('\n📊 RESULTS SUMMARY');
    console.log('==================');
    console.log(`Total URLs checked: ${report.summary.total}`);
    console.log(`✅ Working: ${report.summary.working} (${report.summary.successRate})`);
    console.log(`❌ 404 Errors: ${report.summary.notFound}`);
    console.log(`⚠️  Other Errors: ${report.summary.errors}`);
    
    if (this.results.notFound.length > 0) {
      console.log('\n🚨 404 ERRORS FOUND:');
      this.results.notFound.forEach(result => {
        console.log(`  - ${result.url}`);
      });
    }
    
    if (this.results.errors.length > 0) {
      console.log('\n⚠️  OTHER ERRORS:');
      this.results.errors.forEach(result => {
        console.log(`  - ${result.url} (${result.status})`);
      });
    }
    
    console.log(`\n📄 Detailed report saved to: 404-report.json`);
    
    return report;
  }

  async run() {
    console.log('🔍 Jupitair HVAC 404 Finder');
    console.log('============================\n');
    
    try {
      await this.checkAllUrls();
      return this.generateReport();
    } catch (error) {
      console.error('❌ Script failed:', error);
      process.exit(1);
    }
  }
}

// Run the script
if (import.meta.url === `file://${process.argv[1]}`) {
  const finder = new FourOhFourFinder();
  finder.run();
}

export default FourOhFourFinder;