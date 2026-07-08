export default function SeatMap({ seats, selectedSeats, onToggle }) {
  return (
    <div>
      <div className="flex justify-center mb-8">
        <div className="w-3/4 h-2 bg-cinema-gold rounded-full opacity-60" />
      </div>
      <p className="text-center text-xs text-cinema-muted mb-6 tracking-widest">SCREEN THIS WAY</p>

      <div className="grid grid-cols-8 gap-3 justify-items-center max-w-xl mx-auto">
        {seats.map((seat) => {
          const isBooked = seat.status === "BOOKED";
          const isSelected = selectedSeats.includes(seat.seatNumber);

          return (
            <button
              key={seat.seatNumber}
              disabled={isBooked}
              onClick={() => onToggle(seat.seatNumber)}
              className={`w-9 h-9 rounded-t-md text-xs font-semibold flex items-center justify-center transition
                ${isBooked ? "bg-cinema-border text-cinema-muted cursor-not-allowed" : ""}
                ${!isBooked && isSelected ? "bg-cinema-gold text-cinema-bg" : ""}
                ${!isBooked && !isSelected ? "bg-cinema-surface border border-cinema-border hover:border-cinema-gold" : ""}
              `}
            >
              {seat.seatNumber}
            </button>
          );
        })}
      </div>

      <div className="flex justify-center gap-6 mt-8 text-xs text-cinema-muted">
        <span className="flex items-center gap-2"><span className="w-3 h-3 bg-cinema-surface border border-cinema-border rounded-sm" /> Available</span>
        <span className="flex items-center gap-2"><span className="w-3 h-3 bg-cinema-gold rounded-sm" /> Selected</span>
        <span className="flex items-center gap-2"><span className="w-3 h-3 bg-cinema-border rounded-sm" /> Booked</span>
      </div>
    </div>
  );
}