import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { payForBooking } from "../api/paymentApi";

const METHODS = [
  { value: "CREDIT_CARD", label: "Credit Card" },
  { value: "DEBIT_CARD", label: "Debit Card" },
  { value: "UPI", label: "UPI" },
  { value: "NET_BANKING", label: "Net Banking" },
  { value: "WALLET", label: "Wallet" },
];

export default function Payment() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const bookingId = state?.bookingId;

  const [method, setMethod] = useState("CREDIT_CARD");
  const [fields, setFields] = useState({ cardNumber: "", upiId: "", bankName: "", walletProvider: "" });
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  if (!bookingId) {
    return (
      <div className="max-w-md mx-auto px-6 py-16 text-center text-cinema-muted">
        No booking to pay for. Go back and book seats first.
      </div>
    );
  }

  const handlePay = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const dto = await payForBooking({ bookingId, paymentMethod: method, ...fields });
      setResult(dto);
    } catch (err) {
      setError(err.response?.data?.message || "Payment failed");
    } finally {
      setBusy(false);
    }
  };

  if (result) {
    const success = result.status === "SUCCESS";
    return (
      <div className="max-w-md mx-auto px-6 py-16 text-center">
        <div className={`text-5xl mb-4 ${success ? "text-cinema-green" : "text-cinema-red"}`}>
          {success ? "✓" : "✕"}
        </div>
        <h2 className="font-display text-3xl tracking-wide mb-2">
          {success ? "PAYMENT SUCCESSFUL" : "PAYMENT FAILED"}
        </h2>
        <p className="text-cinema-muted mb-1">{result.message}</p>
        <p className="text-cinema-muted mb-6">Transaction ID: {result.transactionId}</p>
        <button
          onClick={() => navigate(success ? "/my-bookings" : "/payment", { state: { bookingId } })}
          className="bg-cinema-gold text-cinema-bg font-semibold px-6 py-2 rounded"
        >
          {success ? "View My Bookings" : "Try Again"}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-6 py-12">
      <h2 className="font-display text-3xl text-cinema-gold mb-6 tracking-wide">PAYMENT</h2>

      {error && <p className="bg-red-950 text-red-300 text-sm rounded p-3 mb-4">{error}</p>}

      <form onSubmit={handlePay} className="bg-cinema-surface border border-cinema-border rounded-lg p-6">
        <label className="text-sm text-cinema-muted">Payment Method</label>
        <select
          value={method} onChange={(e) => setMethod(e.target.value)}
          className="w-full bg-cinema-bg border border-cinema-border rounded px-3 py-2 mt-1 mb-4"
        >
          {METHODS.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
        </select>

        {(method === "CREDIT_CARD" || method === "DEBIT_CARD") && (
          <>
            <label className="text-sm text-cinema-muted">Card Number</label>
            <input
              required value={fields.cardNumber}
              onChange={(e) => setFields({ ...fields, cardNumber: e.target.value })}
              placeholder="1234 5678 9012 3456"
              className="w-full bg-cinema-bg border border-cinema-border rounded px-3 py-2 mt-1 mb-4"
            />
          </>
        )}

        {method === "UPI" && (
          <>
            <label className="text-sm text-cinema-muted">UPI ID</label>
            <input
              required value={fields.upiId}
              onChange={(e) => setFields({ ...fields, upiId: e.target.value })}
              placeholder="name@bank"
              className="w-full bg-cinema-bg border border-cinema-border rounded px-3 py-2 mt-1 mb-4"
            />
          </>
        )}

        {method === "NET_BANKING" && (
          <>
            <label className="text-sm text-cinema-muted">Bank Name</label>
            <input
              required value={fields.bankName}
              onChange={(e) => setFields({ ...fields, bankName: e.target.value })}
              className="w-full bg-cinema-bg border border-cinema-border rounded px-3 py-2 mt-1 mb-4"
            />
          </>
        )}

        {method === "WALLET" && (
          <>
            <label className="text-sm text-cinema-muted">Wallet Provider</label>
            <input
              required value={fields.walletProvider}
              onChange={(e) => setFields({ ...fields, walletProvider: e.target.value })}
              placeholder="Paytm, PhonePe, etc."
              className="w-full bg-cinema-bg border border-cinema-border rounded px-3 py-2 mt-1 mb-4"
            />
          </>
        )}

        <button disabled={busy} className="w-full bg-cinema-gold hover:bg-yellow-500 disabled:opacity-40 text-cinema-bg font-semibold py-2 rounded transition mt-2">
          {busy ? "Processing…" : "Pay Now"}
        </button>
      </form>
    </div>
  );
}