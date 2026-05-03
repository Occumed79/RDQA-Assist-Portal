import { pgTable, serial, text, timestamp, jsonb, integer } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const guidesTable = pgTable("guides", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull().default(""),
  category: text("category").notNull().default("General"),
  tags: text("tags").array().notNull().default([]),
  steps: jsonb("steps").notNull().default([]),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const insertGuideSchema = createInsertSchema(guidesTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const selectGuideSchema = createSelectSchema(guidesTable);

export type InsertGuide = z.infer<typeof insertGuideSchema>;
export type Guide = typeof guidesTable.$inferSelect;

export const stepSchema = z.object({
  id: z.string(),
  title: z.string(),
  instruction: z.string(),
  tip: z.string().optional(),
  caution: z.string().optional(),
  imageUrl: z.string().optional(),
  imageCaption: z.string().optional(),
  order: z.number().int(),
});

export type Step = z.infer<typeof stepSchema>;

export const stepArraySchema = z.array(stepSchema);

export const insertGuideWithStepsSchema = z.object({
  title: z.string().min(1),
  description: z.string().default(""),
  category: z.string().default("General"),
  tags: z.array(z.string()).default([]),
  steps: stepArraySchema.default([]),
});

export type InsertGuideWithSteps = z.infer<typeof insertGuideWithStepsSchema>;
