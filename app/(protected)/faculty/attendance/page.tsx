"use client";

import { useEffect, useState } from "react";

type Course = {
  id: number;
  course_name: string;
};

type StudentAttendance = {
  student_id: number;
  name: string;
};

export default function FacultyAttendancePage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<number | null>(null);
  const [students, setStudents] = useState<StudentAttendance[]>([]);
  const [date, setDate] = useState("");

  // 🔐 Faculty-only
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user.role !== "faculty") {
      window.location.href = "/login";
    }
  }, []);

  // Load courses
  useEffect(() => {
    fetch("http://localhost:5000/api/admin/courses")
      .then(res => res.json())
      .then(setCourses);
  }, []);

  // Load students
  useEffect(() => {
    if (!selectedCourse) return;

    fetch(`http://localhost:5000/api/faculty/attendance/course/${selectedCourse}`)
      .then(res => res.json())
      .then(setStudents);
  }, [selectedCourse]);

  // ✅ SINGLE correct function
 const markAttendance = async (
  student_id: number,
  status: "present" | "absent"
) => {
  if (!date || !selectedCourse) {
    alert("Please select course and date");
    return;
  }

  const res = await fetch("http://localhost:5000/api/faculty/attendance", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      student_id,
      course_id: selectedCourse,
      date,
      status,
    }),
  });

  if (!res.ok) {
    alert("Failed to mark attendance");
    return;
  }

  alert(`Attendance marked as ${status.toUpperCase()}`);
};


  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-7xl px-4 pb-12">
        {/* HEADER */}
        <div className="mb-8">
          <p className="text-sm uppercase tracking-wide text-gray-500">Faculty Portal</p>
          <h2 className="text-4xl font-bold text-gray-800">📝 Mark Attendance</h2>
          <p className="text-gray-600 mt-1">Record student attendance for your courses</p>
        </div>

        {/* FILTERS */}
        <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 backdrop-blur rounded-xl shadow-lg p-6 mb-8 border border-white/20">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">🎯</span>
            <h3 className="text-lg font-semibold text-gray-800">Select Course & Date</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Course</label>
              <select
                className="w-full border-2 border-indigo-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 p-3 rounded-lg bg-white shadow-sm transition-all duration-200"
                onChange={e => setSelectedCourse(Number(e.target.value))}
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
              <input
                type="date"
                className="w-full border-2 border-indigo-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 p-3 rounded-lg bg-white shadow-sm transition-all duration-200"
                value={date}
                onChange={e => setDate(e.target.value)}
              />
            </div>
          </div>

          {selectedCourse && date && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
              <span className="text-xl">✅</span>
              <p className="text-green-700 text-sm font-medium">
                Ready to mark attendance
              </p>
            </div>
          )}
        </div>

        {/* STUDENTS TABLE */}
        {students.length > 0 && (
          <div className="bg-white/80 backdrop-blur rounded-xl shadow-lg border border-white/20">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">Students</h3>
                  <p className="text-gray-600 text-sm mt-1">{students.length} student{students.length !== 1 ? 's' : ''} enrolled</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center">
                  <span className="text-2xl">👥</span>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gradient-to-r from-indigo-100 to-purple-100 border-b-2 border-indigo-200">
                  <tr>
                    <th className="p-4 text-gray-800 font-semibold">Student</th>
                    <th className="p-4 text-center text-gray-800 font-semibold">Mark Present</th>
                    <th className="p-4 text-center text-gray-800 font-semibold">Mark Absent</th>
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
                      <tr key={s.student_id} className="border-t hover:bg-indigo-50/50 transition-colors duration-200">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 text-white flex items-center justify-center font-bold text-sm shadow-md">
                              {initials}
                            </div>
                            <span className="font-semibold text-gray-800">{s.name}</span>
                          </div>
                        </td>
                        <td className="p-4 text-center">
                          <button
                            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-2 rounded-lg font-semibold shadow hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center gap-2 mx-auto"
                            onClick={() => markAttendance(s.student_id, "present")}
                          >
                            <span>✓</span>
                            Present
                          </button>
                        </td>
                        <td className="p-4 text-center">
                          <button
                            className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white px-6 py-2 rounded-lg font-semibold shadow hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center gap-2 mx-auto"
                            onClick={() => markAttendance(s.student_id, "absent")}
                          >
                            <span>✗</span>
                            Absent
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* EMPTY STATE */}
        {selectedCourse && date && students.length === 0 && (
          <div className="bg-white/80 backdrop-blur rounded-xl shadow-lg border border-white/20 p-12 text-center">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-gray-500 text-lg">No students enrolled in this course</p>
          </div>
        )}

        {/* NO SELECTION STATE */}
        {(!selectedCourse || !date) && (
          <div className="bg-white/80 backdrop-blur rounded-xl shadow-lg border border-white/20 p-12 text-center">
            <div className="text-6xl mb-4">🎯</div>
            <p className="text-gray-500 text-lg">Please select a course and date to view students</p>
          </div>
        )}
      </div>
    </div>
  );
}
