// src/App.tsx
import { useState, useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";

import InitialPopup from "./components/InitialPopup";
import AppRoutes from "./AppRoutesWrapper"; // small wrapper we create below
import "./styles/global.css";
import "./styles/tokens.css";

export default function App() {
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const submitted = window.localStorage.getItem("popupSubmitted");
    if (!submitted) setShowPopup(true);
  }, []);

  return (
    <Router>
      {showPopup && <InitialPopup onClose={() => setShowPopup(false)} />}
      <AppRoutes onClosePopup={() => setShowPopup(false)} />
    </Router>
  );
}
