# Information Architecture Map

## Site Structure Overview

The Jupitair HVAC website is organized around two primary taxonomies: **Services** and **Locations**, creating a comprehensive matrix that covers all service offerings across all target cities in North Texas.

```
jupitairhvac.com/
├── Homepage (/)
├── Services Hub (/services/)
├── Locations Hub (/locations/)
├── Service Pages (/services/{service}/)
├── Location Pages (/{city}/)
├── Service × Location Pages (/{city}/{service}/)
├── Company (/about/, /contact/)
└── Resources (/blog/, /resources/)
```

## Primary Navigation Structure

### Main Navigation
```
[Logo] Jupitair HVAC
├── Services ▼
│   ├── AC Repair
│   ├── Heating Repair
│   ├── HVAC Installation
│   ├── Duct Cleaning
│   ├── Thermostat Installation
│   ├── Energy Upgrades
│   ├── Emergency HVAC
│   ├── Commercial HVAC
│   └── Residential HVAC
├── Service Areas ▼
│   ├── Frisco
│   ├── Plano
│   ├── McKinney
│   ├── Allen
│   ├── Prosper
│   ├── The Colony
│   ├── Little Elm
│   └── Addison
├── About
├── Blog
└── Contact
```

### Emergency CTA
- Prominent "24/7 Emergency Service" button
- Phone number: (214) 555-HVAC
- "Get Free Estimate" button

## Page Hierarchy & Content Strategy

### Level 1: Homepage (/)
**Purpose**: Brand introduction, service overview, location coverage
**Target Keywords**: "HVAC North Texas", "Jupitair HVAC", "AC repair heating"
**Content Sections**:
- Hero: Emergency service + primary value prop
- Services overview (9 services)
- Service areas (8 cities)
- Why choose us (trust signals)
- Customer testimonials
- Emergency contact section

### Level 2A: Service Hub (/services/)
**Purpose**: Service category overview and navigation
**Target Keywords**: "HVAC services North Texas", "AC repair heating installation"
**Content Sections**:
- Service categories overview
- Emergency vs. planned services
- Commercial vs. residential
- Service process explanation
- Links to all 9 service pages

### Level 2B: Locations Hub (/locations/)
**Purpose**: Geographic coverage overview
**Target Keywords**: "HVAC contractor North Texas cities"
**Content Sections**:
- Service area map
- Coverage areas detail
- Local expertise messaging
- Emergency service coverage
- Links to all 8 city pages

### Level 3A: Individual Service Pages (/services/{service}/)
**Purpose**: Detailed service information, lead generation
**Content Template**:
```
├── Hero Section
│   ├── H1: {Service} in North Texas
│   ├── Key benefits
│   └── Emergency availability
├── Service Details
│   ├── What we do
│   ├── How we do it
│   └── Equipment/brands
├── Process Section
│   ├── Step-by-step process
│   ├── Timeline expectations
│   └── Pricing transparency
├── Trust Signals
│   ├── Licensing/insurance
│   ├── Warranties
│   └── Customer reviews
├── Service Areas
│   ├── Cities served
│   └── Response times
└── CTA Section
    ├── Contact forms
    ├── Phone number
    └── Emergency service
```

**Service Pages (9 total)**:
1. `/services/ac-repair/` - AC Repair & Service
2. `/services/heating-repair/` - Heating System Repair
3. `/services/hvac-installation/` - HVAC Installation & Replacement
4. `/services/duct-cleaning/` - Air Duct Cleaning Services
5. `/services/thermostat-installation/` - Smart Thermostat Installation
6. `/services/energy-upgrades/` - Energy Efficiency Upgrades
7. `/services/emergency-hvac/` - 24/7 Emergency HVAC Service
8. `/services/commercial-hvac/` - Commercial HVAC Services
9. `/services/residential-hvac/` - Residential HVAC Services

### Level 3B: Individual City Pages (/{city}/)
**Purpose**: Local market penetration, local SEO
**Content Template**:
```
├── Hero Section
│   ├── H1: HVAC Services in {City}, TX
│   ├── Local service commitment
│   └── Emergency coverage
├── Local Services
│   ├── All 9 services available
│   ├── Service specialties
│   └── Response times
├── Local Expertise
│   ├── Years serving area
│   ├── Local projects/customers
│   └── Community involvement
├── Service Areas Nearby
│   ├── Neighboring cities
│   └── Service radius
└── Local Contact
    ├── Local scheduling
    ├── Emergency service
    └── Free estimates
```

**City Pages (8 total)**:
1. `/frisco/` - HVAC Services in Frisco, TX
2. `/plano/` - HVAC Services in Plano, TX  
3. `/mckinney/` - HVAC Services in McKinney, TX
4. `/allen/` - HVAC Services in Allen, TX
5. `/prosper/` - HVAC Services in Prosper, TX
6. `/the-colony/` - HVAC Services in The Colony, TX
7. `/little-elm/` - HVAC Services in Little Elm, TX
8. `/addison/` - HVAC Services in Addison, TX

### Level 4: Service × Location Pages (/{city}/{service}/)
**Purpose**: Hyper-local targeting, high-intent keywords
**Content Strategy**: Most specific, highest conversion potential
**Content Template**:
```
├── Hero Section
│   ├── H1: {Service} in {City}, TX
│   ├── Local availability
│   └── Same-day service promise
├── Local Service Details
│   ├── Service specifics for area
│   ├── Common local issues
│   └── Local regulations/permits
├── Why Choose Us Locally
│   ├── Local technicians
│   ├── Area expertise
│   └── Customer testimonials
├── Service Process
│   ├── Local scheduling
│   ├── Response times
│   └── Follow-up service
└── Local Contact & CTA
    ├── Local phone number
    ├── Service area map
    └── Emergency availability
```

**High-Priority Service × Location Pages (24 total)**:
Primary combinations focusing on highest volume/lowest competition:

**Frisco** (High volume market):
- `/frisco/ac-repair/`
- `/frisco/hvac-installation/`
- `/frisco/emergency-hvac/`

**Plano** (High volume market):
- `/plano/ac-repair/`
- `/plano/heating-repair/`
- `/plano/hvac-installation/`

**McKinney** (Medium competition):
- `/mckinney/ac-repair/`
- `/mckinney/duct-cleaning/`
- `/mckinney/thermostat-installation/`

**Allen** (Medium competition):
- `/allen/ac-repair/`
- `/allen/commercial-hvac/`
- `/allen/energy-upgrades/`

**Prosper** (Low competition):
- `/prosper/ac-repair/`
- `/prosper/hvac-installation/`
- `/prosper/residential-hvac/`

**The Colony** (Low competition):
- `/the-colony/ac-repair/`
- `/the-colony/heating-repair/`
- `/the-colony/emergency-hvac/`

**Little Elm** (Low competition):
- `/little-elm/ac-repair/`
- `/little-elm/hvac-installation/`
- `/little-elm/duct-cleaning/`

**Addison** (Commercial focus):
- `/addison/commercial-hvac/`
- `/addison/ac-repair/`
- `/addison/thermostat-installation/`

## Content Taxonomy & Tagging

### Service Categories
- **Emergency Services**: AC Repair, Heating Repair, Emergency HVAC
- **Installation Services**: HVAC Installation, Thermostat Installation
- **Maintenance Services**: Duct Cleaning, Energy Upgrades
- **Market Segments**: Commercial HVAC, Residential HVAC

### Location Categories  
- **Primary Markets**: Frisco, Plano, McKinney (established, high competition)
- **Growth Markets**: Allen, Prosper (medium competition, opportunity)
- **Emerging Markets**: The Colony, Little Elm, Addison (low competition)

### Content Tags
- Service type (repair, installation, maintenance)
- Market segment (residential, commercial)
- Urgency level (emergency, scheduled)
- Season relevance (summer cooling, winter heating)

## Internal Linking Strategy

### Hub Page Linking
- Homepage links to all hub pages
- Service hub links to all service pages
- Location hub links to all city pages
- Cross-linking between related services

### Contextual Internal Links
```
Service Pages → Related Services
├── AC Repair → Thermostat Installation
├── Heating Repair → Energy Upgrades  
├── HVAC Installation → Duct Cleaning
└── Emergency HVAC → All Repair Services

City Pages → Local Services
├── Each city → All services in that city
├── Neighboring cities cross-reference
└── Service area coverage maps

Service×Location Pages → Related Content
├── Link to parent service page
├── Link to parent city page
├── Link to related services in same city
└── Link to same service in neighboring cities
```

### Footer Link Architecture
```
Footer Navigation
├── Services
│   ├── Emergency HVAC (featured)
│   ├── AC Repair (featured)
│   ├── Heating Repair (featured)
│   └── All Services link
├── Service Areas
│   ├── North Texas Overview
│   ├── Primary Cities (top 4)
│   └── All Locations link
├── Company
│   ├── About Us
│   ├── Contact
│   ├── Blog
│   └── Careers
└── Legal
    ├── Privacy Policy
    ├── Terms of Service
    └── Sitemap
```

## User Journey Mapping

### Emergency Service Journey
```
Entry Points → Action
├── Google: "emergency AC repair [city]"
├── Landing: /{city}/ac-repair/ or /services/emergency-hvac/
├── Content: Clear emergency messaging, 24/7 availability
├── Contact: Prominent phone number, emergency form
└── Conversion: Phone call or emergency service request
```

### Planned Service Journey
```
Entry Points → Research → Decision
├── Google: "HVAC installation [city]" or "AC repair [city]"
├── Landing: Service or service×location page
├── Research: Service details, process, pricing, reviews
├── Compare: Other services, locations, company info
├── Contact: Estimate request, consultation scheduling
└── Conversion: Form submission or phone call
```

### Local Browser Journey
```
Entry Points → Exploration → Action
├── Google: "HVAC contractor near me" or "[city] HVAC"
├── Landing: City page or homepage
├── Explore: Local services, coverage area, testimonials
├── Service: Specific service information
├── Trust: About page, credentials, reviews
└── Conversion: Contact for consultation
```

## Mobile-First Considerations

### Mobile Navigation
- Collapsible menu with service/location categories
- Prominent phone number for one-tap calling
- Emergency service button always visible
- Location-based service suggestions

### Mobile Content Priority
1. Contact information (phone, emergency service)
2. Service availability and response time
3. Key services overview
4. Trust signals (licensing, reviews)
5. Detailed service information
6. Company background

### Mobile Conversion Optimization
- Click-to-call phone numbers
- Simple contact forms (minimal fields)
- Emergency service prominently featured
- Location-based content personalization
- Fast loading service/pricing information

## Analytics & Measurement Framework

### Page Performance Metrics
- **Service Pages**: Time on page, bounce rate, form completions
- **City Pages**: Local search rankings, organic traffic growth
- **Service×Location Pages**: Conversion rate, phone calls generated
- **Emergency Pages**: Response time to inquiries, emergency service bookings

### User Flow Analysis
- Entry page → service exploration → contact conversion
- Mobile vs desktop user behavior patterns
- Emergency vs planned service journey differences
- Geographic traffic patterns and preferences

### Conversion Tracking
- Phone call conversions by source page
- Form submissions by page and traffic source
- Emergency service requests by location
- Estimate requests by service type
- Page-to-phone-call conversion rates

This information architecture creates a comprehensive, SEO-optimized structure that serves both user needs and search engine requirements while maximizing conversion opportunities across all service areas and offerings.