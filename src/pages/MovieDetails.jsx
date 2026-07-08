import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getSeats } from "../api/movieApi";
import { lockSeats, bookTicket } from "../api/bookingApi";
import SeatMap from "../components/SeatMap";

export default function MovieDetails() {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const [seats, setSeats] = useState([]);
  const [selected, setSelected] = useState([]);
  const [locked, setLocked] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const loadSeats = async () => setSeats(await getSeats(movieId));

  useEffect(() => {
    loadSeats();
  }, [movieId]);

  const toggleSeat = (seatNumber) => {
    if (locked) return; // can't change selection after locking
    setSelected((prev) =>
      prev.includes(seatNumber) ? prev.filter((s) => s !== seatNumber) : [...prev, seatNumber]
    );
  };

  const handleLock = async () => {
    if (selected.length === 0) return;
    setError("");
    setBusy(true);
    try {
      await lockSeats(Number(movieId), selected);
      setLocked(true);
    } catch (err) {
      setError(err.response?.data?.message || "Could not lock seats - try different ones");
      loadSeats();
    } finally {
      setBusy(false);
    }
  };

  const handleConfirm = async () => {
    setError("");
    setBusy(true);
    try {
      const result = await bookTicket(Number(movieId), selected);
      navigate("/payment", { state: { bookingId: result.bookingId } });
    } catch (err) {
      setError(err.response?.data?.message || "Booking failed");
      setLocked(false);
      loadSeats();
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h2 className="font-display text-4xl text-cinema-gold mb-8 tracking-wide">SELECT YOUR SEATS</h2>

      {error && <p className="bg-red-950 text-red-300 text-sm rounded p-3 mb-6">{error}</p>}

      <SeatMap seats={seats} selectedSeats={selected} onToggle={toggleSeat} />

      <div className="mt-10 flex items-center justify-between bg-cinema-surface border border-cinema-border rounded-lg p-5">
        <div className="text-sm text-cinema-muted">
          {selected.length > 0 ? (
            <>Selected: <span className="text-cinema-text">{selected.join(", ")}</span></>
          ) : (
            "No seats selected"
          )}
          {locked && <p className="text-cinema-green mt-1">Seats locked - complete booking within 5 minutes</p>}
        </div>

        {!locked ? (
          <button
            disabled={selected.length === 0 || busy}
            onClick={handleLock}
            className="bg-cinema-gold hover:bg-yellow-500 disabled:opacity-40 text-cinema-bg font-semibold px-6 py-2 rounded transition"
          >
            {busy ? "Locking…" : "Lock Seats"}
          </button>
        ) : (
          <button
            disabled={busy}
            onClick={handleConfirm}
            className="bg-cinema-red hover:bg-red-700 disabled:opacity-40 text-white font-semibold px-6 py-2 rounded transition"
          >
            {busy ? "Booking…" : "Confirm Booking"}
          </button>
        )}
      </div>
    </div>
  );
}