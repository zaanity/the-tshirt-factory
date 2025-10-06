import React from "react";
import MainLayout from "../components/MainLayout";
import "./AboutPage.css";

const AboutPage: React.FC = () => (
  <MainLayout>
    <section className="brand-story">
      <h1>Our Story</h1>
      <div className="brand-story-content">
        <p>
          The T-Shirt Factory is a contemporary wholesale clothing label that blends
          refined minimalism with expressive design. Our collections are curated
          for style-led boutiques and retailers who value quality, versatility,
          and timeless elegance.
        </p>
        <p>
          We believe in thoughtful, sustainable production and use only premium
          fabrics. Our design philosophy balances classic tailoring with modern
          silhouettes and trend-forward accents, ensuring every piece feels both
          current and enduring.
        </p>
        <p>
          As a wholesale partner, you benefit from exclusive bulk pricing,
          flexible order quantities, and dedicated support throughout your
          buying journey.
        </p>
      </div>
    </section>
  </MainLayout>
);

export default AboutPage;