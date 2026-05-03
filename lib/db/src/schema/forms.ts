import { pgTable, serial, integer, text, timestamp, jsonb, boolean, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { guidesTable } from "./guides";

export const formFieldSchema = z.object({
  id: z.string(),
  type: z.enum(["text", "textarea", "checkbox", "radio", "select", "number", "rating", "date", "signature"]),
  label: z.string(),
  required: z.boolean().default(false),
  placeholder: z.string().optional(),
  options: z.array(z.string()).optional(),
  order: z.number().int(),
});
export type FormField = z.infer<typeof formFieldSchema>;

export const guideFormsTable = pgTable("guide_forms", {
  id: serial("id").primaryKey(),
  guideId: integer("guide_id")
    .notNull()
    .references(() => guidesTable.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description").notNull().default(""),
  fields: jsonb("fields").notNull().default([]),
  isActive: boolean("is_active").notNull().default(true),
  publicToken: uuid("public_token").notNull().defaultRandom().unique(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const guideFormSubmissionsTable = pgTable("guide_form_submissions", {
  id: serial("id").primaryKey(),
  formId: integer("form_id")
    .notNull()
    .references(() => guideFormsTable.id, { onDelete: "cascade" }),
  guideId: integer("guide_id")
    .notNull()
    .references(() => guidesTable.id, { onDelete: "cascade" }),
  submitterName: text("submitter_name").notNull(),
  submitterEmail: text("submitter_email").notNull(),
  answers: jsonb("answers").notNull().default({}),
  ipAddress: text("ip_address"),
  submittedAt: timestamp("submitted_at", { withTimezone: true }).defaultNow().notNull(),
});

export const insertGuideFormSchema = createInsertSchema(guideFormsTable).omit({ id: true, createdAt: true, updatedAt: true });
export const selectGuideFormSchema = createSelectSchema(guideFormsTable);
export const insertSubmissionSchema = createInsertSchema(guideFormSubmissionsTable).omit({ id: true, submittedAt: true });

export type GuideForm = typeof guideFormsTable.$inferSelect;
export type GuideFormSubmission = typeof guideFormSubmissionsTable.$inferSelect;
