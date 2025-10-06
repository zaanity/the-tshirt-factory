"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getContacts = exports.addContact = void 0;
const googleSheetsServices_1 = require("../services/googleSheetsServices");
const SHEET = "Contacts";
const HEADER = ["id", "name", "contact", "timestamp"];
const addContact = async (req, res) => {
    try {
        const { name, contact } = req.body;
        const contactData = {
            id: Date.now().toString(),
            name,
            contact,
            timestamp: new Date().toISOString(),
        };
        await (0, googleSheetsServices_1.appendSheetRow)(SHEET, [contactData.id, contactData.name, contactData.contact, contactData.timestamp]);
        res.status(201).json({ success: true, message: "Contact information saved successfully" });
    }
    catch (e) {
        console.error("addContact error:", e);
        res.status(500).json({ error: "Failed to save contact information" });
    }
};
exports.addContact = addContact;
const getContacts = async (_, res) => {
    try {
        // For admin purposes - get all contacts
        const contacts = await (0, googleSheetsServices_1.getSheetRows)(SHEET);
        res.json(contacts);
    }
    catch (e) {
        console.error("getContacts error:", e);
        res.status(500).json({ error: "Failed to fetch contacts" });
    }
};
exports.getContacts = getContacts;
