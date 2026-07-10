import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getSeats } from "../api/movieApi";
import { lockSeats, bookTicket } from "../api/bookingApi";
import SeatMap from "../components/SeatMap";
import ReviewSection from "../components/ReviewSection";
import { useAuth } from "../context/AuthContext";

export default function MovieDetails() {
  const { user } = useAuth();
  const { movieId } = useParams();
  const navigate = useNavigate();
  const [tab, setTab] = useState("book"); // "book" | "reviews"
  const [seatMap, setSeatMap] = useState({ seats: [], totalSeats: null, availableSeats: null });
  const [seatCount, setSeatCount] = useState(null);
  const [selected, setSelected] = useState([]);
  const [locked, setLocked] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const loadSeats = async () => {
    const data = await getSeats(movieId);
    setSeatMap(data);

    if (locked) return;

    setSelected((prev) =>
      prev.filter((sn) => {
        const s = data.seats.find((x) => x.seatNumber === sn);
        return s && s.status === "AVAILABLE";
      })
    );
  };

  useEffect(() => {
    loadSeats();
    if (locked) return;
    const interval = setInterval(loadSeats, 5000);
    return () => clearInterval(interval);
  }, [movieId, locked]);

  const maxSelectable = Math.min(10, seatMap.availableSeats ?? 10);

  const toggleSeat = (seatNumber) => {
    if (locked || !seatCount) return;
    setSelected((prev) => {
      if (prev.includes(seatNumber)) return prev.filter((s) => s !== seatNumber);
      if (prev.length >= seatCount) return prev;
      return [...prev, seatNumber];
    });
  };

  const handleLock = async () => {
    if (selected.length !== seatCount) return;
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

  const changeSeatCount = () => {
    if (locked) return;
    setSeatCount(null);
    setSelected([]);
    setError("");
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <div className="flex gap-2 mb-8 border-b border-cinema-border">
        <button
          onClick={() => setTab("book")}
          className={`px-5 py-3 font-display text-lg tracking-wide border-b-2 transition ${
            tab === "book" ? "border-cinema-gold text-cinema-gold" : "border-transparent text-cinema-muted hover:text-cinema-text"
          }`}
        >
          BOOK TICKETS
        </button>
        <button
          onClick={() => setTab("reviews")}
          className={`px-5 py-3 font-display text-lg tracking-wide border-b-2 transition ${
            tab === "reviews" ? "border-cinema-gold text-cinema-gold" : "border-transparent text-cinema-muted hover:text-cinema-text"
          }`}
        >
          REVIEWS
        </button>
      </div>

      {tab === "book" ? (
        <>
          {error && <p className="bg-red-950 text-red-300 text-sm rounded p-3 mb-6">{error}</p>}

          {seatCount === null ? (
            <div className="bg-cinema-surface border border-cinema-border rounded-lg p-8 text-center max-w-md mx-auto">
              <p className="text-lg mb-1">How many seats would you like?</p>
              <p className="text-sm text-cinema-muted mb-6">Choose 1 to {maxSelectable}</p>
              <div className="grid grid-cols-5 gap-3">
                {Array.from({ length: maxSelectable }, (_, i) => i + 1).map((n) => (
                  <button
                    key={n}
                    onClick={() => setSeatCount(n)}
                    className="aspect-square rounded-lg border border-cinema-border bg-cinema-bg hover:border-cinema-gold hover:text-cinema-gold font-semibold text-lg transition"
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-cinema-muted">
                  Booking <span className="text-cinema-gold font-semibold">{seatCount}</span> seat{seatCount > 1 ? "s" : ""}
                </p>
                {!locked && (
                  <button onClick={changeSeatCount} className="text-xs text-cinema-muted hover:text-cinema-gold underline">
                    Change seat count
                  </button>
                )}
              </div>

              <SeatMap
                seats={seatMap.seats}
                selectedSeats={selected}
                onToggle={toggleSeat}
                availableSeats={seatMap.availableSeats}
                totalSeats={seatMap.totalSeats}
              />

              <div className="mt-10 flex items-center justify-between bg-cinema-surface border border-cinema-border rounded-lg p-5">
                <div className="text-sm text-cinema-muted">
                  {selected.length > 0 ? (
                    <>Selected ({selected.length}/{seatCount}): <span className="text-cinema-text">{selected.join(", ")}</span></>
                  ) : (
                    `Select ${seatCount} seat${seatCount > 1 ? "s" : ""} from the map above`
                  )}
                  {locked && <p className="text-cinema-green mt-1">Seats locked - complete booking within 5 minutes</p>}
                </div>

                {!locked ? (
                  <button
                    disabled={selected.length !== seatCount || busy}
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
            </>
          )}
        </>
      ) : (
        <ReviewSection
          movieId={Number(movieId)}
          currentUserEmail={user?.email}
        />
      )}
    </div>
  );
}