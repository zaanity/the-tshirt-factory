// src/App.tsx
import { useState, useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import InitialPopup from "./components/InitialPopup";
import AppRoutes from "./AppRoutesWrapper"; // small wrapper we create below
import "./styles/global.css";
import "./styles/tokens.css";

const queryClient = new QueryClient();

export default function App() {
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const submitted = window.localStorage.getItem("popupSubmitted");
    if (!submitted) setShowPopup(true);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        {showPopup && <InitialPopup onClose={() => setShowPopup(false)} />}
        <AppRoutes />
      </Router>
    </QueryClientProvider>
  );
}
