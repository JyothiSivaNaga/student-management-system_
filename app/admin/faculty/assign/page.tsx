"use client";

import { useEffect, useState } from "react";

type Faculty = {
  id: number;
  name: string;
};

type Course = {
  id: number;
  course_name: string;
};

export default function AssignFacultyPage() {
  const [facultyList, setFacultyList] = useState<Faculty[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [facultyId, setFacultyId] = useState("");
  const [courseId, setCourseId] = useState("");

  // 🔐 Admin protection
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user.role !== "admin") {
      window.location.href = "/login";
    }
  }, []);

  // Load faculty
  useEffect(() => {
    fetch("http://localhost:5000/api/admin/faculty")
      .then(res => res.json())
      .then(data => setFacultyList(data))
      .catch(err => console.error(err));
  }, []);

  // Load courses
  useEffect(() => {
    fetch("http://localhost:5000/api/admin/courses")
      .then(res => res.json())
      .then(data => setCourses(data))
      .catch(err => console.error(err));
  }, []);

  const handleAssign = async () => {
    if (!facultyId || !courseId) {
      alert("Select both faculty and course");
      return;
    }

    const res = await fetch(
      "http://localhost:5000/api/admin/assign-faculty",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          faculty_id: Number(facultyId),
          course_id: Number(courseId),
        }),
      }
    );

    if (!res.ok) {
      alert("Assignment failed");
      return;
    }

    alert("Faculty assigned to course successfully");
    setFacultyId("");
    setCourseId("");
  };

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-2xl px-4">
      <h2 className="text-4xl font-bold mb-8 text-gray-800">
        Assign Faculty to Course
      </h2>

      <div className="bg-white/80 backdrop-blur p-8 rounded-xl shadow-lg max-w-lg mx-auto border border-white/20">
      <div className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Select Faculty</label>
          <select
            className="w-full border-2 border-gray-300 focus:border-blue-500 focus:outline-none p-3 rounded-lg transition-colors duration-200 bg-white/50"
            value={facultyId}
            onChange={e => setFacultyId(e.target.value)}
          >
            <option value="">Select Faculty</option>
            {facultyList.map(f => (
              <option key={f.id} value={f.id}>
                {f.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Select Course</label>
          <select
            className="w-full border-2 border-gray-300 focus:border-blue-500 focus:outline-none p-3 rounded-lg transition-colors duration-200 bg-white/50"
            value={courseId}
            onChange={e => setCourseId(e.target.value)}
          >
            <option value="">Select Course</option>
            {courses.map(c => (
              <option key={c.id} value={c.id}>
                {c.course_name}
              </option>
            ))}
          </select>
        </div>

      <button
        onClick={handleAssign}
        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg transition-all duration-200 font-semibold mt-6"
      >
        Assign Faculty
      </button>
      </div>
      </div>
      </div>
    </div>
  );
}
