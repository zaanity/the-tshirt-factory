import express from "express";
import cors from "cors";
import adminRoutes from "./routes/adminRoutes";
import productRoutes from "./routes/productRoutes";
import visitorRoutes from "./routes/visitorRoutes";
import userRoutes from "./routes/userRoutes";
import contactsRoutes from "./routes/contactsRoutes";

const app = express();

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

app.use(cors(corsOptions));

// Handle preflight requests
app.options("*", cors(corsOptions));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

app.use("/api/admin", adminRoutes);
app.use("/api/products", productRoutes);
app.use("/api/visitors", visitorRoutes);
app.use("/api/users", userRoutes);
app.use("/api/contacts", contactsRoutes);

app.get("/", (_req, res) => {
  res.send("Wholesale Backend with Google Sheets DB");
});

export default app;
