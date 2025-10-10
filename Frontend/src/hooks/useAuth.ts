// import { useState } from "react";
// import { useNavigate } from "react-router-dom";

// export function useAuth() {
//   const [error, setError] = useState<string | null>(null);
//   const navigate = useNavigate();

//   function login(username: string, password: string) {
//     // Replace with your backend API call:
//     fetch("/api/admin/login", {
//       method: "POST", headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ username, password })
//     })
//       .then(res => res.json())
//       .then(data => {
//         if (data.success) {
//           localStorage.setItem("admin_token", data.token);
//           navigate("/admin");
//         } else {
//           setError("Invalid credentials");
//         }
//       });
//   }

//   function logout() {
//     localStorage.removeItem("admin_token");
//     navigate("/admin/login");
//   }

//   function isAuthenticated() {
//     return !!localStorage.getItem("admin_token");
//   }

//   return { login, logout, isAuthenticated, error };
// }

// src/hooks/useAuth.ts
import { useNavigate } from "react-router-dom";

type LoginResp = { success?: boolean; token?: string; error?: string };

export function useAuth() {
  const navigate = useNavigate();

  async function login(username: string, password: string): Promise<LoginResp> {
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";
    const res = await fetch(`${API_URL}/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    // defensive handling: don't call res.json() blindly
    if (!res.ok) {
      const txt = await res.text();
      throw new Error(txt || res.statusText || "Login failed");
    }

    const data = await res.json();
    if (data && data.token) {
      localStorage.setItem("admin_token", data.token);
      return data;
    }
    throw new Error("No token returned from server");
  }

  function logout() {
    localStorage.removeItem("admin_token");
    navigate("/");
  }

  function getToken() {
    return localStorage.getItem("admin_token");
  }

  function isAuthenticated() {
    return !!getToken();
  }

  return { login, logout, getToken, isAuthenticated };
}
