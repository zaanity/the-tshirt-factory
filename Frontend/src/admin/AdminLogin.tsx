// import React, { useState } from "react";
// import { useAuth } from "../hooks/useAuth";
// import "./Admin.css";

// const AdminLogin: React.FC = () => {
//   const { login, error } = useAuth();
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
  
//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     login(username, password);
//   };
  
//   return (
//     <div className="admin-login">
//       <form onSubmit={handleSubmit}>
//         <h2>Admin Login</h2>
//         <input placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
//         <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
//         {error && <div className="admin-error">{error}</div>}
//         <button type="submit">Login</button>
//       </form>
//     </div>
//   );
// };

// export default AdminLogin;

// src/admin/AdminLogin.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import "./Admin.css";

const AdminLogin: React.FC = () => {
  const auth = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await auth.login(username.trim(), password);
      // on success, go to dashboard
      navigate("/admin");
    } catch (err: any) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setError(err.message || "Login failed");
    }
  };

  return (
    <div className="admin-login">
      <form onSubmit={handleSubmit}>
        <h2>Admin Login</h2>
        <input placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
        {error && <div className="admin-error">{error}</div>}
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default AdminLogin;
