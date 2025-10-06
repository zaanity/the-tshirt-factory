"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
const productRoutes_1 = __importDefault(require("./routes/productRoutes"));
const visitorRoutes_1 = __importDefault(require("./routes/visitorRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const contactsRoutes_1 = __importDefault(require("./routes/contactsRoutes"));
const app = (0, express_1.default)();
// Enhanced CORS configuration
const corsOptions = {
    origin: [
        "http://localhost:5173", // Vite dev server
        "http://localhost:3000", // Alternative dev port
        "http://localhost:4000", // Same origin
        ...(process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : [])
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
};
app.use((0, cors_1.default)(corsOptions));
// Handle preflight requests
app.options("*", (0, cors_1.default)(corsOptions));
app.use(express_1.default.json({ limit: "10mb" }));
app.use(express_1.default.urlencoded({ extended: true }));
app.use("/api/admin", adminRoutes_1.default);
app.use("/api/products", productRoutes_1.default);
app.use("/api/visitors", visitorRoutes_1.default);
app.use("/api/users", userRoutes_1.default);
app.use("/api/contacts", contactsRoutes_1.default);
app.get("/", (_req, res) => {
    res.send("Wholesale Backend with Google Sheets DB");
});
exports.default = app;
