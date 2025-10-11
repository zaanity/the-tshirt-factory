import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import MainLayout from "../components/MainLayout";
import "./CatalogPage.css";

type Product = {
  id: string;
  name: string;
  image: string;
  images?: string[];
  moq: number;
  sizesAvailable?: string[];
  priceTiers: { minQty: number; price: number }[];
  category?: string;
};

const CatalogPage: React.FC = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const category = queryParams.get("category");

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState(category || 'all');

  useEffect(() => {
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";
    fetch(`${API_URL}/products`)
      .then(r => {
        if (!r.ok) throw new Error(`Failed to fetch products: ${r.status} ${r.statusText}`);
        return r.json();
      })
      .then(data => {
        // Transform backend product data to include priceTiers array expected by ProductCard
        const transformed = data.map((product: any) => ({
          ...product,
          priceTiers: product.price ? [{ minQty: 1, price: parseFloat(product.price) }] : [],
          // Ensure images field is properly handled (backend returns both image and images)
          images: product.images || (product.image ? [product.image] : []),
        }));
        setProducts(transformed);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching products:", err);
        setError(err.message || "An error occurred while loading products");
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const currentCategory = queryParams.get("category") || 'all';
    setSelectedCategory(currentCategory);
  }, [location.search]);

  const handleCategoryFilter = (cat: string) => {
    setSelectedCategory(cat);
    if (cat === 'all') {
      navigate('/catalog');
    } else {
      navigate(`/catalog?category=${cat}`);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchesSearch) return false;

    if (selectedCategory === "menswear") {
      return product.category === "menswear";
    } else if (selectedCategory === "kidswear") {
      return product.category === "kidswear";
    }
    return true;
  });

  return (
    <MainLayout>
      <div className="catalog-header">
        <div className="container">
          <h1 className="catalog-title">Wholesale Catalog</h1>
          <p className="catalog-subtitle">
            Discover our premium collection of wholesale t-shirts and apparel from The T-Shirt Factory
          </p>

          <div className="catalog-controls">
            <div className="search-bar">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/>
                <path d="M21 21l-4.35-4.35"/>
              </svg>
            </div>

            <div className="category-filters">
              <button
                className={`filter-btn ${selectedCategory === 'all' ? 'active' : ''}`}
                onClick={() => handleCategoryFilter('all')}
              >
                All
              </button>
              <button
                className={`filter-btn ${selectedCategory === 'menswear' ? 'active' : ''}`}
                onClick={() => handleCategoryFilter('menswear')}
              >
                Menswear
              </button>
              <button
                className={`filter-btn ${selectedCategory === 'kidswear' ? 'active' : ''}`}
                onClick={() => handleCategoryFilter('kidswear')}
              >
                Kidswear
              </button>
            </div>

            <div className="catalog-stats">
              <span className="stats-item">
                {filteredProducts.length} products
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="catalog-content">
        <div className="container">
          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Loading products...</p>
            </div>
          ) : error ? (
            <div className="empty-state">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <circle cx="12" cy="12" r="10"/>
                <path d="M16 16l-4-4m0 0L8 8m4 4l4-4m-4 4L8 16"/>
              </svg>
              <h3>Error loading products</h3>
              <p>{error}</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="empty-state">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <circle cx="12" cy="12" r="10"/>
                <path d="M16 16l-4-4m0 0L8 8m4 4l4-4m-4 4L8 16"/>
              </svg>
              <h3>No products found</h3>
              <p>Try adjusting your search terms</p>
            </div>
          ) : (
            <div className="catalog-grid">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default CatalogPage;
