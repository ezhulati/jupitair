import type { APIRoute } from 'astro';
import { readFileSync, readdirSync } from 'fs';
import { parse } from 'yaml';
import { join } from 'path';

export const GET: APIRoute = async () => {
  try {
    // Load data from project root
    const servicesData = parse(readFileSync(join(process.cwd(), 'data/services.yml'), 'utf8'));
    const citiesData = parse(readFileSync(join(process.cwd(), 'data/cities.yml'), 'utf8'));
  
  const services = servicesData?.money_pages || [];
  const cities = citiesData?.cities || [];
  
    // Get blog posts
    const blogDir = join(process.cwd(), 'src/content/blog');
    const blogPosts = readdirSync(blogDir)
      .filter(file => file.endsWith('.mdx'))
      .map(file => file.replace('.mdx', ''));
  
  // Get current date in W3C format
  const currentDate = new Date().toISOString().split('T')[0];
  
  // Build URLs array
  const urls = [];
  
  // Homepage
  urls.push({
    loc: 'https://jupitairhvac.com/',
    lastmod: currentDate,
    changefreq: 'weekly',
    priority: '1.0'
  });
  
  // Main pages
  const mainPages = [
    { path: '/about', priority: '0.8', changefreq: 'monthly' },
    { path: '/services', priority: '0.9', changefreq: 'weekly' },
    { path: '/contact', priority: '0.9', changefreq: 'monthly' },
    { path: '/schedule', priority: '0.9', changefreq: 'monthly' },
    { path: '/privacy', priority: '0.3', changefreq: 'yearly' },
    { path: '/terms', priority: '0.3', changefreq: 'yearly' },
    { path: '/style-guide', priority: '0.1', changefreq: 'yearly' },
    { path: '/success', priority: '0.1', changefreq: 'yearly' },
    { path: '/sitemap', priority: '0.5', changefreq: 'monthly' }
  ];
  
  mainPages.forEach(page => {
    urls.push({
      loc: `https://jupitairhvac.com${page.path}`,
      lastmod: currentDate,
      changefreq: page.changefreq,
      priority: page.priority
    });
  });
  
  // Service pages (from services.yml)
  services.forEach((service: any) => {
    // Service page
    urls.push({
      loc: `https://jupitairhvac.com/services/${service.slug}`,
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: service.priority <= 5 ? '0.9' : '0.8'
    });
  });
  
  // City pages
  cities.forEach((city: any) => {
    // City landing page
    urls.push({
      loc: `https://jupitairhvac.com/${city.slug}`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: '0.8'
    });
    
    // City + Service combination pages
    services.slice(0, 6).forEach((service: any) => {
      urls.push({
        loc: `https://jupitairhvac.com/${city.slug}/${service.slug}`,
        lastmod: currentDate,
        changefreq: 'monthly',
        priority: '0.7'
      });
    });
  });
  
  // Blog pages
  urls.push({
    loc: 'https://jupitairhvac.com/blog',
    lastmod: currentDate,
    changefreq: 'daily',
    priority: '0.8'
  });
  
  // Individual blog posts
  blogPosts.forEach(post => {
    urls.push({
      loc: `https://jupitairhvac.com/blog/${post}`,
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: '0.7'
    });
  });
  
  // Build XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0">
${urls.map(url => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

    return new Response(xml, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600' // Cache for 1 hour
      }
    });
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return new Response('Error generating sitemap', { status: 500 });
  }
};