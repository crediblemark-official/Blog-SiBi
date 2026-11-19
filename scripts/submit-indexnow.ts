#!/usr/bin/env bun
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:fs/promises';

const INDEXNOW_KEY = '2db59a3f789e4c5b9671f28b4932d0c1';
const HOST = 'blog.situsbisnis.com';
const KEY_LOCATION = `https://${HOST}/${INDEXNOW_KEY}.txt`;
const SITEMAP_PATH = './dist/sitemap-0.xml';

async function getUrls(): Promise<string[]> {
  const urls: Set<string> = new Set();

  if (existsSync(SITEMAP_PATH)) {
    const xml = readFileSync(SITEMAP_PATH, 'utf-8');
    const matches = xml.matchAll(/<loc>([^<]+)<\/loc>/g);
    for (const match of matches) {
      const url = match[1].trim();
      if (url.startsWith(`https://${HOST}`)) {
        urls.add(url);
      }
    }
  }

  // Always ensure essential root and feed URLs are included
  urls.add(`https://${HOST}/`);
  urls.add(`https://${HOST}/en/`);
  urls.add(`https://${HOST}/rss.xml`);
  urls.add(`https://${HOST}/en/rss.xml`);
  urls.add(`https://${HOST}/kategori/`);
  urls.add(`https://${HOST}/en/kategori/`);

  return Array.from(urls);
}

async function submitIndexNow() {
  console.log('🚀 [IndexNow] Preparing URL submission...');
  const urlList = await getUrls();
  console.log(`📦 [IndexNow] Found ${urlList.length} URLs to submit.`);

  if (urlList.length === 0) {
    console.warn('⚠️ [IndexNow] No URLs found. Run "bun run build" first.');
    return;
  }

  const payload = {
    host: HOST,
    key: INDEXNOW_KEY,
    keyLocation: KEY_LOCATION,
    urlList: urlList.slice(0, 10000), // IndexNow batch max limit
  };

  const endpoints = [
    'https://api.indexnow.org/indexnow',
    'https://www.bing.com/indexnow',
  ];

  for (const endpoint of endpoints) {
    try {
      console.log(`📡 [IndexNow] Submitting to ${endpoint}...`);
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok || response.status === 202) {
        console.log(`✅ [IndexNow] Success from ${endpoint}: HTTP ${response.status} (${response.statusText || 'Accepted'})`);
      } else {
        const text = await response.text();
        console.warn(`⚠️ [IndexNow] ${endpoint} returned HTTP ${response.status}: ${text}`);
      }
    } catch (err) {
      console.error(`❌ [IndexNow] Network error connecting to ${endpoint}:`, err instanceof Error ? err.message : err);
    }
  }
}

submitIndexNow().catch((err) => {
  console.error('Fatal IndexNow error:', err);
  process.exit(0); // Graceful exit
});
