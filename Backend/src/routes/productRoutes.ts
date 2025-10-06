import { Router } from "express";
import {
  getAllProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController";
import { requireAuth } from "../middleware/authMiddleware";

const router = Router();

router.get("/", getAllProducts);
router.post("/", requireAuth, addProduct);
router.put("/:id", requireAuth, updateProduct);
router.delete("/:id", requireAuth, deleteProduct);

export default router;
