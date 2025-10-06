import { Router } from "express";
import { addUser } from "../controllers/userController";

const router = Router();
router.post("/", addUser);

export default router;