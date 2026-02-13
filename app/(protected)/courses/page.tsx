"use client";

import { useEffect, useState } from "react";

type Course = {
  id: number;
  course_code: string;
  course_name: string;
  department: string;
  year: number;
};

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/admin/courses")
      .then(res => res.json())
      .then(data => setCourses(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Courses</h2>

      <table className="w-full bg-white rounded shadow">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-3">Code</th>
            <th className="p-3">Name</th>
            <th className="p-3">Department</th>
            <th className="p-3">Year</th>
          </tr>
        </thead>
        <tbody>
          {courses.map(c => (
            <tr key={c.id} className="border-t">
              <td className="p-3">{c.course_code}</td>
              <td className="p-3">{c.course_name}</td>
              <td className="p-3">{c.department}</td>
              <td className="p-3">{c.year}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
