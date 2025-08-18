Here’s a **copy-paste implementation spec** you can drop into Claude Code. It defines **full, 2025-grade SEO requirements** for *every* page type and gives exact files, code, and checks to build into your Astro project.

---

# Claude Code — Full-Stack SEO Requirements (Jupitair HVAC)

## Goal

Implement a **sitewide SEO system** covering metadata, canonicals, structured data, internal linking, local SEO, image SEO, sitemaps/robots, and CI checks. All pages must ship with **valid JSON-LD**, **fast CWV**, and **clean, consistent URLs**.

---

## 0) Project settings

1. Ensure `astro.config.mjs` has the live site URL:

```js
// astro.config.mjs
import { defineConfig } from 'astro/config';
export default defineConfig({
  site: 'https://www.jupitairhvac.com', // adjust if different
});
```

2. Decide URL policy: **no trailing slash** (recommended) and **force https & apex** (301).

* Non-www → www or vice-versa (pick one and redirect the other).

---

## 1) Content model (enforce SEO fields)

Update **`src/content/config.ts`** to require SEO metadata:

```ts
import { defineCollection, z } from "astro:content";

const MAX_T = 65;  // title length budget
const MAX_D = 160; // meta description budget

const baseFields = z.object({
  title: z.string().max(MAX_T),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  metaTitle: z.string().max(MAX_T),
  metaDescription: z.string().max(MAX_D),
  category: z.string(),
  subcategory: z.string(),
  intent: z.enum(["Awareness","Consideration","Decision","Emergency"]),
  primaryKeyword: z.string(),
  secondaryKeywords: z.array(z.string()).default([]),
  updated: z.string().optional(),
  ctaText: z.string().optional(),
  internalLinks: z.array(z.string()).default([]),
  schema: z.array(z.string()).default([]), // e.g., ["FAQPage","BreadcrumbList"]
  // Optional author block for E-E-A-T
  author: z.object({
    name: z.string(),
    title: z.string().optional(),
    bio: z.string().optional(),
    sameAs: z.array(z.string()).optional()
  }).optional(),
  // Optional review data (only if visibly shown on page)
  aggregateRating: z.object({
    ratingValue: z.number(),
    reviewCount: z.number()
  }).optional(),
  // Images
  heroImage: z.string().optional(),   // /images/...
  heroAlt: z.string().optional()
});

export const collections = {
  articles: defineCollection({ type: "content", schema: baseFields }),
  pages:    defineCollection({ type: "content", schema: baseFields.extend({
    isIndexable: z.boolean().default(true) // allow noindex for thin/system pages
  })})
};
```

---

## 2) SEO utilities (meta, canonical, JSON-LD)

Create **`src/lib/seo/meta.ts`**:

```ts
export const SITE = "https://www.jupitairhvac.com";

const STRIP_PARAMS = new Set(["utm_source","utm_medium","utm_campaign","utm_term","utm_content","gclid","fbclid"]);

export function canonicalFromPath(path: string): string {
  const url = new URL(path, SITE);
  // strip trackers
  [...url.searchParams.keys()].forEach(k => { if (STRIP_PARAMS.has(k)) url.searchParams.delete(k); });
  // enforce no trailing slash except root
  if (url.pathname !== "/" && url.pathname.endsWith("/")) url.pathname = url.pathname.slice(0, -1);
  return url.toString();
}

export function titleTemplate(metaTitle: string): string {
  // Keep under ~60–65 chars total whenever possible
  return metaTitle;
}

export function robotsMeta({ indexable = true }: { indexable?: boolean }) {
  return indexable ? "index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1"
                   : "noindex,follow";
}
```

Create **`src/lib/seo/schema.ts`** (JSON-LD builders):

```ts
export function ldBreadcrumb(items: Array<{name:string, url:string}>) {
  return {
    "@context":"https://schema.org",
    "@type":"BreadcrumbList",
    "itemListElement": items.map((it, i) => ({
      "@type":"ListItem", "position": i+1, "name": it.name, "item": it.url
    }))
  };
}

export function ldFAQ(faqs: Array<{q:string, a:string}>) {
  return {
    "@context":"https://schema.org",
    "@type":"FAQPage",
    "mainEntity": faqs.map(x => ({
      "@type":"Question",
      "name": x.q,
      "acceptedAnswer": {"@type":"Answer","text": x.a}
    }))
  };
}

export function ldArticle({url, headline, description, dateModified, image, author}:{url:string, headline:string, description:string, dateModified?:string, image?:string, author?:{name:string}}) {
  return {
    "@context":"https://schema.org",
    "@type":"Article",
    "mainEntityOfPage": {"@type":"WebPage","@id": url},
    "headline": headline,
    "description": description,
    ...(image ? {"image":[image]} : {}),
    ...(author ? {"author":{"@type":"Person","name":author.name}} : {}),
    ...(dateModified ? {"dateModified": dateModified} : {})
  };
}

// Local business for HVAC
export function ldHVACBusiness({url, name, logo, phone, priceRange, geo, address, hours, sameAs, areaServed}:{url:string, name:string, logo:string, phone:string, priceRange?:string, geo?:{lat:number, lng:number}, address:{street:string, city:string, region:string, postal:string}, hours?:Array<{dayOfWeek:string[], opens:string, closes:string}>, sameAs?:string[], areaServed?:string[]}) {
  return {
    "@context":"https://schema.org",
    "@type":"HVACBusiness",
    "@id": url + "#identity",
    "url": url,
    "name": name,
    "logo": {"@type":"ImageObject","url": logo},
    "telephone": phone,
    ...(priceRange ? {"priceRange": priceRange} : {}),
    "address": {
      "@type":"PostalAddress",
      "streetAddress": address.street,
      "addressLocality": address.city,
      "addressRegion": address.region,
      "postalCode": address.postal
    },
    ...(geo ? {"geo":{"@type":"GeoCoordinates","latitude":geo.lat,"longitude":geo.lng}} : {}),
    ...(hours ? {"openingHoursSpecification": hours.map(h=>({
      "@type":"OpeningHoursSpecification",
      "dayOfWeek": h.dayOfWeek,
      "opens": h.opens, "closes": h.closes
    }))} : {}),
    ...(sameAs && sameAs.length ? {"sameAs": sameAs} : {}),
    ...(areaServed && areaServed.length ? {"areaServed": areaServed} : {})
  };
}

export function ldService({url, serviceType, providerUrl, areaServed}:{url:string, serviceType:string, providerUrl:string, areaServed:string[]}) {
  return {
    "@context":"https://schema.org",
    "@type":"Service",
    "serviceType": serviceType,
    "provider": {"@type":"HVACBusiness","@id": providerUrl + "#identity"},
    "areaServed": areaServed,
    "url": url
  };
}

export function ldWebsiteSearch({siteUrl}:{siteUrl:string}) {
  return {
    "@context":"https://schema.org",
    "@type":"WebSite",
    "url": siteUrl,
    "potentialAction": [{
      "@type":"SearchAction",
      "target": `${siteUrl}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    }]
  };
}
```

---

## 3) Reusable `<SEOHead />` component

Create **`src/components/SEOHead.astro`**:

```astro
---
import { canonicalFromPath, titleTemplate, robotsMeta } from "@/lib/seo/meta";
const { metaTitle, metaDescription, path, indexable = true, ogImage, jsonLd = [] } = Astro.props;
const url = canonicalFromPath(path || Astro.url.pathname);
const title = titleTemplate(metaTitle);
const robots = robotsMeta({ indexable });
---
<head>
  <title>{title}</title>
  <meta name="description" content={metaDescription} />
  <link rel="canonical" href={url} />

  <meta name="robots" content={robots} />
  <meta name="viewport" content="width=device-width, initial-scale=1" />

  <!-- Open Graph -->
  <meta property="og:title" content={title} />
  <meta property="og:description" content={metaDescription} />
  <meta property="og:type" content="website" />
  <meta property="og:url" content={url} />
  {ogImage && <meta property="og:image" content={ogImage} />}
  <meta property="og:site_name" content="Jupitair HVAC" />

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={title} />
  <meta name="twitter:description" content={metaDescription} />
  {ogImage && <meta name="twitter:image" content={ogImage} />}

  {Array.isArray(jsonLd) ? jsonLd.map((obj) => (
    <script type="application/ld+json">{JSON.stringify(obj)}</script>
  )) : (jsonLd && <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>)}
</head>
```

---

## 4) Page templates — wire meta + JSON-LD

### 4.1 Articles (learn pages)

Update **`src/pages/learn/[slug].astro`**:

```astro
---
import SEOHead from "@/components/SEOHead.astro";
import { getCollection } from "astro:content";
import { ldBreadcrumb, ldFAQ, ldArticle } from "@/lib/seo/schema";
import { canonicalFromPath } from "@/lib/seo/meta";

const { slug } = Astro.params;
const all = await getCollection("articles");
const page = all.find(p => p.data.slug === slug);
if (!page) throw new Error("Article not found");
const url = canonicalFromPath(`/learn/${slug}`);

const crumbs = ldBreadcrumb([
  { name: "Learn", url: canonicalFromPath("/learn") },
  { name: page.data.title, url }
]);

const faqBlocks = page.data.schema.includes("FAQPage")
  ? ldFAQ([
      { q: "Can I run the system while I wait?", a: "Short answer with safety limits." },
      { q: "How fast can you arrive in North Texas?", a: "Same-day in most cases." }
    ])
  : null;

const article = ldArticle({
  url,
  headline: page.data.metaTitle,
  description: page.data.metaDescription,
  dateModified: page.data.updated,
  image: page.data.heroImage,
  author: page.data.author ? { name: page.data.author.name } : undefined
});

const jsonLd = [crumbs, article, ...(faqBlocks ? [faqBlocks] : [])];
---
<html lang="en">
  <SEOHead metaTitle={page.data.metaTitle}
           metaDescription={page.data.metaDescription}
           path={`/learn/${slug}`}
           indexable={true}
           ogImage={page.data.heroImage}
           jsonLd={jsonLd} />
  <body>
    <main class="mx-auto max-w-3xl px-4 py-8">
      <h1 class="text-3xl font-semibold mb-4">{page.data.title}</h1>
      <article class="prose max-w-none">
        <Fragment set:html={await page.render().then(r => r?.html ?? "")} />
      </article>
    </main>
  </body>
</html>
```

### 4.2 Service pages

* Use **LocalBusiness** once site-wide (home/about/footer), **Service** per service page.
* Add FAQ JSON-LD only if matching visible FAQ content.

### 4.3 City/Location pages

* Use **HVACBusiness** (primary) + **Service** for featured services.
* Include **areaServed** (city names) and **GeoCoordinates** if you have a physical office.
  If service-area only (no storefront), keep address consistent with GMB.

---

## 5) Image SEO & OpenGraph

* Use Astro `<Image />`/`<picture>` with **AVIF/WebP** and width/height set to prevent CLS.
* **Hero**: 1200×630 min for OG; generate OG images automatically.

Add dynamic OG route **`src/pages/api/og.png.ts`** (if using @vercel/og or satori) — optional:

* Input: `title`, `category`.
* Output: 1200×630 PNG.
* In templates, set `ogImage` to `/api/og.png?title=...`.

**Alt text rule**: `{object/action}, {context}, {brand when relevant}`.
Example: `Technician replacing AC capacitor in attic air handler — Jupitair HVAC`.

---

## 6) Internal linking rules

* Each article: **≥3 internal links** to service pages or related learn posts (from frontmatter `internalLinks`).
* Each service page: links to **top diagnostic guides** and **financing** page.
* Breadcrumbs on all content pages (and JSON-LD BreadcrumbList).
* Use descriptive anchor text, no “click here.”

---

## 7) Robots, sitemaps, redirects

**`public/robots.txt`**

```
User-agent: *
Disallow: /search
Disallow: /api/
Allow: /

Sitemap: https://www.jupitairhvac.com/sitemap.xml
```

**Sitemap index** with logical splits (articles, services, cities). Create **`src/pages/sitemap.xml.ts`**:

```ts
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { canonicalFromPath } from '@/lib/seo/meta';

export const GET: APIRoute = async ({ site }) => {
  const articles = await getCollection('articles');
  const urls = [
    canonicalFromPath("/"),
    canonicalFromPath("/learn"),
    ...articles.map(a => canonicalFromPath(`/learn/${a.data.slug}`))
    // add service & city routes when present
  ];
  const body =
    `<?xml version="1.0" encoding="UTF-8"?>` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">` +
    urls.map(u => `<url><loc>${u}</loc></url>`).join("") +
    `</urlset>`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml' }});
}
```

**Redirects** (Netlify/Vercel or adapter). Example Netlify **`public/_redirects`**:

```
http://jupitairhvac.com/* https://www.jupitairhvac.com/:splat 301!
https://www.jupitairhvac.com/*  https://www.jupitairhvac.com/:splat  200
```

(Also add non-preferred host → preferred, and **http → https**.)

---

## 8) Page-type requirements (quick matrix)

| Page type          | Title/Description          | Canonical | Schema (JSON-LD)                                      | Robots             | Notes                                     |
| ------------------ | -------------------------- | --------- | ----------------------------------------------------- | ------------------ | ----------------------------------------- |
| Home               | Brand + USP / value        | Self      | `HVACBusiness` + `WebSite` SearchAction               | index,follow       | Include NAP, hours, service areas, sameAs |
| Service            | Service + city/area intent | Self      | `Service` + breadcrumbs                               | index,follow       | Link to diagnostics & financing           |
| Article (Learn)    | Problem/solution phrasing  | Self      | `Article` + `BreadcrumbList` (+ `FAQPage` if visible) | index,follow       | One H1, clear sections                    |
| City hub           | City + HVAC intent         | Self      | `HVACBusiness` (with areaServed) + breadcrumbs        | index,follow       | Embed GMB link; show phone/hours          |
| About/Team         | Brand trust                | Self      | `Organization` + breadcrumbs                          | index,follow       | Show license/insurance if any             |
| Contact            | Clear CTA                  | Self      | `ContactPage` + breadcrumbs                           | index,follow       | tel: links, hours                         |
| Reviews            | Brand + rating             | Self      | `AggregateRating` **only if visible**                 | index,follow       | Don’t fake review markup                  |
| Search results     | N/A                        | Self      | none                                                  | **noindex,follow** | Prevent thin SERP pages indexing          |
| Thank-you / system | N/A                        | Self      | none                                                  | **noindex,follow** | Do not block CSS/JS                       |

---

## 9) Core Web Vitals guardrails (code-level)

* **LCP**: server-render hero, preconnect fonts/CDN, preload hero image.
* **INP**: ship minimal JS; prefer Astro islands only where needed.
* **CLS**: always set width/height on media; avoid late-loading UI shifts.
* Fonts: `font-display: swap`, subset and preload WOFF2.

---

## 10) Link hygiene

* External links: `rel="noopener noreferrer"` (+ `sponsored` or `ugc` when applicable).
* Phone: `tel:+1XXXXXXXXXX` and visible number matches GMB (**NAP consistency**).
* Email: `mailto:...` only where needed; otherwise use forms with spam protection.

---

## 11) Local SEO specifics

* **NAP** identical across site, GMB, footer, and schema.
* **Service areas**: list target cities in footer and `HVACBusiness.areaServed`.
* **Map link**: link to GMB profile; embed map only if it doesn’t hurt LCP (defer).
* **Hours**: keep JSON-LD hours synced with footer/humans-visible hours.

---

## 12) OpenGraph image automation (optional but recommended)

* Route: `/api/og.png?title=...` → returns branded OG.
* Cache OG images to `/public/og/slug.png` on build for speed.
* Set default fallback image for pages without `heroImage`.

---

## 13) Robots safety for staging

* If `process.env.DEPLOY_ENV !== 'prod'`: inject `<meta name="robots" content="noindex,nofollow">` globally and **no sitemap**.

---

## 14) CI: SEO quality gate

Create **`scripts/seo-check.mjs`**:

```js
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import glob from 'fast-glob';

const root = path.dirname(fileURLToPath(import.meta.url));
const MAX_T = 65, MAX_D = 160;

function within(s, n){ return (s||"").trim().length > 0 && (s||"").length <= n; }

const files = await glob("src/content/**/*.{md,mdx}", { cwd: path.resolve(root, "..") });
let failed = false;

for (const f of files) {
  const t = fs.readFileSync(path.resolve(root, "..", f), "utf-8");
  const fm = t.match(/^---([\s\S]*?)---/);
  if (!fm) { console.error(`No frontmatter: ${f}`); failed = true; continue; }
  const text = fm[1];
  const get = (k)=> (text.match(new RegExp(`${k}:\\s*(.*)`))||[])[1]?.replace(/(^"|"$)/g,'').trim();

  const title = get("metaTitle") || get("title");
  const desc  = get("metaDescription");
  const slug  = get("slug");
  if (!within(title, MAX_T)) { console.error(`Title length bad: ${f}`); failed = true; }
  if (!within(desc,  MAX_D)) { console.error(`Meta description length bad: ${f}`); failed = true; }
  if (!/^[a-z0-9-]+$/.test(slug||"")) { console.error(`Slug bad: ${f}`); failed = true; }
}
if (failed) process.exit(1);
console.log("SEO check passed.");
```

Add to `package.json`:

```json
"scripts": {
  "lint:seo": "node scripts/seo-check.mjs"
}
```

Run this in CI and fail the build on errors.

---

## 15) Definition of Done (per page)

* **One H1** that matches **metaTitle** intent.
* **metaTitle ≤ 65 chars**, **metaDescription ≤ 160 chars**.
* **Canonical** points to preferred host, https, no trailing slash.
* **OpenGraph/Twitter** set; OG image present or fallback.
* **BreadcrumbList** JSON-LD present on all subpages.
* **Article/Service/HVACBusiness/FAQ** JSON-LD present when applicable and **content is visible**.
* **Internal links ≥ 3** to relevant pages with descriptive anchors.
* **Images** have alt text, explicit dimensions, modern formats.
* **Robots**: indexable pages use `index,follow`; thin/system pages `noindex,follow`.
* Page included in **sitemap.xml** (unless noindex).
* Page loads pass **LCP/INP/CLS** budgets in lab runs.

---

## 16) LocalBusiness base markup (site-wide include)

In your **layout** (home/about/footer), inject:

```astro
---
import SEOHead from "@/components/SEOHead.astro";
import { ldHVACBusiness, ldWebsiteSearch } from "@/lib/seo/schema";
const baseUrl = "https://www.jupitairhvac.com";
const org = ldHVACBusiness({
  url: baseUrl,
  name: "Jupitair HVAC",
  logo: baseUrl + "/images/logo.png",
  phone: "+1972XXXXXXX",
  priceRange: "$$",
  address: { street: "123 Service Rd", city: "Frisco", region: "TX", postal: "75034" },
  sameAs: ["https://g.co/kgs/yourgmb", "https://www.facebook.com/yourpage"],
  areaServed: ["Frisco","Plano","McKinney","Allen","Prosper","The Colony","Little Elm","Addison"]
});
const website = ldWebsiteSearch({ siteUrl: baseUrl });
---
<SEOHead metaTitle="Jupitair HVAC — AC & Heating in North Texas"
         metaDescription="Repairs, installs, and tune-ups with same-day service across North Texas."
         path="/"
         jsonLd={[org, website]} />
```

---

## 17) Page copy rules (search intent)

* Use direct, clear language. Avoid filler.
* Put **primary keyword** in H1 and first 100 words naturally.
* Include **secondary keywords** in subheads where relevant.
* Add a short **“The short version”** box with scannable bullets.
* End with a clear CTA with phone and contact link.

---

## 18) Tracking (optional but recommended)

* Add **tel links** and event tracking on click.
* Use **call tracking** with DNI on web while keeping **GMB primary number** consistent across schema and footer for NAP.
* Strip UTMs in canonical (already handled). Keep UTMs for analytics only.

---

### Execution notes to Claude

* Create/modify all files exactly as shown.
* Refactor existing templates to **use `<SEOHead />`** and JSON-LD builders.
* Add CI step `npm run lint:seo` and ensure the build fails if checks fail.
* For every MDX already generated, ensure frontmatter meets title/description budgets and includes `schema` flags appropriately (`FAQPage` only if the FAQ section is visible).

If you want, I can also provide a **ready-to-run PR patch** for an Astro repo with these exact changes.
