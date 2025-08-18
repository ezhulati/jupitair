import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import node from '@astrojs/node';

export default defineConfig({
  integrations: [
    tailwind(), 
    sitemap(),
    mdx(),
    react()
  ],
  output: 'hybrid',
  adapter: node({
    mode: 'standalone'
  }),
  site: 'https://jupitairhvac.com',
  build: {
    assets: 'assets'
  },
  vite: {
    build: {
      rollupOptions: {
        output: {
          assetFileNames: 'assets/[name].[hash][extname]'
        }
      }
    }
  }
});