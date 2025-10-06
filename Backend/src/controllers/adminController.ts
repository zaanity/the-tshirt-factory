// src/controllers/adminController.ts (improved)
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { getSheetRows } from "../services/googleSheetsServices";

const JWT_SECRET = process.env.JWT_SECRET || "changeme";
const SHEET = "Admin";

export const loginAdmin = async (req: Request, res: Response) => {
  const { username, password } = req.body || {};
  if (!username || !password) return res.status(400).json({ success: false, message: "Missing credentials" });

  try {
    const users = await getSheetRows(SHEET); // returns array of objects
    const admin = users.find((u: any) => String(u.username || "").trim() === String(username).trim());

    if (!admin) return res.status(401).json({ success: false, message: "Invalid credentials" });

    const storedHash = admin.passwordHash || admin.password || ""; // tolerate column name variations for dev
    const ok = await bcrypt.compare(password, storedHash);
    if (!ok) return res.status(401).json({ success: false, message: "Invalid credentials" });

    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: "12h" });
    res.json({ success: true, token });
  } catch (err) {
    console.error("loginAdmin error:", err);
    res.status(500).json({ error: "Failed to login" });
  }
};
