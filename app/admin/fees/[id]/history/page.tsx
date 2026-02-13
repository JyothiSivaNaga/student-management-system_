"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Payment {
  id: number;
  amount: number | string; // 👈 IMPORTANT
  payment_date: string;
  payment_mode: string;
  transaction_id?: string;
  payment_status: string;
  notes?: string;
}

interface StudentFee {
  name: string;
  total_fee: number;
  paid_amount: number;
  pending_amount: number;
}

export default function PaymentHistoryPage() {
  const params = useParams();
  const router = useRouter();
  const studentId = params?.id;

  const [studentFee, setStudentFee] = useState<StudentFee | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!studentId) return;
    fetchData();
  }, [studentId]);

  const fetchData = async () => {
    try {
      const [feeRes, paymentsRes] = await Promise.all([
        fetch(`http://localhost:5000/api/admin/fees/${studentId}`),
        fetch(`http://localhost:5000/api/admin/payments/${studentId}`),
      ]);

      if (!feeRes.ok || !paymentsRes.ok) {
        throw new Error("Failed to fetch data");
      }

      const feeData = await feeRes.json();
      const paymentsData = await paymentsRes.json();

      setStudentFee(feeData);
      setPayments(paymentsData);
    } catch (err) {
      console.error("Error:", err);
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="p-6 text-center">Loading...</p>;

  if (error) {
    return (
      <div className="w-full flex justify-center">
        <div className="w-full max-w-4xl px-4">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">💳 Payment History</h2>
          <div className="bg-gradient-to-br from-red-50 to-rose-50 border-2 border-red-300 rounded-xl p-8 text-center shadow-lg">
            <p className="text-red-600 font-semibold">{error}</p>
            <button
              onClick={() => router.back()}
              className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white px-6 py-3 rounded-lg mt-4 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!studentFee) {
    return (
      <div className="w-full flex justify-center">
        <div className="w-full max-w-4xl px-4">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">💳 Payment History</h2>
          <div className="bg-gradient-to-br from-yellow-50 to-amber-50 border-2 border-yellow-300 rounded-xl p-8 text-center shadow-lg">
            <p className="text-yellow-800 font-semibold">
              Student fee information not found
            </p>
            <button
              onClick={() => router.back()}
              className="bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-700 hover:to-amber-700 text-white px-6 py-3 rounded-lg mt-4 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-5xl px-4 pb-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <p className="text-sm uppercase tracking-wide text-gray-500">Student</p>
            <h2 className="text-3xl font-bold text-gray-800">💳 Payment History</h2>
            <p className="text-gray-600 mt-1">{studentFee.name}</p>
          </div>
          <button
            onClick={() => router.back()}
            className="self-start md:self-auto bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-800 hover:to-black text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            Back
          </button>
        </div>

        {/* Fee Summary */}
        <div className="bg-white/80 backdrop-blur border border-white/20 rounded-2xl shadow-xl p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-2 border-indigo-200 rounded-xl p-4">
              <p className="text-indigo-700 text-sm font-semibold mb-1">Total Fee</p>
              <p className="text-2xl font-bold text-indigo-900">
                ₹{Number(studentFee.total_fee).toFixed(2)}
              </p>
            </div>
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-2 border-emerald-200 rounded-xl p-4">
              <p className="text-emerald-700 text-sm font-semibold mb-1">Paid</p>
              <p className="text-2xl font-bold text-emerald-900">
                ₹{Number(studentFee.paid_amount).toFixed(2)}
              </p>
            </div>
            <div className="bg-gradient-to-br from-rose-50 to-rose-100 border-2 border-rose-200 rounded-xl p-4">
              <p className="text-rose-700 text-sm font-semibold mb-1">Pending</p>
              <p className="text-2xl font-bold text-rose-900">
                ₹{Number(studentFee.pending_amount).toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        {/* Payments Table */}
        {payments.length > 0 ? (
          <div className="bg-white/85 backdrop-blur rounded-2xl shadow-xl overflow-hidden border border-white/20">
            <table className="w-full text-left">
              <thead className="bg-gradient-to-r from-blue-100 to-indigo-100 border-b-2 border-blue-200">
                <tr>
                  <th className="p-4 text-gray-800 font-semibold">Date</th>
                  <th className="p-4 text-center text-gray-800 font-semibold">Amount</th>
                  <th className="p-4 text-gray-800 font-semibold">Mode</th>
                  <th className="p-4 text-gray-800 font-semibold">Transaction ID</th>
                  <th className="p-4 text-center text-gray-800 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <tr key={payment.id} className="border-t hover:bg-blue-50/50 transition-colors duration-200">
                    <td className="p-4 text-gray-800">
                      {new Date(payment.payment_date).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-center font-semibold text-gray-800">
                      ₹{Number(payment.amount).toFixed(2)}
                    </td>
                    <td className="p-4 text-gray-800">{payment.payment_mode}</td>
                    <td className="p-4 text-sm text-gray-700">
                      {payment.transaction_id || "-"}
                    </td>
                    <td className="p-4 text-center">
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                        {payment.payment_status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-white/85 backdrop-blur shadow-xl rounded-2xl p-8 text-center border border-white/20">
            <p className="text-gray-500">No payments recorded yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
