import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../api/authApi";

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

export default function Register() {
  const [form, setForm] = useState({ name: "", phone: "", email: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      await register(form.name, form.phone, form.email, form.password);
      setSuccess(true);
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <form onSubmit={handleSubmit} className="bg-cinema-surface border border-cinema-border rounded-lg p-8 w-full max-w-sm">
        <h2 className="font-display text-3xl text-cinema-gold mb-6 text-center tracking-wide">CREATE ACCOUNT</h2>

        {error && <p className="bg-red-950 text-red-300 text-sm rounded p-2 mb-4">{error}</p>}
        {success && <p className="bg-green-950 text-green-300 text-sm rounded p-2 mb-4">Registered! Redirecting to login…</p>}

        {["name", "phone", "email"].map((field) => (
          <div key={field} className="mb-4">
            <label className="text-sm text-cinema-muted capitalize">{field}</label>
            <input
              type="text"
              required
              value={form[field]}
              onChange={update(field)}
              className="w-full bg-cinema-bg border border-cinema-border rounded px-3 py-2 mt-1 focus:outline-none focus:border-cinema-gold"
            />
          </div>
        ))}

        <div className="mb-4">
          <label className="text-sm text-cinema-muted">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              required
              value={form.password}
              onChange={update("password")}
              className="w-full bg-cinema-bg border border-cinema-border rounded px-3 py-2 pr-10 mt-1 focus:outline-none focus:border-cinema-gold"
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
        </div>

        <div className="mb-4">
          <label className="text-sm text-cinema-muted">Confirm Password</label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              required
              value={form.confirmPassword}
              onChange={update("confirmPassword")}
              className="w-full bg-cinema-bg border border-cinema-border rounded px-3 py-2 pr-10 mt-1 focus:outline-none focus:border-cinema-gold"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-cinema-muted hover:text-cinema-gold"
              tabIndex={-1}
            >
              <EyeIcon open={showConfirmPassword} />
            </button>
          </div>
        </div>

        <button className="w-full bg-cinema-gold hover:bg-yellow-500 text-cinema-bg font-semibold py-2 rounded transition mt-2">
          Register
        </button>

        <p className="text-center text-sm text-cinema-muted mt-4">
          Already have an account? <Link to="/login" className="text-cinema-gold">Log in</Link>
        </p>
      </form>
    </div>
  );
}