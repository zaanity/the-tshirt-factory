import { Request, Response } from "express";
import {
  getSheetRows,
  appendSheetRow,
  updateSheetRow,
  deleteSheetRow,
} from "../services/googleSheetsServices";
const SHEET_NAME = "Products"; // Sheet name within the spreadsheet
const HEADER = ["id", "name", "price", "moq", "category", "size1", "size2", "size3", "size4", "size5", "image1", "image2", "image3", "image4", "image5"];

// Convert object → row
function toRow(obj: any): string[] {
  const row: any = {};
  HEADER.forEach(h => {
    if (h.startsWith('image') && h !== 'image') {
      const index = parseInt(h.replace('image', '')) - 1;
      row[h] = obj.images && obj.images[index] ? obj.images[index] : "";
    } else if (h.startsWith('size') && h !== 'size') {
      const index = parseInt(h.replace('size', '')) - 1;
      row[h] = obj.sizesAvailable && obj.sizesAvailable[index] ? obj.sizesAvailable[index] : "";
    } else {
      row[h] = obj[h] ?? "";
    }
  });
  return HEADER.map(h => row[h]);
}

// Convert row → object
function fromRow(row: any): any {
  const images = [];

  // Check for image1, image2, etc.
  for (let i = 1; i <= 5; i++) {
    if (row[`image${i}`]) {
      images.push(row[`image${i}`]);
    }
  }

  // If no images found, check for single image column
  if (images.length === 0) {
    if (row.image) {
      images.push(row.image);
    }
    // Also check for images column that might be comma-separated or an array
    if (row.images) {
      if (typeof row.images === 'string') {
        const additionalImages = row.images.split(',').map((url: string) => url.trim()).filter((url: string) => url.length > 0);
        images.push(...additionalImages);
      } else if (Array.isArray(row.images)) {
        images.push(...row.images);
      }
    }
  }

  // Collect sizes from separate columns
  const sizesAvailable: string[] = [];
  for (let i = 1; i <= 5; i++) {
    if (row[`size${i}`]) {
      sizesAvailable.push(row[`size${i}`]);
    }
  }

  // Keep backward compatibility with old sizesAvailable column
  if (sizesAvailable.length === 0 && row.sizesAvailable) {
    if (typeof row.sizesAvailable === 'string') {
      sizesAvailable.push(...row.sizesAvailable.split(',').map((size: string) => size.trim()).filter((size: string) => size.length > 0));
    } else if (Array.isArray(row.sizesAvailable)) {
      sizesAvailable.push(...row.sizesAvailable);
    }
  }

  return { ...row, images, image: images[0] || "", sizesAvailable }; // Keep image for backward compatibility
}

export const getAllProducts = async (_: Request, res: Response) => {
  try {
    const data = await getSheetRows(SHEET_NAME);
    const normalized = data.map(fromRow);
    console.log(`Fetched ${normalized.length} products successfully`);
    res.json(normalized);
  } catch (e) {
    console.error("getAllProducts error:", e);
    res.status(500).json({ error: "Failed to fetch products", details: e instanceof Error ? e.message : String(e) });
  }
};

export const addProduct = async (req: Request, res: Response) => {
  try {
    const product = { ...req.body, id: Date.now().toString() };

    await appendSheetRow(SHEET_NAME, toRow(product));
    res.status(201).json(fromRow(product));
  } catch (e) {
    console.error("addProduct error:", e);
    res.status(500).json({ error: "Failed to add product" });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const products = await getSheetRows(SHEET_NAME);
    const idx = products.findIndex((p: any) => p.id === req.params.id);
    if (idx === -1) {
      console.log(`Product with id ${req.params.id} not found`);
      return res.status(404).json({ error: "Product not found" });
    }

    const updated = { ...products[idx], ...req.body };

    // Handle images array properly
    if (Array.isArray(updated.images)) {
      updated.image = updated.images[0] || "";
    }

    await updateSheetRow(SHEET_NAME, idx + 1, toRow(updated));
    const result = fromRow(updated);
    console.log(`Product ${req.params.id} updated successfully`);
    res.json(result);
  } catch (e) {
    console.error("updateProduct error:", e);
    res.status(500).json({ error: "Failed to update product", details: e instanceof Error ? e.message : String(e) });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const products = await getSheetRows(SHEET_NAME);
    const idx = products.findIndex((p: any) => p.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: "Not found" });

    await deleteSheetRow(SHEET_NAME, idx + 1);
    res.json({ success: true });
  } catch (e) {
    console.error("deleteProduct error:", e);
    res.status(500).json({ error: "Failed to delete product" });
  }
};
