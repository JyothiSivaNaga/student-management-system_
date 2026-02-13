"use client";

import { useEffect, useState } from "react";

export default function FacultyExamsPage() {
  const [courses, setCourses] = useState<{ id: number; course_name: string; department: string }[]>([]);
  const [courseId, setCourseId] = useState("");
  const [examName, setExamName] = useState("");
  const [examDate, setExamDate] = useState("");
  const [totalMarks, setTotalMarks] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("http://localhost:5000/api/admin/courses")
      .then(res => res.json())
      .then(setCourses);
  }, []);

  const createExam = async () => {
    if (!courseId || !examName || !examDate || !totalMarks) {
      alert("⚠️ Please fill all fields");
      return;
    }

    setLoading(true);

    const res = await fetch("http://localhost:5000/api/faculty/exams", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        course_id: courseId,
        exam_name: examName,
        exam_date: examDate,
        total_marks: totalMarks
      })
    });

    if (res.ok) {
      alert("✅ Exam created successfully!");
      setCourseId("");
      setExamName("");
      setExamDate("");
      setTotalMarks("");
    } else {
      alert("❌ Failed to create exam");
    }
    setLoading(false);
  };

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-4xl px-4 pb-12">
        {/* HEADER */}
        <div className="mb-8">
          <p className="text-sm uppercase tracking-wide text-gray-500">Faculty Portal</p>
          <h2 className="text-4xl font-bold text-gray-800">📝 Create Exam</h2>
          <p className="text-gray-600 mt-1">Set up a new exam for your course</p>
        </div>

        {/* FORM CARD */}
        <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 backdrop-blur rounded-xl shadow-lg border border-white/20">
          <div className="p-6 border-b border-indigo-200">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center">
                <span className="text-2xl">📋</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">Exam Details</h3>
                <p className="text-gray-600 text-sm">Fill in all required information</p>
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="space-y-5">
              {/* Course Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <span>📚</span>
                  Course
                  <span className="text-red-500">*</span>
                </label>
                <select
                  className="w-full border-2 border-indigo-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 p-3 rounded-lg bg-white shadow-sm transition-all duration-200 text-gray-800"
                  value={courseId}
                  onChange={e => setCourseId(e.target.value)}
                >
                  <option value="">Select Course</option>
                  {courses.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.course_name} - {c.department}
                    </option>
                  ))}
                </select>
              </div>

              {/* Exam Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <span>✏️</span>
                  Exam Name
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="w-full border-2 border-indigo-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 p-3 rounded-lg bg-white shadow-sm transition-all duration-200"
                  placeholder="e.g., Mid-Term Exam, Final Exam"
                  value={examName}
                  onChange={e => setExamName(e.target.value)}
                />
              </div>

              {/* Date and Total Marks */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <span>📅</span>
                    Exam Date
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    className="w-full border-2 border-indigo-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 p-3 rounded-lg bg-white shadow-sm transition-all duration-200"
                    value={examDate}
                    onChange={e => setExamDate(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <span>💯</span>
                    Total Marks
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    className="w-full border-2 border-indigo-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 p-3 rounded-lg bg-white shadow-sm transition-all duration-200"
                    placeholder="e.g., 100"
                    value={totalMarks}
                    onChange={e => setTotalMarks(e.target.value)}
                    min="1"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-8 flex items-center gap-4">
              <button
                onClick={createExam}
                disabled={loading}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-8 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 disabled:hover:scale-100 transition-all duration-200 flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <span>✨</span>
                    Create Exam
                  </>
                )}
              </button>

              {(courseId || examName || examDate || totalMarks) && !loading && (
                <button
                  onClick={() => {
                    setCourseId("");
                    setExamName("");
                    setExamDate("");
                    setTotalMarks("");
                  }}
                  className="text-gray-600 hover:text-gray-800 px-4 py-3 rounded-lg font-medium transition-colors duration-200"
                >
                  Clear Form
                </button>
              )}
            </div>

            {/* Helper Text */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
              <span className="text-xl">💡</span>
              <div>
                <p className="text-blue-800 text-sm font-medium mb-1">Quick Tips</p>
                <ul className="text-blue-700 text-sm space-y-1">
                  <li>• Choose the course you're teaching</li>
                  <li>• Use clear exam names (e.g., "Mid-Term", "Final")</li>
                  <li>• Set the exam date for student preparation</li>
                  <li>• Enter total marks for grading reference</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
