import { useState } from "react";
import { useNavigate } from "react-router";

const Login = ({ setIsLoggedIn }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMsg("");
    const res = await fetch("http://localhost:3001/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (res.ok) {
      setIsLoggedIn(true);
      navigate("/");
    } else {
      setMsg(data.error || "Login failed");
    }
  };

  return (
    <div className="container mt-5" id="login">
      <h2>Login</h2>
      <div className="row login-form-container">
        <form onSubmit={handleLogin}>
          <div className="form-group mb-3">
            <label>Email address</label>
            <input
              type="email"
              className="form-control login-input"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group mb-3">
            <label>Password</label>
            <input
              type="password"
              className="form-control login-input"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Login
          </button>
          {msg && <div className="alert alert-danger mt-2">{msg}</div>}
        </form>
      </div>
    </div>
  );
};

export default Login;