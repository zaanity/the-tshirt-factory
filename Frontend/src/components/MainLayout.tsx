// src/components/MainLayout.tsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./MainLayout.css";

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <div className="main-layout">
      <header className="header">
        <div className="container">
          <Link className="logo" to="/" onClick={closeMenu}>
            <video
              src="/assets/Video_Conversion_to_Portrait_Ratio.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="logo-video"
            />
          </Link>
          <nav className="nav">
            <Link to="/catalog" className="nav-link">Catalog</Link>
            <Link to="/about" className="nav-link">About</Link>
            <Link to="/contact" className="nav-link">Contact</Link>
          </nav>
          <button className={`hamburger ${isMenuOpen ? 'open' : ''}`} onClick={toggleMenu} aria-label="Toggle menu">
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
          </button>
        </div>
      </header>
      {isMenuOpen && (
        <div className="mobile-menu-overlay" onClick={closeMenu}>
          <nav className="mobile-nav">
            <Link to="/catalog" className="mobile-nav-link" onClick={closeMenu}>Catalog</Link>
            <Link to="/about" className="mobile-nav-link" onClick={closeMenu}>About</Link>
            <Link to="/contact" className="mobile-nav-link" onClick={closeMenu}>Contact</Link>
          </nav>
        </div>
      )}
      <main className="main">
        <div className="container">
          {children}
        </div>
      </main>
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h4>About Us</h4>
              <p>Premium wholesale t-shirts and apparel for modern retailers.</p>
            </div>
            <div className="footer-section">
              <h4>Quick Links</h4>
              <ul>
                <li><Link to="/catalog">Catalog</Link></li>
                <li><Link to="/about">About</Link></li>
                <li><Link to="/contact">Contact</Link></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Contact</h4>
              <p>thetshirtfactory2003@gmail.com</p>
              <p>+91 8982511109</p>
              <div className="store-locator">
                <p>Visit our warehouse for wholesale inquiries.</p>
                <p>Address: 2F, Scheme no. 54, Near Kasturi Sabhagrah, Vijay Nagar, Indore, M.P.</p>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} The T-Shirt Factory. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
