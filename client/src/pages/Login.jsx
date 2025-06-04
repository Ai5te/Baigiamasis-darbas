import { useState } from "react";
import { useNavigate } from "react-router";

const Login = ({ setIsLoggedIn }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Replace this with real authentication
    if (username === "test1" && password === "test123") {
      setIsLoggedIn(true);
      navigate("/");
    } else {
      alert("Invalid credentials");
    }
  };

  return (

    <div className="container mt-5" id="login">
      <h2>Login</h2>
      <div className="row">
        <form onSubmit={handleLogin}> 
            <div className="form-group mb-3">
                <label>Email address</label>
                <input 
                    type="text"
                    className="form-control"
                    placeholder="Enter email"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
            </div>
            <div className="form-group mb-3">
                <label>Password</label>
                <input 
                    type="password" 
                    className="form-control"
                    placeholder="Enter password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </div>
            <button type="submit" className="btn btn-primary">Login</button>
        </form>
    </div>
    </div>
  );
}

export default Login;