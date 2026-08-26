// Local-development configuration.
// Intentionally does NOT load the Cloudflare adapter so `npm run dev`
// uses Astro/Vite's normal Node development server instead of Miniflare/workerd.
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  site: 'https://upsight.digital',
  integrations: [react(), sitemap({ namespaces: { news: false, xhtml: false, video: false } })],
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
  },
});
