import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";

const ImageUploader: React.FC = () => {
  const auth = useAuth();
  const token = auth.getToken();
  const [uploading, setUploading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<{ url: string; name: string }[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploading(true);
    setError(null);
    const newUploadedImages: { url: string; name: string }[] = [];

    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append("images", file);

        const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:4000";
        const apiUrl = baseUrl.endsWith('/api') ? baseUrl : `${baseUrl}/api`;
        const response = await fetch(`${apiUrl}/upload/images`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`Failed to upload ${file.name}: ${response.statusText}`);
        }

        const data = await response.json();
        if (data.urls && data.urls.length > 0) {
          newUploadedImages.push({
            url: data.urls[0],
            name: file.name,
          });
        }
      }

      setUploadedImages((prev) => [...prev, ...newUploadedImages]);
      e.target.value = ""; // Reset input
    } catch (err: any) {
      setError(err.message || "Upload failed");
      console.error("Upload error:", err);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div style={{ padding: "1rem", border: "1px solid #ccc", borderRadius: "8px", margin: "1rem 0" }}>
      <h3>Image Uploader</h3>
      <p>Upload images here to get public URLs. You can then copy these URLs and paste them into the Product Manager for product images.</p>
      
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleUpload}
        disabled={uploading}
        style={{ marginBottom: "1rem", padding: "0.5rem" }}
      />
      
      {uploading && <p>Uploading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      
      {uploadedImages.length > 0 && (
        <div>
          <h4>Uploaded Images:</h4>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {uploadedImages.map((img, index) => (
              <li key={index} style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.5rem", padding: "0.5rem", border: "1px solid #eee" }}>
                <img src={img.url} alt={img.name} style={{ width: "50px", height: "50px", objectFit: "cover" }} />
                <a href={img.url} target="_blank" rel="noopener noreferrer" style={{ flex: 1 }}>
                  {img.url}
                </a>
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  style={{ background: "#d33", color: "#fff", border: "none", padding: "0.25rem 0.5rem", borderRadius: "4px", cursor: "pointer" }}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
          <p>Copy the URLs above and use them in the Product Manager's manual URL inputs.</p>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
