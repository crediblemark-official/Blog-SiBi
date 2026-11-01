import type { CollectionEntry } from 'astro:content';

export interface SeriesPartInfo {
  slug: string;
  part: number;
  title: string;
  description: string;
  isCurrent: boolean;
}

export interface SeriesContext {
  id: string;
  name: string;
  currentPart: number;
  totalParts: number;
  parts: SeriesPartInfo[];
  prevPost?: { slug: string; title: string; part: number };
  nextPost?: { slug: string; title: string; part: number };
}

export function getSeriesContext(
  currentPost: CollectionEntry<'blog'>,
  allPosts: CollectionEntry<'blog'>[]
): SeriesContext | null {
  const series = currentPost.data.series;
  if (!series) return null;

  // Filter and sort all posts in the same series
  const seriesPosts = allPosts
    .filter((p) => p.data.series?.id === series.id)
    .sort((a, b) => (a.data.series?.part || 0) - (b.data.series?.part || 0));

  const totalParts = series.totalParts || Math.max(series.part, seriesPosts.length);
  const currentPart = series.part;

  const parts: SeriesPartInfo[] = seriesPosts.map((p) => ({
    slug: p.id.replace(/\.mdx?$/, ''),
    part: p.data.series!.part,
    title: p.data.title,
    description: p.data.description,
    isCurrent: p.id === currentPost.id,
  }));

  const prev = seriesPosts.find((p) => p.data.series?.part === currentPart - 1);
  const next = seriesPosts.find((p) => p.data.series?.part === currentPart + 1);

  return {
    id: series.id,
    name: series.name,
    currentPart,
    totalParts,
    parts,
    prevPost: prev ? { slug: prev.id.replace(/\.mdx?$/, ''), title: prev.data.title, part: prev.data.series!.part } : undefined,
    nextPost: next ? { slug: next.id.replace(/\.mdx?$/, ''), title: next.data.title, part: next.data.series!.part } : undefined,
  };
}

export interface SeriesOverview {
  id: string;
  name: string;
  totalParts: number;
  posts: CollectionEntry<'blog'>[];
}

export function getAllSeries(allPosts: CollectionEntry<'blog'>[]): SeriesOverview[] {
  const map = new Map<string, { name: string; totalParts: number; posts: CollectionEntry<'blog'>[] }>();

  for (const post of allPosts) {
    const s = post.data.series;
    if (!s) continue;
    if (!map.has(s.id)) {
      map.set(s.id, {
        name: s.name,
        totalParts: s.totalParts || 0,
        posts: [],
      });
    }
    const entry = map.get(s.id)!;
    entry.posts.push(post);
    if (s.totalParts && s.totalParts > entry.totalParts) {
      entry.totalParts = s.totalParts;
    }
  }

  return Array.from(map.entries()).map(([id, data]) => ({
    id,
    name: data.name,
    totalParts: data.totalParts || data.posts.length,
    posts: data.posts.sort((a, b) => (a.data.series?.part || 0) - (b.data.series?.part || 0)),
  }));
}
