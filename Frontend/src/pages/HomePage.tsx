import React from "react";
import { Link } from "react-router-dom";
import "./HomePage.css";
import HeroSection from "../sections/HeroSection";
import CollectionShowcase from "../sections/CollectionShowcase";
import WholesaleAdvantages from "../sections/WholesaleAdvantages";
import MainLayout from "../components/MainLayout";
import MensKidswearSection from "../sections/MensKidswearSection";

const HomePage: React.FC = () => (
  <MainLayout>
    <HeroSection />
    <MensKidswearSection />
    <CollectionShowcase />
    <WholesaleAdvantages />
    <section className="cta-section">
      <div className="container">
        <div className="cta-content">
          <h2 className="cta-title">Ready to Stock Premium T-Shirts?</h2>
          <p className="cta-description">
            Join retailers worldwide who trust us for high-quality wholesale t-shirts
          </p>
          <div className="cta-actions">
            <Link className="cta-btn primary" to="/catalog">
              Browse Collections
            </Link>
            <Link className="cta-btn secondary" to="/contact">
              Request Quote
            </Link>
          </div>
        </div>
      </div>
    </section>
  </MainLayout>
);

export default HomePage;
