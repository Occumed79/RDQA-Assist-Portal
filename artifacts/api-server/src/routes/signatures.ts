import { Router } from "express";
import { db } from "@workspace/db";
import { guidesTable, guideSignaturesTable } from "@workspace/db";
import { CreateGuideSignatureBody, ListGuideSignaturesParams, CreateGuideSignatureParams } from "@workspace/api-zod";
import { eq, desc } from "drizzle-orm";

const router = Router();

router.get("/guides/:id/signatures", async (req, res): Promise<void> => {
  const parsed = ListGuideSignaturesParams.safeParse({ id: Number(req.params.id) });
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid guide ID" });
    return;
  }
  const { id } = parsed.data;

  const [guide] = await db.select({ id: guidesTable.id }).from(guidesTable).where(eq(guidesTable.id, id));
  if (!guide) {
    res.status(404).json({ error: "Guide not found" });
    return;
  }

  const signatures = await db
    .select()
    .from(guideSignaturesTable)
    .where(eq(guideSignaturesTable.guideId, id))
    .orderBy(desc(guideSignaturesTable.signedAt));

  res.json(signatures);
});

router.post("/guides/:id/signatures", async (req, res): Promise<void> => {
  const idParsed = CreateGuideSignatureParams.safeParse({ id: Number(req.params.id) });
  if (!idParsed.success) {
    res.status(400).json({ error: "Invalid guide ID" });
    return;
  }
  const { id } = idParsed.data;

  const [guide] = await db.select({ id: guidesTable.id }).from(guidesTable).where(eq(guidesTable.id, id));
  if (!guide) {
    res.status(404).json({ error: "Guide not found" });
    return;
  }

  const parsed = CreateGuideSignatureBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { signerName, signerEmail, signatureDataUrl } = parsed.data;
  const ipAddress = (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() || req.socket.remoteAddress || null;

  const [signature] = await db
    .insert(guideSignaturesTable)
    .values({ guideId: id, signerName, signerEmail, signatureDataUrl, ipAddress })
    .returning();

  res.status(201).json(signature);
});

export default router;
