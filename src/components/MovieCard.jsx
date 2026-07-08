import { Link } from "react-router-dom";

export default function MovieCard({ movie }) {
  return (
    <div className="bg-cinema-surface border border-cinema-border rounded-lg p-5 flex flex-col gap-3 hover:border-cinema-gold transition">
      <h3 className="font-display text-2xl tracking-wide">{movie.movieName}</h3>
      <div className="flex gap-2 text-xs text-cinema-muted">
        <span className="bg-cinema-bg px-2 py-1 rounded border border-cinema-border">{movie.genre}</span>
        <span className="bg-cinema-bg px-2 py-1 rounded border border-cinema-border">{movie.language}</span>
        <span className="bg-cinema-bg px-2 py-1 rounded border border-cinema-border">{movie.duration} min</span>
      </div>
      <div className="flex items-center justify-between mt-2">
        <span className="text-cinema-gold font-semibold text-lg">₹{movie.ticketPrice}</span>
        <Link
          to={`/movies/${movie.id}`}
          className="bg-cinema-gold hover:bg-yellow-500 text-cinema-bg font-semibold px-4 py-1.5 rounded text-sm transition"
        >
          Book Seats
        </Link>
      </div>
    </div>
  );
}