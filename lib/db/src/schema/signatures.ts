import { pgTable, serial, integer, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { guidesTable } from "./guides";

export const guideSignaturesTable = pgTable("guide_signatures", {
  id: serial("id").primaryKey(),
  guideId: integer("guide_id")
    .notNull()
    .references(() => guidesTable.id, { onDelete: "cascade" }),
  signerName: text("signer_name").notNull(),
  signerEmail: text("signer_email").notNull(),
  signatureDataUrl: text("signature_data_url").notNull(),
  ipAddress: text("ip_address"),
  signedAt: timestamp("signed_at", { withTimezone: true }).defaultNow().notNull(),
});

export const insertSignatureSchema = createInsertSchema(guideSignaturesTable).omit({
  id: true,
  signedAt: true,
});

export const selectSignatureSchema = createSelectSchema(guideSignaturesTable);

export type InsertSignature = z.infer<typeof insertSignatureSchema>;
export type GuideSignature = typeof guideSignaturesTable.$inferSelect;
