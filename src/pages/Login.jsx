import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <form onSubmit={handleSubmit} className="bg-cinema-surface border border-cinema-border rounded-lg p-8 w-full max-w-sm">
        <h2 className="font-display text-3xl text-cinema-gold mb-6 text-center tracking-wide">SIGN IN</h2>

        {error && <p className="bg-red-950 text-red-300 text-sm rounded p-2 mb-4">{error}</p>}

        <label className="text-sm text-cinema-muted">Email</label>
        <input
          type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-cinema-bg border border-cinema-border rounded px-3 py-2 mt-1 mb-4 focus:outline-none focus:border-cinema-gold"
        />

        <label className="text-sm text-cinema-muted">Password</label>
        <input
          type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-cinema-bg border border-cinema-border rounded px-3 py-2 mt-1 mb-6 focus:outline-none focus:border-cinema-gold"
        />

        <button className="w-full bg-cinema-gold hover:bg-yellow-500 text-cinema-bg font-semibold py-2 rounded transition">
          Log In
        </button>

        <p className="text-center text-sm text-cinema-muted mt-4">
          No account? <Link to="/register" className="text-cinema-gold">Register</Link>
        </p>
      </form>
    </div>
  );
}