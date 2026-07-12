import { useEffect, useState } from "react";
import { getProfile, updateProfile, changePassword } from "../api/userApi";

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

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [profileMsg, setProfileMsg] = useState("");
  const [profileError, setProfileError] = useState("");
  const [profileBusy, setProfileBusy] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [pwMsg, setPwMsg] = useState("");
  const [pwError, setPwError] = useState("");
  const [pwBusy, setPwBusy] = useState(false);

  useEffect(() => {
    getProfile().then((data) => {
      setProfile(data);
      setName(data.name);
      setPhone(data.phone);
    });
  }, []);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileMsg("");
    setProfileError("");
    setProfileBusy(true);
    try {
      const updated = await updateProfile(name, phone);
      setProfile(updated);
      setProfileMsg("Profile updated");
    } catch (err) {
      setProfileError(err.response?.data?.message || "Could not update profile");
    } finally {
      setProfileBusy(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPwMsg("");
    setPwError("");

    if (newPassword !== confirmPassword) {
      setPwError("New passwords do not match");
      return;
    }

    setPwBusy(true);
    try {
      await changePassword(currentPassword, newPassword);
      setPwMsg("Password changed successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setPwError(err.response?.data?.message || "Could not change password");
    } finally {
      setPwBusy(false);
    }
  };

  if (!profile) return <p className="text-cinema-muted px-6 py-8">Loading…</p>;

  return (
    <div className="max-w-xl mx-auto px-6 py-10 space-y-10">
      <h2 className="font-display text-4xl text-cinema-gold mb-2 tracking-wide">MY PROFILE</h2>

      <form onSubmit={handleProfileSubmit} className="bg-cinema-surface border border-cinema-border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Personal Details</h3>

        {profileError && <p className="bg-red-950 text-red-300 text-sm rounded p-2 mb-4">{profileError}</p>}
        {profileMsg && <p className="bg-green-950 text-green-300 text-sm rounded p-2 mb-4">{profileMsg}</p>}

        <label className="text-sm text-cinema-muted">Name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full bg-cinema-bg border border-cinema-border rounded px-3 py-2 mt-1 mb-4 focus:outline-none focus:border-cinema-gold"
        />

        <label className="text-sm text-cinema-muted">Phone</label>
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          className="w-full bg-cinema-bg border border-cinema-border rounded px-3 py-2 mt-1 mb-4 focus:outline-none focus:border-cinema-gold"
        />

        <label className="text-sm text-cinema-muted">Email</label>
        <input
          value={profile.email}
          disabled
          className="w-full bg-cinema-bg border border-cinema-border rounded px-3 py-2 mt-1 mb-6 opacity-50 cursor-not-allowed"
        />

        <button
          disabled={profileBusy}
          className="bg-cinema-gold hover:bg-yellow-500 disabled:opacity-40 text-cinema-bg font-semibold px-6 py-2 rounded transition"
        >
          {profileBusy ? "Saving…" : "Save Changes"}
        </button>
      </form>

      <form onSubmit={handlePasswordSubmit} className="bg-cinema-surface border border-cinema-border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Change Password</h3>

        {pwError && <p className="bg-red-950 text-red-300 text-sm rounded p-2 mb-4">{pwError}</p>}
        {pwMsg && <p className="bg-green-950 text-green-300 text-sm rounded p-2 mb-4">{pwMsg}</p>}

        <label className="text-sm text-cinema-muted">Current Password</label>
        <input
          type="password"
          required
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          className="w-full bg-cinema-bg border border-cinema-border rounded px-3 py-2 mt-1 mb-4 focus:outline-none focus:border-cinema-gold"
        />

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

        <label className="text-sm text-cinema-muted">Confirm New Password</label>
        <input
          type={showPassword ? "text" : "password"}
          required
          minLength={6}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full bg-cinema-bg border border-cinema-border rounded px-3 py-2 mt-1 mb-6 focus:outline-none focus:border-cinema-gold"
        />

        <button
          disabled={pwBusy}
          className="bg-cinema-gold hover:bg-yellow-500 disabled:opacity-40 text-cinema-bg font-semibold px-6 py-2 rounded transition"
        >
          {pwBusy ? "Updating…" : "Change Password"}
        </button>
      </form>
    </div>
  );
}