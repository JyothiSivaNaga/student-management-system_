"use client";

import { useEffect, useState } from "react";

export default function AddFacultyPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [department, setDepartment] = useState("");
  const [designation, setDesignation] = useState("");

  // 🔐 ADMIN ONLY
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user.role !== "admin") {
      window.location.href = "/login";
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("http://localhost:5000/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email,
        password,
        role: "faculty",
        department,
        designation,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Failed to add faculty");
      return;
    }

    alert("Faculty added successfully!");

    // Reset form
    setName("");
    setEmail("");
    setPassword("");
    setDepartment("");
    setDesignation("");
  };

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-2xl px-4">
      <h2 className="text-4xl font-bold mb-8 text-gray-800">Add Faculty</h2>

      <div className="bg-white/80 backdrop-blur p-8 rounded-xl shadow-lg max-w-lg mx-auto border border-white/20">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Faculty Name</label>
            <input
              className="w-full border-2 border-gray-300 focus:border-blue-500 focus:outline-none p-3 rounded-lg transition-colors duration-200 bg-white/50"
              placeholder="Enter faculty name"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
            <input
              className="w-full border-2 border-gray-300 focus:border-blue-500 focus:outline-none p-3 rounded-lg transition-colors duration-200 bg-white/50"
              placeholder="faculty@example.com"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Temporary Password</label>
            <input
              className="w-full border-2 border-gray-300 focus:border-blue-500 focus:outline-none p-3 rounded-lg transition-colors duration-200 bg-white/50"
              placeholder="Enter temporary password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Department</label>
            <input
              className="w-full border-2 border-gray-300 focus:border-blue-500 focus:outline-none p-3 rounded-lg transition-colors duration-200 bg-white/50"
              placeholder="e.g., CS, IT, EEE"
              value={department}
              onChange={e => setDepartment(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Designation</label>
            <input
              className="w-full border-2 border-gray-300 focus:border-blue-500 focus:outline-none p-3 rounded-lg transition-colors duration-200 bg-white/50"
              placeholder="e.g., Assistant Professor"
              value={designation}
              onChange={e => setDesignation(e.target.value)}
              required
            />
          </div>

          <button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg transition-all duration-200 font-semibold mt-6">
            Add Faculty
          </button>
        </form>
      </div>
      </div>
    </div>
  );
}
