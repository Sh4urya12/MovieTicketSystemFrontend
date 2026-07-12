import { useEffect, useState } from "react";
import { getBookings, cancelBooking } from "../api/bookingApi";
import Ticket from "../components/Ticket";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ticketBooking, setTicketBooking] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);
  const [error, setError] = useState("");

  const load = () => {
    getBookings().then((data) => {
      setBookings(data);
      setLoading(false);
    });
  };

  useEffect(() => {
    load();
  }, []);

  const handleCancel = async (bookingId) => {
    if (!confirm("Cancel this booking? This will release the seats and cannot be undone.")) return;
    setError("");
    setCancellingId(bookingId);
    try {
      await cancelBooking(bookingId);
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Could not cancel booking");
    } finally {
      setCancellingId(null);
    }
  };

  if (loading) return <p className="text-cinema-muted px-6 py-8">Loading…</p>;

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h2 className="font-display text-4xl text-cinema-gold mb-8 tracking-wide">MY BOOKINGS</h2>

      {error && <p className="bg-red-950 text-red-300 text-sm rounded p-3 mb-4">{error}</p>}

      {bookings.length === 0 ? (
        <p className="text-cinema-muted">No bookings yet.</p>
      ) : (
        <div className="space-y-4">
          {bookings.map((b) => (
            <div key={b.bookingId} className="bg-cinema-surface border border-cinema-border rounded-lg p-5 flex justify-between items-center">
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-lg">{b.movieName}</p>
                  <span className={`text-xs px-2 py-0.5 rounded ${b.status === "CANCELLED" ? "bg-cinema-red/20 text-cinema-red" : "bg-cinema-green/20 text-cinema-green"}`}>
                    {b.status}
                  </span>
                </div>
                <p className="text-sm text-cinema-muted">{b.userName} · {b.seatsBooked} seat(s) · {new Date(b.bookingTime).toLocaleString()}</p>
                <div className="flex gap-4 mt-1">
                  <button onClick={() => setTicketBooking(b)} className="text-xs text-cinema-gold underline hover:text-yellow-400">
                    View Ticket
                  </button>
                  {b.status !== "CANCELLED" && (
                    <button
                      onClick={() => handleCancel(b.bookingId)}
                      disabled={cancellingId === b.bookingId}
                      className="text-xs text-cinema-red underline hover:text-red-400 disabled:opacity-40"
                    >
                      {cancellingId === b.bookingId ? "Cancelling…" : "Cancel Booking"}
                    </button>
                  )}
                </div>
              </div>
              <p className="text-cinema-gold font-semibold text-lg">₹{b.totalAmount}</p>
            </div>
          ))}
        </div>
      )}

      {ticketBooking && (
        <Ticket booking={ticketBooking} onClose={() => setTicketBooking(null)} />
      )}
    </div>
  );
}