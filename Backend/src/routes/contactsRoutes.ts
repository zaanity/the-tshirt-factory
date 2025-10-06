import { Router } from "express";
import { addContact, getContacts } from "../controllers/contactsController";

const router = Router();

router.post("/", addContact);
router.get("/", getContacts);

export default router;
