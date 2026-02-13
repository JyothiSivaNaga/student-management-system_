"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("http://localhost:5000/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message);
      return;
    }

    localStorage.setItem("user", JSON.stringify(data));

    // ROLE-BASED REDIRECT
    if (data.role === "admin") router.push("/dashboard");
    else if (data.role === "faculty") router.push("/faculty");
    else if (data.role === "student") router.push("/profile");
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
        onSubmit={handleLogin}
        className="relative bg-white/75 backdrop-blur-xl shadow-2xl
  rounded-2xl p-8 w-full max-w-md
  hover:scale-[1.02] transition-transform
  ring-1 ring-white/30 animate-fade-in"
      >

        {/* Icon */}
        <div className="text-center text-4xl mb-3 text-blue-700">🔐</div>

        <h2 className="text-2xl font-extrabold text-gray-900 text-center mb-1">
          Welcome Back
        </h2>

        <p className="text-center text-gray-700 mb-6 text-sm">
          Login to continue to Student Management System
        </p>

        <div className="space-y-4">
          <input
            type="email"
            className="w-full border border-gray-300 p-3 rounded-lg
            focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            className="w-full border border-gray-300 p-3 rounded-lg
            focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg
          font-semibold hover:bg-blue-700 transition"
        >
          Login
        </button>

        {/* Footer */}
        <p className="text-center text-xs text-gray-600 mt-6">
          © 2026 Student Management System
        </p>
      </form>
    </div>
  );
}
