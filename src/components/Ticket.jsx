export default function Ticket({ booking, onClose }) {
  const qrData = encodeURIComponent(
    `BOOKING:${booking.bookingId}|MOVIE:${booking.movieName}|SEATS:${(booking.seatNumbers || []).join(",")}`
  );
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${qrData}`;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-cinema-surface border border-cinema-border rounded-lg max-w-sm w-full p-6 relative print:shadow-none">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-cinema-muted hover:text-cinema-text print:hidden"
        >
          ✕
        </button>

        <h3 className="font-display text-2xl text-cinema-gold text-center mb-1 tracking-wide">E-TICKET</h3>
        <p className="text-center text-xs text-cinema-muted mb-6">Booking #{booking.bookingId}</p>

        <div className="border-t border-dashed border-cinema-border my-4" />

        <div className="space-y-2 text-sm mb-6">
          <div className="flex justify-between">
            <span className="text-cinema-muted">Movie</span>
            <span className="font-semibold">{booking.movieName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-cinema-muted">Booked by</span>
            <span>{booking.userName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-cinema-muted">Seats</span>
            <span className="font-semibold">{(booking.seatNumbers || []).join(", ") || "—"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-cinema-muted">Date</span>
            <span>{new Date(booking.bookingTime).toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-cinema-muted">Amount Paid</span>
            <span className="text-cinema-gold font-semibold">₹{booking.totalAmount}</span>
          </div>
        </div>

        <div className="border-t border-dashed border-cinema-border my-4" />

        <div className="flex justify-center mb-2">
          <img src={qrUrl} alt="Ticket QR code" className="rounded bg-white p-2" />
        </div>
        <p className="text-center text-xs text-cinema-muted mb-6">Show this QR code at entry</p>

        <button
          onClick={() => window.print()}
          className="w-full bg-cinema-gold hover:bg-yellow-500 text-cinema-bg font-semibold py-2 rounded transition print:hidden"
        >
          Print / Save as PDF
        </button>
      </div>
    </div>
  );
}