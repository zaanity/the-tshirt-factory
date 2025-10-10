import React, { useEffect, useState } from "react";

const VisitorStats: React.FC = () => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";
    fetch(`${API_URL}/visitors`).then(r => r.json()).then(data => setCount(data.count));
  }, []);
  return (
    <section className="visitor-stats">
      <h2>Visitor Analytics</h2>
      <p>Unique Visitors: <strong>{count}</strong></p>
    </section>
  );
};
export default VisitorStats;