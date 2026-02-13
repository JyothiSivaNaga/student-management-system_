"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function CoursesDashboard() {
  const [courses, setCourses] = useState<any[]>([]);
  const [stats, setStats] = useState({ total: 0, active: 0 });

  useEffect(() => {
    // Fetch courses
    fetch("http://localhost:5000/api/admin/courses")
      .then(res => res.json())
      .then(data => {
        setCourses(data.slice(0, 5)); // Get top 5 recent courses
        setStats({ total: data.length, active: data.length });
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-7xl px-4">
      <h2 className="text-4xl font-bold mb-10 text-gray-800">Courses Management</h2>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-2 border-indigo-200 p-6 rounded-xl shadow-md">
          <p className="text-indigo-600 text-sm font-semibold mb-2">Total Courses</p>
          <p className="text-3xl font-bold text-indigo-900">{stats.total}</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 p-6 rounded-xl shadow-md">
          <p className="text-green-600 text-sm font-semibold mb-2">Active Courses</p>
          <p className="text-3xl font-bold text-green-900">{stats.active}</p>
        </div>
        <div className="bg-gradient-to-br from-amber-50 to-amber-100 border-2 border-amber-200 p-6 rounded-xl shadow-md">
          <p className="text-amber-600 text-sm font-semibold mb-2">Departments</p>
          <p className="text-3xl font-bold text-amber-900">5</p>
        </div>
        <div className="bg-gradient-to-br from-rose-50 to-rose-100 border-2 border-rose-200 p-6 rounded-xl shadow-md">
          <p className="text-rose-600 text-sm font-semibold mb-2">Enrollments</p>
          <p className="text-3xl font-bold text-rose-900">25+</p>
        </div>
      </div>

      {/* Quick Actions */}
      <h3 className="text-2xl font-bold mb-6 text-gray-800">Quick Actions</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
        <Link
          href="/admin/courses/add"
          className="group bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200 p-8 rounded-2xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
        >
          <div className="flex items-start gap-4">
            <div className="bg-purple-200 p-4 rounded-xl group-hover:bg-purple-300 transition-colors duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-purple-900 mb-2">Add Course</h3>
              <p className="text-purple-700 text-sm">Create a new course</p>
            </div>
          </div>
        </Link>

        <Link
          href="/admin/courses/view"
          className="group bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 p-8 rounded-2xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
        >
          <div className="flex items-start gap-4">
            <div className="bg-blue-200 p-4 rounded-xl group-hover:bg-blue-300 transition-colors duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-blue-900 mb-2">View Courses</h3>
              <p className="text-blue-700 text-sm">See all courses</p>
            </div>
          </div>
        </Link>

        <Link
          href="/admin/courses/enroll"
          className="group bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 p-8 rounded-2xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
        >
          <div className="flex items-start gap-4">
            <div className="bg-green-200 p-4 rounded-xl group-hover:bg-green-300 transition-colors duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-green-900 mb-2">Enroll Students</h3>
              <p className="text-green-700 text-sm">Assign students to courses</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Recent Courses */}
      {courses.length > 0 && (
        <div className="mb-10">
          <h3 className="text-2xl font-bold mb-6 text-gray-800">Recent Courses</h3>
          <div className="bg-white/80 backdrop-blur rounded-xl shadow-lg overflow-hidden border border-white/20">
            <table className="w-full text-left">
              <thead className="bg-gradient-to-r from-blue-100 to-indigo-100 border-b-2 border-blue-200">
                <tr>
                  <th className="p-4 text-gray-800 font-semibold">Course Name</th>
                  <th className="p-4 text-gray-800 font-semibold">Code</th>
                  <th className="p-4 text-gray-800 font-semibold">Department</th>
                  <th className="p-4 text-gray-800 font-semibold">Credits</th>
                </tr>
              </thead>
              <tbody>
                {courses.map(course => (
                  <tr key={course.id} className="border-t hover:bg-blue-50/50 transition-colors duration-200">
                    <td className="p-4 text-gray-800 font-medium">{course.course_name}</td>
                    <td className="p-4 text-gray-700">{course.course_code}</td>
                    <td className="p-4 text-gray-700">{course.department}</td>
                    <td className="p-4 text-gray-700">{course.credits || 3}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tips Section */}
      <div className="bg-gradient-to-r from-cyan-50 to-blue-50 border-2 border-cyan-200 rounded-xl p-6 shadow-md">
        <h3 className="text-lg font-bold text-cyan-900 mb-3">💡 Quick Tips</h3>
        <ul className="space-y-2 text-cyan-800 text-sm">
          <li>• Use course codes to organize courses systematically</li>
          <li>• Assign faculty to courses for better management</li>
          <li>• Regularly update course information to keep data current</li>
          <li>• Enroll students in courses before the semester begins</li>
        </ul>
      </div>
      </div>
    </div>
  );
}
