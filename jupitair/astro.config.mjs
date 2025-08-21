import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import netlify from '@astrojs/netlify';

export default defineConfig({
  integrations: [
    tailwind({
      config: {
        applyBaseStyles: false,
      }
    }), 
    sitemap(),
    mdx(),
    react()
  ],
  output: 'static',
  // adapter: netlify(), // Disabled for local development
  site: 'https://jupitairhvac.com',
  build: {
    assets: 'assets',
    inlineStylesheets: 'auto'
  },
  vite: {
    build: {
      cssCodeSplit: true,
      rollupOptions: {
        output: {
          assetFileNames: 'assets/[name].[hash][extname]',
          manualChunks: {
            'vendor': ['react', 'react-dom'],
          }
        }
      },
      // Optimize chunks
      chunkSizeWarningLimit: 1000,
      minify: 'esbuild',
      target: 'es2020'
    },
    ssr: {
      noExternal: ['@astrojs/*']
    },
    esbuild: {
      drop: ['console', 'debugger']
    }
  }
});