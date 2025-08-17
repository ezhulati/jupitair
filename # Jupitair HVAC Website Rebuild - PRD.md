# Jupitair HVAC Website Rebuild - PRD

## Executive Summary
Rebuild jupitairhvac.com to capture 3-5x more qualified leads through modern performance, local SEO optimization, and conversion-focused design. Target $50K+ annual revenue impact through improved digital presence in 8 priority North Dallas cities.

## Financial Impact Model
- **Current State**: Legacy site with poor mobile experience, limited local presence
- **Revenue Opportunity**: $50K-150K annually (assuming 100-300 additional qualified leads/year at $500-1000 LTV)
- **Cost Investment**: ~40 hours development + $200/month hosting/tools
- **ROI Timeline**: 3-6 months to positive ROI
- **Key Metric**: Lead conversion rate improvement from ~2% to 5-8%

---

## Opportunity Framing

### Core Problem
Current website fails to convert mobile traffic in competitive North Dallas HVAC market due to poor performance, weak local SEO, and outdated conversion funnel.

### Working Hypothesis  
Modern, locally-optimized website with strong conversion elements will capture 3-5x more qualified leads from existing traffic plus new local search visibility.

### Strategy Fit
Unlocks digital-first growth strategy for service area expansion and reduces dependency on expensive paid advertising channels.

---

## Boundaries

### Scope (What's Included)
- Complete website rebuild using Astro framework
- 8 priority city landing pages (Frisco, Plano, McKinney, Allen, Prosper, The Colony, Little Elm, Addison)
- 9 core service pages with local optimization
- Modern conversion funnel with call tracking
- Mobile-first responsive design
- SEO optimization with structured data
- Analytics and lead tracking infrastructure
- Content migration from existing site

### Non-Goals (Explicitly Excluded)
- E-commerce functionality or online payments
- Customer portal or account management
- Blog content creation (infrastructure only)
- Social media integration beyond basic links
- Multi-language support
- Custom CRM development (webhook integration only)

---

## Success Measurement

### Offline Golden Set (Pre-Launch Testing)
- Lighthouse Performance Score ≥95 (mobile)
- Page load time <2 seconds on 3G
- All contact forms submit successfully
- Phone click tracking fires correctly
- Local business schema validates without errors

### Human Review (Qualitative Checks)
- Service pages clearly explain problem → solution → CTA
- City pages feel locally relevant (neighborhoods, landmarks)
- Mobile experience enables easy calling/form completion
- Trust signals (licenses, reviews, guarantees) prominently displayed
- Content tone matches professional but approachable brand

### Online Metrics (KPIs with Thresholds)

**Primary Success Metrics:**
- Lead conversion rate: 5-8% (vs current ~2%)
- Mobile bounce rate: <40% (vs current 65%+)
- Organic search traffic: +50% within 6 months
- "Near me" search rankings: Top 5 for priority cities

**Secondary Metrics:**
- Page speed score ≥95 across all pages
- Call tracking events: 20+ qualified calls/month
- Form completions: 15+ quality leads/month
- Local pack visibility: 3+ cities in top 3

**Kill Criteria:**
- Lead volume drops >20% in first 30 days
- Site uptime <99.5% in any month
- Core Web Vitals fail Google thresholds

---

## Rollout Plan

### Phase 1: Complete Build & Deploy
- **Exposure**: Claude Code builds entire site in single session
- **Duration**: Single development session (tonight)
- **Gates**: All components functional, deployed to Vercel preview URL

### Phase 2: Review & Polish
- **Exposure**: Staging environment with stakeholder review
- **Duration**: 24-48 hours for review/tweaks
- **Gates**: Content approved, tracking validated, performance confirmed

### Phase 3: Soft Launch
- **Exposure**: 25% of traffic via DNS split
- **Duration**: 48 hours
- **Gates**: No critical errors, conversion tracking working, performance validated

### Phase 4: Full Launch
- **Exposure**: 100% of traffic
- **Duration**: Ongoing
- **Gates**: All success metrics trending positive, stakeholder approval

### Ramp Gates & Decision Points
- **After 24 hours**: Review error logs, conversion tracking
- **After 48 hours**: Analyze lead quality and volume vs. baseline
- **After 7 days**: Full performance review and optimization planning

---

## Risk Management

### Detection (How to Spot Failures)
- **Performance**: Uptime monitoring (Vercel/StatusCake)
- **Conversions**: Daily lead volume alerts via email/Slack
- **SEO**: Weekly rank tracking for target keywords
- **Technical**: Error monitoring with immediate alerts
- **User Experience**: Hotjar/heatmap analysis for UX issues

### Fallback & Kill Switch (Recovery)
- **DNS Rollback**: Immediate revert to current site within 5 minutes
- **Form Backup**: Fallback email endpoint if API fails
- **Phone System**: Primary number forwards to owner mobile as backup
- **Content Backup**: Full site archive for emergency reference
- **Emergency Contact**: Direct owner phone for critical issues

### Owners (Who Handles Incidents)
- **Technical Issues**: Developer (primary), hosting support (secondary)
- **Lead Flow**: Owner review within 24 hours
- **SEO Monitoring**: Monthly check, developer alerts
- **Performance**: Automated monitoring with developer response SLA

---

## Technical Architecture

### Framework & Infrastructure
- **Core**: Astro + TypeScript for optimal performance
- **Styling**: TailwindCSS with shadcn-style component system
- **Content**: MDX with content collections for services/cities
- **Hosting**: Vercel with preview deployments
- **Analytics**: GTM + GA4 + CallRail integration
- **Forms**: API routes with webhook integrations

### Content Strategy
- **Service Pages**: Problem → Solution → Local Benefits → CTA flow
- **City Pages**: Local relevance + service overview + area-specific FAQs
- **Trust Elements**: Licenses, reviews, guarantees, years in business
- **Conversion Elements**: Sticky call button, prominent forms, financing badges

### SEO & Performance
- **Structured Data**: LocalBusiness, Service, FAQPage schema
- **Local Optimization**: City-specific landing pages with local keywords
- **Technical SEO**: Sitemap generation, robots.txt, canonical tags
- **Performance**: Image optimization, minimal JS, Core Web Vitals focus

---

## Behavior Contract (Conversion Elements)

### Call-to-Action Examples

**Primary CTA Button:**
- ✅ "Get Free Estimate" (clear value)
- ✅ "Call Now: (XXX) XXX-XXXX" (urgency + phone)
- ✅ "Book Service Online" (convenience)
- ❌ "Learn More" (vague)
- ❌ "Contact Us" (generic)

**Emergency Scenarios:**
- Input: "AC not working, 95 degrees outside"
- Expected: Prominent emergency service CTA, after-hours number
- Fallback: Standard contact form with urgent flag

**Mobile Experience:**
- Input: User on mobile device
- Expected: Sticky call button, tap-to-call functionality, simplified forms
- Fallback: Desktop-style layout still accessible

**Local Intent:**
- Input: "HVAC repair Frisco TX"
- Expected: Frisco landing page with local neighborhoods, drive time estimates
- Fallback: General service page with location selector

### Form Validation Examples
- Required fields: Name, Phone, City, Service Type
- Phone format validation with auto-formatting
- Spam protection via honeypot + time delays
- Success confirmation with next steps
- Error handling with clear user guidance

---

## Migration Strategy

### Content Preservation
1. **Archive Complete**: Crawl existing site for all pages, assets, content
2. **Content Audit**: Identify valuable copy, testimonials, service descriptions
3. **SEO Mapping**: Preserve valuable URL structures where possible
4. **Asset Migration**: Optimize and migrate images, documents, videos

### URL Strategy
- Maintain SEO-valuable URLs where possible
- 301 redirects for changed URLs
- New structure: `/services/ac-repair/`, `/frisco-tx/` etc.
- Breadcrumb navigation for user orientation

---

## Decision Framework

### Iterate Criteria (Continue Development)
- Lead conversion improving but below 5% target
- Page speed ≥90 but below 95 target
- Positive user feedback with specific improvement requests
- SEO visibility improving but not yet competitive

### Scale Criteria (Expand/Enhance)
- Lead conversion ≥8% consistently
- All primary metrics exceeding targets
- Clear ROI demonstration within 60 days
- Request for additional city pages or services

### Kill Criteria (Rollback/Restart)
- Lead volume drops >20% for 14+ days
- Technical issues affecting >10% of users
- Negative business owner feedback after 30 days
- Core Web Vitals consistently failing

---

## Success Timeline

### 24 Hours Post-Build
- Complete site deployed and functional on preview URL
- All forms, tracking, and conversion elements operational
- Performance metrics meeting targets (95+ Lighthouse score)
- Ready for stakeholder review

### 48 Hours Post-Launch
- Performance metrics stabilized above baseline
- Lead tracking and attribution working correctly
- No critical technical issues
- Initial user experience validation

### 30 Days Post-Launch  
- Lead conversion rate improvement validated
- Local search visibility improvements measurable
- User experience optimizations identified and implemented
- Business impact quantified and documented

### 90 Days Post-Launch
- ROI targets achieved or exceeded
- Competitive position improved in target cities
- Foundation established for ongoing optimization
- Expansion opportunities identified and prioritized

---

## Resource Requirements

### Development
- Single Claude Code session builds complete site
- Design system integration: Included in build session
- Content migration and optimization: Automated in session
- Testing and deployment: Automated to Vercel

### Ongoing Operations
- Monthly performance review: 2 hours
- Content updates as needed: 1-2 hours/month
- Technical maintenance: Included in hosting
- Analytics review and optimization: 2 hours/month

### Tools & Services
- Hosting: Vercel ($20/month)
- Analytics: GA4 (free) + GTM (free)
- Call Tracking: CallRail ($30-50/month)
- Monitoring: StatusCake or similar ($10/month)
- Domain/DNS: Current provider (no change)

This PRD provides the decision-making framework to execute your excellent technical brief while ensuring business value and measurable success.