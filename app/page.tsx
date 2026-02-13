"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function HomePage() {
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem("user");

    if (!raw) {
      setChecked(true);
      return;
    }

    try {
      const user = JSON.parse(raw);

      if (user?.role === "admin") router.replace("/dashboard");
      else if (user?.role === "faculty") router.replace("/faculty");
      else if (user?.role === "student") router.replace("/profile");
      else setChecked(true);
    } catch {
      localStorage.removeItem("user");
      setChecked(true);
    }
  }, [router]);

  // ⛔ Prevent flicker
  if (!checked) return null;

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{
        backgroundImage: "url('/education-bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Card */}
      <div
        className="relative bg-white/70 backdrop-blur-xl shadow-2xl
  rounded-2xl p-10 w-full max-w-md text-center
  hover:scale-[1.02] transition-transform
  ring-1 ring-white/30 animate-fade-in"
      >

        {/* Icon */}
        <div className="text-5xl mb-4 text-green-700">🎓</div>

        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
          Student Management System
        </h1>

        <p className="text-gray-700 mb-8">
          Login or register to manage students, fees, attendance and results
        </p>

        <div className="space-y-4">
          <a
            href="/login"
            className="block w-full py-3 rounded-lg bg-blue-600 text-white 
            font-semibold hover:bg-blue-700 transition"
          >
            Login
          </a>

          <a
            href="/register"
            className="block w-full py-3 rounded-lg bg-green-600 text-white 
            font-semibold hover:bg-green-700 transition"
          >
            Register
          </a>
        </div>

        {/* Footer */}
        <p className="text-xs text-gray-600 mt-6">
          © 2026 Student Management System
        </p>
      </div>
    </div>
  );
}
