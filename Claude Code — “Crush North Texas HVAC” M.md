Claude Code — “Crush North Texas HVAC” Master Brief
Guardrails (must follow)

Respect each site’s robots.txt and ToS; crawl only allowed paths.

Do not copy competitor text or images. Extract structure, headings, topics, entities, schema, word counts, internal-link patterns, and UX patterns. We’ll rewrite content.

Enforce the client’s word-ban list in all generated copy (do not use: nestled, hidden gem, delve, … [full list user provided]). Add linter.

0) Inputs

Domain: https://jupitairhvac.com/

Company: Jupitair HVAC

Priority cities: Frisco, Plano, McKinney, Allen, Prosper, The Colony, Little Elm, Addison

Core services: AC Repair, Heating Repair, HVAC Installation/Replacement, Duct Cleaning, Thermostat Installation, Energy-Efficiency Upgrades, Emergency HVAC, Commercial HVAC, Residential HVAC

Design tokens: Fetch from the Chad CN MCP server (treat as JSON tokens endpoint).

1) Discovery & Competitive Crawl

Goal: Build a structured dataset of the market to out-execute: who ranks, how pages are built, content depth, schema, speed, IA, CTAs, reviews.

Seed query set (initial):

"ac repair [frisco|plano|mckinney|allen|prosper|the colony|little elm|addison]"
"hvac repair [city]"  "air conditioning repair [city]"  "furnace repair [city]"
"hvac installation [city]"  "duct cleaning [city]"  "thermostat installation [city]"
"commercial hvac [city]"  "emergency hvac [city]"


Tasks (automate):

Use a SERP API (preferred) or compliant scraping to collect top 20 organic + map pack names/URLs per query.

Build /data/competitors/serp.csv with: query, rank, title, url, type (organic/map), business name, GBP review count/rating (if available via API).

For each competitor URL (same host only), crawl up to depth 2:

Save HTML, text, H1/H2/H3, FAQ blocks, schema JSON-LD, title/meta, internal links, outbound domains.

Run Lighthouse (mobile) and capture LCP, CLS, INP, TTFB, transfer size, total JS/CSS.

Detect conversion elements: tel links, sticky call, form fields, chat widgets, badges, review blocks.

Output:

/data/competitors/pages/*.json (one per page with all extracted fields)

/data/competitors/summary.csv (site-level medians: wordcount, headings count, vitals, schema types present, #service pages, #city pages)

/data/competitors/ia-map.json (service list, city list, URL patterns)

TOP 10 patterns we should emulate (not copy) — produce /reports/competitive-findings.md.

Keep Jupitair’s own site archived too (same structure) in /data/archive/*.

2) New Astro Project (performance-first)

Stack

Astro (TS), Tailwind, MDX, @astrojs/image + Sharp, View Transitions, Partially-hydrated React islands (for forms/FAQ/CTA).

UI kit: shadcn-style components generated from Chad CN MCP tokens.

Scaffold

npm create astro@latest jupitair-hvac -- --template minimal
cd jupitair-hvac
npm i -D typescript @astrojs/tailwind tailwindcss postcss autoprefixer @astrojs/image sharp @astrojs/mdx
npx astro add tailwind && npx astro add image && npx astro add mdx


Structure

src/
  components/
    ui/ (Button, Input, Select, Card, Badge, Accordion, Modal, Tabs, Alert)
    layout/ (Header, Footer, Section, Container, Grid, Breadcrumbs)
    cta/ (StickyCall, HeroCTA, ServiceCTA)
    forms/ (LeadForm island)
    seo/ (Meta, JsonLD)
  content/
    services/*.mdx
    cities/*.mdx
  pages/
    index.astro  about.astro  services/index.astro
    contact.astro  faqs.astro  calendar.astro  blog/index.astro
    services/[service].astro
    [city]/index.astro
    [city]/[service].astro         # programmatic “service in city” pages
    sitemap.xml.ts  robots.txt.ts
  lib/
    schema.ts analytics.ts content.ts phone.ts
public/
  _archive/assets/* (from crawl)
data/
  archive/*  competitors/*

3) Design System via Chad CN MCP

Tasks

Fetch tokens JSON (colors, typography, radii, spacing, shadows).

Generate src/styles/tokens.css (CSS variables) and map to tailwind.config.cjs.

Create UI kit (rounded-2xl, soft shadows, grid spacing ≥ p-6).

Global patterns: 12-col responsive grid, consistent section padding, accessible contrast, motion-reduced animations.

4) Programmatic SEO Architecture

Collections

services and cities (Astro Content Collections).

Each service page: educational + symptoms/causes/solutions + CTA + FAQ.

Each city page: local intro (unique), neighborhoods, service grid, local FAQs, directions snippet (optional).

Combo pages /[city]/[service] auto-generated from YAML to target “service + city” queries at scale, with unique intros.

Data files

/data/services.yml    # name, slug, synonyms, FAQ, schema
/data/cities.yml      # name, slug, neighborhoods[], mapUrl, nearbyCities[]


Generator

scripts/generate-pages.ts: reads YAML and creates MDX stubs with frontmatter & initial copy.

Ensures unique intros per city and avoids banned words (linter below).

5) Content Rules (E-E-A-T + style guard)

Must include

Real business info: NAP, license/insurance, years, owner bio, headshots, truck photos (replace later if not available).

LocalBusiness, Service, FAQ, Breadcrumb, WebSite+SearchAction JSON-LD.

Unique copy per city; mention neighborhoods/landmarks.

No banned words from your list.

Clear pricing guidance ranges only if approved.

Banned-word linter (quick)

Add scripts/lint-banned-words.js to scan src/content/**/*.mdx and fail CI if any banned term appears.

6) Conversion (best-in-class)

Above the fold

Sticky Call Now (mobile) with tracking number.

Primary CTA: “Request Fast Service” → short form (Name, Phone, City, Service, Message).

Secondary CTA: “Book Online” (calendar link).

Trust

Review snippet carousel, badges (BBB, certifications), guarantees, financing (if applicable).

“Why Choose Us” 3–5 bullets (speed, warranty, trained techs).

Forms

One reusable LeadForm island: validation, honeypot, timestamp, UTM/click-ID capture.

POST /api/lead → Email (Resend/SMTP) + CRM webhook (GoHighLevel/HubSpot) + local JSON log.

Show success page (/thank-you), noindex.

Phone

CallRail (or Twilio/OpenPhone) with DNI:

One number for website, one for GBP.

Send events to GA4 (call_start, call_qualified).

7) Analytics & Attribution

GTM + GA4 installed.

DataLayer events: lead_form_view|submit|success, call_click, book_click.

GA4 conversions: form success, calls ≥ 30s.

Monthly export job writes /data/attribution/{YYYY-MM}.csv combining CRM + CallRail.

8) Performance & QA (2025 bar)

Budgets (mobile): LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1, TTI ≤ 3.5s.

Total JS ≤ 90KB gz (route), CSS ≤ 60KB.

Use @astrojs/image (WebP/AVIF), preload hero image, font display swap, preconnect to fonts/analytics, rel=prefetch for internal route hovers.

Lighthouse CI on PRs; fail if budgets exceeded.

a11y: keyboard nav, focus rings, aria-labels for phone CTAs, color-contrast pass.

9) SEO Plumbing

Unique <title> & meta per page; H1 includes target phrase.

Internal linking: service hubs ↔ city hubs ↔ combos; breadcrumbs.

sitemap.xml.ts auto-reads collections + routes.

robots.txt.ts includes Sitemap: https://…/sitemap.xml.

Canonicals per route; noindex thank-you & thin utility pages.

WebSite schema with potentialAction: SearchAction.

10) Deployment

GitHub + Vercel with preview URLs.

ENV placeholders: GTM_ID, GA4_ID, CALLRAIL_KEY, PRIMARY_PHONE, PRIMARY_EMAIL.

Domain mapping, www→root redirect, SSL.

11) Tonight’s Task List (Claude, execute in order)

Archive current site

Crawl Jupitair, save HTML/text/assets → /data/archive, /public/_archive/assets.

Produce /data/archive/inventory.csv.

Competitor discovery & crawl

Build SERP list for seed queries (top 20 organic + map businesses).

Crawl allowed competitor pages; capture structure + schema + vitals.

Output /reports/competitive-findings.md with 10 key patterns to beat (content depth, on-page length, headings strategy, internal linking, CTAs, schema usage, page speed, FAQ presence, review widgets, city/service coverage).

Generate keyword/service/city coverage matrix.

Astro scaffold + tokens

Initialize Astro project as above.

Fetch Chad CN MCP tokens → Tailwind theme → shadcn-style UI kit (rounded-2xl).

Build Header/Footer/CTA/LeadForm/FAQ/Breadcrumbs.

Content collections + generators

Create services & cities collections.

Add /data/services.yml & /data/cities.yml for the 9 services + 8 cities.

Implement scripts/generate-pages.ts to create initial MDX stubs (unique intros, FAQs).

Build dynamic routes: /services/[service], /[city], /[city]/[service].

Copy drafting (rewrite, not copy)

Use the archive only as factual reference.

Draft home, services, city stubs with clean, plain language.

Enforce banned-word linter.

Conversion + tracking

Implement StickyCall + LeadForm + API route + GTM/GA4 placeholders.

Wire CallRail placeholders for DNI events.

SEO & performance plumbing

sitemap.xml.ts, robots.txt.ts, canonicals, JSON-LD helpers.

View Transitions, image optimization, preconnect/prefetch.

Add Lighthouse CI and budgets.

First deploy to Vercel (preview).

Print repo tree and ENV values required.

Provide /reports/next-actions.md with gaps to fill (content to expand, images needed, review copy sources, policy pages, etc.).

Snippets Claude can generate immediately

(a) Competitor crawl schema (per page)

{
  "url": "https://competitor.com/ac-repair-plano",
  "title": "AC Repair Plano | ...",
  "status": 200,
  "word_count": 1420,
  "h1": "AC Repair in Plano, TX",
  "h2s": ["Same-Day Service", "Why Choose Us", "FAQ"],
  "schema_types": ["LocalBusiness","Service","FAQPage","BreadcrumbList"],
  "has_faq": true,
  "has_review_widget": true,
  "has_sticky_call": true,
  "forms": [{"fields": ["name","phone","service","message"], "steps":1}],
  "lighthouse_mobile": {"LCP": 2.3, "CLS": 0.03, "INP": 140, "ttfb": 0.3},
  "internal_links": 42,
  "service_detected": "ac-repair",
  "city_detected": "plano"
}


(b) Banned-word linter (JS)

// scripts/lint-banned-words.js
import fs from 'fs'; import glob from 'fast-glob';
const banned = ["nestled","hidden gem","delve","tapestry","idyllic","allure","lowdown","quaint","boasts","must-see","epic","meander","friendly locals","bucket list","foodie","magical","unveil","marvels","labyrinthine","treasure","embrace","indelible","living narrative","vibrant","tantalizing","brimming","echoes"];
const files = glob.sync('src/content/**/*.mdx');
let bad = [];
for (const f of files){
  const txt = fs.readFileSync(f,'utf8').toLowerCase();
  banned.forEach(w => { if (txt.includes(w)) bad.push({file:f, word:w}); });
}
if (bad.length){ console.error('BANNED WORDS FOUND:', bad); process.exit(1); }
console.log('Content linter passed');


(c) Sitemap generator (Astro)

// src/pages/sitemap.xml.ts
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
export const GET: APIRoute = async () => {
  const urls = [
    '/', '/about', '/services', '/contact', '/faqs', '/calendar', '/blog', '/termconditionprivacypolicy'
  ];
  const services = await getCollection('services');
  const cities = await getCollection('cities');

  const cityUrls = cities.map(c => `/${c.slug}`);
  const combo = [];
  for (const c of cities){
    for (const s of services){ combo.push(`/${c.slug}/${s.slug}`); }
  }
  const all = [...urls, ...services.map(s=>`/services/${s.slug}`), ...cityUrls, ...combo];
  const body = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${
    all.map(u=>`<url><loc>${new URL(u, 'https://jupitairhvac.com').href}</loc></url>`).join('')
  }</urlset>`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml' }});
};


(d) LocalBusiness JSON-LD helper

// src/lib/schema.ts
export const hvacBusiness = ({name,url,phone,address,areas}:{name:string;url:string;phone:string;address:any;areas:string[]}) => ({
  "@context":"https://schema.org",
  "@type":"HVACBusiness",
  name, url, telephone: phone, address,
  areaServed: areas.map(a=>({ "@type":"City", name:a }))
});

What to hand back at the end of the session

/reports/competitive-findings.md (patterns to beat + gaps we’ll exploit)

/data/archive/* and /data/competitors/*

Repo URL (Vercel preview) + ENV keys list

Open tasks: content sections to expand, images needed (crew, trucks, before/after), confirm NAP/license, pick CallRail numbers, connect GA4/GTM.