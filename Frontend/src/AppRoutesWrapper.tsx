// src/AppRoutesWrapper.tsx
// import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import HomePage from "./pages/HomePage";
import CatalogPage from "./pages/CatalogPage";
import ProductPage from "./pages/ProductPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import EnquiryPage from "./pages/EnquiryPage";
import AdminLogin from "./admin/AdminLogin";
import AdminDashboard from "./admin/AdminDashboard";

import { useAuth } from "./hooks/useAuth";

export default function AppRoutesWrapper({}: { onClosePopup?: () => void }) {
  // safe to use router hooks in useAuth here — this component is rendered inside <Router>
  const auth = useAuth();

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/catalog" element={<CatalogPage />} />
      <Route path="/product/:id" element={<ProductPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/enquiry" element={<EnquiryPage />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route
        path="/admin"
        element={
          auth && typeof auth.isAuthenticated === "function" && auth.isAuthenticated() ? (
            <AdminDashboard />
          ) : (
            <Navigate to="/admin/login" />
          )
        }
      />
    </Routes>
  );
}
