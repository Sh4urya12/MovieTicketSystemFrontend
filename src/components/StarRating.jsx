export default function StarRating({ value, onChange, size = "text-lg" }) {
  const stars = [1, 2, 3, 4, 5];
  return (
    <div className={`flex gap-1 ${size}`}>
      {stars.map((n) => (
        <button
          key={n}
          type="button"
          disabled={!onChange}
          onClick={() => onChange && onChange(n)}
          className={n <= value ? "text-cinema-gold" : "text-cinema-border"}
        >
          ★
        </button>
      ))}
    </div>
  );
}
