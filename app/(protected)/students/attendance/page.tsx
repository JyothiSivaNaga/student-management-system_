"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

type Attendance = {
  course_name: string;
  total_classes: number;
  present_count: number;
  attendance_percentage: number;
};

export default function StudentAttendancePage() {
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    if (user.role !== "student") {
      window.location.href = "/login";
      return;
    }

    // STEP 1: Get student profile by userId
    fetch(`http://localhost:5000/api/student/profile/${user.id}`)
      .then(res => res.json())
      .then(student => {
        // STEP 2: Get attendance using student.id
        return fetch(
          `http://localhost:5000/api/student/attendance/${student.id}`
        );
      })
      .then(res => res.json())
      .then(data => {
        setAttendance(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const getAttendanceStats = () => {
    if (attendance.length === 0) return { total: 0, avgAttendance: 0, lowCount: 0 };
    
    const totalClasses = attendance.reduce((sum, a) => sum + a.total_classes, 0);
    const avgAttendance = attendance.reduce((sum, a) => sum + a.attendance_percentage, 0) / attendance.length;
    const lowCount = attendance.filter(a => a.attendance_percentage < 75).length;
    
    return { total: totalClasses, avgAttendance: avgAttendance.toFixed(1), lowCount };
  };

  const stats = getAttendanceStats();

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
        <div className="mb-10">
          <p className="text-sm uppercase tracking-wide text-gray-500">Academic Progress</p>
          <h2 className="text-4xl font-bold text-gray-800">📊 Attendance Overview</h2>
          <p className="text-gray-600 mt-1">Track your class attendance across all courses</p>
        </div>

        {attendance.length === 0 ? (
          <div className="bg-white shadow-lg rounded-2xl p-12 text-center">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-gray-500 text-lg">No attendance records available yet.</p>
          </div>
        ) : (
          <>
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white/85 backdrop-blur border border-blue-100 p-4 rounded-xl shadow-md">
                <p className="text-blue-600 text-xs font-semibold mb-1">Total Courses</p>
                <p className="text-2xl font-bold text-gray-900">{attendance.length}</p>
              </div>
              <div className="bg-white/85 backdrop-blur border border-purple-100 p-4 rounded-xl shadow-md">
                <p className="text-purple-600 text-xs font-semibold mb-1">Total Classes</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="bg-white/85 backdrop-blur border border-green-100 p-4 rounded-xl shadow-md">
                <p className="text-green-600 text-xs font-semibold mb-1">Average Attendance</p>
                <p className="text-2xl font-bold text-gray-900">{stats.avgAttendance}%</p>
              </div>
              <div className="bg-white/85 backdrop-blur border border-rose-100 p-4 rounded-xl shadow-md">
                <p className="text-rose-600 text-xs font-semibold mb-1">Low Attendance</p>
                <p className="text-2xl font-bold text-gray-900">{stats.lowCount}</p>
              </div>
            </div>

            {/* CHART */}
            <div className="bg-white/80 backdrop-blur rounded-xl shadow-lg p-6 mb-8 border border-white/20">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">Course-wise Attendance</h3>
                  <p className="text-gray-600 text-sm mt-1">Visual representation of your attendance</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                  <span className="text-xl">📈</span>
                </div>
              </div>

              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={attendance}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="course_name" 
                    tick={{ fill: '#6b7280', fontSize: 14 }}
                    axisLine={{ stroke: '#d1d5db' }}
                  />
                  <YAxis 
                    domain={[0, 100]} 
                    tick={{ fill: '#6b7280', fontSize: 14 }}
                    axisLine={{ stroke: '#d1d5db' }}
                    label={{ value: 'Attendance %', angle: -90, position: 'insideLeft', fill: '#6b7280' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Bar
                    dataKey="attendance_percentage"
                    fill="url(#colorGradient)"
                    radius={[8, 8, 0, 0]}
                  />
                  <defs>
                    <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#4f46e5" />
                      <stop offset="100%" stopColor="#7c3aed" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* TABLE */}
            <div className="bg-white/80 backdrop-blur rounded-xl shadow-lg overflow-hidden border border-white/20">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-indigo-100 to-purple-100 border-b-2 border-indigo-200">
                  <tr>
                    <th className="p-4 text-left text-gray-800 font-semibold">Course</th>
                    <th className="p-4 text-center text-gray-800 font-semibold">Total Classes</th>
                    <th className="p-4 text-center text-gray-800 font-semibold">Present</th>
                    <th className="p-4 text-center text-gray-800 font-semibold">Absent</th>
                    <th className="p-4 text-center text-gray-800 font-semibold">Attendance %</th>
                    <th className="p-4 text-center text-gray-800 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {attendance.map((a, i) => {
                    const percentage = Number(a.attendance_percentage ?? 0);
                    const isLow = percentage < 75;
                    const courseInitials = a.course_name
                      .split(" ")
                      .map(n => n[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase();

                    return (
                      <tr key={i} className="border-t hover:bg-indigo-50/50 transition-colors duration-200">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className={`h-10 w-10 rounded-full ${isLow ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'} flex items-center justify-center font-bold text-sm shadow-inner`}>
                              {courseInitials}
                            </div>
                            <span className="font-semibold text-gray-800">{a.course_name}</span>
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
          </>
        )}
      </div>
    </div>
  );
}
