import { useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { resetPassword } from "../api/userApi";

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

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setBusy(true);
    try {
      await resetPassword(token, newPassword);
      setSuccess(true);
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Could not reset password - the link may have expired");
    } finally {
      setBusy(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <p className="text-red-400">Missing or invalid reset link. <Link to="/forgot-password" className="text-cinema-gold underline">Request a new one</Link></p>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <form onSubmit={handleSubmit} className="bg-cinema-surface border border-cinema-border rounded-lg p-8 w-full max-w-sm">
        <h2 className="font-display text-3xl text-cinema-gold mb-6 text-center tracking-wide">NEW PASSWORD</h2>

        {error && <p className="bg-red-950 text-red-300 text-sm rounded p-2 mb-4">{error}</p>}
        {success && <p className="bg-green-950 text-green-300 text-sm rounded p-2 mb-4">Password updated! Redirecting to login…</p>}

        <label className="text-sm text-cinema-muted">New Password</label>
        <div className="relative mt-1 mb-4">
          <input
            type={showPassword ? "text" : "password"}
            required
            minLength={6}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full bg-cinema-bg border border-cinema-border rounded px-3 py-2 pr-10 focus:outline-none focus:border-cinema-gold"
          />
          <button type="button" onClick={() => setShowPassword((v) => !v)} tabIndex={-1}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-cinema-muted hover:text-cinema-gold">
            <EyeIcon open={showPassword} />
          </button>
        </div>

        <label className="text-sm text-cinema-muted">Confirm Password</label>
        <input
          type={showPassword ? "text" : "password"}
          required
          minLength={6}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full bg-cinema-bg border border-cinema-border rounded px-3 py-2 mt-1 mb-6 focus:outline-none focus:border-cinema-gold"
        />

        <button
          disabled={busy}
          className="w-full bg-cinema-gold hover:bg-yellow-500 disabled:opacity-40 text-cinema-bg font-semibold py-2 rounded transition"
        >
          {busy ? "Updating…" : "Update Password"}
        </button>
      </form>
    </div>
  );
}