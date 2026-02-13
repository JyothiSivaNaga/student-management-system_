"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Sidebar() {
  const [role, setRole] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    const user = JSON.parse(localStorage.getItem("user") || "null");
    setRole(user?.role || null);
    setUserName(user?.name || null);
  }, []);

  // Prevent hydration mismatch
  if (!mounted) return null;

  // Hide sidebar if not logged in
  if (!role) return null;

  const logout = () => {
    localStorage.removeItem("user");
    router.push("/login");
  };

  return (
    <aside className="fixed left-0 top-0 w-72 h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-8 shadow-lg overflow-y-auto z-50">
      {/* HEADER */}
      <h2 className="text-3xl font-bold tracking-wider text-white mb-1">
        SMS Panel
      </h2>
      <p className="text-xs text-gray-400 mb-6">Student Management System</p>

      {/* USER INFO */}
      {userName && (
        <div className="mt-2 mb-8 bg-gray-800/50 px-4 py-3 rounded-lg border border-gray-700">
          <p className="text-sm font-semibold text-gray-100">
            {userName}
          </p>
          <p className="text-xs text-gray-400 capitalize mt-1">
            ({role})
          </p>
        </div>
      )}

      <nav className="space-y-7 text-sm">
        {/* ================= ADMIN ================= */}
        {role === "admin" && (
          <>
            <Link
              href="/dashboard"
              className="block font-semibold text-base text-white hover:text-blue-300 hover:translate-x-1 transition-all duration-200"
            >
              Dashboard
            </Link>

            {/* STUDENTS */}
            <div>
              <p className="text-gray-400 uppercase text-xs font-semibold mb-3 tracking-widest">
                📚 Students
              </p>
              <div className="ml-4 space-y-2">
                <Link href="/students" className="block text-gray-300 hover:text-blue-300 hover:translate-x-1 transition-all duration-200 text-sm">
                  View / Update / Delete
                </Link>
                <Link href="/add-student" className="block text-gray-300 hover:text-blue-300 hover:translate-x-1 transition-all duration-200 text-sm">
                  Add Student
                </Link>

              </div>
            </div>

            {/* FACULTY */}
            <div>
              <p className="text-gray-400 uppercase text-xs font-semibold mb-3 tracking-widest">
                👨‍🏫 Faculty
              </p>
              <div className="ml-4 space-y-2">
                <Link
                  href="/admin/faculty/add"
                  className="block text-gray-300 hover:text-blue-300 hover:translate-x-1 transition-all duration-200 text-sm"
                >
                  Add Faculty
                </Link>
                <Link
                  href="/admin/faculty/view"
                  className="block text-gray-300 hover:text-blue-300 hover:translate-x-1 transition-all duration-200 text-sm"
                >
                  View Faculty
                </Link>
                <Link
                  href="/admin/faculty/assign"
                  className="block text-gray-300 hover:text-blue-300 hover:translate-x-1 transition-all duration-200 text-sm"
                >
                  Assign Faculty to Course
                </Link>
              </div>
            </div>

            {/* COURSES */}
            <div>
              <p className="text-gray-400 uppercase text-xs font-semibold mb-3 tracking-widest">
                📖 Courses
              </p>
              <div className="ml-4 space-y-2">
                <Link
                  href="/admin/courses"
                  className="block text-gray-300 hover:text-blue-300 hover:translate-x-1 transition-all duration-200 text-sm"
                >
                  Dashboard
                </Link>
                <Link
                  href="/admin/courses/add"
                  className="block text-gray-300 hover:text-blue-300 hover:translate-x-1 transition-all duration-200 text-sm"
                >
                  Add Course
                </Link>
                <Link
                  href="/admin/courses/view"
                  className="block text-gray-300 hover:text-blue-300 hover:translate-x-1 transition-all duration-200 text-sm"
                >
                  View Courses
                </Link>
                <Link
                  href="/admin/courses/enroll"
                  className="block text-gray-300 hover:text-blue-300 hover:translate-x-1 transition-all duration-200 text-sm"
                >
                  Enroll Students
                </Link>
              </div>
            </div>

            {/* FEES */}
            <div>
              <p className="text-gray-400 uppercase text-xs font-semibold mb-3 tracking-widest">
                💰 Fees Management
              </p>
              <div className="ml-4 space-y-2">
                <Link
                  href="/admin/fees"
                  className="block text-gray-300 hover:text-blue-300 hover:translate-x-1 transition-all duration-200 text-sm"
                >
                  View Fees
                </Link>
                <Link
                  href="/admin/fees/set"
                  className="block text-gray-300 hover:text-blue-300 hover:translate-x-1 transition-all duration-200 text-sm"
                >
                  Set Fee
                </Link>
              </div>
            </div>

            {/* ATTENDANCE */}
            <div>
              <p className="text-gray-400 uppercase text-xs font-semibold mb-3 tracking-widest">
                ✓ Attendance
              </p>
              <div className="ml-4">
                <Link
                  href="/dashboard/attendance"
                  className="block text-gray-300 hover:text-blue-300 hover:translate-x-1 transition-all duration-200 text-sm"
                >
                  Monitoring
                </Link>
              </div>
            </div>

            {/* EXAMS */}
            <div>
              <p className="text-gray-400 uppercase text-xs font-semibold mb-3 tracking-widest">
                📝 Exams
              </p>
              <div className="ml-4">
                <Link
                  href="/admin/exams"
                  className="block text-gray-300 hover:text-blue-300 hover:translate-x-1 transition-all duration-200 text-sm"
                >
                  Manage Exams
                </Link>
              </div>
            </div>

            {/* RESULTS */}
            <div>
              <p className="text-gray-400 uppercase text-xs font-semibold mb-3 tracking-widest">
                📊 Results
              </p>
              <div className="ml-4">
                <Link
                  href="/admin/results"
                  className="block text-gray-300 hover:text-blue-300 hover:translate-x-1 transition-all duration-200 text-sm"
                >
                  View Results
                </Link>
              </div>
            </div>
          </>
        )}

        {/* ================= FACULTY ================= */}
        {role === "faculty" && (
          <>
            <Link
              href="/faculty/dashboard"
              className="block font-semibold text-base hover:text-blue-400"
            >
              Dashboard
            </Link>

            <Link
              href="/faculty/profile"
              className="block hover:text-blue-400"
            >
              Profile
            </Link>

            <Link
              href="/faculty/attendance"
              className="block hover:text-blue-400"
            >
              Attendance
            </Link>

            <Link
              href="/faculty/exams"
              className="block hover:text-blue-400"
            >
              Exams
            </Link>

            <Link
              href="/faculty/results"
              className="block hover:text-blue-400"
            >
              Results
            </Link>
          </>
        )}

        {/* ================= STUDENT ================= */}
        {/* ================= STUDENT ================= */}
        {role === "student" && (
          <>
            <Link href="/profile" className="block hover:text-blue-400">
              Profile
            </Link>

            <Link
              href="/students/attendance"
              className="block hover:text-blue-400"
            >
              Attendance
            </Link>

            <Link
              href="/students/results"
              className="block hover:text-blue-400"
            >
              Results
            </Link>

            <Link
              href="/students/fees"
              className="block hover:text-blue-400"
            >
              💰 Fees
            </Link>
          </>
        )}

      </nav>

      <button
        onClick={logout}
        className="mt-12 w-full bg-red-600 py-3 rounded-lg hover:bg-red-700 hover:shadow-lg transition-all duration-200 font-semibold text-white shadow-md"
      >
        🚪 Logout
      </button>
    </aside>
  );
}
