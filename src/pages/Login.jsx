import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function EyeIcon({ open }) {
  return open ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17.94 17.94A10.94 10.94 0 0 1 12 19c-7 0-11-7-11-7a19.7 19.7 0 0 1 4.22-5.34M9.9 4.24A9.87 9.87 0 0 1 12 4c7 0 11 7 11 7a19.7 19.7 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
        <div className="relative mt-1 mb-2">
          <input
            type={showPassword ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-cinema-bg border border-cinema-border rounded px-3 py-2 pr-10 focus:outline-none focus:border-cinema-gold"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-cinema-muted hover:text-cinema-gold"
            tabIndex={-1}
          >
            <EyeIcon open={showPassword} />
          </button>
        </div>

        <div className="text-right mb-6">
          <Link to="/forgot-password" className="text-xs text-cinema-muted hover:text-cinema-gold">Forgot password?</Link>
        </div>

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