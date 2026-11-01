import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    categories: z.array(z.string()).default([]),
    tags: z.array(z.string()).default([]),
    author: z.string().default('Tim SitusBisnis'),
    image: z.string().optional(),
  }),
});

export const collections = { blog };
