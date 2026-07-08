import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../api/authApi";

export default function Register() {
  const [form, setForm] = useState({ name: "", phone: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
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

        {["name", "phone", "email", "password"].map((field) => (
          <div key={field} className="mb-4">
            <label className="text-sm text-cinema-muted capitalize">{field}</label>
            <input
              type={field === "password" ? "password" : "text"}
              required
              value={form[field]}
              onChange={update(field)}
              className="w-full bg-cinema-bg border border-cinema-border rounded px-3 py-2 mt-1 focus:outline-none focus:border-cinema-gold"
            />
          </div>
        ))}

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