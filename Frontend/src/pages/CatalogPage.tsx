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

  const [currentProducts, setCurrentProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState(category || 'all');

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

  const fetchProducts = async (currentPage: number, currentCategory: string, currentSearch: string) => {
    setLoading(true);
    const params = new URLSearchParams({
      page: currentPage.toString(),
      limit: '20',
      ...(currentCategory !== 'all' && { category: currentCategory }),
      ...(currentSearch && { search: currentSearch }),
    });
    try {
      const response = await fetch(`${API_URL}/products?${params}`);
      if (!response.ok) throw new Error(`Failed to fetch: ${response.status}`);
      const data = await response.json();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const transformed = data.products.map((product: any) => ({
        ...product,
        priceTiers: product.price ? [{ minQty: 1, price: parseFloat(product.price) }] : [],
        images: product.images || (product.image ? [product.image] : []),
      }));
      setCurrentProducts(transformed);
      setTotal(data.total);
      setPage(data.page);
      setTotalPages(data.totalPages);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError((err as Error).message || "An error occurred while loading products");
      setLoading(false);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchProducts(1, selectedCategory, searchTerm);
    setPage(1);
  }, [selectedCategory, searchTerm]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const currentCategory = queryParams.get("category") || 'all';
    setSelectedCategory(currentCategory);
  }, [location.search]);

  const handleCategoryFilter = (cat: string) => {
    setSelectedCategory(cat);
    setSearchTerm("");
    if (cat === 'all') {
      navigate('/catalog');
    } else {
      navigate(`/catalog?category=${cat}`);
    }
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    fetchProducts(newPage, selectedCategory, searchTerm);
  };

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
                {total} products
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
          ) : currentProducts.length === 0 ? (
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
              {currentProducts.map((product: Product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
            className="pagination-btn"
          >
            Previous
          </button>
          <span className="pagination-info">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages}
            className="pagination-btn"
          >
            Next
          </button>
        </div>
      )}
    </MainLayout>
  );
};

export default CatalogPage;
