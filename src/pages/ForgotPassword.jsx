import { useState } from "react";
import { Link } from "react-router-dom";
import { forgotPassword } from "../api/userApi";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await forgotPassword(email);
      setSent(true); // always show success, even if the email doesn't exist - don't leak account info
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="bg-cinema-surface border border-cinema-border rounded-lg p-8 w-full max-w-sm">
        <h2 className="font-display text-3xl text-cinema-gold mb-6 text-center tracking-wide">RESET PASSWORD</h2>

        {sent ? (
          <p className="text-cinema-green text-sm text-center">
            If an account exists for that email, a reset link has been sent. Check your inbox.
          </p>
        ) : (
          <form onSubmit={handleSubmit}>
            {error && <p className="bg-red-950 text-red-300 text-sm rounded p-2 mb-4">{error}</p>}

            <label className="text-sm text-cinema-muted">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-cinema-bg border border-cinema-border rounded px-3 py-2 mt-1 mb-6 focus:outline-none focus:border-cinema-gold"
            />

            <button
              disabled={busy}
              className="w-full bg-cinema-gold hover:bg-yellow-500 disabled:opacity-40 text-cinema-bg font-semibold py-2 rounded transition"
            >
              {busy ? "Sending…" : "Send Reset Link"}
            </button>
          </form>
        )}

        <p className="text-center text-sm text-cinema-muted mt-4">
          <Link to="/login" className="text-cinema-gold">Back to login</Link>
        </p>
      </div>
    </div>
  );
}