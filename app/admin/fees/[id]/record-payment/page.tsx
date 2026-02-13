"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface StudentFee {
  id: number;
  name: string;
  email: string;
  total_fee: number;
  paid_amount: number;
  pending_amount: number;
}

export default function RecordPaymentPage() {
  const params = useParams();
  const router = useRouter();
  const studentId = params?.id;

  const [studentFee, setStudentFee] = useState<StudentFee | null>(null);
  const [amount, setAmount] = useState("");
  const [paymentMode, setPaymentMode] = useState("Cash");
  const [transactionId, setTransactionId] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!studentId) return;
    fetchStudentFee();
  }, [studentId]);

  const fetchStudentFee = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/fees/${studentId}`);
      if (!response.ok) throw new Error("Failed to fetch fee details");
      const data = await response.json();
      setStudentFee(data);
    } catch (err) {
      console.error("Error:", err);
      setError("Failed to load fee details");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    setSuccessMessage("");

    if (!amount || parseFloat(amount) <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    if ((studentFee?.pending_amount || 0) <= 0) {
      setError("This student has no pending fees to pay");
      return;
    }

    if (parseFloat(amount) > (studentFee?.pending_amount || 0)) {
      setError("Payment amount cannot exceed pending amount");
      return;
    }

    try {
      setSubmitting(true);
      const response = await fetch("http://localhost:5000/api/admin/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student_id: studentId,
          amount: parseFloat(amount),
          payment_mode: paymentMode,
          transaction_id: transactionId || null,
          notes: notes || null,
        }),
      });

      if (!response.ok) throw new Error("Failed to record payment");

      // If API returns updated fee object, use it; otherwise update locally
      let updated: any = null;
      try {
        updated = await response.json();
      } catch {
        updated = null;
      }

      if (updated && updated.pending_amount !== undefined) {
        setStudentFee(updated as StudentFee);
      } else {
        const paid = Number(studentFee?.paid_amount || 0) + Number(amount);
        const total = Number(studentFee?.total_fee || 0);
        const pending = Math.max(0, total - paid);
        setStudentFee((prev) => (prev ? { ...prev, paid_amount: paid, pending_amount: pending } : prev));
      }

      setSuccessMessage("Payment recorded successfully!");
      setAmount("");
      setTransactionId("");
      setNotes("");
    } catch (err) {
      console.error("Error:", err);
      setError("Failed to record payment");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p className="p-6 text-center">Loading...</p>;

  if (!studentFee) return <p className="p-6 text-red-600 text-center">Student fee not found</p>;

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-3xl px-4">
        <h2 className="text-3xl font-bold mb-8 text-gray-800">💳 Record Payment</h2>

        {/* Fee Summary */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-6 mb-6 shadow-lg">
          <p className="text-xl font-bold mb-6 text-gray-800">{studentFee.name}</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/60 backdrop-blur p-4 rounded-lg">
              <p className="text-gray-600 text-sm font-semibold mb-1">Total Fee</p>
              <p className="text-2xl font-bold text-gray-800">₹{Number(studentFee.total_fee).toFixed(2)}</p>
            </div>
            <div className="bg-white/60 backdrop-blur p-4 rounded-lg">
              <p className="text-green-600 text-sm font-semibold mb-1">Paid</p>
              <p className="text-2xl font-bold text-green-600">₹{Number(studentFee.paid_amount).toFixed(2)}</p>
            </div>
            <div className="bg-white/60 backdrop-blur p-4 rounded-lg">
              <p className="text-red-600 text-sm font-semibold mb-1">Pending</p>
              <p className="text-2xl font-bold text-red-600">₹{Number(studentFee.pending_amount).toFixed(2)}</p>
            </div>
          </div>
        </div>

        {error && <p className="text-red-600 mb-4 bg-red-50 p-4 rounded-lg border border-red-200">{error}</p>}
        {successMessage && <p className="text-green-700 mb-4 bg-green-50 p-4 rounded-lg border border-green-200">{successMessage}</p>}

        <form onSubmit={handleSubmit} className="bg-white/80 backdrop-blur p-8 rounded-2xl shadow-xl border border-white/20 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Payment Amount (₹)</label>
            <input
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full border-2 border-gray-300 p-3 rounded-lg focus:border-green-500 focus:outline-none transition-colors duration-200"
              placeholder={`Max: ₹${Number(studentFee.pending_amount).toFixed(2)}`} 
              required
            />
            <p className="text-sm text-gray-600 mt-2">
              Maximum: ₹{Number(studentFee.pending_amount).toFixed(2)}
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Payment Mode</label>
            <select
              value={paymentMode}
              onChange={(e) => setPaymentMode(e.target.value)}
              className="w-full border-2 border-gray-300 p-3 rounded-lg focus:border-green-500 focus:outline-none transition-colors duration-200 bg-white"
            >
              <option value="Cash">Cash</option>
              <option value="Online">Online</option>
              <option value="Cheque">Cheque</option>
              <option value="DD">Demand Draft</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Transaction ID (Optional)
            </label>
            <input
              type="text"
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              className="w-full border-2 border-gray-300 p-3 rounded-lg focus:border-green-500 focus:outline-none transition-colors duration-200"
              placeholder="e.g., TXN123456"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Notes (Optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full border-2 border-gray-300 p-3 rounded-lg focus:border-green-500 focus:outline-none transition-colors duration-200"
              rows={3}
              placeholder="Any additional notes..."
            />
          </div>

          <div className="flex gap-4 pt-2">
            <button
              type="submit"
              disabled={submitting}
              className={`flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-lg font-semibold flex items-center justify-center shadow-lg ${submitting ? 'opacity-70 cursor-not-allowed' : 'hover:from-green-700 hover:to-emerald-700 hover:shadow-xl transform hover:scale-105 transition-all duration-200'}`}
            >
              {submitting && (
                <svg className="animate-spin h-4 w-4 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                </svg>
              )}
              Record Payment
            </button>
            <button
              type="button"
              onClick={() => router.push("/admin/fees")}
              className="flex-1 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

