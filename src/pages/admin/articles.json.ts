import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const posts = await getCollection('blog');
  
  const items = posts.map((p) => {
    const isEn = p.data.lang === 'en';
    const slug = isEn
      ? p.id.replace(/^en\//, '').replace(/\.mdx?$/, '')
      : p.id.replace(/\.mdx?$/, '');

    const fileRelPath = p.id.endsWith('.md') ? p.id : `${p.id}.md`;

    return {
      id: fileRelPath,
      slug,
      lang: p.data.lang || 'id',
      title: p.data.title,
      description: p.data.description || '',
      date: p.data.date,
      categories: p.data.categories || [],
      tags: p.data.tags || [],
      author: p.data.author || 'Tim Editorial SitusBisnis',
      image: p.data.image || '/images/posts/creator-commerce-cover.svg',
      translationOf: p.data.translationOf || null,
      filePath: `src/content/blog/${fileRelPath}`,
    };
  });

  // Sort descending by date
  items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return new Response(JSON.stringify(items, null, 2), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
    },
  });
}
