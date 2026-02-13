"use client";

import { useState } from "react";

export default function AddCoursePage() {
  const [courseCode, setCourseCode] = useState("");
  const [courseName, setCourseName] = useState("");
  const [department, setDepartment] = useState("");
  const [year, setYear] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("http://localhost:5000/api/admin/courses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        course_code: courseCode,
        course_name: courseName,
        department,
        year: Number(year),
      }),
    });

    if (!res.ok) {
      alert("Failed to add course");
      return;
    }

    alert("Course added successfully!");
    setCourseCode("");
    setCourseName("");
    setDepartment("");
    setYear("");
  };

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-2xl px-4">
        <h2 className="text-3xl font-bold mb-8 text-gray-800">Add Course</h2>

        <form
          onSubmit={handleSubmit}
          className="bg-white/80 backdrop-blur p-8 rounded-2xl shadow-xl border border-white/20 space-y-6"
        >
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Course Code
            </label>
            <input
              className="w-full border-2 border-gray-300 p-3 rounded-lg focus:border-blue-500 focus:outline-none transition-colors duration-200"
              placeholder="e.g., CS101"
              value={courseCode}
              onChange={e => setCourseCode(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Course Name
            </label>
            <input
              className="w-full border-2 border-gray-300 p-3 rounded-lg focus:border-blue-500 focus:outline-none transition-colors duration-200"
              placeholder="e.g., Introduction to Computer Science"
              value={courseName}
              onChange={e => setCourseName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Department
            </label>
            <input
              className="w-full border-2 border-gray-300 p-3 rounded-lg focus:border-blue-500 focus:outline-none transition-colors duration-200"
              placeholder="e.g., Computer Science"
              value={department}
              onChange={e => setDepartment(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Year
            </label>
            <input
              type="number"
              className="w-full border-2 border-gray-300 p-3 rounded-lg focus:border-blue-500 focus:outline-none transition-colors duration-200"
              placeholder="e.g., 1"
              value={year}
              onChange={e => setYear(e.target.value)}
              required
            />
          </div>

          <button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
            Add Course
          </button>
        </form>
      </div>
    </div>
  );
}
