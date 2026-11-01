import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://blog.situsbisnis.com',
  base: '/',
  redirects: {
    '/categories': '/kategori',
    '/tag': '/tags',
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
