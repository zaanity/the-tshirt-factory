import { Router } from "express";
import multer from "multer";
import { Storage } from "@google-cloud/storage";
import { requireAuth } from "../middleware/authMiddleware";

const router = Router();

// Configure Google Cloud Storage
const storage = new Storage({
  credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON || "{}"),
});

const bucketName = process.env.GOOGLE_CLOUD_BUCKET || "your-bucket-name";
const bucket = storage.bucket(bucketName);

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

// Upload single image
router.post("/image", requireAuth, upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image file provided" });
    }

    const file = req.file;
    const fileName = `products/${Date.now()}-${file.originalname}`;
    const fileUpload = bucket.file(fileName);

    const stream = fileUpload.createWriteStream({
      metadata: {
        contentType: file.mimetype,
      },
      public: true, // Make the file publicly accessible
    });

    stream.on("error", (err) => {
      console.error("Upload error:", err);
      res.status(500).json({ error: "Failed to upload image" });
    });

    stream.on("finish", () => {
      const publicUrl = `https://storage.googleapis.com/${bucketName}/${fileName}`;
      res.json({
        success: true,
        url: publicUrl,
        fileName: fileName,
      });
    });

    stream.end(file.buffer);
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: "Failed to upload image" });
  }
});

// Upload multiple images
router.post("/images", requireAuth, upload.array("images", 5), async (req, res) => {
  try {
    if (!req.files || !Array.isArray(req.files)) {
      return res.status(400).json({ error: "No image files provided" });
    }

    const uploadPromises = (req.files as Express.Multer.File[]).map(async (file) => {
      const fileName = `products/${Date.now()}-${file.originalname}`;
      const fileUpload = bucket.file(fileName);

      return new Promise<string>((resolve, reject) => {
        const stream = fileUpload.createWriteStream({
          metadata: {
            contentType: file.mimetype,
          },
          public: true,
        });

        stream.on("error", (err) => {
          console.error("Upload error:", err);
          reject(err);
        });

        stream.on("finish", () => {
          const publicUrl = `https://storage.googleapis.com/${bucketName}/${fileName}`;
          resolve(publicUrl);
        });

        stream.end(file.buffer);
      });
    });

    const urls = await Promise.all(uploadPromises);

    res.json({
      success: true,
      urls: urls,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: "Failed to upload images" });
  }
});

export default router;
