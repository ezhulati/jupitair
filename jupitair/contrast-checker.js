#!/usr/bin/env node

// Contrast Checker Script for Jupitair HVAC Website
import fs from 'fs';

const baseUrl = 'http://localhost:4322';

// Comprehensive list of ALL pages to visually inspect
const pagesToInspect = [
  // Main pages
  { url: '/', name: 'Homepage' },
  { url: '/about', name: 'About Us' },
  { url: '/services', name: 'Services Overview' },
  { url: '/contact', name: 'Contact' },
  { url: '/schedule', name: 'Schedule Service' },
  { url: '/privacy', name: 'Privacy Policy' },
  { url: '/terms', name: 'Terms of Service' },
  { url: '/success', name: 'Success Page' },
  { url: '/commercial', name: 'Commercial Services' },
  { url: '/style-guide', name: 'Style Guide' },
  
  // Service pages
  { url: '/services/ac-repair', name: 'AC Repair Service' },
  { url: '/services/emergency-ac-repair', name: 'Emergency AC Repair' },
  { url: '/services/ac-installation', name: 'AC Installation' },
  { url: '/services/ac-maintenance', name: 'AC Maintenance' },
  { url: '/services/furnace-repair', name: 'Furnace Repair' },
  { url: '/services/furnace-installation', name: 'Furnace Installation' },
  { url: '/services/heat-pump-repair', name: 'Heat Pump Repair' },
  { url: '/services/heat-pump-installation', name: 'Heat Pump Installation' },
  { url: '/services/ductless-mini-split-installation', name: 'Ductless Mini Split' },
  { url: '/services/duct-repair-sealing', name: 'Duct Repair & Sealing' },
  { url: '/services/thermostat-installation', name: 'Thermostat Installation' },
  { url: '/services/indoor-air-quality', name: 'Indoor Air Quality' },
  { url: '/services/residential', name: 'Residential Services' },
  { url: '/services/duct-cleaning', name: 'Duct Cleaning' },
  
  // Commercial pages
  { url: '/commercial/chiller-systems', name: 'Commercial Chiller Systems' },
  { url: '/commercial/emergency-service', name: 'Commercial Emergency Service' },
  { url: '/commercial/new-installation', name: 'Commercial New Installation' },
  { url: '/commercial/office-hvac', name: 'Office HVAC' },
  { url: '/commercial/preventive-maintenance', name: 'Commercial Maintenance' },
  { url: '/commercial/restaurant-hvac', name: 'Restaurant HVAC' },
  { url: '/commercial/retail-hvac', name: 'Retail HVAC' },
  { url: '/commercial/rtu-replacement', name: 'RTU Replacement' },
  
  // City pages - Frisco
  { url: '/frisco', name: 'Frisco HVAC Services' },
  { url: '/frisco/ac-repair', name: 'Frisco AC Repair' },
  { url: '/frisco/emergency-ac-repair', name: 'Frisco Emergency AC Repair' },
  { url: '/frisco/ac-installation', name: 'Frisco AC Installation' },
  { url: '/frisco/ac-maintenance', name: 'Frisco AC Maintenance' },
  { url: '/frisco/furnace-repair', name: 'Frisco Furnace Repair' },
  { url: '/frisco/furnace-installation', name: 'Frisco Furnace Installation' },
  
  // City pages - Plano
  { url: '/plano', name: 'Plano HVAC Services' },
  { url: '/plano/ac-repair', name: 'Plano AC Repair' },
  { url: '/plano/emergency-ac-repair', name: 'Plano Emergency AC Repair' },
  { url: '/plano/ac-installation', name: 'Plano AC Installation' },
  { url: '/plano/ac-maintenance', name: 'Plano AC Maintenance' },
  { url: '/plano/furnace-repair', name: 'Plano Furnace Repair' },
  { url: '/plano/furnace-installation', name: 'Plano Furnace Installation' },
  
  // City pages - McKinney
  { url: '/mckinney', name: 'McKinney HVAC Services' },
  { url: '/mckinney/ac-repair', name: 'McKinney AC Repair' },
  { url: '/mckinney/emergency-ac-repair', name: 'McKinney Emergency AC Repair' },
  { url: '/mckinney/ac-installation', name: 'McKinney AC Installation' },
  { url: '/mckinney/ac-maintenance', name: 'McKinney AC Maintenance' },
  { url: '/mckinney/furnace-repair', name: 'McKinney Furnace Repair' },
  { url: '/mckinney/furnace-installation', name: 'McKinney Furnace Installation' },
  
  // City pages - Allen
  { url: '/allen', name: 'Allen HVAC Services' },
  { url: '/allen/ac-repair', name: 'Allen AC Repair' },
  { url: '/allen/emergency-ac-repair', name: 'Allen Emergency AC Repair' },
  { url: '/allen/ac-installation', name: 'Allen AC Installation' },
  { url: '/allen/ac-maintenance', name: 'Allen AC Maintenance' },
  { url: '/allen/furnace-repair', name: 'Allen Furnace Repair' },
  { url: '/allen/furnace-installation', name: 'Allen Furnace Installation' },
  
  // City pages - Prosper
  { url: '/prosper', name: 'Prosper HVAC Services' },
  { url: '/prosper/ac-repair', name: 'Prosper AC Repair' },
  { url: '/prosper/emergency-ac-repair', name: 'Prosper Emergency AC Repair' },
  
  // Additional city pages
  { url: '/little-elm', name: 'Little Elm HVAC Services' },
  { url: '/the-colony', name: 'The Colony HVAC Services' },
  { url: '/addison', name: 'Addison HVAC Services' },
  
  // Blog pages
  { url: '/blog', name: 'Blog Index' },
  { url: '/blog/ac-blowing-warm-air', name: 'AC Blowing Warm Air Blog' },
  { url: '/blog/ac-leaking-water-what-to-do', name: 'AC Leaking Water Blog' },
  { url: '/blog/ac-lifespan-dfw', name: 'AC Lifespan DFW Blog' },
  { url: '/blog/ac-maintenance-checklist-spring', name: 'Spring AC Maintenance Blog' },
  { url: '/blog/ac-repair-cost-north-texas-2025', name: 'AC Repair Cost 2025 Blog' },
  
  // Test pages
  { url: '/cloudinary-demo', name: 'Cloudinary Demo' },
  { url: '/cloudinary-test', name: 'Cloudinary Test' },
  
  // OAuth pages
  { url: '/oauth/callback', name: 'OAuth Callback' },
  { url: '/oauth/setup', name: 'OAuth Setup' }
];

// Generate inspection checklist
function generateInspectionChecklist() {
  console.log('JUPITAIR HVAC WEBSITE - CONTRAST INSPECTION CHECKLIST');
  console.log('='.repeat(80));
  console.log(`Total pages to inspect: ${pagesToInspect.length}`);
  console.log('\nINSTRUCTIONS:');
  console.log('- Visit each page visually in browser');
  console.log('- Scroll through entire page content');
  console.log('- Check for white text on white backgrounds');
  console.log('- Check for dark text on dark backgrounds');
  console.log('- Hover over ALL buttons to test hover states');
  console.log('- Test form fields and inputs');
  console.log('- Check cards, sections, and overlays');
  console.log('- Mark issues found for each page');
  console.log('='.repeat(80));
  
  const checklist = {
    timestamp: new Date().toISOString(),
    totalPages: pagesToInspect.length,
    pages: pagesToInspect.map(page => ({
      ...page,
      fullUrl: `${baseUrl}${page.url}`,
      inspected: false,
      contrastIssues: [],
      notes: '',
      status: 'pending'
    }))
  };
  
  // Save checklist to file
  fs.writeFileSync('contrast-inspection-checklist.json', JSON.stringify(checklist, null, 2));
  
  console.log('\nPAGES TO INSPECT:');
  console.log('-'.repeat(50));
  pagesToInspect.forEach((page, index) => {
    console.log(`${(index + 1).toString().padStart(2, '0')}. ${page.name}`);
    console.log(`    URL: ${baseUrl}${page.url}`);
  });
  
  console.log('\n' + '='.repeat(80));
  console.log('📋 Inspection checklist saved to: contrast-inspection-checklist.json');
  console.log('🌐 Ready to begin visual inspection!');
  console.log('='.repeat(80));
}

generateInspectionChecklist();
