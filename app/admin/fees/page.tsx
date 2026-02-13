"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface StudentFee {
  id: number;
  student_name: string;
  email: string;
  total_fee: number;
  paid_amount: number;
  pending_amount: number;
  status: string;
  fee_due_date?: string;
}

export default function AdminFeesPage() {
  const [fees, setFees] = useState<StudentFee[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchFees();
  }, []);

  const fetchFees = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/admin/fees");
      if (!response.ok) throw new Error("Failed to fetch fees");
      const data = await response.json();
      setFees(data);
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Paid":
        return "bg-green-100 text-green-800";
      case "Partial":
        return "bg-yellow-100 text-yellow-800";
      case "Pending":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) return <p className="p-6 text-center">Loading fees...</p>;

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-7xl px-4 pb-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
          <div>
            <p className="text-sm uppercase tracking-wide text-gray-500">Finance</p>
            <h2 className="text-4xl font-bold text-gray-800">💰 Fees Management</h2>
            <p className="text-gray-600 mt-1">Overview of collections and dues</p>
          </div>
          <button
            onClick={() => router.push("/admin/fees/set")}
            className="self-start md:self-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            + Set Fee
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <div className="bg-white/85 backdrop-blur border border-purple-100 p-6 rounded-2xl shadow-md">
            <p className="text-purple-600 text-sm font-semibold mb-2">Total Students</p>
            <p className="text-3xl font-bold text-gray-900">{fees?.length || 0}</p>
          </div>
          <div className="bg-white/85 backdrop-blur border border-green-100 p-6 rounded-2xl shadow-md">
            <p className="text-green-600 text-sm font-semibold mb-2">Fees Paid</p>
            <p className="text-3xl font-bold text-gray-900">
              ₹{fees?.length ? fees.reduce((sum, f) => sum + (Number(f.paid_amount) || 0), 0).toFixed(2) : "0.00"}
            </p>
          </div>
          <div className="bg-white/85 backdrop-blur border border-rose-100 p-6 rounded-2xl shadow-md">
            <p className="text-rose-600 text-sm font-semibold mb-2">Pending Fees</p>
            <p className="text-3xl font-bold text-gray-900">
              ₹{fees?.length ? fees.reduce((sum, f) => sum + (Number(f.pending_amount) || 0), 0).toFixed(2) : "0.00"}
            </p>
          </div>
          <div className="bg-white/85 backdrop-blur border border-blue-100 p-6 rounded-2xl shadow-md">
            <p className="text-blue-600 text-sm font-semibold mb-2">Total Fees</p>
            <p className="text-3xl font-bold text-gray-900">
              ₹{fees?.length ? fees.reduce((sum, f) => sum + (Number(f.total_fee) || 0), 0).toFixed(2) : "0.00"}
            </p>
          </div>
        </div>

        {/* Fees Table */}
        {fees.length > 0 ? (
          <div className="bg-white/80 backdrop-blur rounded-xl shadow-lg overflow-hidden border border-white/20">
            <table className="w-full text-left">
              <thead className="bg-gradient-to-r from-indigo-100 to-purple-100 border-b-2 border-indigo-200">
                <tr>
                  <th className="p-4 text-gray-800 font-semibold">Email</th>
                  <th className="p-4 text-center text-gray-800 font-semibold">Total Fee</th>
                  <th className="p-4 text-center text-gray-800 font-semibold">Paid</th>
                  <th className="p-4 text-center text-gray-800 font-semibold">Pending</th>
                  <th className="p-4 text-center text-gray-800 font-semibold">Due Date</th>
                  <th className="p-4 text-center text-gray-800 font-semibold">Status</th>
                  <th className="p-4 text-center text-gray-800 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {fees.map((fee) => (
                  <tr key={fee.id} className="border-t hover:bg-indigo-50/50 transition-colors duration-200">
                    <td className="p-4 text-sm text-gray-700">{fee.email}</td>
                    <td className="p-4 text-center text-gray-800">₹{Number(fee.total_fee).toFixed(2)}</td>
                    <td className="p-4 text-center text-green-600 font-semibold">
                      ₹{Number(fee.paid_amount).toFixed(2)}
                    </td>
                    <td className="p-4 text-center text-red-600 font-semibold">
                      ₹{Number(fee.pending_amount).toFixed(2)}
                    </td>
                    <td className="p-4 text-center text-sm text-gray-700">
                      {fee.fee_due_date
                        ? new Date(fee.fee_due_date).toLocaleDateString()
                        : "-"}
                    </td>
                    <td className="p-4 text-center">
                      <span
                        className={`px-3 py-1 rounded-full font-semibold text-sm ${getStatusColor(
                          fee.status
                        )}`}
                      >
                        {fee.status}
                      </span>
                    </td>
                    <td className="p-4 text-center space-x-2">
                      <button
                        onClick={() => router.push(`/admin/fees/${fee.id}/record-payment`)}
                        className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-3 py-1 rounded-lg text-sm font-semibold shadow hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                      >
                        Record Payment
                      </button>
                      <button
                        onClick={() => router.push(`/admin/fees/${fee.id}/history`)}
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-3 py-1 rounded-lg text-sm font-semibold shadow hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                      >
                        History
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-white shadow rounded p-8 text-center">
            <p className="text-gray-500">No fees found</p>
          </div>
        )}
      </div>
    </div>
  );
}
