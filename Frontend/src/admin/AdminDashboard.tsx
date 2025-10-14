import React from "react";
import { useAuth } from "../hooks/useAuth";
import ProductManager from "./ProductManager";
import VisitorStats from "./VisitorStats";
import ImageUploader from "./ImageUploader";
import "./Admin.css";

const AdminDashboard: React.FC = () => {
  const { logout } = useAuth();

  return (
    <div className="admin-dashboard">
      <header>
        <h1>Admin Dashboard</h1>
        <button onClick={logout}>Logout</button>
      </header>
      <main>
        <ImageUploader />
        <ProductManager />
        <VisitorStats />
      </main>
    </div>
  );
};

export default AdminDashboard;