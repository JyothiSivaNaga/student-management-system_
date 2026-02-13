"use client";

import { useEffect, useState } from "react";

type Faculty = {
  id: number;
  name: string;
  email: string;
  department: string;
  designation: string;
};

export default function ViewFacultyPage() {
  const [faculty, setFaculty] = useState<Faculty[]>([]);

  // 🔐 Admin protection
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user.role !== "admin") {
      window.location.href = "/login";
    }
  }, []);

  // 📥 Fetch faculty
  useEffect(() => {
    fetch("http://localhost:5000/api/faculty")
      .then(res => res.json())
      .then(data => setFaculty(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-6xl px-4">
      <h2 className="text-3xl font-bold mb-8 text-gray-800">Faculty Management</h2>

      <div className="bg-white/80 backdrop-blur rounded-xl shadow-lg overflow-hidden border border-white/20">
        <table className="w-full text-left">
          <thead className="bg-gradient-to-r from-blue-100 to-indigo-100 border-b-2 border-blue-200">
            <tr>
              <th className="p-4 text-gray-800 font-semibold">Name</th>
              <th className="p-4 text-gray-800 font-semibold">Email</th>
              <th className="p-4 text-gray-800 font-semibold">Department</th>
              <th className="p-4 text-gray-800 font-semibold">Designation</th>
            </tr>
          </thead>

          <tbody>
            {faculty.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-4 text-center text-gray-500">
                  No faculty found
                </td>
              </tr>
            ) : (
              faculty.map(f => (
                <tr key={f.id} className="border-t hover:bg-blue-50/50 transition-colors duration-200">
                  <td className="p-4 text-gray-800 font-medium">{f.name}</td>
                  <td className="p-4 text-gray-700">{f.email}</td>
                  <td className="p-4 text-gray-700">{f.department}</td>
                  <td className="p-4 text-gray-700">{f.designation}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      </div>
    </div>
  );
}
