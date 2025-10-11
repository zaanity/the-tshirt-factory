import React, { useState, useEffect } from "react";
import "./ProductCard.css";

type Props = {
  product: {
    id: string;
    name: string;
    image: string;
    images?: string[];
    moq: number;
    sizesAvailable?: string[];
    priceTiers: { minQty: number; price: number }[];
  };
};

const ProductCard: React.FC<Props> = React.memo(({ product }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(0);

  const lowestPrice = product.priceTiers.length > 0 ? Math.min(...product.priceTiers.map(tier => tier.price)) : 0;

  // Get all images (fallback to single image if no images array)
  const images = product.images && product.images.length > 0 ? product.images : [product.image];
  const currentImage = images[currentImageIndex];

  // Your WhatsApp and Email contact info
  const whatsappNumber = "+918982511109"; // e.g. "+1234567890"
  const emailAddress = "thetshirtfactory2003@gmail.com";

  // Message for enquiry
  const enquiryMessage = encodeURIComponent(
    `I am interested in the product:\nName: ${product.name}\nImage: ${currentImage}`
  );

  // WhatsApp and Email URLs
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${enquiryMessage}`;
  const emailUrl = `mailto:${emailAddress}?subject=Product Enquiry&body=${enquiryMessage}`;

  // Auto-slideshow effect with smooth slide transition
  useEffect(() => {
    if (images.length <= 1 || isHovered) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 3500); // Change image every 3.5 seconds

    return () => clearInterval(interval);
  }, [images.length, isHovered]);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="product-card">
      <div
        className="product-image-container"
        style={{ position: "relative" }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <img
          src={images[currentImageIndex].startsWith('http') ? images[currentImageIndex] : `/assets/${images[currentImageIndex]}`}
          alt={product.name}
          className="product-img fade-in"
          key={currentImageIndex}
          loading="lazy"
          onClick={(e) => {
            e.preventDefault();
            setModalImageIndex(currentImageIndex);
            setShowModal(true);
          }}
          style={{ cursor: "pointer" }}
        />
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  prevImage();
                }}
                className="carousel-button prev"
                aria-label="Previous Image"
                style={{
                  position: "absolute",
                  top: "50%",
                  left: 8,
                  transform: "translateY(-50%)",
                  backgroundColor: "rgba(0,0,0,0.5)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "50%",
                  width: 30,
                  height: 30,
                  cursor: "pointer",
                  zIndex: 1,
                }}
              >
                ‹
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  nextImage();
                }}
                className="carousel-button next"
                aria-label="Next Image"
                style={{
                  position: "absolute",
                  top: "50%",
                  right: 8,
                  transform: "translateY(-50%)",
                  backgroundColor: "rgba(0,0,0,0.5)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "50%",
                  width: 30,
                  height: 30,
                  cursor: "pointer",
                  zIndex: 1,
                }}
              >
                ›
              </button>
            </>
          )}
          <div className="product-overlay">
            <div className="product-badges">
              {/*
              {product.stock < 10 && (
                <span className="badge low-stock">Low Stock</span>
              )}
              */}
              {product.priceTiers.length > 1 && (
                <span className="badge bulk-discount">Bulk Discount</span>
              )}
            </div>
          </div>
        </div>
        <div className="product-info">
          <h3 className="product-name">{product.name}</h3>
          <div className="product-price">
            <span className="price-amount">From ₹{lowestPrice.toFixed(2)}</span>
            <span className="price-unit">/unit</span>
          </div>
        </div>

      <div className="product-meta">
        <div className="meta-item">
          <span className="meta-label">MOQ</span>
          <span className="meta-value">{product.moq}</span>
        </div>
        <div className="meta-item">
          <span className="meta-label">Sizes Available</span>
          <span className="meta-value">{Array.isArray(product.sizesAvailable) ? product.sizesAvailable.join(", ") : "N/A"}</span>
        </div>
      </div>

      <div className="product-actions">
        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn enquiry-btn primary">
          Enquire Now via WhatsApp
        </a>
        <a href={emailUrl} target="_blank" rel="noopener noreferrer" className="btn enquiry-btn primary">
          Enquire Now via Email
        </a>
      </div>

      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
          onClick={() => setShowModal(false)}
        >
          <div
            style={{
              position: "relative",
              maxWidth: "90vw",
              maxHeight: "90vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={images[modalImageIndex].startsWith('http') ? images[modalImageIndex] : `/assets/${images[modalImageIndex]}`}
              alt={product.name}
              style={{
                maxWidth: "100%",
                maxHeight: "100%",
                objectFit: "contain",
              }}
            />

            {images.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setModalImageIndex((prev) => (prev - 1 + images.length) % images.length);
                  }}
                  style={{
                    position: "absolute",
                    left: 20,
                    top: "50%",
                    transform: "translateY(-50%)",
                    backgroundColor: "rgba(0,0,0,0.5)",
                    color: "#fff",
                    border: "none",
                    borderRadius: "50%",
                    width: 50,
                    height: 50,
                    fontSize: "24px",
                    cursor: "pointer",
                    zIndex: 1,
                  }}
                  aria-label="Previous Image"
                >
                  ‹
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setModalImageIndex((prev) => (prev + 1) % images.length);
                  }}
                  style={{
                    position: "absolute",
                    right: 20,
                    top: "50%",
                    transform: "translateY(-50%)",
                    backgroundColor: "rgba(0,0,0,0.5)",
                    color: "#fff",
                    border: "none",
                    borderRadius: "50%",
                    width: 50,
                    height: 50,
                    fontSize: "24px",
                    cursor: "pointer",
                    zIndex: 1,
                  }}
                  aria-label="Next Image"
                >
                  ›
                </button>
              </>
            )}

            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowModal(false);
              }}
              style={{
                position: "absolute",
                top: 20,
                right: 20,
                backgroundColor: "rgba(0,0,0,0.5)",
                color: "#fff",
                border: "none",
                borderRadius: "50%",
                width: 40,
                height: 40,
                fontSize: "20px",
                cursor: "pointer",
                zIndex: 1,
              }}
              aria-label="Close Modal"
            >
              ×
            </button>

            {images.length > 1 && (
              <div
                style={{
                  position: "absolute",
                  bottom: 20,
                  left: "50%",
                  transform: "translateX(-50%)",
                  display: "flex",
                  gap: "10px",
                }}
              >
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation();
                      setModalImageIndex(index);
                    }}
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: "50%",
                      border: "none",
                      backgroundColor: index === modalImageIndex ? "#fff" : "rgba(255,255,255,0.5)",
                      cursor: "pointer",
                    }}
                    aria-label={`Go to image ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
});

export default ProductCard;
