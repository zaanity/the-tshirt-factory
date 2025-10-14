import React, { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";

type Product = {
  id: string;
  name: string;
  price?: string;
  moq?: string;
  sizesAvailable?: string[];
  image?: string;
  images?: string[];
  category?: string;
};

const API_BASE = (import.meta as any).env.VITE_API_URL ? `${(import.meta as any).env.VITE_API_URL}/products` : "http://localhost:4000/api/products";

export default function ProductManager() {
  const auth = useAuth();
  const token = auth.getToken();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState<string>("");

  const [isEditing, setIsEditing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Product & { size1?: string; size2?: string; size3?: string; size4?: string; size5?: string }>({
    id: "",
    name: "",
    price: "",
    moq: "",
    sizesAvailable: [],
    images: [],
    category: "",
    size1: "",
    size2: "",
    size3: "",
    size4: "",
    size5: "",
  });

  const [uploadingImages, setUploadingImages] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(API_BASE, {
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to fetch products: ${res.status} ${res.statusText} - ${errorText}`);
      }
      const data = await res.json();
      setProducts(Array.isArray(data.products) ? data.products : []);
      console.log(`Successfully loaded ${Array.isArray(data.products) ? data.products.length : 0} products`);
    } catch (err: any) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      console.error("fetchProducts error:", err);
      setError(err.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  }

  function openNewForm() {
    setForm({
      id: "",
      name: "",
      price: "",
      moq: "",
      sizesAvailable: [],
      images: [],
      category: "",
      size1: "",
      size2: "",
      size3: "",
      size4: "",
      size5: "",
    });
    setIsEditing(false);
    setShowForm(true);
    setError(null);
  }

  function openEditForm(p: Product) {
    // Ensure images is an array, fallback to splitting image if it's a string
    const images = Array.isArray(p.images) ? p.images : (p.image ? p.image.split(',').map(url => url.trim()) : []);

    // Convert sizesAvailable array to individual size fields
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sizeFields: any = { size1: "", size2: "", size3: "", size4: "", size5: "" };
    if (Array.isArray(p.sizesAvailable)) {
      p.sizesAvailable.forEach((size, index) => {
        if (index < 5) {
          sizeFields[`size${index + 1}`] = size;
        }
      });
    }

    setForm({ ...p, images, ...sizeFields });
    setIsEditing(true);
    setShowForm(true);
    setError(null);
  }

  function handleChange<K extends keyof Product>(key: K, value: Product[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function saveProduct(e?: React.FormEvent) {
    if (e) e.preventDefault();
    setError(null);

    try {
      const payload = {
        ...form,
        id: form.id || String(Date.now()),
      };

      // Convert sizesAvailable to array if it's a string (from form input)
      if (typeof payload.sizesAvailable === "string") {
        payload.sizesAvailable = (payload.sizesAvailable as unknown as string).split(",").map((s: string) => s.trim()).filter((s: string) => s);
      }

      // Fix category empty string to undefined to avoid sending empty string
      if (payload.category === "") {
        payload.category = undefined;
      }

      const method = isEditing ? "PUT" : "POST";
      const url = isEditing ? `${API_BASE}/${payload.id}` : API_BASE;

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(await res.text());

      await fetchProducts();
      setShowForm(false);
    } catch (err: any) {
      console.error("saveProduct error:", err);
      setError(err.message || "Failed to save product");
    }
  }

  async function deleteProduct(id: string) {
    const ok = window.confirm("Delete this product?");
    if (!ok) return;

    try {
      const res = await fetch(`${API_BASE}/${id}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) throw new Error(await res.text());
      await fetchProducts();
    } catch (err: any) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      console.error("deleteProduct error:", err);
      setError(err.message || "Failed to delete product");
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Product Manager</h2>

      {error && <div style={{ color: "red" }}>{error}</div>}

      <input
        type="text"
        placeholder="Search products..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{ padding: "0.5rem", borderRadius: "6px", border: "1px solid #ccc", marginBottom: "1rem", width: "100%", maxWidth: 400 }}
      />

      <button onClick={openNewForm}>+ New Product</button>
      <button onClick={fetchProducts} style={{ marginLeft: 10 }}>
        Refresh
      </button>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {products
            .filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
            .map((p) => (
              <div key={p.id} style={{ background: "#fff", padding: "1rem", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
                <div style={{ flexShrink: 0 }}>
                  {p.image ? (
                    <img
                      src={p.image}
                      alt={p.name}
                      style={{ width: 80, height: 80, objectFit: "cover", borderRadius: "6px" }}
                    />
                  ) : (
                    <span>No image</span>
                  )}
                </div>
                <div style={{ flex: "1 1 auto", minWidth: 200 }}>
                  <div><strong>Name:</strong> {p.name}</div>
                  <div><strong>Price:</strong> {p.price}</div>
                  <div><strong>MOQ:</strong> {p.moq}</div>
                  <div><strong>Sizes:</strong> {Array.isArray(p.sizesAvailable) ? p.sizesAvailable.join(", ") : "N/A"}</div>
                  <div><strong>Category:</strong> {p.category || "N/A"}</div>
                </div>
                <div style={{ display: "flex", gap: "0.5rem", flexShrink: 0 }}>
                  <button onClick={() => openEditForm(p)} style={{ padding: "0.5rem 1rem", borderRadius: "6px", border: "none", backgroundColor: "#2d5c4f", color: "#fff", cursor: "pointer" }}>Edit</button>
                  <button onClick={() => deleteProduct(p.id)} style={{ padding: "0.5rem 1rem", borderRadius: "6px", border: "none", backgroundColor: "#d33", color: "#fff", cursor: "pointer" }}>Delete</button>
                </div>
              </div>
            ))}
        </div>
      )}

      {showForm && (
        <div style={{
          position: "fixed",
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "rgba(0,0,0,0.5)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1000,
        }}>
          <form onSubmit={saveProduct} style={{ background: "#fff", padding: "2rem", borderRadius: "8px", display: "flex", flexDirection: "column", gap: "1rem", maxWidth: 400, width: "90%", maxHeight: "80vh", overflowY: "auto" }}>
            <h3>{isEditing ? "Edit Product" : "Add New Product"}</h3>
            <input
              placeholder="Name"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              style={{ padding: "0.5rem", borderRadius: "6px", border: "1px solid #ccc" }}
            />
            <input
              placeholder="Price"
              value={form.price}
              onChange={(e) => handleChange("price", e.target.value)}
              style={{ padding: "0.5rem", borderRadius: "6px", border: "1px solid #ccc" }}
            />
            <input
              placeholder="MOQ"
              value={form.moq}
              onChange={(e) => handleChange("moq", e.target.value)}
              style={{ padding: "0.5rem", borderRadius: "6px", border: "1px solid #ccc" }}
            />
            {/* Sizes Available - Enhanced UI */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <label style={{ fontWeight: "bold", fontSize: "0.9rem" }}>Available Sizes</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "0.5rem" }}>
                {form.sizesAvailable && form.sizesAvailable.map((size, index) => (
                  <div key={index} style={{
                    display: "flex",
                    alignItems: "center",
                    backgroundColor: "#e8f5e8",
                    padding: "0.25rem 0.5rem",
                    borderRadius: "15px",
                    border: "1px solid #2d5c4f"
                  }}>
                    <span style={{ fontSize: "0.9rem", marginRight: "0.5rem" }}>{size}</span>
                    <button
                      type="button"
                      onClick={() => {
                        const newSizes = form.sizesAvailable?.filter((_, i) => i !== index) || [];
                        handleChange("sizesAvailable", newSizes);
                      }}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#d33",
                        cursor: "pointer",
                        fontSize: "1rem",
                        padding: "0",
                        lineHeight: "1"
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <input
                  type="text"
                  placeholder="Add size (e.g. S, M, L, XL)"
                  id="newSizeInput"
                  style={{ flex: 1, padding: "0.5rem", borderRadius: "6px", border: "1px solid #ccc" }}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const input = e.target as HTMLInputElement;
                      const newSize = input.value.trim();
                      if (newSize && (!form.sizesAvailable || !form.sizesAvailable.includes(newSize))) {
                        const currentSizes = form.sizesAvailable || [];
                        handleChange("sizesAvailable", [...currentSizes, newSize]);
                        input.value = "";
                      }
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    const input = document.getElementById('newSizeInput') as HTMLInputElement;
                    const newSize = input.value.trim();
                    if (newSize && (!form.sizesAvailable || !form.sizesAvailable.includes(newSize))) {
                      const currentSizes = form.sizesAvailable || [];
                      handleChange("sizesAvailable", [...currentSizes, newSize]);
                      input.value = "";
                    }
                  }}
                  style={{
                    padding: "0.5rem 1rem",
                    borderRadius: "6px",
                    border: "1px solid #2d5c4f",
                    backgroundColor: "#2d5c4f",
                    color: "#fff",
                    cursor: "pointer"
                  }}
                >
                  Add Size
                </button>
              </div>
              <small style={{ color: "#666", fontSize: "0.8rem" }}>
                Press Enter or click "Add Size" to add a new size. Existing sizes will be shown as tags above.
              </small>
            </div>
            {/* Category selection */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <label style={{ fontWeight: "bold", fontSize: "0.9rem" }}>Category</label>
              <div style={{ display: "flex", gap: "1rem" }}>
                <button
                  type="button"
                  onClick={() => handleChange("category", "menswear")}
                  style={{
                    padding: "0.5rem 1rem",
                    borderRadius: "6px",
                    border: form.category === "menswear" ? "2px solid #2d5c4f" : "1px solid #ccc",
                    backgroundColor: form.category === "menswear" ? "#2d5c4f" : "#fff",
                    color: form.category === "menswear" ? "#fff" : "#000",
                    cursor: "pointer"
                  }}
                >
                  Menswear
                </button>
                <button
                  type="button"
                  onClick={() => handleChange("category", "kidswear")}
                  style={{
                    padding: "0.5rem 1rem",
                    borderRadius: "6px",
                    border: form.category === "kidswear" ? "2px solid #2d5c4f" : "1px solid #ccc",
                    backgroundColor: form.category === "kidswear" ? "#2d5c4f" : "#fff",
                    color: form.category === "kidswear" ? "#fff" : "#000",
                    cursor: "pointer"
                  }}
                >
                  Kidswear
                </button>
              </div>
            </div>

            {/* Image Upload */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <label style={{ fontWeight: "bold", fontSize: "0.9rem" }}>Product Images (up to 5)</label>

              {/* File Upload */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={async (e) => {
                    const files = Array.from(e.target.files || []);
                    if (files.length === 0) return;

                    setUploadingImages(true);
                    try {
                      const formData = new FormData();
                      files.forEach((file) => {
                        formData.append("images", file);
                      });

                      const uploadRes = await fetch(`${(import.meta as any).env.VITE_API_URL || "http://localhost:4000"}/api/upload/images`, {
                        method: "POST",
                        headers: {
                          Authorization: `Bearer ${token}`,
                        },
                        body: formData,
                      });

                      if (!uploadRes.ok) {
                        throw new Error("Failed to upload images");
                      }

                      const uploadData = await uploadRes.json();
                      const currentImages = Array.isArray(form.images) ? form.images : [];
                      const newImages = [...currentImages, ...uploadData.urls].slice(0, 5); // Limit to 5 images

                      handleChange("images", newImages);
                      if (newImages.length > 0 && !form.image) {
                        handleChange("image", newImages[0]);
                      }
                    } catch (error) {
                      console.error("Upload error:", error);
                      setError("Failed to upload images");
                    } finally {
                      setUploadingImages(false);
                    }
                  }}
                  style={{ padding: "0.5rem", borderRadius: "6px", border: "1px solid #ccc" }}
                  disabled={uploadingImages}
                />
                {uploadingImages && <small style={{ color: "#666" }}>Uploading images...</small>}
              </div>

              {/* Current Images Display */}
              {form.images && Array.isArray(form.images) && form.images.length > 0 && (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <label style={{ fontSize: "0.8rem", color: "#666" }}>Current Images:</label>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                    {form.images.map((url, index) => (
                      <div key={index} style={{ position: "relative", display: "inline-block" }}>
                        <img
                          src={url}
                          alt={`Product ${index + 1}`}
                          style={{ width: 60, height: 60, objectFit: "cover", borderRadius: "4px", border: "1px solid #ccc" }}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newImages = form.images?.filter((_, i) => i !== index) || [];
                            handleChange("images", newImages);
                            if (newImages.length === 0) {
                              handleChange("image", "");
                            } else if (form.image === url) {
                              handleChange("image", newImages[0]);
                            }
                          }}
                          style={{
                            position: "absolute",
                            top: -8,
                            right: -8,
                            background: "#d33",
                            color: "#fff",
                            border: "none",
                            borderRadius: "50%",
                            width: 24,
                            height: 24,
                            cursor: "pointer",
                            fontSize: "14px",
                            lineHeight: 1,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            zIndex: 1,
                          }}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Manual URL inputs as fallback */}
              <details style={{ marginTop: "0.5rem" }}>
                <summary style={{ cursor: "pointer", fontSize: "0.8rem", color: "#666" }}>
                  Or enter image URLs manually
                </summary>
                <div style={{ marginTop: "0.5rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  {[0, 1, 2, 3, 4].map((index) => (
                    <input
                      key={index}
                      type="url"
                      placeholder={`Image ${index + 1} URL`}
                      value={form.images && Array.isArray(form.images) && form.images[index] ? form.images[index] : ""}
                      onChange={(e) => {
                        const newImages = [...(Array.isArray(form.images) ? form.images : [])];
                        newImages[index] = e.target.value.trim();
                        // Remove empty strings at the end
                        while (newImages.length > 0 && !newImages[newImages.length - 1]) {
                          newImages.pop();
                        }
                        handleChange("images", newImages);
                        // Update the main image field with the first image
                        if (newImages.length > 0 && newImages[0]) {
                          handleChange("image", newImages[0]);
                        } else {
                          handleChange("image", "");
                        }
                      }}
                      style={{ padding: "0.5rem", borderRadius: "6px", border: "1px solid #ccc" }}
                    />
                  ))}
                </div>
              </details>
            </div>
            <div style={{ display: "flex", gap: "1rem" }}>
              <button type="submit" style={{ flex: 1, padding: "0.5rem", borderRadius: "6px", border: "none", backgroundColor: "#2d5c4f", color: "#fff", cursor: "pointer" }}>
                {isEditing ? "Save" : "Add"}
              </button>
              <button type="button" onClick={() => setShowForm(false)} style={{ flex: 1, padding: "0.5rem", borderRadius: "6px", border: "none", backgroundColor: "#999", color: "#fff", cursor: "pointer" }}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
