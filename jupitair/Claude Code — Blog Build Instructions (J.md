Claude Code — Blog Build Instructions (Jupitair HVAC)
Objective

Stand up a scalable Astro + MDX content system for Jupitair HVAC’s knowledge hub. Import the content plan CSV and MDX starter bundle, generate the rest of the posts, wire templates, internal links, schema flags, and a content linter.

0) Assets to ingest (place in workspace)

Content plan CSV: content_plan_first_60.csv
(User will upload; if not available, generate from the in-script seed_posts fallback.)

MDX starters ZIP: mdx_starters_first_10.zip
(Unzip and place MDX files into src/content/articles/.)

If the two files aren’t in the workspace yet, pause and request upload. If not provided, proceed with the fallback seed inside the generator script.

1) Scaffold the Astro project
# New project
npm create astro@latest jupitair-hvac-blog -- --template minimal
cd jupitair-hvac-blog

# Dependencies
npm i -D typescript @astrojs/tailwind tailwindcss postcss autoprefixer @astrojs/mdx @astrojs/sitemap
npx astro add tailwind
npx astro add mdx
npx astro add sitemap


Create folders:

mkdir -p src/content/articles src/layouts src/components src/pages/learn data/content scripts

2) Content collections schema

Create src/content/config.ts:

import { defineCollection, z } from "astro:content";

const article = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    metaTitle: z.string(),
    metaDescription: z.string().max(160),
    category: z.string(),            // e.g., "AC & Cooling"
    subcategory: z.string(),         // e.g., "Symptoms & Diagnostics"
    intent: z.enum(["Awareness","Consideration","Decision","Emergency"]).default("Awareness"),
    primaryKeyword: z.string(),
    secondaryKeywords: z.array(z.string()).default([]),
    updated: z.string().optional(),
    ctaText: z.string().optional(),
    internalLinks: z.array(z.string()).default([]),   // absolute paths
    schema: z.array(z.string()).default([])           // e.g., ["FAQPage","BreadcrumbList"]
  })
});

export const collections = { articles: article };

3) Base layout and article template

src/layouts/Base.astro

---
const { title, description, jsonLd } = Astro.props;
---
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>{title}</title>
    <meta name="description" content={description} />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    {jsonLd && <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>}
  </head>
  <body class="min-h-screen">
    <slot />
  </body>
</html>


src/pages/learn/[slug].astro

---
import Base from "../../layouts/Base.astro";
import { getCollection } from "astro:content";

const { slug } = Astro.params;
const all = await getCollection("articles");
const page = all.find(a => a.data.slug === slug);
if (!page) throw new Error("Article not found");

const related = all
  .filter(a => a.slug !== page.slug && a.data.category === page.data.category)
  .slice(0, 5);

const jsonLd = page.data.schema?.includes("FAQPage")
  ? { "@context":"https://schema.org", "@type":"FAQPage" }
  : null;
---
<Base title={page.data.metaTitle} description={page.data.metaDescription} jsonLd={jsonLd}>
  <main class="mx-auto max-w-3xl px-4 py-8">
    <h1 class="text-3xl font-semibold mb-4">{page.data.title}</h1>
    <article class="prose max-w-none">
      <Fragment set:html={await page.render().then(r => r?.html ?? "")} />
    </article>

    {page.data.internalLinks?.length > 0 && (
      <aside class="mt-10 border-t pt-6">
        <h2 class="text-xl font-medium mb-2">Related reading</h2>
        <ul class="list-disc pl-6">
          {page.data.internalLinks.map(u => <li><a href={u}>{u}</a></li>)}
        </ul>
      </aside>
    )}
  </main>
</Base>


Learn hub: src/pages/learn/index.astro

---
import { getCollection } from "astro:content";
const all = await getCollection("articles");
const byCategory = all.reduce((m, a) => {
  const k = a.data.category || "Other";
  m[k] = m[k] || [];
  m[k].push(a);
  return m;
}, {});
---
<main class="mx-auto max-w-5xl px-4 py-8">
  <h1 class="text-3xl font-semibold mb-6">HVAC Knowledge Hub</h1>
  {Object.entries(byCategory).map(([cat, posts]) => (
    <section class="mb-10">
      <h2 class="text-2xl font-medium mb-2">{cat}</h2>
      <ul class="grid md:grid-cols-2 gap-3">
        {posts.map(p => (
          <li>
            <a href={`/learn/${p.data.slug}`} class="underline">{p.data.title}</a>
            <div class="text-sm opacity-70">{p.data.subcategory} · {p.data.intent}</div>
          </li>
        ))}
      </ul>
    </section>
  ))}
</main>


Add a simple redirect to keep clean paths (optional later).

4) Import plan + starters; generate the rest
4.1 Place files

Put content_plan_first_60.csv into data/content/.

Unzip mdx_starters_first_10.zip and drop .mdx files into src/content/articles/.

4.2 Generator script (reads CSV → creates MDX)

Create scripts/generate_from_csv.ts:

// Run with: npx tsx scripts/generate_from_csv.ts
import fs from "fs";
import path from "path";
import csvParse from "csv-parse/sync";

const CSV_PATH = "data/content/content_plan_first_60.csv";
const OUT_DIR  = "src/content/articles";

const ensureDir = (p:string) => fs.existsSync(p) || fs.mkdirSync(p, { recursive: true });

function fm(v:any){ return String(v ?? "").replace(/"/g,'\\"'); }

function mdxFrontmatter(row:any){
  const secondary = row.secondary_keywords ? row.secondary_keywords.split(";").map((s:string)=>s.trim()).filter(Boolean) : [];
  const internal  = row.internal_links ? row.internal_links.split(",").map((s:string)=>s.trim()).filter(Boolean) : [];
  const schema    = row.schema_types ? row.schema_types.split(";").map((s:string)=>s.trim()) : [];

  return `---
title: "${fm(row.title)}"
slug: "${fm(row.slug)}"
metaTitle: "${fm(row.title)}"
metaDescription: "${fm(row.title)} — clear steps, practical fixes, and when to call a pro in North Texas."
category: "${fm(row.category)}"
subcategory: "${fm(row.subcategory)}"
intent: "${fm(row.intent)}"
primaryKeyword: "${fm(row.primary_keyword)}"
secondaryKeywords: [${secondary.map((t:string)=>`"${fm(t)}"`).join(", ")}]
updated: "${new Date().toISOString().slice(0,10)}"
ctaText: "${fm(row.cta_text)}"
internalLinks: [${internal.map((u:string)=>`"${fm(u)}"`).join(", ")}]
schema: [${schema.map((s:string)=>`"${fm(s)}"`).join(", ")}]
---
`;
}

function mdxBody(row:any){
  const cta = row.cta_text || "Request Fast Service";
  return `
> If you need help now, call **[Jupitair HVAC](/contact)** or tap **Call** on mobile.

## The short version
- What this problem looks like
- Likely causes
- What to check safely
- When to stop and call
- Typical time and cost ranges

## What you can check safely
- Thermostat mode and setpoint
- Filter condition and airflow at vents
- Breaker/fuse
- Ice or water near the air handler
- Any error code on the unit

## Common causes and the order to rule them out
1. Most common — how it shows up and how to confirm
2. Next likely — what to look for
3. Less common — when this is the culprit
4. Rare — after easy items are ruled out

## When to repair vs replace
- Age, repair history, efficiency
- When an upgrade lowers bills
- How to compare quotes

## Typical cost ranges and time
- Diagnosis time and fee
- Parts and labor ranges
- When a second opinion helps

## Preventing a repeat
- Maintenance that matters
- Filter type and schedule
- Seasonal tune-ups

## Need help?
- **${cta}** → **[Request Fast Service](/contact)** or **[Call Now](tel:+1-XXX-XXX-XXXX)**

## FAQ
- **Can I run the system while I wait?** Short answer with safety limits.
- **How fast can you arrive in my city?** Same-day in most cases across North Texas.
- **Will this be covered by a warranty?** What is usually covered and what is not.
`;
}

function main(){
  ensureDir(OUT_DIR);
  if (!fs.existsSync(CSV_PATH)){
    console.warn("CSV not found. Provide data/content/content_plan_first_60.csv or use the seed fallback.");
    process.exit(0);
  }
  const csv = fs.readFileSync(CSV_PATH, "utf-8");
  const rows = csvParse.parse(csv, { columns: true, skip_empty_lines: true });
  let created = 0, skipped = 0;

  for (const row of rows){
    const slug = String(row.slug).trim();
    if (!slug) continue;
    const file = path.join(OUT_DIR, `${slug}.mdx`);
    if (fs.existsSync(file)){ skipped++; continue; }
    const body = mdxFrontmatter(row) + mdxBody(row);
    fs.writeFileSync(file, body, "utf-8");
    created++;
  }
  console.log(`Created ${created} files, skipped ${skipped} (already exist).`);
}

main();


Install dev deps for the script and run:

npm i -D tsx csv-parse
npx tsx scripts/generate_from_csv.ts


Result: all CSV rows that don’t already exist as MDX will be created under src/content/articles/.

5) Content linter for banned terms

Create scripts/lint-banned-words.js:

#!/usr/bin/env node
import fs from "fs";
import glob from "fast-glob";

const BANNED = [
  "nestled","hidden gem","delve","tapestry","idyllic","allure","lowdown","quaint","boasts","must-see","epic",
  "meander","friendly locals","bucket list","foodie","magical","unveil","marvels","labyrinthine","treasure",
  "embrace","indelible","living narrative","vibrant","tantalizing","brimming","echoes","beacon","abounds","splendor",
  "beckon","chronicles","glimpse","annals","poetry","sun-dappled","gem"
];

const files = await glob("src/content/articles/**/*.mdx");
let issues = [];
for (const f of files){
  const t = fs.readFileSync(f,"utf-8").toLowerCase();
  const hits = BANNED.filter(w => t.includes(w));
  if (hits.length) issues.push({ file:f, hits:[...new Set(hits)].sort() });
}
if (issues.length){
  console.error("BANNED WORDS FOUND:");
  for (const i of issues) console.error(`- ${i.file} => ${i.hits.join(", ")}`);
  process.exit(1);
} else {
  console.log("Content linter passed.");
}


Install and wire:

npm i -D fast-glob
# package.json -> scripts
# "scripts": { "dev": "astro dev", "build": "astro build", "preview": "astro preview", "lint:content": "node scripts/lint-banned-words.js" }


Run:

npm run lint:content

6) Routes & sitemap

Articles render at: /learn/[slug]

Hub at: /learn/

The @astrojs/sitemap integration auto-emits sitemap.xml for published routes on build.

7) Internal links

The CSV internal_links field is already parsed into frontmatter.

The template renders them under Related reading.

When we publish service pages later, add those paths to internalLinks in the related MDX files.

8) Dev and preview
npm run dev
# open http://localhost:4321/learn


(Optionally) initialize a repo and push:

git init
git add .
git commit -m "feat: Jupitair HVAC blog system + imported content plan"


Deploy preview (Vercel example):

npm i -g vercel
vercel init   # follow prompts
vercel        # preview

9) Acceptance criteria

 src/content/articles/ contains MDX for all rows in content_plan_first_60.csv (existing starters preserved).

 /learn/ lists posts grouped by category with subcategory and intent labels.

 /learn/[slug] renders title, meta, body, and Related reading from internalLinks.

 Content linter runs and passes (no banned words).

 Sitemap includes /learn/* routes.

 Local dev server runs without errors; optional Vercel preview created.

10) Fallback (if CSV/ZIP weren’t provided)

Keep this file, then run the generator in seed mode by adding a small seed_posts array at the top of generate_from_csv.ts and iterate to create 10 MDX files identical in structure to the starters.

Once the CSV is available, run the script again; it will skip already-existing files and create the rest.

Done

When these steps are complete, return:

A short summary of files created + counts (created vs skipped).

A screenshot or list of example URLs under /learn/.

Any content rows that failed generation (if any), with reasons.

If you want Claude to also auto-generate briefed content into each MDX (beyond the boilerplate), add a second pass script that expands the body based on category, intent, and notes, but keep the safety/accuracy guardrails.