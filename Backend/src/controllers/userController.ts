import { Request, Response } from "express";
import { appendSheetRow } from "../services/googleSheetsServices";

const SHEET = "Users";
const HEADER = ["timestamp", "name", "contact"];

function toRow(obj: any): string[] {
  return [
    new Date().toISOString(),
    obj.name || "",
    obj.phone || obj.email || "" // Use phone if provided, else email
  ];
}

export const addUser = async (req: Request, res: Response) => {
  try {
    const row = toRow(req.body);
    await appendSheetRow(SHEET, row);
    res.status(201).json({ success: true });
  } catch {
    res.status(500).json({ error: "Failed to save user" });
  }
};