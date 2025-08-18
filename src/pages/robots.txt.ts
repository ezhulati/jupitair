import type { APIRoute } from 'astro';

export const GET: APIRoute = () => {
  const robots = `User-agent: *
Allow: /

# Sitemap
Sitemap: https://jupitairhvac.com/sitemap.xml

# Specific crawl directives
User-agent: Googlebot
Allow: /

User-agent: Bingbot  
Allow: /

# Block specific paths if needed
# Disallow: /admin/
# Disallow: /private/

# Crawl delay for general bots
Crawl-delay: 1`;

  return new Response(robots, {
    headers: {
      'Content-Type': 'text/plain',
    },
  });
};