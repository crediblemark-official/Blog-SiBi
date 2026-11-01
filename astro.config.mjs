import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://blog.situsbisnis.com',
  base: '/',
  redirects: {
    '/categories': '/kategori',
    '/tag': '/tags',
  },
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
