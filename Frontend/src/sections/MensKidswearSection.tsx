import React from 'react';
import { Link } from 'react-router-dom';
import './MensKidswearSection.css';
import { FaMale, FaChild } from 'react-icons/fa';

const MensKidswearSection: React.FC = () => {
  return (
    <section className="mens-kidswear-section">
      <div className="container">
        <h2>Mens and Kidswear</h2>
        <div className="categories">
          <Link to="/catalog?category=menswear" className="category">
            <FaMale className="category-icon" />
            <h3>Menswear</h3>
          </Link>
          <Link to="/catalog?category=kidswear" className="category">
            <FaChild className="category-icon" />
            <h3>Kidswear</h3>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default MensKidswearSection;
