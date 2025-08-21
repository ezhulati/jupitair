# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Jupitair HVAC is an Astro-based website for an HVAC service company serving North Texas. The site uses static site generation with Netlify adapter, MDX content, and Tailwind CSS for styling.

## Essential Commands

```bash
# Development
npm run dev            # Start dev server on http://localhost:4321
npm run build          # Build for production  
npm run preview        # Preview production build

# Code Quality
npx astro check        # Type check Astro components and TypeScript
npx astro check --minimumSeverity warning  # Show only warnings and errors

# Content Management
npm run fetch-reviews  # Fetch Google reviews
npm run fetch-facebook # Fetch Facebook reviews
npm run generate-images # Generate OG images for social sharing

# Testing API endpoints (Note: API routes are currently disabled)
# APIs are in src/pages/api-disabled/ and need to be moved to src/pages/api/ to work
```

## Architecture & Key Systems

### Rendering Strategy
- **Output Mode**: Static site generation (SSG)
- **Adapter**: Netlify adapter
- **Static Pages**: All pages are statically generated
- **API Routes**: Currently disabled (in `/src/pages/api-disabled/`)
- **Content Collections**: Blog posts in `/src/content/blog/`, cities, services

### Core Technologies
- **Framework**: Astro 5.13.2 with React islands
- **Styling**: Tailwind CSS with comprehensive design system (HVAC-specific colors, animations)
- **Content**: MDX for rich content pages with 65 blog posts
- **Images**: Cloudinary CDN integration
- **Deployment**: Netlify with security headers and caching
- **Analytics**: Google Analytics 4 and Microsoft Clarity integration

### API Routes Status
**⚠️ IMPORTANT**: All API routes are currently disabled and located in `/src/pages/api-disabled/`:
- Contact form handling
- Zoho calendar integration  
- Review aggregation
- Booking system

Move files from `api-disabled/` to `api/` to enable functionality.

### Component Architecture

#### Layout Components (`/src/components/layout/`)
- `Header.astro`: Hide-on-scroll navigation with mobile menu
- `Footer.astro`: Sitemap and contact info
- `Hero.astro`: Hero sections with CTAs
- `Contact.astro`: Contact section with form

#### UI Components (`/src/components/ui/`)
- `Button.astro`: Primary button component (use instead of PremiumButton)
- `Card.astro`: Service and content cards
- `PremiumCard.astro`: Glassmorphism effect cards
- `Input.astro`: Form inputs with validation

#### Form Components (`/src/components/forms/`)
- `ContactForm.astro`: Main contact form with validation

### Routing Structure

```
/                           # Homepage
/[city]/                   # City landing pages (8 cities)
/[city]/[service]/         # City + Service pages (72 combos)
/services/[service]/       # Service detail pages
/commercial/               # Commercial services hub
/commercial/[type]/        # Specific commercial services
/blog/                     # Blog index
/blog/[slug]/             # Individual blog posts
/api/*                    # API endpoints (SSR)
```

### Content Management

#### Blog Posts (`/src/content/blog/*.mdx`)
- 65 MDX files with frontmatter
- Each includes SEO metadata, featured image, and CTA
- Phone icon recently updated to stroke-based SVG

#### City Data (`/data/cities.yml`)
- 8 cities: Frisco, Plano, McKinney, Allen, Prosper, The Colony, Little Elm, Addison
- Each with slug, name, and description

#### Service Data (`/data/services.yml`)
- 9 main services with descriptions and slugs
- Used to generate dynamic service pages

### Environment Configuration

Required environment variables (create `.env.local` from `.env.example`):
- **Email**: `ZOHO_EMAIL`, `ZOHO_PASSWORD` (currently optional)
- **Zoho Calendar**: `ZOHO_CLIENT_ID`, `ZOHO_CLIENT_SECRET`, `ZOHO_REFRESH_TOKEN`
- **Cloudinary**: `PUBLIC_CLOUDINARY_CLOUD_NAME`
- **Analytics**: `GTM_ID`, `GA4_ID`

### Current TypeScript Issues (8 errors as of latest check)

#### Critical Issues:
1. **Cloudinary blur effect**: `src/lib/cloudinary.ts:247` - `blur()` function call issue
2. **Schema generator**: Missing import for `ReviewData` type
3. **Contact API**: Null safety issues with `zohoCalendar` object  
4. **ICS calendar**: Type mismatch in event details
5. **Nodemailer**: Wrong method name `createTransporter` vs `createTransport`

#### Content Collection Issues:
- Missing `/src/content/pages/` directory causes warning
- All content collections use strongly typed Zod schemas

#### Common Fixes:
- **Missing PremiumButton**: Use `Button` component instead
- **Horizontal scroll**: Remove `min-w-0` classes from service cards
- **Contrast issues**: Ensure `text-primary-700` on `bg-white`

### Performance Targets
- **LCP**: < 2.5s
- **INP**: < 200ms  
- **CLS**: < 0.1
- **Lighthouse Score**: > 95%

### Git Workflow & Branch Management

Current branch: `google-analytics` (based on git status)
Main branch: `main`

```bash
# Before committing
npx astro check --minimumSeverity warning  # Check for TypeScript errors
git status             # Review changes

# Commit with descriptive messages
git add .
git commit -m "Fix: [component] - [specific issue]"

# Push changes
git push origin google-analytics  # or current branch
```

**Note**: Large number of files show as deleted in git status - likely due to directory restructuring or cleanup.

### Security & Deployment
- **Environment**: `.env.local` is gitignored - never commit secrets
- **Netlify**: Comprehensive security headers configured in `netlify.toml`
- **Content Security Policy**: Allows Google Analytics, Microsoft Clarity, and Cloudinary
- **API Security**: All APIs currently disabled for static deployment

### Tailwind Design System
Comprehensive design system with:
- **HVAC-specific colors**: `hvac.cooling`, `hvac.heating`, `hvac.emergency`
- **Custom utilities**: `.btn-emergency`, `.btn-primary`, `.service-card`
- **Accessibility**: WCAG AA compliant color combinations
- **Animations**: Fade-in, slide-up, pulse effects
- **Typography**: Inter font with semantic sizing scale

### Testing Checklist
- [ ] Run `npx astro check` and fix TypeScript errors
- [ ] All forms work (if APIs are enabled)
- [ ] Phone numbers are clickable
- [ ] Navigation hides/shows on scroll  
- [ ] Service cards don't cause horizontal scroll
- [ ] Analytics events fire (GA4 + Clarity)
- [ ] Schema markup validates
- [ ] Mobile responsive at all breakpoints
- [ ] Cloudinary images load properly

## Recent Architecture Changes
- Migrated to Astro 5.13.2 with static output
- Disabled all API routes for static deployment
- Comprehensive TypeScript strict mode configuration
- 8 TypeScript errors need fixing (detailed above)
- Content collections use Zod schemas for type safety
- Enhanced Tailwind design system with HVAC theming