import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import MainLayout from "../components/MainLayout";
import "./ProductPage.css";

type Product = {
  id: string;
  name: string;
  images: string[];
  description: string;
  fabric: string;
  sizes: string[];
  colors: string[];
  moq: number;
  stock: number;
  priceTiers: { minQty: number; price: number }[];
};

const ProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";
    fetch(`${API_URL}/products/${id}`)
      .then(r => r.json())
      .then(setProduct);
  }, [id]);

  if (!product) return null;

  return (
    <MainLayout>
      <div className="product-detail-container">
        <div className="product-detail-images">
          {product.images.map(img => (
            <img key={img} src={img} alt={product.name} />
          ))}
        </div>
        <div className="product-detail-info">
          <h1 className="product-detail-title">{product.name}</h1>
          <div className="product-detail-meta">
            <span>MOQ: {product.moq}</span>
            <span>{product.stock} in stock</span>
          </div>
          <p className="product-detail-desc">{product.description}</p>
          <div className="product-detail-fabric">
            <strong>Fabric:</strong> {product.fabric}
          </div>
          <div className="product-detail-sizes">
            <strong>Sizes:</strong> {product.sizes.join(", ")}
          </div>
          <div className="product-detail-colors">
            <strong>Colors:</strong> {product.colors.join(", ")}
          </div>
          <div className="product-detail-pricing">
            <strong>Pricing:</strong>
            <ul>
              {product.priceTiers.map(tier => (
                <li key={tier.minQty}>
                  {tier.minQty}+ pcs: <span>${tier.price}</span>
                </li>
              ))}
            </ul>
          </div>
          <Link to={`/enquiry?product=${product.id}`} className="enquiry-btn">
            Enquire Now
          </Link>
        </div>
      </div>
    </MainLayout>
  );
};

export default ProductPage;