import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const posts = await getCollection('blog');
  const sortedPosts = posts.sort(
    (a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime()
  );

  return rss({
    title: 'Blog SiBi — Publikasi Resmi SitusBisnis',
    description: 'Catatan strategis, riset, dan panduan komprehensif seputar creator economy dari tim SitusBisnis.',
    site: context.site || 'https://blog.situsbisnis.com',
    items: sortedPosts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.description,
      categories: post.data.categories,
      author: post.data.author,
      link: `/posts/${post.id.replace(/\.mdx?$/, '')}/`,
    })),
    customData: `<language>id-ID</language>`,
  });
}
