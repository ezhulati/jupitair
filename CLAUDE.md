# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Jupitair HVAC is an Astro-based website for an HVAC service company serving North Texas. The site uses hybrid SSR/SSG rendering with Node.js adapter, MDX content, and Tailwind CSS for styling.

## Essential Commands

```bash
# Development
npm run dev            # Start dev server on http://localhost:4321
npm run build          # Build for production
npm run preview        # Preview production build

# Code Quality
npx astro check        # Type check Astro components and TypeScript
npm run lint           # Lint JavaScript/TypeScript (if configured)

# Content Management
npm run fetch-reviews  # Fetch Google reviews
npm run fetch-facebook # Fetch Facebook reviews
npm run generate-images # Generate OG images for social sharing

# Testing API endpoints
curl -X POST http://localhost:4321/api/contact -H "Content-Type: application/json" -d '{"phone":"123-456-7890"}'
```

## Architecture & Key Systems

### Rendering Strategy
- **Output Mode**: Hybrid (SSR + SSG)
- **Adapter**: Node.js standalone
- **Static Pages**: Marketing pages, service pages
- **Dynamic Pages**: API routes (`/api/*`), OAuth callbacks
- **Content Collections**: Blog posts in `/src/content/blog/`

### Core Technologies
- **Framework**: Astro 4.14 with React islands
- **Styling**: Tailwind CSS with custom design tokens
- **Content**: MDX for rich content pages
- **Images**: Cloudinary CDN integration
- **Forms**: Server-side handling with Nodemailer
- **Analytics**: Custom advanced analytics system

### Critical API Endpoints

#### `/api/contact` (POST)
- Handles all form submissions
- Supports both JSON and form-encoded data
- Creates Zoho calendar events if configured
- Sends email notifications via Nodemailer
- **Note**: Currently has email disabled (line 71) - returns success without sending

#### `/api/availability` (GET)
- Returns available appointment slots
- Integrates with Zoho Calendar API
- Used by booking forms

#### `/api/booking` (POST)  
- Books appointments
- Validates slot availability
- Creates calendar events

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

### Common Issues & Solutions

#### TypeScript Warnings
- 7 non-critical warnings remain in `analytics-advanced.ts`
- Run `npx astro check` to see current status

#### Missing PremiumButton
- Use `Button` component instead
- PremiumButton was removed but some imports remain

#### Horizontal Scroll Issues
- Remove `min-w-0` classes from service cards
- Check for `overflow-x-hidden` on parent containers

#### White Text on White Background
- Common issue in commercial pages
- Ensure proper contrast: `text-primary-700` on `bg-white`

### Performance Targets
- **LCP**: < 2.5s
- **INP**: < 200ms  
- **CLS**: < 0.1
- **Lighthouse Score**: > 95%

### Git Workflow

```bash
# Before committing
npx astro check        # Check for TypeScript errors
git status             # Review changes

# Commit with descriptive messages
git add .
git commit -m "Fix: [component] - [specific issue]"

# Push to main (after removing any secrets)
git push origin main
```

### Security Notes
- `.env.local` is gitignored - never commit secrets
- API endpoints have basic validation but no rate limiting
- Contact form has email disabled by default (line 71 in `/api/contact.ts`)

### Testing Checklist
- [ ] All forms submit successfully
- [ ] Phone numbers are clickable
- [ ] Navigation hides/shows on scroll
- [ ] Service cards don't cause horizontal scroll
- [ ] Analytics events fire correctly
- [ ] Schema markup validates
- [ ] Mobile responsive at all breakpoints

## Recent Changes
- Fixed phone icons in 65 blog posts (stroke-based SVG)
- Removed PremiumButton component (use Button instead)
- Fixed TypeScript errors (7 warnings remain)
- Redesigned Service Areas section with glassmorphism
- Implemented hide-on-scroll navigation
- Fixed button contrast issues on commercial pages