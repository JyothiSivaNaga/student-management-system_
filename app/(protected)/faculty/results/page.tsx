"use client";

import { useEffect, useState } from "react";

export default function FacultyResultsPage() {
  const [activeTab, setActiveTab] = useState<"enter" | "view">("enter");
  const [courses, setCourses] = useState<{ id: number; course_name: string; department?: string }[]>([]);
  const [exams, setExams] = useState<{ id: number; exam_name: string; total_marks: number }[]>([]);
  const [results, setResults] = useState<any[]>([]);
  const [students, setStudents] = useState<{ id: number; name: string }[]>([]);
  
  // For Enter Marks
  const [courseId, setCourseId] = useState("");
  const [examId, setExamId] = useState("");
  const [marks, setMarks] = useState<any>({});
  
  // For View Results
  const [viewCourseId, setViewCourseId] = useState("");
  const [viewExamId, setViewExamId] = useState("");
  const [viewExams, setViewExams] = useState<any[]>([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/admin/courses")
      .then(res => res.json())
      .then(setCourses);
  }, []);

  // For Enter Marks Tab
  useEffect(() => {
    if (!courseId) return;

    fetch(`http://localhost:5000/api/faculty/exams/${courseId}`)
      .then(res => res.json())
      .then(setExams);

    fetch(`http://localhost:5000/api/faculty/students/${courseId}`)
      .then(res => res.json())
      .then(setStudents);
  }, [courseId]);

  // For View Results Tab
  useEffect(() => {
    if (!viewCourseId) {
      setViewExams([]);
      setResults([]);
      return;
    }

    fetch(`http://localhost:5000/api/faculty/exams/${viewCourseId}`)
      .then(res => res.json())
      .then(setViewExams);
  }, [viewCourseId]);

  useEffect(() => {
    if (!viewExamId) {
      setResults([]);
      return;
    }

    fetch(`http://localhost:5000/api/admin/results/exam/${viewExamId}`)
      .then(res => res.json())
      .then(setResults)
      .catch(err => console.error("Error:", err));
  }, [viewExamId]);

  const submitMarks = async () => {
    if (!examId) {
      alert("Please select an exam");
      return;
    }

    const marksToSubmit = Object.entries(marks).filter(([_, mark]) => mark);
    if (marksToSubmit.length === 0) {
      alert("Please enter marks for at least one student");
      return;
    }

    try {
      for (const [studentId, mark] of marksToSubmit) {
        await fetch("http://localhost:5000/api/faculty/results", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            student_id: studentId,
            exam_id: examId,
            marks: mark
          })
        });
      }
      alert("Marks saved successfully ✅");
      setMarks({});
    } catch (err) {
      console.error("Error:", err);
      alert("Failed to save marks");
    }
  };

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-7xl px-4 pb-12">
        {/* HEADER */}
        <div className="mb-6">
          <p className="text-sm uppercase tracking-wide text-gray-500">Faculty Portal</p>
          <h2 className="text-4xl font-bold text-gray-800">📊 Results Management</h2>
          <p className="text-gray-600 mt-1">Enter marks and view exam performance for your courses</p>
        </div>

        {/* TABS */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setActiveTab("enter")}
            className={`px-5 py-3 rounded-lg font-semibold flex items-center gap-2 shadow-sm transition-all duration-200 ${
              activeTab === "enter"
                ? "bg-indigo-600 text-white shadow-lg"
                : "bg-white/80 border border-gray-200 text-gray-700 hover:border-indigo-200 hover:text-indigo-700"
            }`}
          >
            <span>📝</span>
            Enter Marks
          </button>
          <button
            onClick={() => setActiveTab("view")}
            className={`px-5 py-3 rounded-lg font-semibold flex items-center gap-2 shadow-sm transition-all duration-200 ${
              activeTab === "view"
                ? "bg-emerald-600 text-white shadow-lg"
                : "bg-white/80 border border-gray-200 text-gray-700 hover:border-emerald-200 hover:text-emerald-700"
            }`}
          >
            <span>👁️</span>
            View Results
          </button>
        </div>

        {/* ENTER MARKS */}
        {activeTab === "enter" && (
          <div className="bg-white/85 backdrop-blur rounded-xl shadow-lg border border-white/20">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center">
                  <span className="text-2xl">📥</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">Enter Marks for Students</h3>
                  <p className="text-gray-600 text-sm">Select course and exam, then record marks</p>
                </div>
              </div>
            </div>

            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <span>📚</span>
                    Course
                  </label>
                  <select
                    value={courseId}
                    onChange={e => {
                      setCourseId(e.target.value);
                      setExamId("");
                      setMarks({});
                    }}
                    className="w-full border-2 border-indigo-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 p-3 rounded-lg bg-white shadow-sm transition-all duration-200"
                  >
                    <option value="">Select Course</option>
                    {courses.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.course_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <span>🧾</span>
                    Exam
                  </label>
                  <select
                    value={examId}
                    onChange={e => {
                      setExamId(e.target.value);
                      setMarks({});
                    }}
                    className="w-full border-2 border-indigo-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 p-3 rounded-lg bg-white shadow-sm transition-all duration-200 disabled:bg-gray-100"
                    disabled={!courseId}
                  >
                    <option value="">Select Exam</option>
                    {exams.map(e => (
                      <option key={e.id} value={e.id}>
                        {e.exam_name} (Total: {e.total_marks})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {students.length > 0 && examId && (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-gradient-to-r from-indigo-100 to-purple-100 border-b-2 border-indigo-200">
                        <tr>
                          <th className="p-4 text-gray-800 font-semibold">Student</th>
                          <th className="p-4 text-center text-gray-800 font-semibold">Marks</th>
                        </tr>
                      </thead>
                      <tbody>
                        {students.map(s => {
                          const initials = s.name
                            .split(" ")
                            .map(n => n[0])
                            .join("")
                            .slice(0, 2)
                            .toUpperCase();

                          return (
                            <tr key={s.id} className="border-t hover:bg-indigo-50/50 transition-colors duration-200">
                              <td className="p-4">
                                <div className="flex items-center gap-3">
                                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 text-white flex items-center justify-center font-bold text-sm shadow-md">
                                    {initials}
                                  </div>
                                  <span className="font-semibold text-gray-800">{s.name}</span>
                                </div>
                              </td>
                              <td className="p-4 text-center">
                                <input
                                  type="number"
                                  min="0"
                                  className="border-2 border-indigo-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 rounded-lg px-4 py-2 w-32 text-center shadow-sm transition-all duration-200"
                                  placeholder="Marks"
                                  value={marks[s.id] || ""}
                                  onChange={e => setMarks({ ...marks, [s.id]: e.target.value })}
                                />
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  <button
                    onClick={submitMarks}
                    className="mt-6 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
                  >
                    <span>💾</span>
                    Save Marks
                  </button>
                </>
              )}

              {!courseId && (
                <div className="bg-white/90 backdrop-blur rounded-xl border border-dashed border-indigo-200 p-8 text-center text-gray-500">
                  <div className="text-5xl mb-2">📌</div>
                  <p>Select a course to view students</p>
                </div>
              )}
              {courseId && students.length === 0 && (
                <div className="bg-white/90 backdrop-blur rounded-xl border border-dashed border-indigo-200 p-8 text-center text-gray-500">
                  <div className="text-5xl mb-2">📭</div>
                  <p>No students enrolled in this course</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* VIEW RESULTS */}
        {activeTab === "view" && (
          <div className="bg-white/85 backdrop-blur rounded-xl shadow-lg border border-white/20">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center">
                  <span className="text-2xl">📈</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">View Student Results by Exam</h3>
                  <p className="text-gray-600 text-sm">Pick course and exam to see performance</p>
                </div>
              </div>
            </div>

            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <span>📚</span>
                    Course
                  </label>
                  <select
                    value={viewCourseId}
                    onChange={e => {
                      setViewCourseId(e.target.value);
                      setViewExamId("");
                      setResults([]);
                    }}
                    className="w-full border-2 border-emerald-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 p-3 rounded-lg bg-white shadow-sm transition-all duration-200"
                  >
                    <option value="">Select Course</option>
                    {courses.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.course_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <span>🧾</span>
                    Completed Exams
                  </label>
                  <select
                    value={viewExamId}
                    onChange={e => setViewExamId(e.target.value)}
                    className="w-full border-2 border-emerald-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 p-3 rounded-lg bg-white shadow-sm transition-all duration-200 disabled:bg-gray-100"
                    disabled={!viewCourseId}
                  >
                    <option value="">Select Exam</option>
                    {viewExams.map(e => (
                      <option key={e.id} value={e.id}>
                        {e.exam_name} (Total: {e.total_marks})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {results.length > 0 && (
                <>
                  <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg flex items-start gap-3">
                    <span className="text-2xl">📊</span>
                    <div className="text-sm text-emerald-900">
                      <p className="font-semibold">Exam: {results[0]?.exam_name}</p>
                      <p>Course: {results[0]?.course_name}</p>
                      <p>Total Marks: {results[0]?.total_marks}</p>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-gradient-to-r from-emerald-100 to-teal-100 border-b-2 border-emerald-200">
                        <tr>
                          <th className="p-4 text-gray-800 font-semibold">Student</th>
                          <th className="p-4 text-center text-gray-800 font-semibold">Marks</th>
                          <th className="p-4 text-center text-gray-800 font-semibold">Grade</th>
                          <th className="p-4 text-center text-gray-800 font-semibold">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {results.map(r => {
                          const initials = r.student_name
                            .split(" ")
                            .map((n: string) => n[0])
                            .join("")
                            .slice(0, 2)
                            .toUpperCase();

                          const gradeClass =
                            r.grade === "A"
                              ? "bg-emerald-100 text-emerald-800"
                              : r.grade === "B"
                              ? "bg-blue-100 text-blue-800"
                              : r.grade === "C"
                              ? "bg-yellow-100 text-yellow-800"
                              : r.grade === "D"
                              ? "bg-orange-100 text-orange-800"
                              : "bg-red-100 text-red-800";

                          const statusClass =
                            r.status === "Pass"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-red-100 text-red-800";

                          return (
                            <tr key={r.student_id} className="border-t hover:bg-emerald-50/50 transition-colors duration-200">
                              <td className="p-4">
                                <div className="flex items-center gap-3">
                                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 text-white flex items-center justify-center font-bold text-sm shadow-md">
                                    {initials}
                                  </div>
                                  <span className="font-semibold text-gray-800">{r.student_name}</span>
                                </div>
                              </td>
                              <td className="p-4 text-center font-semibold text-gray-800">
                                {r.marks}/{r.total_marks}
                              </td>
                              <td className="p-4 text-center">
                                <span className={`px-3 py-1 rounded-lg font-semibold ${gradeClass}`}>
                                  {r.grade}
                                </span>
                              </td>
                              <td className="p-4 text-center">
                                <span className={`px-3 py-1 rounded-lg font-semibold ${statusClass}`}>
                                  {r.status}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </>
              )}

              {!viewCourseId && (
                <div className="bg-white/90 backdrop-blur rounded-xl border border-dashed border-emerald-200 p-8 text-center text-gray-500">
                  <div className="text-5xl mb-2">🧭</div>
                  <p>Select a course to view exams</p>
                </div>
              )}
              {viewCourseId && viewExams.length === 0 && (
                <div className="bg-white/90 backdrop-blur rounded-xl border border-dashed border-emerald-200 p-8 text-center text-gray-500">
                  <div className="text-5xl mb-2">📭</div>
                  <p>No exams found for this course</p>
                </div>
              )}
              {viewExamId && results.length === 0 && (
                <div className="bg-white/90 backdrop-blur rounded-xl border border-dashed border-emerald-200 p-8 text-center text-gray-500">
                  <div className="text-5xl mb-2">⏳</div>
                  <p>No results available for this exam yet</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
