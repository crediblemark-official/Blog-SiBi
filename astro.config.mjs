import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// https://astro.build/config
export default defineConfig({
  site: 'https://blog.situsbisnis.com',
  base: '/',
  redirects: {
    '/categories': '/kategori',
    '/tag': '/tags',
  },
  integrations: [
    sitemap(),
    {
      name: 'sitemap-xml-alias',
      hooks: {
        'astro:build:done': async ({ dir }) => {
          const outDir = fileURLToPath(dir);
          const srcFile = path.join(outDir, 'sitemap-index.xml');
          const destFile = path.join(outDir, 'sitemap.xml');
          try {
            await fs.copyFile(srcFile, destFile);
          } catch (e) {
            console.error('Failed to create sitemap.xml alias:', e);
          }
        },
      },
    },
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
