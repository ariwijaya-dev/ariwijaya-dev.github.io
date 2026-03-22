import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishDate: z.coerce.date(),
    tags: z.array(z.string()),
    heroImage: z.string().optional(),
    featured: z.boolean().default(false),
    metrics: z.object({
      latency: z.string().optional(),
      throughput: z.string().optional(),
      availability: z.string().optional(),
      scale: z.string().optional(),
    }).optional(),
  }),
});

export const collections = { projects };
