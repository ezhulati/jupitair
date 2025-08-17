# SEO Standards & Guidelines

## Title Tag Templates

### Homepage
```
{Brand} - {Primary Service} in {Primary Location} | {Secondary Service}
Example: Jupitair HVAC - AC Repair in North Texas | Heating & Installation
```

### Service Pages
```
{Service} {Location} | {Brand} - {Benefit/CTA}
Example: AC Repair Frisco TX | Jupitair HVAC - Same Day Service
```

### City Pages
```
HVAC Services {City} TX | {Brand} - {Key Services}
Example: HVAC Services Plano TX | Jupitair HVAC - Repair & Installation
```

### City + Service Pages
```
{Service} {City} TX | {Brand} - {Unique Value Prop}
Example: Duct Cleaning McKinney TX | Jupitair HVAC - Indoor Air Quality Experts
```

### Title Tag Rules
- Maximum 60 characters to prevent truncation
- Include primary keyword within first 30 characters
- Always include location (city, TX)
- Include brand name
- Use pipe (|) or dash (-) as separators
- Avoid keyword stuffing
- Each page must have unique title

## Meta Description Templates

### Homepage
```
{Brand} provides expert {services} throughout {region}. {Years} of experience, {unique value props}. Call {phone} for {emergency/scheduling info}.
Example: Jupitair HVAC provides expert AC repair, heating services, and HVAC installation throughout North Texas. 20+ years of experience, same-day service, 24/7 emergency repairs. Call (214) 555-HVAC for immediate service.
```

### Service Pages
```
Professional {service} in {location}. {Experience/credentials}, {pricing info}, {warranty}. {Emergency availability}. Call {phone} for {call-to-action}.
Example: Professional AC repair in Frisco, TX. Licensed technicians, upfront pricing, 90-day warranty. Same-day service available. Call (214) 555-HVAC for free estimate.
```

### City Pages
```
Trusted HVAC contractor serving {city}, TX. {Services list}, {years} experience, {ratings}. {Emergency info}. Call {phone} for service.
Example: Trusted HVAC contractor serving Plano, TX. AC repair, heating services, installations, 15+ years experience, 4.9/5 rating. 24/7 emergency service. Call (214) 555-HVAC for service.
```

### Meta Description Rules
- 150-160 characters maximum
- Include primary keyword
- Include location
- Include phone number
- Include unique value proposition
- Include call-to-action
- Write for humans, not just search engines

## Heading Structure (H1-H6)

### H1 Requirements
- One H1 per page
- Include primary keyword and location
- 20-70 characters recommended
- Should match or closely relate to title tag

### H1 Templates
```
Homepage: {Primary Service} in {Region} | {Brand}
Service: {Service} in {Location}
City: HVAC Services in {City}, Texas
City+Service: {Service} Services in {City}, TX
```

### H2-H6 Structure
```
H1: Main page topic
  H2: Primary sections/services
    H3: Subsections/features
      H4: Specific details
        H5: Minor subsections
          H6: Minimal use, specific details only
```

### Content Hierarchy Example
```
H1: AC Repair in Frisco, TX
  H2: Emergency AC Repair Services
    H3: Same-Day Service Available
    H3: 24/7 Emergency Response
  H2: AC Repair Process
    H3: Diagnostic & Assessment
    H3: Repair Options & Pricing
    H3: Quality Assurance
  H2: Why Choose Jupitair HVAC
    H3: Licensed & Insured Technicians
    H3: Upfront Pricing
    H3: 90-Day Warranty
```

## Schema Markup Requirements

### LocalBusiness Schema (Required on all pages)
```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Jupitair HVAC",
  "description": "Professional HVAC services in North Texas",
  "url": "https://jupitairhvac.com",
  "telephone": "(214) 555-HVAC",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "123 Main St",
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
  "openingHours": [
    "Mo-Fr 08:00-18:00",
    "Sa 08:00-16:00"
  ],
  "priceRange": "$$",
  "areaServed": [
    "Frisco, TX",
    "Plano, TX",
    "McKinney, TX"
  ]
}
```

### Service Schema (Service pages)
```json
{
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "AC Repair",
  "description": "Professional air conditioning repair services",
  "provider": {
    "@type": "LocalBusiness",
    "name": "Jupitair HVAC"
  },
  "areaServed": {
    "@type": "City",
    "name": "Frisco",
    "addressRegion": "TX"
  },
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "HVAC Services",
    "itemListElement": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Emergency AC Repair"
        }
      }
    ]
  }
}
```

### FAQ Schema (Where applicable)
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How quickly can you repair my AC?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "We provide same-day AC repair service in most cases, with emergency service available 24/7."
      }
    }
  ]
}
```

## URL Structure & Patterns

### URL Hierarchy
```
Domain: jupitairhvac.com
├── / (homepage)
├── /services/
│   ├── /services/ac-repair/
│   ├── /services/heating-repair/
│   └── /services/hvac-installation/
├── /frisco/
├── /plano/
├── /mckinney/
└── /frisco/ac-repair/
```

### URL Rules
- Use lowercase only
- Use hyphens (-) for word separation
- Keep URLs short and descriptive
- Include primary keyword
- Avoid stop words where possible
- No trailing slashes
- Use 301 redirects for URL changes

### URL Templates
```
Homepage: /
Service: /services/{service-slug}/
City: /{city-slug}/
City + Service: /{city-slug}/{service-slug}/
About: /about/
Contact: /contact/
Blog: /blog/
Blog Post: /blog/{post-slug}/
```

## Keyword Strategy

### Primary Keywords (High Volume, High Competition)
- hvac [city] tx
- ac repair [city]
- heating repair [city]
- hvac contractor [city]
- air conditioning [city]

### Secondary Keywords (Medium Volume, Medium Competition)
- [service] [city] tx
- emergency hvac [city]
- hvac installation [city]
- commercial hvac [city]
- residential hvac [city]

### Long-tail Keywords (Lower Volume, Lower Competition)
- emergency ac repair [city] tx
- hvac contractor near me [city]
- duct cleaning services [city]
- smart thermostat installation [city]
- energy efficient hvac [city]

### Keyword Density Guidelines
- Primary keyword: 1-2% density
- Secondary keywords: 0.5-1% density
- Natural language over keyword stuffing
- Include keywords in:
  - Title tag
  - H1 heading
  - First paragraph
  - At least one H2
  - Meta description
  - Image alt text
  - URL slug

## Content Requirements

### Minimum Content Length
- Homepage: 800-1200 words
- Service pages: 1000-1500 words
- City pages: 800-1200 words
- City + Service pages: 1200-1800 words
- Blog posts: 1500-2500 words

### Content Structure
1. **Introduction** (100-150 words)
   - Primary keyword in first sentence
   - Overview of service/location
   - Unique value proposition

2. **Main Content** (600-1000 words)
   - Detailed service information
   - Benefits and features
   - Process explanation
   - Credentials and experience

3. **Trust Signals** (100-200 words)
   - Licensing and insurance
   - Warranties and guarantees
   - Customer testimonials
   - Years of experience

4. **Call-to-Action** (50-100 words)
   - Clear next steps
   - Contact information
   - Emergency availability
   - Incentives (free estimates, etc.)

### Required Content Elements
- Service area coverage
- Emergency service availability
- Licensing and insurance information
- Pricing transparency
- Warranty information
- Customer testimonials/reviews
- Contact information
- Service process explanation

## Technical SEO Requirements

### Page Speed
- Core Web Vitals compliance
- Largest Contentful Paint (LCP) < 2.5s
- First Input Delay (FID) < 100ms
- Cumulative Layout Shift (CLS) < 0.1
- Mobile PageSpeed score > 85
- Desktop PageSpeed score > 90

### Mobile Optimization
- Responsive design
- Mobile-first indexing ready
- Touch-friendly navigation
- Readable font sizes (16px minimum)
- Proper viewport meta tag

### Internal Linking
- Link to related services
- Link to service areas
- Use descriptive anchor text
- Include links to contact page
- Link to testimonials/reviews
- Create topic clusters

### Image Optimization
- Alt text with keywords
- Descriptive filenames
- Compressed file sizes
- WebP format when possible
- Proper image dimensions
- Lazy loading implementation

## Local SEO Requirements

### Google My Business
- Complete profile optimization
- Regular posts and updates
- Customer review management
- Accurate NAP information
- Service area definition
- Business hours updates

### Citations & NAP Consistency
- Name, Address, Phone identical across all platforms
- Major citation sites (Yelp, BBB, Angie's List)
- Industry-specific directories
- Local chamber of commerce
- Professional associations

### Local Content
- City-specific landing pages
- Local event mentions
- Community involvement
- Local landmarks and references
- Regional weather/seasonal content
- Local customer testimonials

## Performance Monitoring

### Key Metrics to Track
- Organic traffic by page
- Keyword rankings
- Click-through rates
- Bounce rate
- Time on page
- Conversion rate
- Local pack rankings
- Google My Business insights

### Monthly SEO Tasks
- Keyword ranking reports
- Google Analytics review
- Google Search Console monitoring
- Competitor analysis update
- Content gap analysis
- Technical SEO audit
- Local citation audit
- Review response management