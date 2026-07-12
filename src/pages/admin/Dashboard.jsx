import { useEffect, useState } from "react";
import { getDashboard } from "../../api/adminApi";

function StatCard({ label, value }) {
  return (
    <div className="bg-cinema-surface border border-cinema-border rounded-lg p-5">
      <p className="text-xs text-cinema-muted mb-1">{label}</p>
      <p className="text-2xl font-semibold text-cinema-gold">{value}</p>
    </div>
  );
}

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getDashboard()
      .then(setData)
      .catch((err) => setError(err.response?.data?.message || "Failed to load dashboard"));
  }, []);

  if (error) return <p className="text-red-400 px-6 py-8">{error}</p>;
  if (!data) return <p className="text-cinema-muted px-6 py-8">Loading…</p>;

  const maxDailyRevenue = Math.max(...data.revenueLast7Days.map((d) => d.revenue), 1);
  const maxMovieBookings = Math.max(...data.topMovies.map((m) => m.bookingsCount), 1);

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <h2 className="font-display text-4xl text-cinema-gold mb-8 tracking-wide">ADMIN DASHBOARD</h2>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
        <StatCard label="Total Revenue" value={`₹${data.totalRevenue.toLocaleString()}`} />
        <StatCard label="Total Bookings" value={data.totalBookings} />
        <StatCard label="Today's Bookings" value={data.todaysBookings} />
        <StatCard label="Total Users" value={data.totalUsers} />
        <StatCard label="Total Movies" value={data.totalMovies} />
        <StatCard label="Cancelled Bookings" value={data.cancelledBookings} />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-cinema-surface border border-cinema-border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Revenue - Last 7 Days</h3>
          <div className="flex items-end gap-3 h-40">
            {data.revenueLast7Days.map((d) => (
              <div key={d.date} className="flex-1 flex flex-col items-center gap-2">
                <div
                  className="w-full bg-cinema-gold rounded-t"
                  style={{ height: `${Math.max((d.revenue / maxDailyRevenue) * 100, 2)}%` }}
                  title={`₹${d.revenue}`}
                />
                <span className="text-[10px] text-cinema-muted">{d.date.slice(5)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-cinema-surface border border-cinema-border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Top Movies</h3>
          {data.topMovies.length === 0 ? (
            <p className="text-cinema-muted text-sm">No bookings yet.</p>
          ) : (
            <div className="space-y-3">
              {data.topMovies.map((m) => (
                <div key={m.movieName}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{m.movieName}</span>
                    <span className="text-cinema-muted">{m.bookingsCount} bookings · ₹{m.revenue}</span>
                  </div>
                  <div className="w-full bg-cinema-bg rounded h-2">
                    <div
                      className="bg-cinema-gold h-2 rounded"
                      style={{ width: `${(m.bookingsCount / maxMovieBookings) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}