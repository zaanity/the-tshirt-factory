import { BrowserRouter, Route, Routes } from 'react-router-dom';
import App from './App';
import AdminDashboard from './admin/AdminDashboard';
import ProductManager from './admin/ProductManager';
import VisitorStats from './admin/VisitorStats';
import AdminLogin from './admin/AdminLogin';

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/products" element={<ProductManager />} />
        <Route path="/stats" element={<VisitorStats />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;