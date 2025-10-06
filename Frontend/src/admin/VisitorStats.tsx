import React, { useEffect, useState } from "react";

const VisitorStats: React.FC = () => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    fetch("/api/visitors").then(r => r.json()).then(data => setCount(data.count));
  }, []);
  return (
    <section className="visitor-stats">
      <h2>Visitor Analytics</h2>
      <p>Unique Visitors: <strong>{count}</strong></p>
    </section>
  );
};
export default VisitorStats;