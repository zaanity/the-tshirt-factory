import { Router } from "express";
import { getVisitorCount, incrementVisitor } from "../controllers/visitorController";

const router = Router();

router.get("/", getVisitorCount);
router.post("/", incrementVisitor);

export default router;