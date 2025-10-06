import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./HeroSection.css";

const HeroSection: React.FC = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const blurIntensity = Math.min(scrollY / 20, 10); // Max blur 10px

  return (
    <section className="hero-section" style={{ filter: `blur(${blurIntensity}px)` }}>
      <div className="hero-background">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="hero-video"
          aria-label="The T-Shirt Factory"
        >
          <source src="/assets/Brand_Logo_Animation_For_T_Shirt_Factory.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="hero-overlay" />
      </div>
      <div className="hero-content">
        <div className="container">
          <h1 className="hero-title">
            Premium T-Shirts, <span>Wholesale</span>
          </h1>
          <p className="hero-description">
            Discover our curated collection of premium t-shirts for modern retailers. High-quality fabrics, trendy designs, and exclusive bulk pricing.
          </p>
          <div className="hero-actions">
            <Link to="/catalog" className="cta-btn primary">
              Explore Catalog
            </Link>
            <Link to="/about" className="cta-btn secondary">
              Learn More
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
