import { Router, type IRouter } from "express";
import healthRouter from "./health";
import guidesRouter from "./guides";
import aiRouter from "./ai";
import geminiRouter from "./gemini";
import signaturesRouter from "./signatures";
import formsRouter from "./forms";
import publicFormsRouter from "./public-forms";

const router: IRouter = Router();

router.use(healthRouter);
router.use(guidesRouter);
router.use(signaturesRouter);
router.use(formsRouter);
router.use(publicFormsRouter);
router.use(aiRouter);
router.use(geminiRouter);

export default router;
