"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Exam {
  id: number;
  course_id: number;
  exam_name: string;
  exam_date: string;
  total_marks: number;
  course_name?: string;
}

export default function ExamsPage() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/admin/exams");
      if (!response.ok) throw new Error("Failed to fetch exams");
      const data = await response.json();
      setExams(data);
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteExam = async (id: number) => {
    if (!confirm("Are you sure you want to delete this exam?")) return;

    try {
      const response = await fetch(`http://localhost:5000/api/admin/exams/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete exam");

      setExams(exams.filter(exam => exam.id !== id));
      alert("Exam deleted successfully");
    } catch (err) {
      console.error("Error:", err);
      alert("Failed to delete exam");
    }
  };

  const getExamStats = () => {
    if (exams.length === 0) return { totalExams: 0, upcomingExams: 0, completedExams: 0, totalMarks: 0 };
    
    const now = new Date();
    const upcomingExams = exams.filter(e => new Date(e.exam_date) >= now).length;
    const completedExams = exams.length - upcomingExams;
    const totalMarks = exams.reduce((sum, e) => sum + e.total_marks, 0);
    
    return { totalExams: exams.length, upcomingExams, completedExams, totalMarks };
  };

  const isUpcoming = (examDate: string) => {
    return new Date(examDate) >= new Date();
  };

  const stats = getExamStats();

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
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
          <div>
            <p className="text-sm uppercase tracking-wide text-gray-500">Assessment</p>
            <h2 className="text-4xl font-bold text-gray-800">📝 Exams Management</h2>
            <p className="text-gray-600 mt-1">Schedule and manage exams</p>
          </div>
          <button
            onClick={() => router.push("/admin/exams/create")}
            className="self-start md:self-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            + Add Exam
          </button>
        </div>

        {/* Statistics Cards */}
        {exams.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
            <div className="bg-white/85 backdrop-blur border border-blue-100 p-6 rounded-2xl shadow-md">
              <p className="text-blue-600 text-sm font-semibold mb-2">Total Exams</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalExams}</p>
            </div>
            <div className="bg-white/85 backdrop-blur border border-green-100 p-6 rounded-2xl shadow-md">
              <p className="text-green-600 text-sm font-semibold mb-2">Upcoming</p>
              <p className="text-3xl font-bold text-gray-900">{stats.upcomingExams}</p>
            </div>
            <div className="bg-white/85 backdrop-blur border border-purple-100 p-6 rounded-2xl shadow-md">
              <p className="text-purple-600 text-sm font-semibold mb-2">Completed</p>
              <p className="text-3xl font-bold text-gray-900">{stats.completedExams}</p>
            </div>
            <div className="bg-white/85 backdrop-blur border border-indigo-100 p-6 rounded-2xl shadow-md">
              <p className="text-indigo-600 text-sm font-semibold mb-2">Total Marks</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalMarks}</p>
            </div>
          </div>
        )}

        {/* Exams Table */}
        {exams.length === 0 ? (
          <div className="bg-white shadow-lg rounded-2xl p-12 text-center">
            <div className="text-6xl mb-4">📋</div>
            <p className="text-gray-500 text-lg">No exams scheduled yet</p>
            <button
              onClick={() => router.push("/admin/exams/create")}
              className="mt-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              Create First Exam
            </button>
          </div>
        ) : (
          <div className="bg-white/80 backdrop-blur rounded-xl shadow-lg overflow-hidden border border-white/20">
            <table className="w-full text-left">
              <thead className="bg-gradient-to-r from-indigo-100 to-purple-100 border-b-2 border-indigo-200">
                <tr>
                  <th className="p-4 text-gray-800 font-semibold">Exam Name</th>
                  <th className="p-4 text-gray-800 font-semibold">Course</th>
                  <th className="p-4 text-center text-gray-800 font-semibold">Date</th>
                  <th className="p-4 text-center text-gray-800 font-semibold">Total Marks</th>
                  <th className="p-4 text-center text-gray-800 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {exams.map((exam) => {
                  const upcoming = isUpcoming(exam.exam_date);
                  const examDate = new Date(exam.exam_date);
                  const initials = exam.exam_name
                    .split(" ")
                    .map(n => n[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase();

                  return (
                    <tr key={exam.id} className="border-t hover:bg-indigo-50/50 transition-colors duration-200">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className={`h-10 w-10 rounded-full ${upcoming ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'} flex items-center justify-center font-bold text-sm shadow-inner`}>
                            {initials}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800">{exam.exam_name}</p>
                            {upcoming && (
                              <span className="text-xs text-green-600 font-medium">Upcoming</span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-gray-700">
                        <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium">
                          {exam.course_name || "-"}
                        </span>
                      </td>
                      <td className="p-4 text-center text-gray-700 font-medium">
                        {examDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="p-4 text-center">
                        <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-semibold">
                          {exam.total_marks}
                        </span>
                      </td>
                      <td className="p-4 text-center space-x-2">
                        <button
                          onClick={() => router.push(`/admin/exams/${exam.id}`)}
                          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-3 py-1 rounded-lg text-sm font-semibold shadow hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => router.push(`/admin/results/exam/${exam.id}`)}
                          className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-3 py-1 rounded-lg text-sm font-semibold shadow hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                        >
                          Results
                        </button>
                        <button
                          onClick={() => deleteExam(exam.id)}
                          className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white px-3 py-1 rounded-lg text-sm font-semibold shadow hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                        >
                          Delete
                        </button>
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
