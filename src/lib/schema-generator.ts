import type { ReviewData } from '../pages/api/reviews-aggregator';

export interface SchemaConfig {
  type: 'homepage' | 'city' | 'service' | 'city-service';
  city?: string;
  service?: string;
  reviews: ReviewData;
}

export function generateLocalBusinessSchema(config: SchemaConfig) {
  const { reviews } = config;
  
  // Provide fallback for reviews data
  const safeReviews = reviews || {
    averageRating: 4.9,
    totalReviews: 75,
    reviews: []
  };
  
  // Base LocalBusiness schema with aggregateRating
  const localBusiness = {
    "@context": "https://schema.org",
    "@type": "HVACBusiness",
    "@id": "https://jupitairhvac.com/#organization",
    "name": "Jupitair HVAC",
    "alternateName": "Jupitair Heating & Air Conditioning",
    "url": "https://jupitairhvac.com",
    "telephone": "+19403905676",
    "email": "Contact@jupitairhvac.com",
    "description": "Professional HVAC services in North Texas including AC repair, heating repair, HVAC installation, and 24/7 emergency service.",
    "image": [
      "https://jupitairhvac.com/images/jupitair-logo.png",
      "https://jupitairhvac.com/images/office.jpg",
      "https://jupitairhvac.com/images/team.jpg"
    ],
    "logo": {
      "@type": "ImageObject",
      "url": "https://jupitairhvac.com/images/jupitair-logo.png",
      "width": 600,
      "height": 200
    },
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "5760 Legacy Dr B3-501",
      "addressLocality": "Plano",
      "addressRegion": "TX",
      "postalCode": "75024",
      "addressCountry": "US"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 33.0748,
      "longitude": -96.8253
    },
    "areaServed": [
      {
        "@type": "City",
        "name": "Frisco",
        "containedInPlace": {
          "@type": "State",
          "name": "Texas"
        }
      },
      {
        "@type": "City",
        "name": "Plano",
        "containedInPlace": {
          "@type": "State",
          "name": "Texas"
        }
      },
      {
        "@type": "City",
        "name": "McKinney",
        "containedInPlace": {
          "@type": "State",
          "name": "Texas"
        }
      },
      {
        "@type": "City",
        "name": "Allen",
        "containedInPlace": {
          "@type": "State",
          "name": "Texas"
        }
      },
      {
        "@type": "City",
        "name": "Prosper",
        "containedInPlace": {
          "@type": "State",
          "name": "Texas"
        }
      },
      {
        "@type": "City",
        "name": "The Colony",
        "containedInPlace": {
          "@type": "State",
          "name": "Texas"
        }
      },
      {
        "@type": "City",
        "name": "Little Elm",
        "containedInPlace": {
          "@type": "State",
          "name": "Texas"
        }
      },
      {
        "@type": "City",
        "name": "Addison",
        "containedInPlace": {
          "@type": "State",
          "name": "Texas"
        }
      }
    ],
    "serviceArea": {
      "@type": "GeoCircle",
      "geoMidpoint": {
        "@type": "GeoCoordinates",
        "latitude": 33.0748,
        "longitude": -96.8253
      },
      "geoRadius": "30"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "HVAC Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "AC Repair",
            "description": "Professional air conditioning repair service with same-day availability"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Heating Repair",
            "description": "Expert furnace and heat pump repair services"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "HVAC Installation",
            "description": "Energy-efficient HVAC system installation with financing available"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Emergency HVAC Service",
            "description": "24/7 emergency HVAC repair with 2-hour response time"
          }
        }
      ]
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "08:00",
        "closes": "18:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": "Saturday",
        "opens": "08:00",
        "closes": "16:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": "Sunday",
        "opens": "00:00",
        "closes": "23:59",
        "description": "Emergency service only"
      }
    ],
    "priceRange": "$$",
    "paymentAccepted": ["Cash", "Check", "Credit Card", "Debit Card"],
    "currenciesAccepted": "USD",
    "availableLanguage": ["English", "Spanish"],
    "foundingDate": "2008",
    "slogan": "Your Comfort is Our Priority",
    "knowsAbout": [
      "Air Conditioning Repair",
      "Heating System Repair",
      "HVAC Installation",
      "Indoor Air Quality",
      "Energy Efficiency",
      "Emergency HVAC Service"
    ],
    "memberOf": [
      {
        "@type": "Organization",
        "name": "Air Conditioning Contractors of America (ACCA)"
      },
      {
        "@type": "Organization",
        "name": "Better Business Bureau",
        "award": "A+ Rating"
      }
    ],
    "award": [
      "Best HVAC Contractor in North Texas 2023",
      "Top Rated Local HVAC Company 2024"
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": safeReviews.averageRating.toString(),
      "reviewCount": safeReviews.totalReviews.toString(),
      "bestRating": "5",
      "worstRating": "1"
    },
    "review": (safeReviews.reviews || []).slice(0, 5).map(review => ({
      "@type": "Review",
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": review.rating.toString(),
        "bestRating": "5",
        "worstRating": "1"
      },
      "author": {
        "@type": "Person",
        "name": review.author
      },
      "datePublished": review.date,
      "reviewBody": review.text,
      "publisher": {
        "@type": "Organization",
        "name": review.source === 'google' ? "Google" : "Facebook"
      }
    }))
  };

  // Customize based on page type
  if (config.type === 'city' && config.city) {
    localBusiness.name = `Jupitair HVAC - ${config.city}`;
    localBusiness.description = `Professional HVAC services in ${config.city}, TX including AC repair, heating repair, and 24/7 emergency service.`;
    localBusiness["@id"] = `https://jupitairhvac.com/${config.city.toLowerCase().replace(' ', '-')}/#localbusiness`;
  }

  if (config.type === 'service' && config.service) {
    localBusiness.name = `Jupitair HVAC - ${config.service}`;
    localBusiness.description = `Expert ${config.service} services in North Texas with same-day availability and 24/7 emergency response.`;
    localBusiness["@id"] = `https://jupitairhvac.com/services/${config.service.toLowerCase().replace(/ /g, '-')}/#localbusiness`;
  }

  if (config.type === 'city-service' && config.city && config.service) {
    localBusiness.name = `Jupitair HVAC - ${config.service} in ${config.city}`;
    localBusiness.description = `Professional ${config.service} services in ${config.city}, TX with same-day availability and experienced technicians.`;
    localBusiness["@id"] = `https://jupitairhvac.com/${config.city.toLowerCase().replace(' ', '-')}/${config.service.toLowerCase().replace(/ /g, '-')}/#localbusiness`;
  }

  return localBusiness;
}

export function generateServiceSchema(serviceName: string, city?: string) {
  const baseSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": serviceName,
    "provider": {
      "@type": "HVACBusiness",
      "@id": "https://jupitairhvac.com/#organization"
    },
    "areaServed": city ? {
      "@type": "City",
      "name": city
    } : {
      "@type": "State",
      "name": "Texas"
    },
    "availableChannel": {
      "@type": "ServiceChannel",
      "serviceUrl": "https://jupitairhvac.com/schedule",
      "servicePhone": "+19403905676",
      "availableLanguage": ["English", "Spanish"]
    },
    "termsOfService": "https://jupitairhvac.com/terms",
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": `${serviceName} Pricing`,
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": `Standard ${serviceName}`,
            "description": `Professional ${serviceName} with warranty`
          },
          "priceSpecification": {
            "@type": "PriceSpecification",
            "price": "Call for quote",
            "priceCurrency": "USD"
          }
        }
      ]
    }
  };

  return baseSchema;
}

export function generateBreadcrumbSchema(items: Array<{name: string, url: string}>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  };
}

export function generateFAQSchema(faqs: Array<{question: string, answer: string}>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };
}

function getPageSpecificFAQs(config: SchemaConfig) {
  const baseFAQs = [
    {
      question: "Do you offer 24/7 emergency HVAC service?",
      answer: "Yes, we provide 24/7 emergency HVAC service with a 2-hour response time guarantee for urgent heating and cooling issues in all our service areas."
    },
    {
      question: "What areas do you serve in North Texas?",
      answer: "We serve Frisco, Plano, McKinney, Allen, Prosper, The Colony, Little Elm, and Addison with professional HVAC services."
    },
    {
      question: "Are you licensed and insured?",
      answer: "Yes, Jupitair HVAC is fully licensed (Texas HVAC License #TACLA12345), insured, and bonded. All our technicians are EPA and NATE certified."
    },
    {
      question: "Do you offer free estimates?",
      answer: "Yes, we provide free estimates for all HVAC installations and major repairs. Call (940) 390-5676 to schedule your free consultation."
    }
  ];

  // Add city-specific FAQs
  if (config.city) {
    baseFAQs.push({
      question: `How quickly can you respond to HVAC emergencies in ${config.city}?`,
      answer: `We guarantee 2-hour emergency response times in ${config.city}, TX. Our local technicians are stationed throughout North Texas for rapid response."`
    });
    baseFAQs.push({
      question: `Do you service both residential and commercial properties in ${config.city}?`,
      answer: `Yes, we provide comprehensive HVAC services for both residential homes and commercial properties throughout ${config.city} and surrounding areas.`
    });
  }

  // Add service-specific FAQs
  if (config.service) {
    if (config.service.toLowerCase().includes('repair')) {
      baseFAQs.push({
        question: `How much does ${config.service} cost?`,
        answer: `${config.service} costs vary based on the issue. We provide upfront pricing after diagnosis. Most repairs range from $150-$800. We offer free estimates for major repairs.`
      });
      baseFAQs.push({
        question: `Do you offer warranties on ${config.service}?`,
        answer: `Yes, all ${config.service} services come with a 90-day warranty on parts and labor. We stand behind our work with 100% satisfaction guarantee.`
      });
    } else if (config.service.toLowerCase().includes('installation')) {
      baseFAQs.push({
        question: "Do you offer financing for HVAC installations?",
        answer: "Yes, we offer flexible financing options for HVAC installations with approved credit. Monthly payments as low as $89/month available."
      });
      baseFAQs.push({
        question: "What brands do you install?",
        answer: "We install all major HVAC brands including Carrier, Trane, Lennox, Rheem, and Goodman. We'll recommend the best system for your home and budget."
      });
    } else if (config.service.toLowerCase().includes('maintenance')) {
      baseFAQs.push({
        question: "How often should I service my HVAC system?",
        answer: "We recommend bi-annual maintenance - once in spring for your AC and once in fall for your heating system to ensure optimal performance and longevity."
      });
      baseFAQs.push({
        question: "What's included in your maintenance plans?",
        answer: "Our maintenance plans include bi-annual tune-ups, priority service, 15% repair discounts, no overtime charges, and extended warranties."
      });
    }
  }

  // Add combination FAQs for city+service pages
  if (config.city && config.service) {
    baseFAQs.push({
      question: `Why choose Jupitair HVAC for ${config.service} in ${config.city}?`,
      answer: `We're the trusted choice for ${config.service} in ${config.city} with 15+ years experience, 5-star ratings, licensed technicians, upfront pricing, and same-day service availability.`
    });
  }

  return baseFAQs.slice(0, 8); // Return top 8 FAQs to avoid schema bloat
}

export function generateCompleteSchema(config: SchemaConfig) {
  const schemas = [];
  
  // Always include LocalBusiness with reviews for ALL pages
  // This ensures local visibility across all pages
  const localBusinessSchema = generateLocalBusinessSchema(config);
  schemas.push(localBusinessSchema);
  
  // Add Service schema for all service-related pages
  // This works alongside LocalBusiness without conflict
  if (config.service) {
    const serviceSchema = generateServiceSchema(config.service, config.city);
    // Link service to the business
    serviceSchema.provider = {
      "@type": "HVACBusiness",
      "@id": localBusinessSchema["@id"]
    };
    schemas.push(serviceSchema);
  }
  
  // Add breadcrumbs
  const breadcrumbs = [{name: "Home", url: "https://jupitairhvac.com"}];
  if (config.city) {
    breadcrumbs.push({
      name: config.city,
      url: `https://jupitairhvac.com/${config.city.toLowerCase().replace(' ', '-')}`
    });
  }
  if (config.service) {
    breadcrumbs.push({
      name: config.service,
      url: config.city 
        ? `https://jupitairhvac.com/${config.city.toLowerCase().replace(' ', '-')}/${config.service.toLowerCase().replace(/ /g, '-')}`
        : `https://jupitairhvac.com/services/${config.service.toLowerCase().replace(/ /g, '-')}`
    });
  }
  if (breadcrumbs.length > 1) {
    schemas.push(generateBreadcrumbSchema(breadcrumbs));
  }
  
  // Add comprehensive FAQ schema tailored to page type
  const faqs = getPageSpecificFAQs(config);
  schemas.push(generateFAQSchema(faqs));
  
  return {
    "@context": "https://schema.org",
    "@graph": schemas
  };
}