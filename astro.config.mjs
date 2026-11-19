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
  i18n: {
    defaultLocale: 'id',
    locales: ['id', 'en'],
    routing: {
      prefixDefaultLocale: false,
      redirectToDefaultLocale: false,
    },
  },
  redirects: {
    '/categories': '/kategori',
    '/tag': '/tags',
  },
  integrations: [
    sitemap(),
    {
      name: 'sitemap-and-rss-alias',
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

          // Alias root RSS for platforms requesting /rss without extension
          try {
            const rootRss = path.join(outDir, 'rss.xml');
            const rootRssNoExt = path.join(outDir, 'rss');
            await fs.copyFile(rootRss, rootRssNoExt);
          } catch {}

          // Alias English RSS for platforms requesting /en/rss without extension
          try {
            const enRss = path.join(outDir, 'en', 'rss.xml');
            const enRssNoExt = path.join(outDir, 'en', 'rss');
            await fs.copyFile(enRss, enRssNoExt);
          } catch {}
        },
      },
    },
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
