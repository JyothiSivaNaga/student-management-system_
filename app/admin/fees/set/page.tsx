"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function SetFeePage() {
  const [students, setStudents] = useState<any[]>([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [totalFee, setTotalFee] = useState("");
  const [feeDueDate, setFeeDueDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/students");
      if (!response.ok) throw new Error("Failed to fetch students");
      const data = await response.json();
      setStudents(data);
    } catch (err) {
      console.error("Error:", err);
      setError("Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!selectedStudent || !totalFee) {
      setError("Please select a student and enter fee amount");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/admin/fees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student_id: parseInt(selectedStudent),
          total_fee: parseFloat(totalFee),
          fee_due_date: feeDueDate || null,
        }),
      });

      if (!response.ok) throw new Error("Failed to set fee");

      alert("Fee set successfully!");
      router.push("/admin/fees");
    } catch (err) {
      console.error("Error:", err);
      setError("Failed to set fee");
    }
  };

  if (loading) return <p className="p-6 text-center">Loading...</p>;

  if (students.length === 0) {
    return (
      <div className="w-full flex justify-center">
        <div className="w-full max-w-2xl px-4">
          <h2 className="text-3xl font-bold mb-8 text-gray-800">Set Student Fee</h2>
          <div className="bg-gradient-to-br from-yellow-50 to-amber-50 border-2 border-yellow-300 rounded-xl p-8 text-center shadow-lg">
            <p className="text-yellow-800 font-semibold text-lg">No students found in the system</p>
            <p className="text-yellow-700 text-sm mt-2">Please add students first before setting fees</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-2xl px-4">
        <h2 className="text-3xl font-bold mb-8 text-gray-800">Set Student Fee</h2>

        {error && <p className="text-red-600 mb-4 bg-red-50 p-4 rounded-lg border border-red-200">{error}</p>}

        <form onSubmit={handleSubmit} className="bg-white/80 backdrop-blur p-8 rounded-2xl shadow-xl border border-white/20 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Student</label>
            <select
              value={selectedStudent}
              onChange={(e) => setSelectedStudent(e.target.value)}
              className="w-full border-2 border-gray-300 p-3 rounded-lg focus:border-blue-500 focus:outline-none transition-colors duration-200 bg-white"
              required
            >
              <option value="">Select Student</option>
              {students.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.name} ({student.email})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Total Fee Amount (₹)</label>
            <input
              type="number"
              step="0.01"
              value={totalFee}
              onChange={(e) => setTotalFee(e.target.value)}
              className="w-full border-2 border-gray-300 p-3 rounded-lg focus:border-blue-500 focus:outline-none transition-colors duration-200"
              placeholder="Enter fee amount"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Fee Due Date (Optional)</label>
            <input
              type="date"
              value={feeDueDate}
              onChange={(e) => setFeeDueDate(e.target.value)}
              className="w-full border-2 border-gray-300 p-3 rounded-lg focus:border-blue-500 focus:outline-none transition-colors duration-200"
            />
          </div>

          <div className="flex gap-4 pt-2">
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              Set Fee
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
