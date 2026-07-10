import { useEffect, useState } from "react";
import { getAllBookings } from "../../api/bookingApi";

export default function AllBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllBookings().then((data) => {
      setBookings(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <p className="text-cinema-muted px-6 py-8">Loading…</p>;

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h2 className="font-display text-4xl text-cinema-gold mb-8 tracking-wide">ALL BOOKINGS</h2>

      {bookings.length === 0 ? (
        <p className="text-cinema-muted">No bookings yet.</p>
      ) : (
        <div className="space-y-4">
          {bookings.map((b) => (
            <div key={b.bookingId} className="bg-cinema-surface border border-cinema-border rounded-lg p-5 flex justify-between items-center">
              <div>
                <p className="font-semibold text-lg">{b.movieName}</p>
                <p className="text-sm text-cinema-muted">{b.userName} · {b.seatsBooked} seat(s) · {new Date(b.bookingTime).toLocaleString()}</p>
              </div>
              <p className="text-cinema-gold font-semibold text-lg">₹{b.totalAmount}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}