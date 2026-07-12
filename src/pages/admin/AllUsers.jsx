import { useEffect, useState } from "react";
import { getAllUsers } from "../../api/adminApi";
import { getUserBookings } from "../../api/bookingApi";

function HistoryModal({ user, onClose }) {
  const [bookings, setBookings] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getUserBookings(user.id)
      .then(setBookings)
      .catch((err) => setError(err.response?.data?.message || "Failed to load history"));
  }, [user.id]);

  const totalSpent = bookings
    ?.filter((b) => b.status === "CONFIRMED")
    .reduce((sum, b) => sum + b.totalAmount, 0);

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-cinema-surface border border-cinema-border rounded-lg max-w-lg w-full p-6 max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-semibold">{user.name}</h3>
            <p className="text-sm text-cinema-muted">{user.email}</p>
          </div>
          <button onClick={onClose} className="text-cinema-muted hover:text-cinema-text">✕</button>
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}
        {!bookings && !error && <p className="text-cinema-muted text-sm">Loading…</p>}

        {bookings && (
          <>
            <p className="text-sm text-cinema-muted mb-4">
              {bookings.length} booking(s) · ₹{totalSpent} total spent (confirmed only)
            </p>
            {bookings.length === 0 ? (
              <p className="text-cinema-muted text-sm">No bookings yet.</p>
            ) : (
              <div className="space-y-3">
                {bookings.map((b) => (
                  <div key={b.bookingId} className="border border-cinema-border rounded p-3 flex justify-between items-center">
                    <div>
                      <p className="font-medium">{b.movieName}</p>
                      <p className="text-xs text-cinema-muted">
                        {b.seatsBooked} seat(s) · {new Date(b.bookingTime).toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-cinema-gold font-semibold">₹{b.totalAmount}</p>
                      <span className={`text-xs ${b.status === "CANCELLED" ? "text-cinema-red" : "text-cinema-green"}`}>
                        {b.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function AllUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [historyUser, setHistoryUser] = useState(null);

  useEffect(() => {
    getAllUsers().then((data) => {
      setUsers(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <p className="text-cinema-muted px-6 py-8">Loading…</p>;

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h2 className="font-display text-4xl text-cinema-gold mb-8 tracking-wide">ALL USERS</h2>

      <div className="bg-cinema-surface border border-cinema-border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-cinema-bg text-cinema-muted text-left">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t border-cinema-border">
                <td className="px-4 py-3">{u.name}</td>
                <td className="px-4 py-3">{u.email}</td>
                <td className="px-4 py-3">{u.phone}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded text-xs ${u.role === "ADMIN" ? "bg-cinema-gold text-cinema-bg" : "bg-cinema-border text-cinema-muted"}`}>
                    {u.role}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => setHistoryUser(u)}
                    className="text-xs text-cinema-gold underline hover:text-yellow-400"
                  >
                    View History
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {historyUser && <HistoryModal user={historyUser} onClose={() => setHistoryUser(null)} />}
    </div>
  );
}