"use client";

import { useEffect, useState } from "react";

type Course = {
  id: number;
  course_code: string;
  course_name: string;
  department: string;
  year: number;
};

export default function ViewCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/admin/courses")
      .then(res => res.json())
      .then(data => setCourses(data));
  }, []);

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-6xl px-4">
        <h2 className="text-3xl font-bold mb-8 text-gray-800">All Courses</h2>

        <div className="bg-white/80 backdrop-blur rounded-xl shadow-lg overflow-hidden border border-white/20">
          <table className="w-full text-left">
            <thead className="bg-gradient-to-r from-blue-100 to-indigo-100 border-b-2 border-blue-200">
              <tr>
                <th className="p-4 text-gray-800 font-semibold">Code</th>
                <th className="p-4 text-gray-800 font-semibold">Name</th>
                <th className="p-4 text-gray-800 font-semibold">Department</th>
                <th className="p-4 text-gray-800 font-semibold">Year</th>
              </tr>
            </thead>
            <tbody>
              {courses.map(c => (
                <tr key={c.id} className="border-t hover:bg-blue-50/50 transition-colors duration-200">
                  <td className="p-4 text-gray-800 font-medium">{c.course_code}</td>
                  <td className="p-4 text-gray-800">{c.course_name}</td>
                  <td className="p-4 text-gray-700">{c.department}</td>
                  <td className="p-4 text-gray-700">{c.year}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
