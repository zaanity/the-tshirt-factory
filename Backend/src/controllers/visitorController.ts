import { Request, Response } from "express";
import { getSheetRows, appendSheetRow } from "../services/googleSheetsServices";

const SHEET = "Visitors";

export const getVisitorCount = async (_: Request, res: Response) => {
  try {
    const data = await getSheetRows(SHEET);
    res.json({ count: data.length });
  } catch {
    res.status(500).json({ error: "Failed to get visitor count" });
  }
};

export const incrementVisitor = async (_: Request, res: Response) => {
  try {
    await appendSheetRow(SHEET, [new Date().toISOString()]);
    const data = await getSheetRows(SHEET);
    res.json({ count: data.length });
  } catch {
    res.status(500).json({ error: "Failed to add visitor" });
  }
};