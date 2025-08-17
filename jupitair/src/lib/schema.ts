/**
 * Schema.org JSON-LD helpers for Jupitair HVAC
 * Generates structured data for better SEO
 */

export interface ServiceSchemaProps {
  serviceName: string;
  serviceDescription: string;
  serviceUrl: string;
  cityName?: string;
  priceRange?: string;
  serviceType?: string;
}

export interface CitySchemaProps {
  cityName: string;
  cityDescription: string;
  cityUrl: string;
  population?: number;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface ReviewSchemaProps {
  reviewBody: string;
  reviewRating: number;
  authorName: string;
  reviewDate: string;
}

// Base LocalBusiness schema for Jupitair HVAC
export const baseLocalBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Jupitair HVAC",
  "image": "https://jupitairhvac.com/logo.png",
  "description": "Professional HVAC services throughout North Texas including AC repair, heating repair, HVAC installation, and emergency service.",
  "url": "https://jupitairhvac.com",
  "telephone": "(214) 555-HVAC",
  "priceRange": "$$",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "123 Main Street",
    "addressLocality": "Frisco",
    "addressRegion": "TX",
    "postalCode": "75034",
    "addressCountry": "US"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 33.1507,
    "longitude": -96.8236
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
    }
  ],
  "areaServed": [
    {
      "@type": "City",
      "name": "Frisco",
      "addressRegion": "TX"
    },
    {
      "@type": "City",
      "name": "Plano",
      "addressRegion": "TX"
    },
    {
      "@type": "City",
      "name": "McKinney",
      "addressRegion": "TX"
    },
    {
      "@type": "City",
      "name": "Allen",
      "addressRegion": "TX"
    },
    {
      "@type": "City",
      "name": "Prosper",
      "addressRegion": "TX"
    },
    {
      "@type": "City",
      "name": "The Colony",
      "addressRegion": "TX"
    },
    {
      "@type": "City",
      "name": "Little Elm",
      "addressRegion": "TX"
    },
    {
      "@type": "City",
      "name": "Addison",
      "addressRegion": "TX"
    }
  ]
};

// Service schema generator
export function generateServiceSchema(props: ServiceSchemaProps) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": props.serviceName,
    "description": props.serviceDescription,
    "url": props.serviceUrl,
    "provider": {
      "@type": "LocalBusiness",
      "name": "Jupitair HVAC",
      "telephone": "(214) 555-HVAC",
      "url": "https://jupitairhvac.com"
    },
    "serviceType": props.serviceType || "HVAC Service",
    "areaServed": props.cityName ? {
      "@type": "City",
      "name": props.cityName,
      "addressRegion": "TX"
    } : [
      {
        "@type": "City",
        "name": "Frisco",
        "addressRegion": "TX"
      },
      {
        "@type": "City",
        "name": "Plano",
        "addressRegion": "TX"
      },
      {
        "@type": "City",
        "name": "McKinney",
        "addressRegion": "TX"
      },
      {
        "@type": "City",
        "name": "Allen",
        "addressRegion": "TX"
      },
      {
        "@type": "City",
        "name": "Prosper",
        "addressRegion": "TX"
      },
      {
        "@type": "City",
        "name": "The Colony",
        "addressRegion": "TX"
      },
      {
        "@type": "City",
        "name": "Little Elm",
        "addressRegion": "TX"
      },
      {
        "@type": "City",
        "name": "Addison",
        "addressRegion": "TX"
      }
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "HVAC Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": props.serviceName
          },
          "priceRange": props.priceRange || "$$"
        }
      ]
    }
  };
}

// Emergency service schema
export function generateEmergencyServiceSchema(cityName?: string) {
  return {
    "@context": "https://schema.org",
    "@type": "EmergencyService",
    "name": "24/7 Emergency HVAC Service",
    "description": "Round-the-clock emergency HVAC repair services for urgent heating and cooling issues",
    "provider": {
      "@type": "LocalBusiness",
      "name": "Jupitair HVAC",
      "telephone": "(214) 555-HVAC"
    },
    "areaServed": cityName ? {
      "@type": "City",
      "name": cityName,
      "addressRegion": "TX"
    } : {
      "@type": "State",
      "name": "Texas",
      "containsPlace": [
        { "@type": "City", "name": "Frisco" },
        { "@type": "City", "name": "Plano" },
        { "@type": "City", "name": "McKinney" },
        { "@type": "City", "name": "Allen" },
        { "@type": "City", "name": "Prosper" },
        { "@type": "City", "name": "The Colony" },
        { "@type": "City", "name": "Little Elm" },
        { "@type": "City", "name": "Addison" }
      ]
    },
    "openingHours": "Mo,Tu,We,Th,Fr,Sa,Su 00:00-23:59",
    "serviceType": "Emergency HVAC Repair"
  };
}

// Local area schema for city pages
export function generateLocalAreaSchema(props: CitySchemaProps) {
  const schema: any = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": `Jupitair HVAC - ${props.cityName} Service`,
    "description": props.cityDescription,
    "url": props.cityUrl,
    "telephone": "(214) 555-HVAC",
    "areaServed": {
      "@type": "City",
      "name": props.cityName,
      "addressRegion": "TX"
    },
    "serviceArea": {
      "@type": "GeoCircle",
      "geoMidpoint": props.coordinates ? {
        "@type": "GeoCoordinates",
        "latitude": props.coordinates.lat,
        "longitude": props.coordinates.lng
      } : {
        "@type": "GeoCoordinates",
        "latitude": 33.1507,
        "longitude": -96.8236
      },
      "geoRadius": "25000" // 25km radius
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": `HVAC Services in ${props.cityName}`,
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "AC Repair",
            "description": `Professional air conditioning repair services in ${props.cityName}, TX`
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Heating Repair",
            "description": `Expert heating system repair services in ${props.cityName}, TX`
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "HVAC Installation",
            "description": `Complete HVAC system installation in ${props.cityName}, TX`
          }
        }
      ]
    }
  };

  if (props.population) {
    schema.areaServed.population = props.population;
  }

  return schema;
}

// Review/Rating schema
export function generateReviewSchema(reviews: ReviewSchemaProps[]) {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Jupitair HVAC",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": reviews.length.toString(),
      "bestRating": "5",
      "worstRating": "1"
    },
    "review": reviews.map(review => ({
      "@type": "Review",
      "reviewBody": review.reviewBody,
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": review.reviewRating.toString(),
        "bestRating": "5",
        "worstRating": "1"
      },
      "author": {
        "@type": "Person",
        "name": review.authorName
      },
      "datePublished": review.reviewDate
    }))
  };
}

// FAQ schema generator
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

// Breadcrumb schema
export function generateBreadcrumbSchema(breadcrumbs: Array<{name: string, url: string}>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": crumb.name,
      "item": crumb.url
    }))
  };
}

// Organization schema with complete details
export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Jupitair HVAC",
    "legalName": "Jupitair HVAC LLC",
    "url": "https://jupitairhvac.com",
    "logo": "https://jupitairhvac.com/logo.png",
    "description": "Professional HVAC contractor serving North Texas since 2008. Specializing in AC repair, heating repair, HVAC installation, and emergency service.",
    "foundingDate": "2008",
    "numberOfEmployees": "15-20",
    "slogan": "North Texas Premier HVAC Services",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "123 Main Street",
      "addressLocality": "Frisco",
      "addressRegion": "TX",
      "postalCode": "75034",
      "addressCountry": "US"
    },
    "contactPoint": [
      {
        "@type": "ContactPoint",
        "telephone": "(214) 555-HVAC",
        "contactType": "customer service",
        "areaServed": "TX",
        "availableLanguage": "English"
      },
      {
        "@type": "ContactPoint",
        "telephone": "(214) 555-HVAC",
        "contactType": "emergency service",
        "areaServed": "TX",
        "hoursAvailable": "Mo,Tu,We,Th,Fr,Sa,Su 00:00-23:59"
      }
    ],
    "sameAs": [
      "https://www.facebook.com/JupitairHVAC",
      "https://www.google.com/maps/place/Jupitair+HVAC",
      "https://www.yelp.com/biz/jupitair-hvac"
    ],
    "serviceArea": {
      "@type": "State",
      "name": "Texas",
      "containsPlace": [
        { "@type": "City", "name": "Frisco", "addressRegion": "TX" },
        { "@type": "City", "name": "Plano", "addressRegion": "TX" },
        { "@type": "City", "name": "McKinney", "addressRegion": "TX" },
        { "@type": "City", "name": "Allen", "addressRegion": "TX" },
        { "@type": "City", "name": "Prosper", "addressRegion": "TX" },
        { "@type": "City", "name": "The Colony", "addressRegion": "TX" },
        { "@type": "City", "name": "Little Elm", "addressRegion": "TX" },
        { "@type": "City", "name": "Addison", "addressRegion": "TX" }
      ]
    }
  };
}

// Product/Service catalog schema
export function generateServiceCatalogSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "HVAC Services",
    "description": "Complete HVAC services offered by Jupitair HVAC",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "item": {
          "@type": "Service",
          "name": "AC Repair",
          "description": "Professional air conditioning repair services",
          "provider": {
            "@type": "LocalBusiness",
            "name": "Jupitair HVAC"
          }
        }
      },
      {
        "@type": "ListItem",
        "position": 2,
        "item": {
          "@type": "Service",
          "name": "Heating Repair",
          "description": "Expert heating system repair and maintenance",
          "provider": {
            "@type": "LocalBusiness",
            "name": "Jupitair HVAC"
          }
        }
      },
      {
        "@type": "ListItem",
        "position": 3,
        "item": {
          "@type": "Service",
          "name": "HVAC Installation",
          "description": "Complete HVAC system installation and replacement",
          "provider": {
            "@type": "LocalBusiness",
            "name": "Jupitair HVAC"
          }
        }
      },
      {
        "@type": "ListItem",
        "position": 4,
        "item": {
          "@type": "Service",
          "name": "Duct Cleaning",
          "description": "Professional air duct cleaning services",
          "provider": {
            "@type": "LocalBusiness",
            "name": "Jupitair HVAC"
          }
        }
      },
      {
        "@type": "ListItem",
        "position": 5,
        "item": {
          "@type": "Service",
          "name": "Thermostat Installation",
          "description": "Smart and programmable thermostat installation",
          "provider": {
            "@type": "LocalBusiness",
            "name": "Jupitair HVAC"
          }
        }
      },
      {
        "@type": "ListItem",
        "position": 6,
        "item": {
          "@type": "Service",
          "name": "Energy Upgrades",
          "description": "HVAC energy efficiency upgrades and improvements",
          "provider": {
            "@type": "LocalBusiness",
            "name": "Jupitair HVAC"
          }
        }
      },
      {
        "@type": "ListItem",
        "position": 7,
        "item": {
          "@type": "EmergencyService",
          "name": "Emergency HVAC Service",
          "description": "24/7 emergency HVAC repair services",
          "provider": {
            "@type": "LocalBusiness",
            "name": "Jupitair HVAC"
          }
        }
      },
      {
        "@type": "ListItem",
        "position": 8,
        "item": {
          "@type": "Service",
          "name": "Commercial HVAC",
          "description": "Commercial HVAC services for businesses",
          "provider": {
            "@type": "LocalBusiness",
            "name": "Jupitair HVAC"
          }
        }
      },
      {
        "@type": "ListItem",
        "position": 9,
        "item": {
          "@type": "Service",
          "name": "Residential HVAC",
          "description": "Residential HVAC services for homes",
          "provider": {
            "@type": "LocalBusiness",
            "name": "Jupitair HVAC"
          }
        }
      }
    ]
  };
}

// Helper function to combine multiple schemas
export function combineSchemas(...schemas: any[]) {
  return schemas.filter(Boolean);
}

// Common FAQ data for HVAC services
export const commonHVACFAQs = [
  {
    question: "How often should I have my HVAC system serviced?",
    answer: "We recommend having your HVAC system professionally serviced twice a year - once in spring for your AC and once in fall for your heating system. Regular maintenance helps prevent breakdowns, improves efficiency, and extends system life."
  },
  {
    question: "What are signs that my HVAC system needs repair?",
    answer: "Common signs include unusual noises, poor airflow, inconsistent temperatures, high energy bills, frequent cycling, and strange odors. If you notice any of these issues, contact us for a professional diagnosis."
  },
  {
    question: "How quickly can you respond to emergency HVAC calls?",
    answer: "We provide 24/7 emergency HVAC service throughout North Texas with response times typically within 2 hours. Our technicians are on-call and ready to restore your comfort quickly."
  },
  {
    question: "Do you provide free estimates?",
    answer: "Yes, we provide free estimates on all HVAC installations and replacements. For repairs, we charge a diagnostic fee that is applied toward the repair cost if you choose to proceed with our services."
  },
  {
    question: "What areas do you serve?",
    answer: "We serve 8 cities throughout North Texas: Frisco, Plano, McKinney, Allen, Prosper, The Colony, Little Elm, and Addison. We also provide emergency service to surrounding areas."
  }
];

// Sample customer reviews
export const sampleReviews: ReviewSchemaProps[] = [
  {
    reviewBody: "Excellent service! Our AC went out during the hottest day of summer and Jupitair had a technician at our house within 2 hours. Fixed the problem same day. Professional, courteous, and reasonably priced.",
    reviewRating: 5,
    authorName: "Maria Johnson",
    reviewDate: "2024-07-15"
  },
  {
    reviewBody: "I called Jupitair for a heating system installation and couldn't be happier. The team was professional, explained everything clearly, and the new system works perfectly. Highly recommend!",
    reviewRating: 5,
    authorName: "David Chen",
    reviewDate: "2024-11-02"
  },
  {
    reviewBody: "Great experience with Jupitair. They were upfront about pricing, arrived on time, and completed the duct cleaning efficiently. The air quality in our home has improved noticeably.",
    reviewRating: 5,
    authorName: "Sarah Williams",
    reviewDate: "2024-09-20"
  }
];