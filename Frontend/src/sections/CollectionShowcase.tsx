import React from "react";
import { Link } from "react-router-dom";
import "./CollectionShowcase.css";

const collections = [
  {
    id: "cotton-basics",
    title: "Cotton Basics",
    image: "/assets/cotton-basics.jpg",
    desc: "Premium 100% cotton t-shirts in classic colors and fits.",
  },
  {
    id: "graphic-tees",
    title: "Graphic Tees",
    image: "/assets/graphic-tees.jpg",
    desc: "Trendy graphic designs for fashion-forward retailers.",
  },
  {
    id: "organic-collection",
    title: "Organic Collection",
    image: "/assets/organic-collection.jpg",
    desc: "Eco-friendly organic cotton t-shirts for conscious consumers.",
  },
];

const CollectionShowcase: React.FC = () => (
  <section className="collections-section">
    <div className="container">
      <div className="section-header">
        <h2 className="section-title">Featured Collections</h2>
        <p className="section-subtitle">
          Discover our curated collections designed for modern retailers
        </p>
      </div>
      <div className="collections-grid">
        {collections.map(collection => (
          <Link
            to={`/catalog?collection=${collection.id}`}
            className="collection-card"
            key={collection.id}
          >
            <div className="collection-image">
              <img src={collection.image} alt={collection.title} />
              <div className="collection-overlay">
              </div>
            </div>
            <div className="collection-info">
              <h3 className="collection-title">{collection.title}</h3>
              <p className="collection-desc">{collection.desc}</p>
              <div className="collection-link">
                <span>Explore Collection</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M7 17L17 7M17 7H7M17 7V17"/>
                </svg>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  </section>
);

export default CollectionShowcase;
