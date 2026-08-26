// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import cloudflare from '@astrojs/cloudflare';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  site: 'https://upsight.digital',
  integrations: [react(), sitemap({ namespaces: { news: false, xhtml: false, video: false } })],
  adapter: cloudflare(),
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
  },
});
