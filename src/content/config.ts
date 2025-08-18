import { defineCollection, z } from 'astro:content';

const cities = defineCollection({
  type: 'data',
  schema: z.object({
    cities: z.array(z.object({
      slug: z.string(),
      name: z.string(),
      fullName: z.string(),
      state: z.string(),
      zip: z.union([z.string(), z.number()]).transform(val => String(val)),
      county: z.string(),
      population: z.number(),
      coordinates: z.object({
        lat: z.number(),
        lng: z.number(),
      }),
      description: z.string(),
      shortDescription: z.string(),
      serviceRadius: z.number(),
      priority: z.number(),
      established: z.boolean(),
      keywords: z.array(z.string()),
      demographics: z.object({
        medianIncome: z.number(),
        homeOwnership: z.number(),
        avgHomeAge: z.number(),
      }),
      marketData: z.object({
        competition: z.string(),
        opportunity: z.string(),
        searchVolume: z.number(),
      }),
    }))
  })
});

const services = defineCollection({
  type: 'data',
  schema: z.object({
    services: z.array(z.object({
      slug: z.string(),
      name: z.string(),
      title: z.string(),
      description: z.string(),
      shortDescription: z.string(),
      category: z.string(),
      priority: z.number(),
      emergency: z.boolean(),
      residential: z.boolean(),
      commercial: z.boolean(),
      keywords: z.array(z.string()).optional(),
      pricing: z.object({
        starting: z.number(),
        average: z.number(),
        description: z.string().optional(),
      }).optional(),
      serviceTime: z.string().optional(),
      warranty: z.string().optional(),
    }))
  })
});

// MDX pages collection for SEO-optimized service pages
const pages = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    keywords: z.string(),
    canonicalUrl: z.string(),
    image: z.string().optional(),
    author: z.string().default('Jupitair HVAC'),
    lastModified: z.string(),
    service: z.string(),
    enableSchema: z.object({
      service: z.boolean().default(true),
      breadcrumbs: z.boolean().default(true),
      faq: z.boolean().default(true),
    }).optional(),
    pricing: z.object({
      min: z.number(),
      max: z.number(),
      unit: z.string().default('installation'),
    }).optional(),
    tags: z.array(z.string()).optional(),
  })
});

// Blog collection for SEO-optimized blog posts
const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    author: z.string().default('Jupitair HVAC Team'),
    publishDate: z.coerce.date(),
    updateDate: z.coerce.date().optional(),
    heroImage: z.string().optional(),
    heroImageAlt: z.string().optional(),
    category: z.string(),
    subcategory: z.string().optional(),
    tags: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
    
    // SEO Fields
    metaTitle: z.string().optional(),
    metaDescription: z.string().max(160).optional(),
    primaryKeyword: z.string(),
    secondaryKeywords: z.array(z.string()).default([]),
    canonicalURL: z.string().optional(),
    
    // Content Structure
    readingTime: z.number().optional(),
    tableOfContents: z.boolean().default(true),
    
    // Schema Markup
    schemaTypes: z.array(z.enum([
      'Article',
      'FAQPage',
      'HowTo',
      'BlogPosting',
      'TechArticle'
    ])).default(['BlogPosting']),
    
    // CTA Configuration
    ctaText: z.string().default('Schedule Service'),
    ctaLink: z.string().default('/schedule'),
    
    // Related Content
    relatedPosts: z.array(z.string()).default([]),
    internalLinks: z.array(z.string()).default([]),
    
    // Location Targeting
    targetCity: z.enum([
      'all',
      'frisco',
      'plano',
      'mckinney',
      'allen',
      'prosper',
      'little-elm',
      'the-colony',
      'addison'
    ]).default('all'),
  })
});

export const collections = {
  cities,
  services,
  pages,
  blog,
};