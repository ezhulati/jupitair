#!/usr/bin/env node

import fs from 'fs';

const baseUrl = 'http://localhost:4322';

// Complete list of ALL pages to inspect (76 total)
const allPages = [
  // Main pages (10)
  { url: '/', name: 'Homepage', category: 'main' },
  { url: '/about', name: 'About Us', category: 'main' },
  { url: '/services', name: 'Services Overview', category: 'main' },
  { url: '/contact', name: 'Contact', category: 'main' },
  { url: '/schedule', name: 'Schedule Service', category: 'main' },
  { url: '/privacy', name: 'Privacy Policy', category: 'main' },
  { url: '/terms', name: 'Terms of Service', category: 'main' },
  { url: '/success', name: 'Success Page', category: 'main' },
  { url: '/commercial', name: 'Commercial Services', category: 'main' },
  { url: '/style-guide', name: 'Style Guide', category: 'main' },
  
  // Service pages (14)
  { url: '/services/ac-repair', name: 'AC Repair Service', category: 'service' },
  { url: '/services/emergency-ac-repair', name: 'Emergency AC Repair', category: 'service' },
  { url: '/services/ac-installation', name: 'AC Installation', category: 'service' },
  { url: '/services/ac-maintenance', name: 'AC Maintenance', category: 'service' },
  { url: '/services/furnace-repair', name: 'Furnace Repair', category: 'service' },
  { url: '/services/furnace-installation', name: 'Furnace Installation', category: 'service' },
  { url: '/services/heat-pump-repair', name: 'Heat Pump Repair', category: 'service' },
  { url: '/services/heat-pump-installation', name: 'Heat Pump Installation', category: 'service' },
  { url: '/services/ductless-mini-split-installation', name: 'Ductless Mini Split', category: 'service' },
  { url: '/services/duct-repair-sealing', name: 'Duct Repair & Sealing', category: 'service' },
  { url: '/services/thermostat-installation', name: 'Thermostat Installation', category: 'service' },
  { url: '/services/indoor-air-quality', name: 'Indoor Air Quality', category: 'service' },
  { url: '/services/residential', name: 'Residential Services', category: 'service' },
  { url: '/services/duct-cleaning', name: 'Duct Cleaning', category: 'service' },
  
  // Commercial pages (8)
  { url: '/commercial/chiller-systems', name: 'Commercial Chiller Systems', category: 'commercial' },
  { url: '/commercial/emergency-service', name: 'Commercial Emergency Service', category: 'commercial' },
  { url: '/commercial/new-installation', name: 'Commercial New Installation', category: 'commercial' },
  { url: '/commercial/office-hvac', name: 'Office HVAC', category: 'commercial' },
  { url: '/commercial/preventive-maintenance', name: 'Commercial Maintenance', category: 'commercial' },
  { url: '/commercial/restaurant-hvac', name: 'Restaurant HVAC', category: 'commercial' },
  { url: '/commercial/retail-hvac', name: 'Retail HVAC', category: 'commercial' },
  { url: '/commercial/rtu-replacement', name: 'RTU Replacement', category: 'commercial' },
  
  // City pages - Frisco (7)
  { url: '/frisco', name: 'Frisco HVAC Services', category: 'city' },
  { url: '/frisco/ac-repair', name: 'Frisco AC Repair', category: 'city' },
  { url: '/frisco/emergency-ac-repair', name: 'Frisco Emergency AC Repair', category: 'city' },
  { url: '/frisco/ac-installation', name: 'Frisco AC Installation', category: 'city' },
  { url: '/frisco/ac-maintenance', name: 'Frisco AC Maintenance', category: 'city' },
  { url: '/frisco/furnace-repair', name: 'Frisco Furnace Repair', category: 'city' },
  { url: '/frisco/furnace-installation', name: 'Frisco Furnace Installation', category: 'city' },
  
  // City pages - Plano (7)
  { url: '/plano', name: 'Plano HVAC Services', category: 'city' },
  { url: '/plano/ac-repair', name: 'Plano AC Repair', category: 'city' },
  { url: '/plano/emergency-ac-repair', name: 'Plano Emergency AC Repair', category: 'city' },
  { url: '/plano/ac-installation', name: 'Plano AC Installation', category: 'city' },
  { url: '/plano/ac-maintenance', name: 'Plano AC Maintenance', category: 'city' },
  { url: '/plano/furnace-repair', name: 'Plano Furnace Repair', category: 'city' },
  { url: '/plano/furnace-installation', name: 'Plano Furnace Installation', category: 'city' },
  
  // City pages - McKinney (7)
  { url: '/mckinney', name: 'McKinney HVAC Services', category: 'city' },
  { url: '/mckinney/ac-repair', name: 'McKinney AC Repair', category: 'city' },
  { url: '/mckinney/emergency-ac-repair', name: 'McKinney Emergency AC Repair', category: 'city' },
  { url: '/mckinney/ac-installation', name: 'McKinney AC Installation', category: 'city' },
  { url: '/mckinney/ac-maintenance', name: 'McKinney AC Maintenance', category: 'city' },
  { url: '/mckinney/furnace-repair', name: 'McKinney Furnace Repair', category: 'city' },
  { url: '/mckinney/furnace-installation', name: 'McKinney Furnace Installation', category: 'city' },
  
  // City pages - Allen (7)
  { url: '/allen', name: 'Allen HVAC Services', category: 'city' },
  { url: '/allen/ac-repair', name: 'Allen AC Repair', category: 'city' },
  { url: '/allen/emergency-ac-repair', name: 'Allen Emergency AC Repair', category: 'city' },
  { url: '/allen/ac-installation', name: 'Allen AC Installation', category: 'city' },
  { url: '/allen/ac-maintenance', name: 'Allen AC Maintenance', category: 'city' },
  { url: '/allen/furnace-repair', name: 'Allen Furnace Repair', category: 'city' },
  { url: '/allen/furnace-installation', name: 'Allen Furnace Installation', category: 'city' },
  
  // City pages - Prosper (3)
  { url: '/prosper', name: 'Prosper HVAC Services', category: 'city' },
  { url: '/prosper/ac-repair', name: 'Prosper AC Repair', category: 'city' },
  { url: '/prosper/emergency-ac-repair', name: 'Prosper Emergency AC Repair', category: 'city' },
  
  // Additional city pages (3)
  { url: '/little-elm', name: 'Little Elm HVAC Services', category: 'city' },
  { url: '/the-colony', name: 'The Colony HVAC Services', category: 'city' },
  { url: '/addison', name: 'Addison HVAC Services', category: 'city' },
  
  // Blog pages (6)
  { url: '/blog', name: 'Blog Index', category: 'blog' },
  { url: '/blog/ac-blowing-warm-air', name: 'AC Blowing Warm Air Blog', category: 'blog' },
  { url: '/blog/ac-leaking-water-what-to-do', name: 'AC Leaking Water Blog', category: 'blog' },
  { url: '/blog/ac-lifespan-dfw', name: 'AC Lifespan DFW Blog', category: 'blog' },
  { url: '/blog/ac-maintenance-checklist-spring', name: 'Spring AC Maintenance Blog', category: 'blog' },
  { url: '/blog/ac-repair-cost-north-texas-2025', name: 'AC Repair Cost 2025 Blog', category: 'blog' },
  
  // Test/Other pages (4)
  { url: '/cloudinary-demo', name: 'Cloudinary Demo', category: 'test' },
  { url: '/cloudinary-test', name: 'Cloudinary Test', category: 'test' },
  { url: '/oauth/callback', name: 'OAuth Callback', category: 'test' },
  { url: '/oauth/setup', name: 'OAuth Setup', category: 'test' }
];

// Detailed inspection results
const inspectionResults = {
  timestamp: new Date().toISOString(),
  totalPages: allPages.length,
  completed: 0,
  contrastIssues: [],
  pageResults: {},
  summary: {
    critical: 0,
    high: 0,
    medium: 0,
    clean: 0
  }
};

// Create detailed inspection report
function createDetailedInspectionPlan() {
  console.log('🔍 JUPITAIR HVAC - DEEP CONTRAST INSPECTION PLAN');
  console.log('='.repeat(80));
  console.log(`📋 Total Pages to Inspect: ${allPages.length}`);
  console.log('');
  
  const categories = ['main', 'service', 'commercial', 'city', 'blog', 'test'];
  
  categories.forEach(category => {
    const categoryPages = allPages.filter(page => page.category === category);
    console.log(`📁 ${category.toUpperCase()} PAGES (${categoryPages.length}):`);
    categoryPages.forEach((page, index) => {
      console.log(`   ${(index + 1).toString().padStart(2, '0')}. ${page.name}`);
      console.log(`       URL: ${baseUrl}${page.url}`);
    });
    console.log('');
  });
  
  console.log('🎯 INSPECTION FOCUS AREAS:');
  console.log('   • Secondary/outline buttons (light blue text issues)');
  console.log('   • CTA buttons and phone number buttons');
  console.log('   • Form submit buttons and inputs');
  console.log('   • Card text on light backgrounds');
  console.log('   • Dark text on dark backgrounds');
  console.log('   • Button hover states');
  console.log('   • Navigation elements');
  console.log('   • Footer links and text');
  console.log('');
  
  console.log('📊 EXPECTED FINDINGS:');
  console.log('   🔴 CRITICAL: Secondary button text contrast (site-wide)');
  console.log('   🟡 HIGH: Hover states, form elements');
  console.log('   🟢 MEDIUM: Minor text/background combinations');
  console.log('');
  
  // Save detailed inspection plan
  const inspectionPlan = {
    pages: allPages,
    focusAreas: [
      'Secondary/outline buttons (light blue text)',
      'CTA buttons and phone buttons',
      'Form elements and submit buttons',
      'Card text on backgrounds',
      'Button hover states',
      'Navigation elements',
      'Footer content'
    ],
    inspectionInstructions: [
      '1. Load each page completely',
      '2. Scroll through entire page content',
      '3. Test ALL button hover states',
      '4. Check form input contrast',
      '5. Document specific contrast failures',
      '6. Note exact colors and locations',
      '7. Assess severity level'
    ]
  };
  
  fs.writeFileSync('deep-inspection-plan.json', JSON.stringify(inspectionPlan, null, 2));
  console.log('💾 Detailed inspection plan saved to: deep-inspection-plan.json');
  console.log('🚀 Ready for systematic manual inspection of all 76 pages!');
  console.log('='.repeat(80));
}

createDetailedInspectionPlan();
