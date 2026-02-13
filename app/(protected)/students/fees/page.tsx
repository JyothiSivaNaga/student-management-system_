"use client";

import { useEffect, useState } from "react";

interface Fee {
  total_fee: number;
  paid_amount: number;
  pending_amount: number;
  status: string;
  fee_due_date?: string;
}

interface Payment {
  id: number;
  amount: number;
  payment_date: string;
  payment_mode: string;
  payment_status: string;
}

export default function StudentFeesPage() {
  const [studentId, setStudentId] = useState<number | null>(null);
  const [fee, setFee] = useState<Fee | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  const [showPay, setShowPay] = useState(false);
  const [amount, setAmount] = useState("");
  const [paymentMode, setPaymentMode] = useState("Online");
  const [txnId, setTxnId] = useState("");
  const [paying, setPaying] = useState(false);

  /* ================================
     STEP 1: GET students.id FROM user.id
  ================================= */
  useEffect(() => {
    const userRaw = localStorage.getItem("user");
    if (!userRaw) {
      setLoading(false);
      return;
    }

    const user = JSON.parse(userRaw); // { id, role, name }

    fetch(`http://localhost:5000/api/student/by-user/${user.id}`)
      .then(res => {
        if (!res.ok) throw new Error("Student not found");
        return res.json();
      })
      .then(data => {
        setStudentId(data.id); // ✅ students.id
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  /* ================================
     STEP 2: FETCH FEES + PAYMENTS
  ================================= */
  useEffect(() => {
    if (!studentId) return;

    fetchFee();
    fetchPayments();
  }, [studentId]);

  const fetchFee = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/student/fees/${studentId}`
      );
      if (!res.ok) throw new Error("Fee fetch failed");

      const data = await res.json();
      setFee(data);
    } catch (err) {
      console.error(err);
      setFee(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchPayments = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/student/payments/${studentId}`
      );
      if (!res.ok) throw new Error("Payments fetch failed");

      const data = await res.json();
      setPayments(data);
    } catch (err) {
      console.error(err);
    }
  };

  /* ================================
     PAYMENT HANDLER
  ================================= */
  const handlePay = async () => {
    if (!fee || !studentId) return;

    if (Number(amount) <= 0 || Number(amount) > fee.pending_amount) {
      alert("Invalid payment amount");
      return;
    }

    try {
      setPaying(true);

      await fetch("http://localhost:5000/api/admin/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student_id: studentId,
          amount,
          payment_mode: paymentMode,
          transaction_id: paymentMode === "Online" ? txnId : null,
          notes: "Student self payment",
        }),
      });

      setShowPay(false);
      setAmount("");
      setTxnId("");

      await fetchFee();
      await fetchPayments();
    } catch (err) {
      alert("Payment failed");
    } finally {
      setPaying(false);
    }
  };

  /* ================================
     UI STATES
  ================================= */
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 font-semibold">
        Loading fees...
      </div>
    );
  }

  if (!studentId) {
    return (
      <div className="p-6 text-red-600 font-semibold">
        Student profile not found. Please login again.
      </div>
    );
  }

  if (!fee) {
    return (
      <div className="p-6 font-semibold">
        No fee record found. Contact admin.
      </div>
    );
  }

  const progress =
    fee.total_fee > 0
      ? (fee.paid_amount / fee.total_fee) * 100
      : 0;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">💰 My Fees</h2>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-3 gap-6 mb-6">
        <div className="bg-white shadow p-4 rounded">
          <p>Total Fee</p>
          <p className="text-2xl font-bold">
            ₹{fee.total_fee ?? 0}
          </p>
        </div>

        <div className="bg-white shadow p-4 rounded">
          <p>Paid</p>
          <p className="text-2xl font-bold text-green-600">
            ₹{fee.paid_amount ?? 0}
          </p>
        </div>

        <div className="bg-white shadow p-4 rounded">
          <p>Pending</p>
          <p className="text-2xl font-bold text-red-600">
            ₹{fee.pending_amount ?? 0}
          </p>
        </div>
      </div>

      {/* PROGRESS */}
      <div className="bg-white shadow p-4 rounded mb-6">
        <div className="w-full bg-gray-200 h-3 rounded">
          <div
            className="bg-green-600 h-3 rounded"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="mt-2">{progress.toFixed(1)}%</p>
      </div>

      {/* PAY BUTTON */}
      {fee.pending_amount > 0 && (
        <button
          onClick={() => setShowPay(true)}
          className="mb-6 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Pay Fees
        </button>
      )}

      {/* PAYMENT MODAL */}
      {showPay && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded w-96">
            <h3 className="text-xl font-bold mb-4">Pay Fees</h3>

            <p className="mb-2 text-sm">
              Pending Amount: ₹{fee.pending_amount}
            </p>

            <input
              type="number"
              placeholder="Enter amount"
              className="w-full border p-2 mb-3"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />

            <select
              className="w-full border p-2 mb-3"
              value={paymentMode}
              onChange={(e) => setPaymentMode(e.target.value)}
            >
              <option value="Online">Online</option>
              <option value="Cash">Cash</option>
              <option value="Cheque">Cheque</option>
              <option value="DD">DD</option>
            </select>

            {paymentMode === "Online" && (
              <input
                type="text"
                placeholder="Transaction ID"
                className="w-full border p-2 mb-3"
                value={txnId}
                onChange={(e) => setTxnId(e.target.value)}
              />
            )}

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowPay(false)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>

              <button
                onClick={handlePay}
                disabled={paying}
                className="px-4 py-2 bg-green-600 text-white rounded"
              >
                {paying ? "Processing..." : "Pay"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PAYMENT HISTORY */}
      <div className="bg-white shadow rounded mt-6">
        <h3 className="text-xl font-bold p-4">Payment History</h3>
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-center">Amount</th>
              <th className="p-3 text-center">Mode</th>
              <th className="p-3 text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            {payments.map(p => (
              <tr key={p.id} className="border-t">
                <td className="p-3">
                  {new Date(p.payment_date).toLocaleDateString()}
                </td>
                <td className="p-3 text-center">₹{p.amount}</td>
                <td className="p-3 text-center">{p.payment_mode}</td>
                <td className="p-3 text-center">{p.payment_status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
