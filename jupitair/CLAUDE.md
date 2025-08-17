# CLAUDE.md - Complete Instructions for Jupitair HVAC Multi-Agent System

## 🎯 Mission Critical

You are orchestrating a complete rebuild of the Jupitair HVAC website for North Texas domination. This project requires executing 18 specialized agents in sequence to create a high-converting, SEO-optimized Astro website that outranks all competitors.

## ⚡ Quick Start Commands

When opening this project, immediately run:
```bash
npm run lint        # Check code quality
npm run typecheck   # Verify TypeScript
npm run dev         # Start development server
```

## 🚨 Critical Requirements

### Always Remember
1. **Respect robots.txt and ToS** - Never scrape disallowed paths
2. **No copy/paste** - Use competitor content only for structure and patterns
3. **Commit early/often** - Small, atomic commits with clear messages
4. **Test everything** - Run lighthouse, check accessibility, verify SEO
5. **Performance first** - LCP < 2.5s, INP < 200ms, CLS < 0.1

### Banned Words List
Never use these terms in content:
- "Click here"
- "Best HVAC in..."
- "Cheap"
- "Discount" (unless specific offer)
- Generic superlatives without proof

## 📋 Complete Agent Execution Plan

### Phase 0: Orchestrator Setup
```yaml
Role: Project Conductor
Priority: IMMEDIATE
Tasks:
  1. Load control.yaml configuration
  2. Create work plan in /docs/plan.md
  3. Initialize task queue
  4. Set up monitoring
```

### Phase 1: Data Collection & Intelligence

#### Agent 1: Crawler Engineer
```yaml
Priority: HIGH
Inputs: 
  - URL: https://jupitairhvac.com/
  - Depth: 3 levels
  - Respect: robots.txt
Outputs:
  - /data/archive/urls.json
  - /data/archive/pages/*.html
  - /data/archive/inventory.csv
  - /public/_archive/assets/*
Script: /scripts/crawler.js
```

#### Agent 2: Competitive Intelligence
```yaml
Priority: HIGH
Targets:
  - One Hour Air Conditioning (Frisco)
  - Air Repair Pros (Plano)
  - Texas Air Experts (McKinney)
  - Elite HVAC Services (Little Elm)
  - Colony Comfort Systems (The Colony)
Outputs:
  - /data/competitors/serp.csv
  - /reports/competitive-findings.md
  - Coverage matrix by city/service
```

### Phase 2: Architecture & Strategy

#### Agent 3: SEO Strategist
```yaml
Priority: CRITICAL
Deliverables:
  - Keyword map (primary/secondary per page)
  - Title tag templates: "[Service] in [City], TX | Jupitair HVAC"
  - H1 templates: "Professional [Service] in [City]"
  - Schema requirements (LocalBusiness, Service, FAQ)
  - URL structure: /[city]/[service]/
Output: /docs/seo-standards.md
```

#### Agent 4: Information Architect
```yaml
Priority: CRITICAL
Data Files:
  - /data/services.yml (9 services)
  - /data/cities.yml (8 cities)
Routes:
  - Homepage: /
  - City pages: /[city]/
  - Service pages: /services/[service]/
  - City+Service: /[city]/[service]/
  - Total pages: 72 programmatic + 10 static
Output: /docs/ia-map.md
```

### Phase 3: Astro Implementation

#### Agent 5: Astro Architect
```yaml
Priority: CRITICAL
Framework: Astro 5.5.2
Commands:
  1. Remove all Next.js files
  2. npm create astro@latest -- --template minimal --typescript --tailwind
  3. npm install @astrojs/sitemap @astrojs/image astro-seo
Configuration:
  - SSG mode
  - Content collections for services/cities
  - Dynamic routing with getStaticPaths
  - sitemap.xml.ts
  - robots.txt.ts
```

#### Agent 6: Design Token Integrator
```yaml
Priority: HIGH
Tokens:
  Colors:
    - primary: #0066CC (trust blue)
    - emergency: #DC2626 (urgent red)
    - cooling: #06B6D4 (cool cyan)
    - heating: #EA580C (warm orange)
  Typography:
    - headings: Inter
    - body: system-ui
Output: /src/styles/tokens.css
```

### Phase 4: Component Development

#### Agent 7: UI Component Engineer
```yaml
Priority: HIGH
Components:
  Core:
    - Button (primary, secondary, emergency)
    - Card (service, testimonial, pricing)
    - Input, Select, Textarea (forms)
    - Badge (certifications, warranties)
  Layout:
    - Header (sticky mobile, transparent desktop)
    - Footer (sitemap, trust signals)
    - Hero (video background capable)
    - Section (consistent spacing)
Output: /src/components/ui/*
```

#### Agent 8: CRO Engineer
```yaml
Priority: CRITICAL
Conversion Elements:
  - Sticky call button (mobile only)
  - Header phone with CallRail tracking
  - Emergency service banner
  - Lead form with validation
  - Trust signals (licenses, insurance)
API Endpoint: /src/pages/api/lead.ts
Form Fields:
  - Name, Phone, Email
  - Service needed
  - Urgency (emergency/scheduled)
  - Property type
  - Hidden: UTM parameters, timestamp
```

### Phase 5: Content & Schema

#### Agent 9: Content Lead
```yaml
Priority: HIGH
Content Requirements:
  - Unique city intros (200-300 words)
  - Service descriptions (400-500 words)
  - Local expertise signals
  - Seasonal content hooks
  - Emergency service emphasis
Style:
  - Professional but approachable
  - Technical accuracy
  - Local references
  - Clear CTAs
```

#### Agent 10: Schema Engineer
```yaml
Priority: HIGH
Schema Types:
  - Organization (homepage)
  - LocalBusiness (city pages)
  - Service (service pages)
  - FAQPage (all pages)
  - BreadcrumbList (navigation)
  - Review (testimonials)
Validation: Google Rich Results Test
Output: /src/lib/schema.ts
```

### Phase 6: Analytics & Performance

#### Agent 11: Analytics Engineer
```yaml
Priority: HIGH
Tracking:
  - GTM container
  - GA4 events:
    - lead_form_start
    - lead_form_submit
    - phone_click
    - emergency_cta_click
  - CallRail integration
  - Conversion goals:
    - Form submissions
    - Phone calls > 30s
    - Emergency requests
Output: /src/lib/analytics.ts
```

#### Agent 12: Performance Engineer
```yaml
Priority: CRITICAL
Targets:
  - LCP: < 2.5s
  - INP: < 200ms
  - CLS: < 0.1
  - FCP: < 1.8s
Optimizations:
  - Image optimization (@astrojs/image)
  - Font preloading
  - Critical CSS inlining
  - JS lazy loading
Tools: Lighthouse CI
Output: /lighthouse.config.js
```

### Phase 7: Quality & Compliance

#### Agent 13: Style Linter
```yaml
Priority: MEDIUM
Banned Terms:
  - "Click here"
  - "Best in..."
  - Superlatives without proof
Script: /scripts/lint-banned-words.js
CI Integration: Fail on violations
```

#### Agent 14: Accessibility QA
```yaml
Priority: HIGH
Standards: WCAG 2.1 AA
Checks:
  - Color contrast (4.5:1 minimum)
  - Keyboard navigation
  - Screen reader compatibility
  - Form labels
  - Alt text
Tools: axe-core, pa11y
Output: /reports/a11y.md
```

#### Agent 15: Security Engineer
```yaml
Priority: HIGH
Security Measures:
  - Rate limiting (10 req/min per IP)
  - Input sanitization
  - CSRF protection
  - Environment variables
  - Security headers
Output: /.env.example
```

### Phase 8: Local SEO & Deployment

#### Agent 16: Local SEO Specialist
```yaml
Priority: HIGH
Tasks:
  - Google Business Profile optimization
  - NAP consistency
  - Citation building list
  - Review collection strategy
  - Local schema markup
Output: /reports/gbp-playbook.md
```

#### Agent 17: DevOps Engineer
```yaml
Priority: CRITICAL
Pipeline:
  1. Lint & type check
  2. Build Astro
  3. Run Lighthouse CI
  4. Deploy to Vercel preview
  5. Smoke tests
  6. Production deploy (manual approval)
Files:
  - /.github/workflows/ci.yml
  - /vercel.json
```

#### Agent 18: QA Lead
```yaml
Priority: CRITICAL
Test Coverage:
  - All forms submit correctly
  - Phone numbers clickable
  - Analytics firing
  - Schema validates
  - Performance budgets met
  - Mobile responsive
  - Cross-browser (Chrome, Safari, Firefox)
Output: /reports/qa-smoke.md
```

## 🗂️ File Structure

```
jupitair/
├── .github/
│   └── workflows/
│       └── ci.yml              # CI/CD pipeline
├── data/
│   ├── archive/                # Crawled content
│   ├── competitors/            # Market analysis
│   ├── cities.yml              # 8 cities config
│   └── services.yml            # 9 services config
├── docs/
│   ├── ia-map.md               # Site architecture
│   ├── plan.md                 # Project plan
│   └── seo-standards.md        # SEO guidelines
├── public/
│   ├── _archive/               # Archived assets
│   ├── robots.txt              # Crawler rules
│   └── sitemap.xml             # XML sitemap
├── reports/
│   ├── a11y.md                 # Accessibility
│   ├── competitive-findings.md # Market analysis
│   ├── gbp-playbook.md         # Local SEO
│   └── qa-smoke.md             # QA results
├── scripts/
│   ├── crawler.js              # Site crawler
│   └── lint-banned-words.js   # Content linter
├── src/
│   ├── components/
│   │   ├── cta/                # Conversion CTAs
│   │   ├── forms/              # Lead forms
│   │   ├── layout/             # Page sections
│   │   └── ui/                 # Core components
│   ├── content/
│   │   ├── cities/             # City content
│   │   └── services/           # Service content
│   ├── layouts/
│   │   └── Layout.astro        # Base layout
│   ├── lib/
│   │   ├── analytics.ts        # Tracking
│   │   └── schema.ts           # Structured data
│   ├── pages/
│   │   ├── api/
│   │   │   └── lead.ts         # Form handler
│   │   ├── services/
│   │   │   └── [service].astro # Service pages
│   │   ├── [city]/
│   │   │   └── [service].astro # City+Service
│   │   ├── [city].astro        # City pages
│   │   └── index.astro         # Homepage
│   └── styles/
│       └── tokens.css          # Design system
├── .env.example                # Environment template
├── astro.config.mjs            # Astro config
├── CLAUDE.md                   # This file
├── control.yaml                # Project config
├── lighthouse.config.js        # Performance
├── package.json                # Dependencies
├── tailwind.config.mjs         # Tailwind
├── tsconfig.json              # TypeScript
└── vercel.json                # Deployment
```

## 🚀 Deployment Checklist

### Pre-Deployment
- [ ] All 18 agents completed successfully
- [ ] Lighthouse scores > 95%
- [ ] No banned words in content
- [ ] All forms tested
- [ ] Analytics verified
- [ ] Schema validates
- [ ] Mobile responsive
- [ ] Environment variables set

### Deployment Commands
```bash
# Local testing
npm run dev         # Development server
npm run build       # Production build
npm run preview     # Test production

# Quality checks
npm run lint        # Code quality
npm run typecheck   # TypeScript
npm run lighthouse  # Performance

# Deploy to Netlify
netlify deploy      # Preview deployment
netlify deploy --prod # Production deployment

# Or use Netlify CLI
npx netlify-cli deploy
npx netlify-cli deploy --prod
```

### Post-Deployment
- [ ] Verify all pages load
- [ ] Test forms and CTAs
- [ ] Check analytics data flow
- [ ] Submit sitemap to Google
- [ ] Configure CallRail
- [ ] Set up monitoring

## 📊 Success Metrics

### Technical KPIs
- Page Speed: LCP < 2.5s on mobile
- SEO Score: > 95% on Lighthouse
- Accessibility: WCAG AA compliant
- Uptime: 99.9% availability

### Business KPIs
- Organic Traffic: 31,000+ monthly
- Conversion Rate: > 3%
- Emergency Conversion: < 30s to call
- Local Rankings: Top 3 per city

## 🔥 Emergency Procedures

### If Build Fails
1. Check `npm run typecheck`
2. Verify all imports
3. Check environment variables
4. Review recent commits

### If Performance Degrades
1. Run Lighthouse CI
2. Check image sizes
3. Review JavaScript bundles
4. Verify caching headers

### If Forms Break
1. Check API endpoint
2. Verify environment variables
3. Test validation rules
4. Check rate limiting

## 💡 Pro Tips

### Content Creation
- Start each city page with local landmarks
- Reference local weather patterns
- Mention nearby schools/businesses
- Include local testimonials

### SEO Optimization
- Use exact match domains in anchors
- Create service cluster pages
- Build local citation profiles
- Implement FAQ schema everywhere

### Conversion Optimization
- Emergency CTAs above fold
- Phone number in multiple places
- Form should be 3 fields max initially
- Use urgency messaging wisely

## 🎯 Final Execution Command

To execute the complete multi-agent pipeline:

```bash
# Start the orchestrator
npm run orchestrate

# Or manually execute phases
npm run phase:1:crawl
npm run phase:2:architect  
npm run phase:3:astro
npm run phase:4:components
npm run phase:5:content
npm run phase:6:analytics
npm run phase:7:quality
npm run phase:8:deploy
```

## ⚠️ CRITICAL REMINDERS

1. **NEVER** copy competitor content verbatim
2. **ALWAYS** test on mobile first
3. **COMMIT** after each agent completes
4. **VALIDATE** schema before deployment
5. **MONITOR** Core Web Vitals continuously

## 📞 Support Contacts

- Technical Issues: Create GitHub issue
- Content Questions: Reference /docs/seo-standards.md
- Deployment Help: Check vercel.json config
- Performance Issues: Run lighthouse.config.js

---

**Remember**: This is a conversion-focused, performance-optimized, SEO-dominant HVAC website. Every decision should support these goals. Execute with precision. Dominate North Texas.

Last Updated: 2024-08-17
Version: 1.0.0
Status: READY FOR EXECUTION