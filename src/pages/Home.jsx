import { useEffect, useState } from "react";
import { getMovies, searchMovies } from "../api/movieApi";
import MovieCard from "../components/MovieCard";

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [filters, setFilters] = useState({ movieName: "", genre: "", language: "" });
  const [loading, setLoading] = useState(true);

  const loadAll = async () => {
    setLoading(true);
    setMovies(await getMovies());
    setLoading(false);
  };

  useEffect(() => {
    loadAll();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    const cleaned = Object.fromEntries(
      Object.entries(filters).filter(([, v]) => v !== "")
    );
    setMovies(await searchMovies(cleaned));
    setLoading(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <form onSubmit={handleSearch} className="flex flex-wrap gap-3 mb-8">
        <input
          placeholder="Movie name" value={filters.movieName}
          onChange={(e) => setFilters({ ...filters, movieName: e.target.value })}
          className="bg-cinema-surface border border-cinema-border rounded px-3 py-2 text-sm focus:outline-none focus:border-cinema-gold"
        />
        <input
          placeholder="Genre" value={filters.genre}
          onChange={(e) => setFilters({ ...filters, genre: e.target.value })}
          className="bg-cinema-surface border border-cinema-border rounded px-3 py-2 text-sm focus:outline-none focus:border-cinema-gold"
        />
        <input
          placeholder="Language" value={filters.language}
          onChange={(e) => setFilters({ ...filters, language: e.target.value })}
          className="bg-cinema-surface border border-cinema-border rounded px-3 py-2 text-sm focus:outline-none focus:border-cinema-gold"
        />
        <button className="bg-cinema-gold text-cinema-bg font-semibold px-4 py-2 rounded text-sm">Search</button>
        <button type="button" onClick={loadAll} className="border border-cinema-border px-4 py-2 rounded text-sm text-cinema-muted">
          Reset
        </button>
      </form>

      {loading ? (
        <p className="text-cinema-muted">Loading movies…</p>
      ) : movies.length === 0 ? (
        <p className="text-cinema-muted">No movies match your search.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {movies.map((m) => <MovieCard key={m.id} movie={m} />)}
        </div>
      )}
    </div>
  );
}