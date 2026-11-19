import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const posts = await getCollection('blog');
  const enPosts = posts.filter((p) => p.data.lang === 'en');
  const sortedPosts = enPosts.sort(
    (a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime()
  );

  const siteUrl = (context.site?.toString() || 'https://blog.situsbisnis.com').replace(/\/$/, '');

  return rss({
    title: 'Blog SiBi — Official Publication of SitusBisnis',
    description: 'Strategic playbooks, deep dives, and research on creator economy, digital products, and automated commerce from the SitusBisnis team.',
    site: `${siteUrl}/en/`,
    items: sortedPosts.map((post) => {
      const slug = post.id.replace(/^en\//, '').replace(/\.mdx?$/, '');
      const imgPath = post.data.image || '/images/posts/creator-commerce-cover.svg';
      const absoluteImageUrl = imgPath.startsWith('http') ? imgPath : `${siteUrl}${imgPath.startsWith('/') ? '' : '/'}${imgPath}`;
      const mimeType = imgPath.endsWith('.svg') ? 'image/svg+xml' : 'image/jpeg';
      return {
        title: post.data.title,
        pubDate: post.data.date,
        description: post.data.description,
        categories: post.data.categories,
        author: post.data.author,
        link: `/en/posts/${slug}/`,
        enclosure: {
          url: absoluteImageUrl,
          length: 0,
          type: mimeType,
        },
        customData: `<image>${absoluteImageUrl}</image>`,
      };
    }),
    customData: `<language>en-US</language>`,
  });
}
