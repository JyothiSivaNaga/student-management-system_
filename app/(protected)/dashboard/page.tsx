"use client";

import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [totalStudents, setTotalStudents] = useState(0);
  const [totalDepartments, setTotalDepartments] = useState(0);
  const [recentStudents, setRecentStudents] = useState<Array<{id:number,name:string,email:string}>>([]);

  useEffect(() => {
    // 🔐 ROLE CHECK (ADMIN ONLY)
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    if (!user.role || user.role !== "admin") {
      window.location.href = "/login";
      return;
    }

    // 📊 FETCH DASHBOARD DATA
    fetch("http://localhost:5000/api/dashboard")
      .then(res => res.json())
      .then(data => {
        setTotalStudents(data.totalStudents);
        setTotalDepartments(data.totalDepartments);
        // optionally set recent students if provided
        if (data.recentStudents) setRecentStudents(data.recentStudents.slice(0,5));
      })
      .catch(err => console.error(err));
    // also fetch a small recent students list as fallback
    fetch("http://localhost:5000/api/students?limit=5")
      .then(res => res.json())
      .then(list => {
        if (Array.isArray(list) && list.length) setRecentStudents(list.slice(0,5));
      })
      .catch(() => {});
  }, []);

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-6xl px-4">
      {/* Page Title */}
      <div className="flex items-center justify-between mb-8 px-1">
        <div>
          <h2 className="text-4xl font-bold text-gray-800">Dashboard</h2>
          <p className="text-sm text-gray-600 mt-2 font-medium">Overview of students, departments and quick actions</p>
        </div>
        <div className="flex gap-3 items-center">
          <button onClick={() => window.location.href = '/add-student'} className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 hover:shadow-lg transition-all duration-200 font-semibold">+ Add Student</button>
          <button onClick={() => window.location.href = '/dashboard/fees'} className="bg-white text-gray-700 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 hover:shadow-md transition-all duration-200 font-semibold">Fees</button>
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 items-start">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 p-6 rounded-xl shadow-md flex items-start gap-4 min-h-[120px] hover:shadow-xl hover:scale-105 transition-all duration-300">
          <div className="bg-blue-100 p-3 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <p className="text-blue-700 text-sm font-semibold">Total Students</p>
            <p className="text-3xl font-bold mt-1 leading-tight text-blue-900">{totalStudents}</p>
            <p className="text-xs text-blue-600 mt-2">Active across all departments</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 p-6 rounded-xl shadow-md flex items-start gap-4 min-h-[120px] hover:shadow-xl hover:scale-105 transition-all duration-300">
          <div className="bg-green-100 p-3 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h18M3 12h18M3 17h18" />
            </svg>
          </div>
          <div>
            <p className="text-green-700 text-sm font-semibold">Departments</p>
            <p className="text-3xl font-bold mt-1 leading-tight text-green-900">{totalDepartments}</p>
            <p className="text-xs text-green-600 mt-2">Academic & administrative</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 p-6 rounded-xl shadow-md flex items-start gap-4 min-h-[120px] hover:shadow-xl hover:scale-105 transition-all duration-300">
          <div className="bg-amber-100 p-3 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-amber-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3" />
            </svg>
          </div>
          <div>
            <p className="text-amber-700 text-sm font-semibold">Status</p>
            <p className="text-xl font-semibold mt-1 text-green-600">System Active</p>
            <p className="text-xs text-amber-600 mt-2">All services running</p>
          </div>
        </div>
      </div>

      {/* Main grid: recent + placeholder charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white/80 backdrop-blur p-6 rounded-xl shadow-md border border-white/20">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Recent Students</h3>
          {recentStudents.length === 0 ? (
            <p className="text-sm text-gray-500">No recent students available.</p>
          ) : (
            <div className="overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="text-gray-500 border-b">
                    <th className="py-2 text-left">Name</th>
                    <th className="py-2 text-left">Email</th>
                    <th className="py-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {recentStudents.map(s => (
                    <tr key={s.id} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="py-4">{s.name}</td>
                      <td className="py-4 text-gray-600">{s.email}</td>
                      <td className="py-4">
                        <button className="text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-150" onClick={() => window.location.href = `/students/${s.id}`}>View</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="bg-white/80 backdrop-blur p-6 rounded-xl shadow-md border border-white/20">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Quick Overview</h3>
          <p className="text-sm text-gray-600">Use the quick actions to add students, manage fees, or review results.</p>
          <div className="mt-4 flex flex-col gap-3">
            <button onClick={() => window.location.href = '/add-student'} className="w-full bg-blue-600 text-white py-2 rounded-lg shadow-md hover:bg-blue-700 hover:shadow-lg transition-all duration-200 font-semibold">Add Student</button>
            <button onClick={() => window.location.href = '/dashboard/fees'} className="w-full border border-gray-300 py-2 rounded-lg hover:bg-gray-50 hover:shadow-md transition-all duration-200 font-semibold">Manage Fees</button>
            <button onClick={() => window.location.href = '/dashboard/results'} className="w-full border border-gray-300 py-2 rounded-lg hover:bg-gray-50 hover:shadow-md transition-all duration-200 font-semibold">View Results</button>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
