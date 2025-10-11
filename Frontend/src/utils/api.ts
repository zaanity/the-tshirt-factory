// eslint-disable-next-line @typescript-eslint/no-explicit-any
const API_URL = (import.meta as any).env.VITE_API_URL || "https://the-tshirt-factory-admin.onrender.com/api";
// Helper to get auth token for admin routes
function getToken() {
  return localStorage.getItem("token");
}

// ----- Products -----
export async function fetchProducts() {
  try {
    const res = await fetch(`${API_URL}/products`);
    if (!res.ok) throw new Error(`Failed to fetch products: ${res.status} ${res.statusText}`);
    return res.json();
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function addProduct(product: any) {
  const res = await fetch(`${API_URL}/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(product),
  });
  if (!res.ok) throw new Error("Failed to add product");
  return res.json();
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function updateProduct(id: string, updates: any) {
  const res = await fetch(`${API_URL}/products/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error("Failed to update product");
  return res.json();
}

export async function deleteProduct(id: string) {
  const res = await fetch(`${API_URL}/products/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  if (!res.ok) throw new Error("Failed to delete product");
  return res.json();
}

// ----- Admin Auth -----
export async function adminLogin(username: string, password: string) {
  const res = await fetch(`${API_URL}/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) throw new Error("Login failed");
  return res.json();
}

// ----- Visitor Count -----
export async function getVisitorCount() {
  const res = await fetch(`${API_URL}/visitors`);
  if (!res.ok) throw new Error("Failed to get visitor count");
  return res.json();
}

export async function incrementVisitor() {
  const res = await fetch(`${API_URL}/visitors`, { method: "POST" });
  if (!res.ok) throw new Error("Failed to increment visitor");
  return res.json();
}

// ----- User Details (Initial Popup) -----
export async function submitUserDetails(details: { name: string; phone?: string; email?: string }) {
  const res = await fetch(`${API_URL}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(details),
  });
  if (!res.ok) throw new Error("Failed to submit user details");
  return res.json();
}