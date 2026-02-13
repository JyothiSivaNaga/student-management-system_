"use client";

import { useEffect, useState } from "react";

type Result = {
  course_name: string;
  exam_name: string;
  marks: number;
  total_marks?: number;
  grade: string;
  status: string;
};

export default function StudentResultsPage() {
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    if (user.role !== "student") {
      window.location.href = "/login";
      return;
    }

    // 1️⃣ get student_id using user_id
    fetch(`http://localhost:5000/api/student/by-user/${user.id}`)
      .then(res => res.json())
      .then(student => {
        // 2️⃣ fetch results using student_id
        return fetch(
          `http://localhost:5000/api/student/results/${student.id}`
        );
      })
      .then(res => res.json())
      .then(data => {
        setResults(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-7xl px-4 pb-12">
        {/* Header */}
        <div className="mb-8">
          <p className="text-sm uppercase tracking-wide text-gray-500">Academic Performance</p>
          <h2 className="text-4xl font-bold text-gray-800">🎓 My Results</h2>
          <p className="text-gray-600 mt-1">View your exam scores and grades</p>
        </div>

        {results.length === 0 ? (
          <div className="bg-white shadow-lg rounded-2xl p-12 text-center">
            <div className="text-6xl mb-4">📋</div>
            <p className="text-gray-500 text-lg">No results available yet</p>
          </div>
        ) : (
          <div className="bg-white/80 backdrop-blur rounded-xl shadow-lg overflow-hidden border border-white/20">
            <table className="w-full text-left">
              <thead className="bg-gradient-to-r from-indigo-100 to-purple-100 border-b-2 border-indigo-200">
                <tr>
                  <th className="p-4 text-gray-800 font-semibold">Course</th>
                  <th className="p-4 text-gray-800 font-semibold">Exam</th>
                  <th className="p-4 text-center text-gray-800 font-semibold">Marks</th>
                  <th className="p-4 text-center text-gray-800 font-semibold">Grade</th>
                  <th className="p-4 text-center text-gray-800 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {results.map((r, i) => {
                  const isPassed = r.status === "Pass";
                  const courseInitials = r.course_name
                    .split(" ")
                    .map(n => n[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase();

                  return (
                    <tr key={i} className="border-t hover:bg-indigo-50/50 transition-colors duration-200">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className={`h-10 w-10 rounded-full ${isPassed ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'} flex items-center justify-center font-bold text-sm shadow-inner`}>
                            {courseInitials}
                          </div>
                          <span className="font-semibold text-gray-800">{r.course_name}</span>
                        </div>
                      </td>
                      <td className="p-4 text-gray-700">
                        <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium">
                          {r.exam_name}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <span className="font-bold text-gray-800">
                          {r.marks}{r.total_marks ? `/${r.total_marks}` : ''}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <span className={`px-3 py-1 rounded-full font-bold text-sm ${
                          r.grade === 'A' ? 'bg-green-100 text-green-800' :
                          r.grade === 'B' ? 'bg-blue-100 text-blue-800' :
                          r.grade === 'C' ? 'bg-yellow-100 text-yellow-800' :
                          r.grade === 'D' ? 'bg-orange-100 text-orange-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {r.grade}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <span className={`px-4 py-1 rounded-full font-semibold text-sm ${
                          isPassed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {r.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
