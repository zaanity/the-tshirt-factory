import React, { useState } from "react";
import "./InitialPopup.css";

type Props = {
  onClose: () => void;
};

const InitialPopup: React.FC<Props> = ({ onClose }) => {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !contact.trim()) {
      setError("Please enter your name and email or phone.");
      return;
    }
    // Save to localStorage to prevent re-prompt
    window.localStorage.setItem("popupSubmitted", "true");

    // Optionally, POST to backend
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";
    await fetch(`${API_URL}/contacts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, contact }),
    });

    onClose();
  };

  return (
    <div className="popup-overlay">
      <form className="popup-modal" onSubmit={handleSubmit}>
        <h2>Welcome to The T-Shirt Factory</h2>
        <p>Please enter your details to access our wholesale collection.</p>
        <input
          placeholder="Your Name"
          value={name}
          onChange={e => setName(e.target.value)}
          className="popup-input"
        />
        <input
          placeholder="Email or Phone"
          value={contact}
          onChange={e => setContact(e.target.value)}
          className="popup-input"
        />
        {error && <div className="popup-error">{error}</div>}
        <button className="popup-btn" type="submit">
          Enter
        </button>
      </form>
    </div>
  );
};

export default InitialPopup;