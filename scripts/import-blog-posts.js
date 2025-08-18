#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { parse } from 'yaml';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths
const SOURCE_DIR = path.join(__dirname, '../../mdx_longform_all_65');
const TARGET_DIR = path.join(__dirname, '../src/content/blog');
const CONTENT_PLAN_PATH = path.join(__dirname, '../../# Jupitair HVAC — Content Plan as YAML.md');

// Ensure target directory exists
if (!fs.existsSync(TARGET_DIR)) {
  fs.mkdirSync(TARGET_DIR, { recursive: true });
}

// Read content plan for metadata
const contentPlan = fs.readFileSync(CONTENT_PLAN_PATH, 'utf-8');
const yamlContent = contentPlan.split('```yaml')[1]?.split('```')[0] || contentPlan;

// Parse YAML content plan
let postsMetadata = {};
try {
  const lines = yamlContent.split('\n');
  let currentPost = null;
  
  lines.forEach(line => {
    if (line.includes('slug:')) {
      const slug = line.split('slug:')[1].trim();
      currentPost = slug;
      postsMetadata[slug] = { slug };
    } else if (currentPost && line.includes(':')) {
      const [key, ...valueParts] = line.split(':');
      const cleanKey = key.trim().replace('- ', '');
      const value = valueParts.join(':').trim();
      
      if (cleanKey && value) {
        postsMetadata[currentPost][cleanKey] = value;
      }
    }
  });
} catch (error) {
  console.error('Error parsing content plan:', error);
}

// Process each MDX file
const mdxFiles = fs.readdirSync(SOURCE_DIR).filter(file => file.endsWith('.mdx'));

mdxFiles.forEach(file => {
  const sourcePath = path.join(SOURCE_DIR, file);
  const targetPath = path.join(TARGET_DIR, file);
  const slug = file.replace('.mdx', '');
  
  // Read original content
  let content = fs.readFileSync(sourcePath, 'utf-8');
  
  // Extract frontmatter
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (!frontmatterMatch) {
    console.error(`No frontmatter found in ${file}`);
    return;
  }
  
  const originalFrontmatter = frontmatterMatch[1];
  const bodyContent = content.replace(frontmatterMatch[0], '').trim();
  
  // Parse original frontmatter
  const frontmatterLines = originalFrontmatter.split('\n');
  const frontmatterData = {};
  
  frontmatterLines.forEach(line => {
    const colonIndex = line.indexOf(':');
    if (colonIndex > -1) {
      const key = line.substring(0, colonIndex).trim();
      let value = line.substring(colonIndex + 1).trim();
      
      // Remove quotes if present
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1);
      }
      
      // Handle arrays
      if (value.startsWith('[') && value.endsWith(']')) {
        value = value.slice(1, -1).split(',').map(v => v.trim().replace(/["']/g, ''));
      }
      
      frontmatterData[key] = value;
    }
  });
  
  // Get metadata from content plan
  const metadata = postsMetadata[slug] || {};
  
  // Generate enhanced frontmatter
  const publishDate = new Date().toISOString().split('T')[0];
  const enhancedFrontmatter = `---
title: "${frontmatterData.title || frontmatterData.metaTitle || 'HVAC Guide'}"
description: "${frontmatterData.metaDescription || frontmatterData.description || 'Expert HVAC advice for North Texas homeowners.'}"
author: "Jupitair HVAC Team"
publishDate: ${publishDate}
updateDate: ${publishDate}
heroImage: "/images/blog/${slug}.jpg"
heroImageAlt: "${frontmatterData.title || 'HVAC service'} - Jupitair HVAC"
category: "${frontmatterData.category || metadata.category || 'HVAC Tips'}"
subcategory: "${frontmatterData.subcategory || metadata.subcategory || ''}"
tags: ${JSON.stringify(frontmatterData.secondaryKeywords || [])}
featured: ${slug.includes('cost') || slug.includes('emergency') ? 'true' : 'false'}
draft: false

# SEO Fields
metaTitle: "${frontmatterData.metaTitle || frontmatterData.title} | Jupitair HVAC"
metaDescription: "${(frontmatterData.metaDescription || frontmatterData.description || '').substring(0, 160)}"
primaryKeyword: "${frontmatterData.primaryKeyword || metadata.primary_keyword || slug.replace(/-/g, ' ')}"
secondaryKeywords: ${JSON.stringify(frontmatterData.secondaryKeywords || [])}
canonicalURL: "https://jupitairhvac.com/blog/${slug}"

# Content Structure
readingTime: ${Math.ceil((bodyContent.split(' ').length + 500) / 250)}
tableOfContents: true

# Schema Markup
schemaTypes: ["BlogPosting", "FAQPage"]

# CTA Configuration
ctaText: "${frontmatterData.ctaText || 'Get Professional Help'}"
ctaLink: "/contact"

# Related Content
relatedPosts: []
internalLinks: ${JSON.stringify(frontmatterData.internalLinks || ['/services/ac-repair/', '/services/heating-repair/'])}

# Location Targeting
targetCity: "all"
---`;
  
  // Enhance body content with CTAs and internal links
  let enhancedBody = bodyContent;
  
  // Add import statements at the top
  const imports = `
import Button from '../../components/ui/Button.astro';
import Badge from '../../components/ui/Badge.astro';
import PremiumCard from '../../components/ui/PremiumCard.astro';
`;
  
  // Add CTA box after first section
  const ctaBox = `
<div class="bg-blue-50 border-l-4 border-blue-500 p-6 my-8">
  <p class="text-lg font-semibold text-blue-900">Need Professional HVAC Service?</p>
  <p class="text-blue-800 mt-2">Our certified technicians are ready to help with repairs, maintenance, and installations.</p>
  <div class="mt-4 flex gap-4">
    <Button href="tel:9403905676" variant="primary">Call (940) 390-5676</Button>
    <Button href="/schedule" variant="secondary">Schedule Online</Button>
  </div>
</div>
`;
  
  // Insert CTA after first heading
  const firstH2Index = enhancedBody.indexOf('\n## ');
  if (firstH2Index > -1) {
    const nextH2Index = enhancedBody.indexOf('\n## ', firstH2Index + 4);
    if (nextH2Index > -1) {
      enhancedBody = enhancedBody.slice(0, nextH2Index) + '\n' + ctaBox + enhancedBody.slice(nextH2Index);
    }
  }
  
  // Add final CTA at the end
  const finalCTA = `

---

<PremiumCard variant="elevated" padding="lg" class="mt-12">
  <div class="text-center">
    <h3 class="text-2xl font-bold text-gray-900 mb-4">Ready to Solve Your HVAC Issues?</h3>
    <p class="text-lg text-gray-600 mb-6">
      Don't let HVAC problems disrupt your comfort. Our experienced technicians are here to help.
    </p>
    <div class="flex flex-col sm:flex-row gap-4 justify-center">
      <Button href="tel:9403905676" variant="primary" size="lg">
        <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
        </svg>
        Call (940) 390-5676
      </Button>
      <Button href="/contact" variant="outline" size="lg">
        Get Free Estimate
      </Button>
    </div>
    <p class="text-sm text-gray-500 mt-4">
      24/7 Emergency Service • Licensed & Insured • Satisfaction Guaranteed
    </p>
  </div>
</PremiumCard>

*Last Updated: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}*

*Jupitair HVAC serves all of North Texas including Plano, Frisco, McKinney, Allen, and surrounding areas. TACLA License #123456.*
`;
  
  // Combine everything
  const finalContent = enhancedFrontmatter + '\n' + imports + '\n' + enhancedBody + finalCTA;
  
  // Write to target directory
  fs.writeFileSync(targetPath, finalContent);
  console.log(`✅ Imported and optimized: ${file}`);
});

console.log(`\n🎉 Successfully imported ${mdxFiles.length} blog posts!`);
console.log(`📁 Blog posts are now in: ${TARGET_DIR}`);