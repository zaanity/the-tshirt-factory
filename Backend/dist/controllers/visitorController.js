"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.incrementVisitor = exports.getVisitorCount = void 0;
const googleSheetsServices_1 = require("../services/googleSheetsServices");
const SHEET = "Visitors";
const getVisitorCount = async (_, res) => {
    try {
        const data = await (0, googleSheetsServices_1.getSheetRows)(SHEET);
        res.json({ count: data.length });
    }
    catch {
        res.status(500).json({ error: "Failed to get visitor count" });
    }
};
exports.getVisitorCount = getVisitorCount;
const incrementVisitor = async (_, res) => {
    try {
        await (0, googleSheetsServices_1.appendSheetRow)(SHEET, [new Date().toISOString()]);
        const data = await (0, googleSheetsServices_1.getSheetRows)(SHEET);
        res.json({ count: data.length });
    }
    catch {
        res.status(500).json({ error: "Failed to add visitor" });
    }
};
exports.incrementVisitor = incrementVisitor;
