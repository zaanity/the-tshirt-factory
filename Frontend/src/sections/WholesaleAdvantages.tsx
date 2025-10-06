import React from "react";
import "./WholesaleAdvantages.css";

const advantages = [
  {
    icon: (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
      </svg>
    ),
    title: "Premium Quality",
    desc: "Soft, breathable fabrics crafted for comfort and durability.",
  },
  {
    icon: (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
      </svg>
    ),
    title: "Competitive Pricing",
    desc: "Bulk discounts tailored for retailers to maximize profits.",
  },
  {
    icon: (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.83z"/>
        <line x1="7" y1="7" x2="7.01" y2="7"/>
      </svg>
    ),
    title: "Curated Collections",
    desc: "Exclusive designs for fashion-forward boutiques and stores.",
  },
];

const WholesaleAdvantages: React.FC = () => (
  <section className="advantages-section">
    <div className="container">
      <div className="advantages-grid">
        {advantages.map((advantage, index) => (
          <div className="advantage-card" key={advantage.title}>
            <div className="advantage-icon">
              {advantage.icon}
            </div>
            <div className="advantage-content">
              <h3 className="advantage-title">{advantage.title}</h3>
              <p className="advantage-desc">{advantage.desc}</p>
            </div>
            <div className="advantage-number">{String(index + 1).padStart(2, '0')}</div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default WholesaleAdvantages;
