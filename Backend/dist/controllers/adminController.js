"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginAdmin = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const googleSheetsServices_1 = require("../services/googleSheetsServices");
const JWT_SECRET = process.env.JWT_SECRET || "changeme";
const SHEET = "Admin";
const loginAdmin = async (req, res) => {
    const { username, password } = req.body || {};
    if (!username || !password)
        return res.status(400).json({ success: false, message: "Missing credentials" });
    try {
        const users = await (0, googleSheetsServices_1.getSheetRows)(SHEET); // returns array of objects
        const admin = users.find((u) => String(u.username || "").trim() === String(username).trim());
        if (!admin)
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        const storedHash = admin.passwordHash || admin.password || ""; // tolerate column name variations for dev
        const ok = await bcryptjs_1.default.compare(password, storedHash);
        if (!ok)
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        const token = jsonwebtoken_1.default.sign({ username }, JWT_SECRET, { expiresIn: "12h" });
        res.json({ success: true, token });
    }
    catch (err) {
        console.error("loginAdmin error:", err);
        res.status(500).json({ error: "Failed to login" });
    }
};
exports.loginAdmin = loginAdmin;
