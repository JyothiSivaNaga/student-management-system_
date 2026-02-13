"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [department, setDepartment] = useState("");
  const [year, setYear] = useState("");
  const [designation, setDesignation] = useState("");

  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("http://localhost:5000/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email,
        password,
        role,
        department,
        year: Number(year),
        designation,
      }),
    });

    if (!res.ok) {
      alert("Registration failed");
      return;
    }

    alert("Registered successfully. Please login.");
    router.push("/login");
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{
        backgroundImage: [
          "radial-gradient(circle at 20% 20%, rgba(99,102,241,0.18), transparent 35%)",
          "radial-gradient(circle at 80% 0%, rgba(236,72,153,0.12), transparent 30%)",
          "radial-gradient(circle at 10% 80%, rgba(16,185,129,0.12), transparent 28%)",
          "linear-gradient(135deg, #f9fbff 0%, #eef4ff 100%)"
        ].join(","),
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Light overlay for readability */}
      <div className="absolute inset-0 bg-white/65 backdrop-blur-[1px]" />

      <form
        onSubmit={handleRegister}
        className="relative bg-white/75 backdrop-blur-xl shadow-2xl
  rounded-2xl p-8 w-full max-w-md
  hover:scale-[1.02] transition-transform
  ring-1 ring-white/30 animate-fade-in"
      >

        {/* Icon */}
        <div className="text-center text-4xl mb-3 text-green-700">📝</div>

        <h2 className="text-2xl font-extrabold text-gray-900 text-center mb-1">
          Create Account
        </h2>

        <p className="text-center text-gray-700 text-sm mb-6">
          Register to access the Student Management System
        </p>

        <div className="space-y-4">
          <input
            className="w-full border border-gray-300 p-3 rounded-lg
            focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Full Name"
            required
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="email"
            className="w-full border border-gray-300 p-3 rounded-lg
            focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Email address"
            required
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            className="w-full border border-gray-300 p-3 rounded-lg
            focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Password"
            required
            onChange={(e) => setPassword(e.target.value)}
          />

          <select
            className="w-full border border-gray-300 p-3 rounded-lg
            focus:outline-none focus:ring-2 focus:ring-green-500"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="student">Student</option>
            <option value="faculty">Faculty</option>
          </select>

          {/* STUDENT FIELDS */}
          {role === "student" && (
            <div className="space-y-4">
              <input
                className="w-full border border-gray-300 p-3 rounded-lg
                focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Department"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
              />

              <input
                type="number"
                className="w-full border border-gray-300 p-3 rounded-lg
                focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Year (e.g. 1, 2, 3, 4)"
                value={year}
                onChange={(e) => setYear(e.target.value)}
              />
            </div>
          )}

          {/* FACULTY FIELDS */}
          {role === "faculty" && (
            <div className="space-y-4">
              <input
                className="w-full border border-gray-300 p-3 rounded-lg
                focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Department"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
              />

              <input
                className="w-full border border-gray-300 p-3 rounded-lg
                focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Designation (e.g. Professor)"
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
              />
            </div>
          )}
        </div>

        <button
          type="submit"
          className="w-full mt-6 bg-green-600 text-white py-3 rounded-lg
          font-semibold hover:bg-green-700 transition"
        >
          Register
        </button>

        <p className="text-center text-xs text-gray-600 mt-6">
          © 2026 Student Management System
        </p>
      </form>
    </div>
  );
}
