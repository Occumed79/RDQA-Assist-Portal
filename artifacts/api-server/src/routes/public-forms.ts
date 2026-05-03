import { Router } from "express";
import { db } from "@workspace/db";
import { guideFormsTable, guideFormSubmissionsTable, guidesTable } from "@workspace/db";
import { GetPublicFormParams, SubmitPublicFormParams, SubmitPublicFormBody } from "@workspace/api-zod";
import { eq } from "drizzle-orm";
import { sendSubmissionNotification } from "../lib/email";
import type { FormField } from "@workspace/db";

const router = Router();

// GET /public/forms/:token — no auth required
router.get("/public/forms/:token", async (req, res): Promise<void> => {
  const parsed = GetPublicFormParams.safeParse({ token: req.params.token });
  if (!parsed.success) { res.status(400).json({ error: "Invalid token" }); return; }

  const [form] = await db
    .select({
      id: guideFormsTable.id,
      title: guideFormsTable.title,
      description: guideFormsTable.description,
      fields: guideFormsTable.fields,
      isActive: guideFormsTable.isActive,
      guideId: guideFormsTable.guideId,
    })
    .from(guideFormsTable)
    .where(eq(guideFormsTable.publicToken, parsed.data.token));

  if (!form) { res.status(404).json({ error: "Form not found" }); return; }
  if (!form.isActive) { res.status(404).json({ error: "This form is no longer active" }); return; }

  const [guide] = await db
    .select({ title: guidesTable.title })
    .from(guidesTable)
    .where(eq(guidesTable.id, form.guideId));

  res.json({
    id: form.id,
    title: form.title,
    description: form.description,
    fields: form.fields,
    guideTitle: guide?.title ?? "",
  });
});

// POST /public/forms/:token/submit — no auth required
router.post("/public/forms/:token/submit", async (req, res): Promise<void> => {
  const parsed = SubmitPublicFormParams.safeParse({ token: req.params.token });
  if (!parsed.success) { res.status(400).json({ error: "Invalid token" }); return; }

  const [form] = await db
    .select()
    .from(guideFormsTable)
    .where(eq(guideFormsTable.publicToken, parsed.data.token));

  if (!form) { res.status(404).json({ error: "Form not found" }); return; }
  if (!form.isActive) { res.status(404).json({ error: "This form is no longer accepting responses" }); return; }

  const bodyParsed = SubmitPublicFormBody.safeParse(req.body);
  if (!bodyParsed.success) { res.status(400).json({ error: bodyParsed.error.message }); return; }

  const { submitterName, submitterEmail, answers } = bodyParsed.data;
  const ipAddress =
    (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ||
    req.socket.remoteAddress ||
    null;

  const [submission] = await db
    .insert(guideFormSubmissionsTable)
    .values({
      formId: form.id,
      guideId: form.guideId,
      submitterName,
      submitterEmail,
      answers: answers ?? {},
      ipAddress,
    })
    .returning();

  const [guide] = await db
    .select({ title: guidesTable.title })
    .from(guidesTable)
    .where(eq(guidesTable.id, form.guideId));

  const origin = `${req.protocol}://${req.get("host")}`;
  sendSubmissionNotification({
    formTitle: form.title,
    formId: form.id,
    guideTitle: guide?.title ?? "",
    guideId: form.guideId,
    submitterName,
    submitterEmail,
    submittedAt: new Date(submission.submittedAt),
    fields: (form.fields as FormField[]),
    answers: (answers ?? {}) as Record<string, unknown>,
    appOrigin: origin,
  }).catch(() => {}); // fire-and-forget, never block the response

  res.status(201).json(submission);
});

export default router;
