"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Course = {
  id: number;
  course_name: string;
  department: string;
};

export default function FacultyDashboardPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "null");

    // 🔐 Protect route
    if (!user || user.role !== "faculty") {
      router.push("/login");
      return;
    }

    fetch(`http://localhost:5000/api/faculty/courses/${user.id}`)
      .then(res => res.json())
      .then(data => {
        setCourses(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [router]);

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
        {/* HEADER */}
        <div className="mb-8">
          <p className="text-sm uppercase tracking-wide text-gray-500">Teaching Portal</p>
          <h2 className="text-4xl font-bold text-gray-800">👨‍🏫 Faculty Dashboard</h2>
          <p className="text-gray-600 mt-1">Manage your courses and track student progress</p>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white/85 backdrop-blur border border-blue-100 p-4 rounded-xl shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-xs font-semibold mb-1">Assigned Courses</p>
                <p className="text-2xl font-bold text-gray-900">{courses.length}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-2xl">📚</span>
              </div>
            </div>
          </div>

          <div className="bg-white/85 backdrop-blur border border-purple-100 p-4 rounded-xl shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 text-xs font-semibold mb-1">Department</p>
                <p className="text-xl font-bold text-gray-900">
                  {courses[0]?.department || "—"}
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                <span className="text-2xl">🏢</span>
              </div>
            </div>
          </div>

          <div className="bg-white/85 backdrop-blur border border-green-100 p-4 rounded-xl shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-xs font-semibold mb-1">Status</p>
                <p className="text-xl font-bold text-green-600">Active</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                <span className="text-2xl">✅</span>
              </div>
            </div>
          </div>
        </div>

        {/* COURSES */}
        <div className="bg-white/80 backdrop-blur rounded-xl shadow-lg border border-white/20">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-gray-800">My Courses</h3>
                <p className="text-gray-600 text-sm mt-1">{courses.length} course{courses.length !== 1 ? 's' : ''} assigned</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center">
                <span className="text-2xl">🎓</span>
              </div>
            </div>
          </div>

          {courses.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-6xl mb-4">📭</div>
              <p className="text-gray-500 text-lg">No courses assigned yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gradient-to-r from-indigo-100 to-purple-100 border-b-2 border-indigo-200">
                  <tr>
                    <th className="p-4 text-gray-800 font-semibold">Course Name</th>
                    <th className="p-4 text-gray-800 font-semibold">Department</th>
                    <th className="p-4 text-center text-gray-800 font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map((course) => {
                    const courseInitials = course.course_name
                      .split(" ")
                      .map(n => n[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase();

                    return (
                      <tr key={course.id} className="border-t hover:bg-indigo-50/50 transition-colors duration-200">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm shadow-inner">
                              {courseInitials}
                            </div>
                            <span className="font-semibold text-gray-800">{course.course_name}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium">
                            {course.department}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <button
                            onClick={() => router.push("/faculty/attendance")}
                            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                          >
                            📝 Mark Attendance
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
    </div>
  );
}
