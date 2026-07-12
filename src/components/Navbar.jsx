import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav className="bg-cinema-surface border-b border-cinema-border px-6 py-4 flex items-center justify-between">
      <Link to="/" className="font-display text-3xl tracking-wide text-cinema-gold">
        NOW SHOWING
      </Link>

      <div className="flex items-center gap-6 text-sm font-medium text-cinema-muted">
        <Link to="/" className="hover:text-cinema-text transition">Movies</Link>

        {user && (
          <Link to="/my-bookings" className="hover:text-cinema-text transition">My Bookings</Link>
        )}

        {isAdmin && (
          <>
            <Link to="/admin/dashboard" className="hover:text-cinema-text transition">Dashboard</Link>
            <Link to="/admin/add-movie" className="hover:text-cinema-text transition">Add Movie</Link>
            <Link to="/admin/users" className="hover:text-cinema-text transition">Users</Link>
            <Link to="/admin/bookings" className="hover:text-cinema-text transition">All Bookings</Link>
          </>
        )}

        {user ? (
          <div className="flex items-center gap-4">
            <Link to="/profile" className="text-cinema-text hover:text-cinema-gold transition">{user.name}</Link>
            <button
              onClick={handleLogout}
              className="bg-cinema-red hover:bg-red-700 text-white px-4 py-1.5 rounded transition"
            >
              Logout
            </button>
          </div>
        ) : (
          <Link
            to="/login"
            className="bg-cinema-gold hover:bg-yellow-500 text-cinema-bg font-semibold px-4 py-1.5 rounded transition"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}