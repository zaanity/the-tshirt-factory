"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || "changeme";
const requireAuth = (req, res, next) => {
    const auth = req.headers.authorization;
    if (!auth)
        return res.status(401).json({ error: "No token" });
    const token = auth.replace("Bearer ", "");
    try {
        jsonwebtoken_1.default.verify(token, JWT_SECRET);
        next();
    }
    catch {
        res.status(401).json({ error: "Invalid token" });
    }
};
exports.requireAuth = requireAuth;
