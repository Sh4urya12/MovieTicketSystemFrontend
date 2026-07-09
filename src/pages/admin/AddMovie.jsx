import { useState } from "react";
import { addMovie } from "../../api/movieApi";

export default function AddMovie() {
  const [form, setForm] = useState({
    movieName: "", genre: "", duration: "", language: "", ticketPrice: "", totalSeats: ""
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      await addMovie({
        ...form,
        duration: Number(form.duration),
        ticketPrice: Number(form.ticketPrice),
        totalSeats: Number(form.totalSeats),  
      });
      setMessage("Movie added successfully");
      setForm({ movieName: "", genre: "", duration: "", language: "", ticketPrice: "", totalSeats: "" });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add movie");
    }
  };

  return (
    <div className="max-w-md mx-auto px-6 py-10">
      <h2 className="font-display text-3xl text-cinema-gold mb-6 tracking-wide">ADD MOVIE</h2>

      {error && <p className="bg-red-950 text-red-300 text-sm rounded p-3 mb-4">{error}</p>}
      {message && <p className="bg-green-950 text-green-300 text-sm rounded p-3 mb-4">{message}</p>}

      <form onSubmit={handleSubmit} className="bg-cinema-surface border border-cinema-border rounded-lg p-6 space-y-4">
        <div>
          <label className="text-sm text-cinema-muted">Movie Name</label>
          <input required value={form.movieName} onChange={update("movieName")} className="w-full bg-cinema-bg border border-cinema-border rounded px-3 py-2 mt-1" />
        </div>
        <div>
          <label className="text-sm text-cinema-muted">Genre</label>
          <input required value={form.genre} onChange={update("genre")} className="w-full bg-cinema-bg border border-cinema-border rounded px-3 py-2 mt-1" />
        </div>
        <div>
          <label className="text-sm text-cinema-muted">Duration (minutes)</label>
          <input required type="number" value={form.duration} onChange={update("duration")} className="w-full bg-cinema-bg border border-cinema-border rounded px-3 py-2 mt-1" />
        </div>
        <div>
          <label className="text-sm text-cinema-muted">Language</label>
          <input required value={form.language} onChange={update("language")} className="w-full bg-cinema-bg border border-cinema-border rounded px-3 py-2 mt-1" />
        </div>
        <div>
          <label className="text-sm text-cinema-muted">Ticket Price (₹)</label>
          <input required type="number" step="0.01" value={form.ticketPrice} onChange={update("ticketPrice")} className="w-full bg-cinema-bg border border-cinema-border rounded px-3 py-2 mt-1" />
        </div>
        <div>
          <label className="text-sm text-cinema-muted">Total Seats</label>
          <input required type="number" min="1" max="260" value={form.totalSeats} onChange={update("totalSeats")} className="w-full bg-cinema-bg border border-cinema-border rounded px-3 py-2 mt-1" />
        </div>
        <button className="w-full bg-cinema-gold hover:bg-yellow-500 text-cinema-bg font-semibold py-2 rounded transition">
          Add Movie
        </button>
      </form>
    </div>
  );
}
