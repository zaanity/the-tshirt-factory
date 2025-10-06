"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addUser = void 0;
const googleSheetsServices_1 = require("../services/googleSheetsServices");
const SHEET = "Users";
const HEADER = ["timestamp", "name", "contact"];
function toRow(obj) {
    return [
        new Date().toISOString(),
        obj.name || "",
        obj.phone || obj.email || "" // Use phone if provided, else email
    ];
}
const addUser = async (req, res) => {
    try {
        const row = toRow(req.body);
        await (0, googleSheetsServices_1.appendSheetRow)(SHEET, row);
        res.status(201).json({ success: true });
    }
    catch {
        res.status(500).json({ error: "Failed to save user" });
    }
};
exports.addUser = addUser;
