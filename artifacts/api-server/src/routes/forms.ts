import { Router } from "express";
import { db } from "@workspace/db";
import { guidesTable, guideFormsTable, guideFormSubmissionsTable } from "@workspace/db";
import type { FormField } from "@workspace/db";
import { sendSubmissionNotification } from "../lib/email";
import {
  CreateGuideFormBody,
  UpdateGuideFormBody,
  SubmitGuideFormBody,
  ListGuideFormsParams,
  CreateGuideFormParams,
  GetGuideFormParams,
  UpdateGuideFormParams,
  DeleteGuideFormParams,
  ListFormSubmissionsParams,
  SubmitGuideFormParams,
} from "@workspace/api-zod";
import { eq, desc } from "drizzle-orm";

const router = Router();

// GET /guides/:id/forms
router.get("/guides/:id/forms", async (req, res): Promise<void> => {
  const parsed = ListGuideFormsParams.safeParse({ id: Number(req.params.id) });
  if (!parsed.success) { res.status(400).json({ error: "Invalid guide ID" }); return; }
  const { id } = parsed.data;
  const [guide] = await db.select({ id: guidesTable.id }).from(guidesTable).where(eq(guidesTable.id, id));
  if (!guide) { res.status(404).json({ error: "Guide not found" }); return; }
  const forms = await db.select().from(guideFormsTable).where(eq(guideFormsTable.guideId, id)).orderBy(desc(guideFormsTable.createdAt));
  res.json(forms);
});

// POST /guides/:id/forms
router.post("/guides/:id/forms", async (req, res): Promise<void> => {
  const idParsed = CreateGuideFormParams.safeParse({ id: Number(req.params.id) });
  if (!idParsed.success) { res.status(400).json({ error: "Invalid guide ID" }); return; }
  const { id } = idParsed.data;
  const [guide] = await db.select({ id: guidesTable.id }).from(guidesTable).where(eq(guidesTable.id, id));
  if (!guide) { res.status(404).json({ error: "Guide not found" }); return; }
  const parsed = CreateGuideFormBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  const { title, description, fields } = parsed.data;
  const [form] = await db.insert(guideFormsTable).values({ guideId: id, title, description: description ?? "", fields: fields ?? [] }).returning();
  res.status(201).json(form);
});

// GET /forms/:id
router.get("/forms/:id", async (req, res): Promise<void> => {
  const parsed = GetGuideFormParams.safeParse({ id: Number(req.params.id) });
  if (!parsed.success) { res.status(400).json({ error: "Invalid form ID" }); return; }
  const [form] = await db.select().from(guideFormsTable).where(eq(guideFormsTable.id, parsed.data.id));
  if (!form) { res.status(404).json({ error: "Form not found" }); return; }
  res.json(form);
});

// PUT /forms/:id
router.put("/forms/:id", async (req, res): Promise<void> => {
  const idParsed = UpdateGuideFormParams.safeParse({ id: Number(req.params.id) });
  if (!idParsed.success) { res.status(400).json({ error: "Invalid form ID" }); return; }
  const [existing] = await db.select({ id: guideFormsTable.id }).from(guideFormsTable).where(eq(guideFormsTable.id, idParsed.data.id));
  if (!existing) { res.status(404).json({ error: "Form not found" }); return; }
  const parsed = UpdateGuideFormBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  const [form] = await db.update(guideFormsTable).set({ ...parsed.data, updatedAt: new Date() }).where(eq(guideFormsTable.id, idParsed.data.id)).returning();
  res.json(form);
});

// DELETE /forms/:id
router.delete("/forms/:id", async (req, res): Promise<void> => {
  const parsed = DeleteGuideFormParams.safeParse({ id: Number(req.params.id) });
  if (!parsed.success) { res.status(400).json({ error: "Invalid form ID" }); return; }
  const [existing] = await db.select({ id: guideFormsTable.id }).from(guideFormsTable).where(eq(guideFormsTable.id, parsed.data.id));
  if (!existing) { res.status(404).json({ error: "Form not found" }); return; }
  await db.delete(guideFormsTable).where(eq(guideFormsTable.id, parsed.data.id));
  res.status(204).end();
});

// GET /forms/:id/submissions
router.get("/forms/:id/submissions", async (req, res): Promise<void> => {
  const parsed = ListFormSubmissionsParams.safeParse({ id: Number(req.params.id) });
  if (!parsed.success) { res.status(400).json({ error: "Invalid form ID" }); return; }
  const [form] = await db.select({ id: guideFormsTable.id }).from(guideFormsTable).where(eq(guideFormsTable.id, parsed.data.id));
  if (!form) { res.status(404).json({ error: "Form not found" }); return; }
  const submissions = await db.select().from(guideFormSubmissionsTable).where(eq(guideFormSubmissionsTable.formId, parsed.data.id)).orderBy(desc(guideFormSubmissionsTable.submittedAt));
  res.json(submissions);
});

// POST /forms/:id/submissions
router.post("/forms/:id/submissions", async (req, res): Promise<void> => {
  const idParsed = SubmitGuideFormParams.safeParse({ id: Number(req.params.id) });
  if (!idParsed.success) { res.status(400).json({ error: "Invalid form ID" }); return; }
  const [form] = await db.select().from(guideFormsTable).where(eq(guideFormsTable.id, idParsed.data.id));
  if (!form) { res.status(404).json({ error: "Form not found" }); return; }
  const parsed = SubmitGuideFormBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  const { submitterName, submitterEmail, answers } = parsed.data;
  const ipAddress = (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() || req.socket.remoteAddress || null;
  const [submission] = await db.insert(guideFormSubmissionsTable).values({ formId: form.id, guideId: form.guideId, submitterName, submitterEmail, answers: answers ?? {}, ipAddress }).returning();

  const [guide] = await db.select({ title: guidesTable.title }).from(guidesTable).where(eq(guidesTable.id, form.guideId));
  const origin = `${req.protocol}://${req.get("host")}`;
  sendSubmissionNotification({
    formTitle: form.title,
    formId: form.id,
    guideTitle: guide?.title ?? "",
    guideId: form.guideId,
    submitterName,
    submitterEmail,
    submittedAt: new Date(submission.submittedAt),
    fields: form.fields as FormField[],
    answers: (answers ?? {}) as Record<string, unknown>,
    appOrigin: origin,
  }).catch(() => {});

  res.status(201).json(submission);
});

export default router;
