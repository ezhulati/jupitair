/**
 * Lighthouse CI Configuration for Jupitair HVAC
 * Performance monitoring and optimization
 */

module.exports = {
  ci: {
    collect: {
      url: [
        'http://localhost:4321/', // Homepage
        'http://localhost:4321/services/ac-repair/', // Service page
        'http://localhost:4321/frisco/', // City page
        'http://localhost:4321/frisco/ac-repair/', // City + Service page
        'http://localhost:4321/services/emergency-hvac/', // Emergency service
        'http://localhost:4321/contact/', // Contact page
      ],
      startServerCommand: 'npm run build && npm run preview',
      numberOfRuns: 3,
      settings: {
        chromeFlags: '--no-sandbox --headless',
        preset: 'desktop'
      }
    },
    assert: {
      assertions: {
        // Performance thresholds
        'categories:performance': ['error', {minScore: 0.85}],
        'categories:accessibility': ['error', {minScore: 0.95}],
        'categories:best-practices': ['error', {minScore: 0.90}],
        'categories:seo': ['error', {minScore: 0.95}],
        
        // Core Web Vitals
        'first-contentful-paint': ['error', {maxNumericValue: 2000}],
        'largest-contentful-paint': ['error', {maxNumericValue: 2500}],
        'cumulative-layout-shift': ['error', {maxNumericValue: 0.1}],
        'speed-index': ['error', {maxNumericValue: 3000}],
        'interactive': ['error', {maxNumericValue: 3000}],
        
        // SEO requirements
        'meta-description': 'error',
        'document-title': 'error',
        'canonical': 'error',
        'robots-txt': 'error',
        
        // Accessibility requirements
        'color-contrast': 'error',
        'image-alt': 'error',
        'label': 'error',
        'heading-order': 'error',
        
        // HVAC-specific optimizations
        'unused-javascript': ['warn', {maxNumericValue: 50000}],
        'unused-css-rules': ['warn', {maxNumericValue: 20000}],
        'render-blocking-resources': 'warn',
        'uses-optimized-images': 'error',
        'modern-image-formats': 'warn',
        
        // Mobile performance
        'tap-targets': 'error',
        'viewport': 'error',
        
        // Security
        'is-on-https': 'error',
        'uses-http2': 'warn'
      }
    },
    upload: {
      target: 'temporary-public-storage'
    },
    server: {
      port: 9001,
      storage: './lighthouse-results'
    }
  }
};

// Performance budgets for different page types
const performanceBudgets = {
  homepage: {
    'first-contentful-paint': 1500,
    'largest-contentful-paint': 2000,
    'speed-index': 2500,
    'cumulative-layout-shift': 0.1,
    'interactive': 2500
  },
  servicePage: {
    'first-contentful-paint': 1800,
    'largest-contentful-paint': 2300,
    'speed-index': 3000,
    'cumulative-layout-shift': 0.1,
    'interactive': 3000
  },
  cityPage: {
    'first-contentful-paint': 1600,
    'largest-contentful-paint': 2100,
    'speed-index': 2800,
    'cumulative-layout-shift': 0.1,
    'interactive': 2800
  },
  emergencyPage: {
    'first-contentful-paint': 1200, // Critical for emergency
    'largest-contentful-paint': 1800,
    'speed-index': 2000,
    'cumulative-layout-shift': 0.05,
    'interactive': 2000
  }
};

module.exports.performanceBudgets = performanceBudgets;