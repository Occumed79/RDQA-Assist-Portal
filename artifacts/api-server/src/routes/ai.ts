import { Router } from "express";
import { ai } from "@workspace/integrations-gemini-ai";
import {
  AiGenerateStepsBody,
  AiPolishStepsBody,
  AiAutofillStepBody,
} from "@workspace/api-zod";

const router = Router();

function makeStepId() {
  return `step-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function parseJsonSafe(text: string): unknown {
  const match = text.match(/```json\s*([\s\S]*?)```/);
  if (match) {
    return JSON.parse(match[1]);
  }
  const jsonStart = text.indexOf("[");
  const jsonEnd = text.lastIndexOf("]") + 1;
  if (jsonStart !== -1 && jsonEnd > jsonStart) {
    return JSON.parse(text.slice(jsonStart, jsonEnd));
  }
  return JSON.parse(text);
}

router.post("/ai/generate-steps", async (req, res): Promise<void> => {
  const parsed = AiGenerateStepsBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { outline, guideTitle } = parsed.data;

  const prompt = `You are a professional guide writer. Given a rough outline, generate well-structured guide steps.

Guide Title: "${guideTitle}"

Rough Outline:
${outline}

Generate a JSON array of step objects. Each step should have:
- id: a unique string like "step-1"
- title: short step title (3-7 words)
- instruction: clear instruction (2-4 sentences)
- tip: optional helpful tip (1 sentence, or omit)
- caution: optional caution/warning (1 sentence, or omit)
- order: integer starting from 1

Return ONLY a valid JSON array, no additional text.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: { maxOutputTokens: 8192 },
    });

    const text = response.text ?? "[]";
    const raw = parseJsonSafe(text) as Array<{
      id?: string;
      title: string;
      instruction: string;
      tip?: string;
      caution?: string;
      order: number;
    }>;

    const steps = raw.map((s, i) => ({
      id: s.id ?? makeStepId(),
      title: s.title,
      instruction: s.instruction,
      tip: s.tip,
      caution: s.caution,
      order: s.order ?? i + 1,
    }));

    res.json({ steps });
  } catch (err) {
    req.log.error({ err }, "AI generate-steps failed");
    res.status(500).json({ error: "AI generation failed" });
  }
});

router.post("/ai/polish-steps", async (req, res): Promise<void> => {
  const parsed = AiPolishStepsBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { steps, guideTitle } = parsed.data;

  const prompt = `You are a professional guide writer. Polish and improve the following guide steps.

Guide Title: "${guideTitle}"

Current Steps:
${JSON.stringify(steps, null, 2)}

Improve each step to be:
- Clear, professional, and action-oriented
- Consistent in style and tone
- Complete with helpful tips and cautions where appropriate

Return ONLY a valid JSON array with the same structure (same ids and order), improved content only.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: { maxOutputTokens: 8192 },
    });

    const text = response.text ?? "[]";
    const polished = parseJsonSafe(text) as typeof steps;
    res.json({ steps: polished });
  } catch (err) {
    req.log.error({ err }, "AI polish-steps failed");
    res.status(500).json({ error: "AI polishing failed" });
  }
});

router.post("/ai/autofill-step", async (req, res): Promise<void> => {
  const parsed = AiAutofillStepBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { step, guideTitle } = parsed.data;

  const prompt = `You are a professional guide writer. Improve and autofill this single guide step.

Guide Title: "${guideTitle}"

Step to improve:
${JSON.stringify(step, null, 2)}

Return ONLY a valid JSON object with the same structure, with improved/filled-in content. Keep the same id and order.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: { maxOutputTokens: 8192 },
    });

    const text = response.text ?? "{}";
    let improved: typeof step;
    try {
      const match = text.match(/```json\s*([\s\S]*?)```/);
      if (match) {
        improved = JSON.parse(match[1]);
      } else {
        const start = text.indexOf("{");
        const end = text.lastIndexOf("}") + 1;
        improved = JSON.parse(text.slice(start, end));
      }
    } catch {
      improved = step;
    }

    res.json({ step: improved });
  } catch (err) {
    req.log.error({ err }, "AI autofill-step failed");
    res.status(500).json({ error: "AI autofill failed" });
  }
});

const VALID_MIME_TYPES = ["image/png", "image/jpeg", "image/webp", "image/gif"];

router.post("/ai/analyze-screenshots", async (req, res): Promise<void> => {
  const { screenshots, context } = req.body as {
    screenshots?: Array<{ data: string; mimeType: string }>;
    context?: string;
  };

  if (!Array.isArray(screenshots) || screenshots.length === 0 || screenshots.length > 20) {
    res.status(400).json({ error: "screenshots must be an array of 1-20 images" });
    return;
  }
  for (const ss of screenshots) {
    if (typeof ss.data !== "string" || !VALID_MIME_TYPES.includes(ss.mimeType)) {
      res.status(400).json({ error: "Each screenshot must have base64 data and a valid mimeType" });
      return;
    }
  }

  const contextClause = context ? `\n\nContext provided by user: "${context}"` : "";

  const prompt = `You are an expert technical writer creating a step-by-step guide from screenshots.

I will provide ${screenshots.length} screenshot(s) in order. Each screenshot shows one step in a process.${contextClause}

For each screenshot, analyze what action is being performed and generate a guide step.

Return a JSON object with this exact structure:
{
  "suggestedTitle": "A concise guide title (5-10 words)",
  "suggestedDescription": "A 1-2 sentence description of what the guide covers",
  "steps": [
    {
      "id": "step-1",
      "title": "Short action-oriented title (3-6 words)",
      "instruction": "Clear instruction for what to do (2-4 sentences). Be specific about UI elements visible in the screenshot.",
      "tip": "Optional helpful tip or shortcut (1 sentence, omit if not applicable)",
      "caution": "Optional warning (1 sentence, omit if not applicable)",
      "order": 1
    }
  ]
}

IMPORTANT:
- One step per screenshot, in the same order
- Keep titles action-oriented (e.g., "Click the Settings Button", "Enter Your Username")
- Instructions should reference what is visible in the screenshot
- Return ONLY valid JSON, no markdown or extra text`;

  try {
    const imageParts = screenshots.map(ss => ({
      inlineData: {
        data: ss.data,
        mimeType: ss.mimeType,
      },
    }));

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            ...imageParts,
            { text: prompt },
          ],
        },
      ],
      config: { maxOutputTokens: 8192 },
    });

    const text = response.text ?? "{}";
    let result: {
      suggestedTitle: string;
      suggestedDescription: string;
      steps: Array<{
        id?: string;
        title: string;
        instruction: string;
        tip?: string;
        caution?: string;
        order: number;
      }>;
    };

    try {
      const match = text.match(/```json\s*([\s\S]*?)```/);
      if (match) {
        result = JSON.parse(match[1]);
      } else {
        const start = text.indexOf("{");
        const end = text.lastIndexOf("}") + 1;
        result = JSON.parse(text.slice(start, end));
      }
    } catch {
      req.log.error({ text }, "Failed to parse AI screenshot analysis response");
      res.status(500).json({ error: "Failed to parse AI response" });
      return;
    }

    const steps = (result.steps || []).map((s, i) => ({
      id: s.id ?? makeStepId(),
      title: s.title,
      instruction: s.instruction,
      tip: s.tip,
      caution: s.caution,
      order: i + 1,
    }));

    res.json({
      steps,
      suggestedTitle: result.suggestedTitle || "Auto-Generated Guide",
      suggestedDescription: result.suggestedDescription || "",
    });
  } catch (err) {
    req.log.error({ err }, "AI analyze-screenshots failed");
    res.status(500).json({ error: "AI analysis failed" });
  }
});

export default router;
