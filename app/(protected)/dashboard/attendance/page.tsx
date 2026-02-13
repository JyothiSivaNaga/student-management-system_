"use client";

import { useEffect, useState } from "react";

type Course = {
  id: number;
  course_name: string;
};

type AttendanceRow = {
  student_id: number;
  name: string;
  total_classes: number;
  present_count: number;
  attendance_percentage: number | null;
};

export default function AdminAttendancePage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<number | null>(null);
  const [attendance, setAttendance] = useState<AttendanceRow[]>([]);
  const [loading, setLoading] = useState(false);

  // 🔐 Admin protection
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user.role !== "admin") {
      window.location.href = "/login";
    }
  }, []);

  // Load courses
  useEffect(() => {
    fetch("http://localhost:5000/api/admin/courses")
      .then(res => res.json())
      .then(data => setCourses(data));
  }, []);

  // Load attendance
  useEffect(() => {
    if (!selectedCourse) return;

    setLoading(true);
    fetch(
      `http://localhost:5000/api/admin/attendance/course/${selectedCourse}`
    )
      .then(res => res.json())
      .then(data => setAttendance(data))
      .finally(() => setLoading(false));
  }, [selectedCourse]);

  const getAttendanceStats = () => {
    if (attendance.length === 0) return { lowCount: 0, okCount: 0, avgPercentage: 0 };
    
    const lowCount = attendance.filter(a => (a.attendance_percentage ?? 0) < 75).length;
    const okCount = attendance.length - lowCount;
    const avgPercentage = attendance.reduce((sum, a) => sum + (a.attendance_percentage ?? 0), 0) / attendance.length;
    
    return { lowCount, okCount, avgPercentage: avgPercentage.toFixed(1) };
  };

  const stats = getAttendanceStats();

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-7xl px-4 pb-12">
        {/* Header */}
        <div className="mb-10">
          <p className="text-sm uppercase tracking-wide text-gray-500">Academic</p>
          <h2 className="text-4xl font-bold text-gray-800">📊 Attendance Monitoring</h2>
          <p className="text-gray-600 mt-1">Track student attendance across courses</p>
        </div>

        {/* Course Selector */}
        <div className="mb-10">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Select Course
          </label>
          <select
            className="w-full md:w-96 border-2 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 p-4 rounded-xl shadow-sm transition-all duration-200 font-medium text-gray-700 bg-white hover:border-indigo-300"
            onChange={e => setSelectedCourse(Number(e.target.value))}
            value={selectedCourse || ""}
          >
            <option value="">Choose a course...</option>
            {courses.map(c => (
              <option key={c.id} value={c.id}>
                {c.course_name}
              </option>
            ))}
          </select>
        </div>

        {/* Statistics Cards */}
        {attendance.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-white/85 backdrop-blur border border-blue-100 p-6 rounded-2xl shadow-md">
              <p className="text-blue-600 text-sm font-semibold mb-2">Total Students</p>
              <p className="text-3xl font-bold text-gray-900">{attendance.length}</p>
            </div>
            <div className="bg-white/85 backdrop-blur border border-green-100 p-6 rounded-2xl shadow-md">
              <p className="text-green-600 text-sm font-semibold mb-2">Good Attendance (≥75%)</p>
              <p className="text-3xl font-bold text-gray-900">{stats.okCount}</p>
            </div>
            <div className="bg-white/85 backdrop-blur border border-rose-100 p-6 rounded-2xl shadow-md">
              <p className="text-rose-600 text-sm font-semibold mb-2">Low Attendance (&lt;75%)</p>
              <p className="text-3xl font-bold text-gray-900">{stats.lowCount}</p>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        )}

        {/* Attendance Table */}
        {!loading && attendance.length > 0 && (
          <div className="bg-white/80 backdrop-blur rounded-xl shadow-lg overflow-hidden border border-white/20">
            <table className="w-full text-left">
              <thead className="bg-gradient-to-r from-indigo-100 to-purple-100 border-b-2 border-indigo-200">
                <tr>
                  <th className="p-4 text-gray-800 font-semibold">Student Name</th>
                  <th className="p-4 text-center text-gray-800 font-semibold">Total Classes</th>
                  <th className="p-4 text-center text-gray-800 font-semibold">Present</th>
                  <th className="p-4 text-center text-gray-800 font-semibold">Absent</th>
                  <th className="p-4 text-center text-gray-800 font-semibold">Percentage</th>
                  <th className="p-4 text-center text-gray-800 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {attendance.map(a => {
                  const percentage = Number(a.attendance_percentage ?? 0);
                  const isLow = percentage < 75;
                  const initials = a.name
                    .split(" ")
                    .map(n => n[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase();

                  return (
                    <tr key={a.student_id} className="border-t hover:bg-indigo-50/50 transition-colors duration-200">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm shadow-inner">
                            {initials}
                          </div>
                          <span className="font-semibold text-gray-800">{a.name}</span>
                        </div>
                      </td>
                      <td className="p-4 text-center text-gray-700 font-medium">{a.total_classes}</td>
                      <td className="p-4 text-center text-green-600 font-semibold">{a.present_count}</td>
                      <td className="p-4 text-center text-red-600 font-semibold">
                        {a.total_classes - a.present_count}
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex flex-col items-center gap-1">
                          <span className={`text-lg font-bold ${isLow ? 'text-red-600' : 'text-green-600'}`}>
                            {percentage.toFixed(1)}%
                          </span>
                          <div className="w-24 bg-gray-200 rounded-full h-2 overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-300 ${
                                isLow ? 'bg-red-500' : 'bg-green-500'
                              }`}
                              style={{ width: `${Math.min(percentage, 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        {isLow ? (
                          <span className="px-3 py-1 rounded-full font-semibold text-sm bg-red-100 text-red-800">
                            Low
                          </span>
                        ) : (
                          <span className="px-3 py-1 rounded-full font-semibold text-sm bg-green-100 text-green-800">
                            Good
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Empty State */}
        {!loading && selectedCourse && attendance.length === 0 && (
          <div className="bg-white shadow-lg rounded-2xl p-12 text-center">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-gray-500 text-lg">No attendance records found for this course</p>
          </div>
        )}

        {/* Initial State */}
        {!selectedCourse && (
          <div className="bg-white shadow-lg rounded-2xl p-12 text-center">
            <div className="text-6xl mb-4">🎓</div>
            <p className="text-gray-500 text-lg">Please select a course to view attendance records</p>
          </div>
        )}
      </div>
    </div>
  );
}
