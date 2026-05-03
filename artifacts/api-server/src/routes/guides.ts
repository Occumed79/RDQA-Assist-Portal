import { Router } from "express";
import { db } from "@workspace/db";
import { guidesTable } from "@workspace/db";
import {
  CreateGuideBody,
  UpdateGuideBody,
  GetGuideParams,
  UpdateGuideParams,
  DeleteGuideParams,
} from "@workspace/api-zod";
import { eq, desc, sql } from "drizzle-orm";

const router = Router();

router.get("/guides", async (req, res): Promise<void> => {
  const guides = await db
    .select()
    .from(guidesTable)
    .orderBy(desc(guidesTable.updatedAt));
  res.json(guides);
});

router.post("/guides", async (req, res): Promise<void> => {
  const parsed = CreateGuideBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { title, description, category, tags, steps } = parsed.data;
  const [guide] = await db
    .insert(guidesTable)
    .values({
      title,
      description: description ?? "",
      category: category ?? "General",
      tags: tags ?? [],
      steps: (steps as object[]) ?? [],
    })
    .returning();
  res.status(201).json(guide);
});

router.get("/guides/stats/summary", async (req, res): Promise<void> => {
  const guides = await db
    .select()
    .from(guidesTable)
    .orderBy(desc(guidesTable.updatedAt));

  const totalGuides = guides.length;
  const totalSteps = guides.reduce((sum, g) => {
    const steps = Array.isArray(g.steps) ? g.steps : [];
    return sum + steps.length;
  }, 0);

  const categoryCounts: Record<string, number> = {};
  for (const g of guides) {
    const cat = g.category ?? "General";
    categoryCounts[cat] = (categoryCounts[cat] ?? 0) + 1;
  }

  const recentGuides = guides.slice(0, 5);

  res.json({ totalGuides, totalSteps, categoryCounts, recentGuides });
});

router.get("/guides/:id", async (req, res): Promise<void> => {
  const parsed = GetGuideParams.safeParse({ id: Number(req.params["id"]) });
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  const [guide] = await db
    .select()
    .from(guidesTable)
    .where(eq(guidesTable.id, parsed.data.id));
  if (!guide) {
    res.status(404).json({ error: "Guide not found" });
    return;
  }
  res.json(guide);
});

router.put("/guides/:id", async (req, res): Promise<void> => {
  const idParsed = UpdateGuideParams.safeParse({ id: Number(req.params["id"]) });
  if (!idParsed.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  const bodyParsed = UpdateGuideBody.safeParse(req.body);
  if (!bodyParsed.success) {
    res.status(400).json({ error: bodyParsed.error.message });
    return;
  }

  const { title, description, category, tags, steps } = bodyParsed.data;
  const updateData: Partial<typeof guidesTable.$inferInsert> & { updatedAt: Date } = {
    updatedAt: new Date(),
  };
  if (title !== undefined) updateData.title = title;
  if (description !== undefined) updateData.description = description;
  if (category !== undefined) updateData.category = category;
  if (tags !== undefined) updateData.tags = tags;
  if (steps !== undefined) updateData.steps = steps as object[];

  const [updated] = await db
    .update(guidesTable)
    .set(updateData)
    .where(eq(guidesTable.id, idParsed.data.id))
    .returning();

  if (!updated) {
    res.status(404).json({ error: "Guide not found" });
    return;
  }
  res.json(updated);
});

router.delete("/guides/:id", async (req, res): Promise<void> => {
  const parsed = DeleteGuideParams.safeParse({ id: Number(req.params["id"]) });
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  const [deleted] = await db
    .delete(guidesTable)
    .where(eq(guidesTable.id, parsed.data.id))
    .returning();
  if (!deleted) {
    res.status(404).json({ error: "Guide not found" });
    return;
  }
  res.status(204).send();
});

export default router;
