import { Request, Response } from "express";
import {
  appendSheetRow,
  getSheetRows,
} from "../services/googleSheetsServices";

const SHEET = "Contacts";
const HEADER = ["id", "name", "contact", "timestamp"];

export const addContact = async (req: Request, res: Response) => {
  try {
    const { name, contact } = req.body;
    const contactData = {
      id: Date.now().toString(),
      name,
      contact,
      timestamp: new Date().toISOString(),
    };

    await appendSheetRow(SHEET, [contactData.id, contactData.name, contactData.contact, contactData.timestamp]);
    res.status(201).json({ success: true, message: "Contact information saved successfully" });
  } catch (e) {
    console.error("addContact error:", e);
    res.status(500).json({ error: "Failed to save contact information" });
  }
};

export const getContacts = async (_: Request, res: Response) => {
  try {
    // For admin purposes - get all contacts
    const contacts = await getSheetRows(SHEET);
    res.json(contacts);
  } catch (e) {
    console.error("getContacts error:", e);
    res.status(500).json({ error: "Failed to fetch contacts" });
  }
};
