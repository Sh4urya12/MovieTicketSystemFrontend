import { useEffect, useState } from "react";
import { getReviews, addReview, updateReview, deleteReview } from "../api/reviewApi";
import StarRating from "./StarRating";

export default function ReviewSection({ movieId, currentUserEmail }) {
  const [data, setData] = useState({ reviews: [], averageRating: 0, totalReviews: 0, totalPages: 1 });
  const [page, setPage] = useState(0);
  const [sortBy, setSortBy] = useState("recent");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  const load = async () => setData(await getReviews(movieId, page, sortBy));

  useEffect(() => { load(); }, [movieId, page, sortBy]);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (editingId) {
        await updateReview(movieId, editingId, rating, comment);
      } else {
        await addReview(movieId, rating, comment);
      }
      setRating(0);
      setComment("");
      setEditingId(null);
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Could not submit review");
    }
  };

  const startEdit = (review) => {
    setEditingId(review.id);
    setRating(review.rating);
    setComment(review.comment || "");
  };

  const remove = async (reviewId) => {
    await deleteReview(movieId, reviewId);
    load();
  };

  return (
    <div className="mt-12">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-display text-2xl text-cinema-gold tracking-wide">RATINGS & REVIEWS</h3>
          <p className="text-sm text-cinema-muted mt-1">
            {data.averageRating?.toFixed(1) ?? "—"} ★ · {data.totalReviews} review{data.totalReviews === 1 ? "" : "s"}
          </p>
        </div>
        <select
          value={sortBy}
          onChange={(e) => { setSortBy(e.target.value); setPage(0); }}
          className="bg-cinema-surface border border-cinema-border rounded px-3 py-1.5 text-sm"
        >
          <option value="recent">Most recent</option>
          <option value="highest">Highest rated</option>
          <option value="lowest">Lowest rated</option>
        </select>
      </div>

      <form onSubmit={submit} className="bg-cinema-surface border border-cinema-border rounded-lg p-5 mb-8">
        <p className="text-sm text-cinema-muted mb-2">{editingId ? "Edit your review" : "Write a review"}</p>
        <StarRating value={rating} onChange={setRating} size="text-2xl" />
        {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          maxLength={1000}
          placeholder="Share your thoughts (optional)"
          className="w-full mt-3 bg-cinema-bg border border-cinema-border rounded px-3 py-2 text-sm"
          rows={3}
        />
        <div className="flex gap-3 mt-3">
          <button
            disabled={rating === 0}
            className="bg-cinema-gold hover:bg-yellow-500 disabled:opacity-40 text-cinema-bg font-semibold px-4 py-1.5 rounded text-sm transition"
          >
            {editingId ? "Update Review" : "Submit Review"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => { setEditingId(null); setRating(0); setComment(""); }}
              className="text-cinema-muted text-sm"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="space-y-4">
        {data.reviews.map((r) => (
          <div key={r.id} className="border border-cinema-border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="font-semibold text-sm">{r.userName}</span>
                <StarRating value={r.rating} />
                {r.verifiedBooking && (
                  <span className="text-xs text-cinema-green">Verified booking</span>
                )}
              </div>
              {r.userEmail === currentUserEmail && (
                <div className="flex gap-3 text-xs text-cinema-muted">
                  <button onClick={() => startEdit(r)}>Edit</button>
                  <button onClick={() => remove(r.id)}>Delete</button>
                </div>
              )}
            </div>
            {r.comment && <p className="text-sm text-cinema-muted mt-2">{r.comment}</p>}
          </div>
        ))}
        {data.reviews.length === 0 && (
          <p className="text-sm text-cinema-muted text-center py-6">No reviews yet — be the first.</p>
        )}
      </div>

      {data.totalPages > 1 && (
        <div className="flex justify-center gap-3 mt-6 text-sm">
          <button disabled={page === 0} onClick={() => setPage((p) => p - 1)} className="disabled:opacity-30">Prev</button>
          <span className="text-cinema-muted">{page + 1} / {data.totalPages}</span>
          <button disabled={page + 1 >= data.totalPages} onClick={() => setPage((p) => p + 1)} className="disabled:opacity-30">Next</button>
        </div>
      )}
    </div>
  );
}