import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const docs = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/docs" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    order: z.number(),
    section: z.string().default("Guide"),
  }),
});

const updates = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/updates" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    category: z.string(),
    artwork: z.enum(["focus", "measure"]),
    order: z.number().default(0),
  }),
});

export const collections = { docs, updates };
