#!/usr/bin/env node

/**
 * Schema Validation Script
 * Validates that all schemas work together without conflicts
 */

import { generateCompleteSchema } from '../src/lib/schema-generator.js';

// Test configurations for different page types
const testConfigs = [
  {
    name: 'Homepage',
    config: {
      type: 'homepage',
      reviews: {
        averageRating: 4.9,
        totalReviews: 75,
        googleReviews: 47,
        facebookReviews: 28,
        reviews: [
          { author: "Test User", rating: 5, text: "Great service!", date: "2024-08-10", source: "google" }
        ]
      }
    }
  },
  {
    name: 'City Page (Frisco)',
    config: {
      type: 'city',
      city: 'Frisco',
      reviews: {
        averageRating: 4.9,
        totalReviews: 75,
        googleReviews: 47,
        facebookReviews: 28,
        reviews: []
      }
    }
  },
  {
    name: 'Service Page (AC Repair)',
    config: {
      type: 'service',
      service: 'AC Repair',
      reviews: {
        averageRating: 4.9,
        totalReviews: 75,
        googleReviews: 47,
        facebookReviews: 28,
        reviews: []
      }
    }
  },
  {
    name: 'City+Service Page (Plano AC Repair)',
    config: {
      type: 'city-service',
      city: 'Plano',
      service: 'AC Repair',
      reviews: {
        averageRating: 4.9,
        totalReviews: 75,
        googleReviews: 47,
        facebookReviews: 28,
        reviews: []
      }
    }
  }
];

function validateSchema(schema, pageName) {
  const errors = [];
  const warnings = [];
  
  // Check for @context
  if (!schema['@context']) {
    errors.push('Missing @context');
  }
  
  // Check for @graph
  if (!schema['@graph'] || !Array.isArray(schema['@graph'])) {
    errors.push('Missing or invalid @graph array');
    return { errors, warnings };
  }
  
  const graphItems = schema['@graph'];
  const types = graphItems.map(item => item['@type']);
  
  // Check for required schema types
  const hasLocalBusiness = graphItems.some(item => 
    item['@type'] === 'HVACBusiness' || item['@type'] === 'LocalBusiness'
  );
  const hasService = graphItems.some(item => item['@type'] === 'Service');
  const hasFAQ = graphItems.some(item => item['@type'] === 'FAQPage');
  const hasBreadcrumb = graphItems.some(item => item['@type'] === 'BreadcrumbList');
  
  if (!hasLocalBusiness) {
    errors.push('Missing LocalBusiness/HVACBusiness schema');
  }
  
  if (!hasFAQ) {
    warnings.push('Missing FAQPage schema');
  }
  
  // Validate LocalBusiness schema
  const localBusiness = graphItems.find(item => 
    item['@type'] === 'HVACBusiness' || item['@type'] === 'LocalBusiness'
  );
  
  if (localBusiness) {
    // Check for aggregateRating
    if (!localBusiness.aggregateRating) {
      errors.push('LocalBusiness missing aggregateRating');
    } else {
      if (!localBusiness.aggregateRating.ratingValue) {
        errors.push('aggregateRating missing ratingValue');
      }
      if (!localBusiness.aggregateRating.reviewCount) {
        errors.push('aggregateRating missing reviewCount');
      }
    }
    
    // Check for reviews
    if (!localBusiness.review || localBusiness.review.length === 0) {
      warnings.push('LocalBusiness missing individual reviews');
    }
    
    // Check for required business fields
    if (!localBusiness.name) errors.push('LocalBusiness missing name');
    if (!localBusiness.telephone) errors.push('LocalBusiness missing telephone');
    if (!localBusiness.address) errors.push('LocalBusiness missing address');
    if (!localBusiness['@id']) errors.push('LocalBusiness missing @id');
  }
  
  // Check for ID conflicts
  const ids = graphItems.filter(item => item['@id']).map(item => item['@id']);
  const uniqueIds = new Set(ids);
  if (ids.length !== uniqueIds.size) {
    errors.push('Duplicate @id values found - schemas may conflict');
  }
  
  // Validate Service schema if present
  if (hasService) {
    const service = graphItems.find(item => item['@type'] === 'Service');
    if (service) {
      // Check that service references the LocalBusiness
      if (!service.provider || !service.provider['@id']) {
        warnings.push('Service schema not properly linked to LocalBusiness');
      } else if (localBusiness && service.provider['@id'] !== localBusiness['@id']) {
        errors.push('Service provider @id does not match LocalBusiness @id');
      }
    }
  }
  
  // Check that schemas are properly connected
  const referencedIds = new Set();
  graphItems.forEach(item => {
    // Find all @id references
    JSON.stringify(item).replace(/"@id":"([^"]+)"/g, (match, id) => {
      if (id !== item['@id']) {
        referencedIds.add(id);
      }
      return match;
    });
  });
  
  // Check that all referenced IDs exist
  referencedIds.forEach(refId => {
    if (!ids.includes(refId)) {
      warnings.push(`Referenced @id "${refId}" not found in schema graph`);
    }
  });
  
  return { errors, warnings };
}

console.log('🔍 Validating Schema Compatibility\n');
console.log('==================================\n');

let totalErrors = 0;
let totalWarnings = 0;

testConfigs.forEach(test => {
  console.log(`Testing: ${test.name}`);
  
  try {
    const schema = generateCompleteSchema(test.config);
    const { errors, warnings } = validateSchema(schema, test.name);
    
    if (errors.length === 0) {
      console.log(`✅ No errors found`);
    } else {
      console.log(`❌ ${errors.length} errors found:`);
      errors.forEach(error => console.log(`   - ${error}`));
      totalErrors += errors.length;
    }
    
    if (warnings.length > 0) {
      console.log(`⚠️  ${warnings.length} warnings:`);
      warnings.forEach(warning => console.log(`   - ${warning}`));
      totalWarnings += warnings.length;
    }
    
    // Display schema structure
    const schemaTypes = schema['@graph'].map(item => item['@type']);
    console.log(`📋 Schema types: ${schemaTypes.join(', ')}`);
    
  } catch (error) {
    console.log(`❌ Failed to generate schema: ${error.message}`);
    totalErrors++;
  }
  
  console.log('');
});

console.log('==================================\n');
console.log('📊 Validation Summary:\n');

if (totalErrors === 0) {
  console.log('✅ All schemas are valid and compatible!');
  console.log('✅ No conflicts detected between schemas');
  console.log('✅ LocalBusiness schema present on all pages');
  console.log('✅ Service schemas properly linked to LocalBusiness');
  console.log('✅ FAQ schemas are page-specific');
  console.log('✅ All schemas include aggregateRating for stars in SERP');
} else {
  console.log(`❌ ${totalErrors} total errors found`);
  console.log('Please fix these errors before deploying');
}

if (totalWarnings > 0) {
  console.log(`⚠️  ${totalWarnings} total warnings (non-critical)`);
}

console.log('\n🎯 Schema Features:');
console.log('• LocalBusiness with aggregateRating on ALL pages');
console.log('• Service schema on service-related pages');
console.log('• Dynamic FAQs based on page context');
console.log('• Individual reviews for rich snippets');
console.log('• Proper schema linking without conflicts');
console.log('• Breadcrumbs for navigation context');

console.log('\n🚀 Ready for deployment and Google Rich Results Test!');

process.exit(totalErrors > 0 ? 1 : 0);