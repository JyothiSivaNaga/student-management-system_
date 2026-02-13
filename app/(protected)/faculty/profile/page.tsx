"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type FacultyProfile = {
  id: number;
  name: string;
  email: string;
  department: string;
  designation: string;
};

export default function FacultyProfilePage() {
  const [profile, setProfile] = useState<FacultyProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "null");

    // 🔐 Protect route
    if (!user || user.role !== "faculty") {
      router.push("/login");
      return;
    }

    fetch(`http://localhost:5000/api/faculty/profile/${user.id}`)
      .then(res => {
        if (!res.ok) {
          throw new Error("Failed to fetch faculty profile");
        }
        return res.json();
      })
      .then(data => {
        setProfile(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [router]);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="bg-white shadow-lg rounded-2xl p-12 text-center">
        <div className="text-6xl mb-4">❌</div>
        <p className="text-red-500 text-lg">Faculty profile not found</p>
      </div>
    );
  }

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-5xl px-4 pb-12">
        {/* Header */}
        <div className="mb-10">
          <p className="text-sm uppercase tracking-wide text-gray-500">Faculty Portal</p>
          <h2 className="text-4xl font-bold text-gray-800">👨‍🏫 My Profile</h2>
          <p className="text-gray-600 mt-1">View your professional information</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card - Left */}
          <div className="lg:col-span-1">
            <div className="bg-white/80 backdrop-blur rounded-xl shadow-lg p-8 border border-white/20">
              {/* Profile Picture */}
              <div className="flex flex-col items-center mb-6">
                <div className="relative">
                  <div className="h-32 w-32 rounded-full bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 flex items-center justify-center shadow-xl">
                    <span className="text-white text-4xl font-bold">
                      {getInitials(profile.name)}
                    </span>
                  </div>
                  <div className="absolute bottom-0 right-0 h-8 w-8 bg-green-500 rounded-full border-4 border-white shadow-lg"></div>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mt-4">{profile.name}</h3>
                <p className="text-sm text-indigo-600 font-semibold mt-1">{profile.designation}</p>
                <p className="text-sm text-gray-500 mt-1">{profile.email}</p>
              </div>

              {/* Quick Info */}
              <div className="space-y-4 pt-6 border-t border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-600 text-lg">🏢</span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Department</p>
                    <p className="text-gray-800 font-semibold">{profile.department}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
                    <span className="text-purple-600 text-lg">👤</span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Role</p>
                    <p className="text-gray-800 font-semibold">{profile.designation}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                    <span className="text-indigo-600 text-lg">🆔</span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Faculty ID</p>
                    <p className="text-gray-800 font-semibold">#{profile.id}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Details Section - Right */}
          <div className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur rounded-xl shadow-lg p-8 border border-white/20">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">Professional Details</h3>
                  <p className="text-gray-600 text-sm mt-1">Your academic information</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center">
                  <span className="text-2xl">📋</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-5 rounded-xl border-2 border-blue-200 bg-blue-50 hover:shadow-lg transition-all duration-200">
                  <div className="flex items-start gap-3">
                    <div className="h-12 w-12 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm shadow-inner border-2 border-blue-200">
                      👤
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-blue-600 font-semibold mb-1">Full Name</p>
                      <p className="text-blue-900 font-bold">{profile.name}</p>
                    </div>
                  </div>
                </div>

                <div className="p-5 rounded-xl border-2 border-green-200 bg-green-50 hover:shadow-lg transition-all duration-200">
                  <div className="flex items-start gap-3">
                    <div className="h-12 w-12 rounded-lg bg-green-100 text-green-700 flex items-center justify-center font-bold text-sm shadow-inner border-2 border-green-200">
                      ✉️
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-green-600 font-semibold mb-1">Email Address</p>
                      <p className="text-green-900 font-bold break-all">{profile.email}</p>
                    </div>
                  </div>
                </div>

                <div className="p-5 rounded-xl border-2 border-purple-200 bg-purple-50 hover:shadow-lg transition-all duration-200">
                  <div className="flex items-start gap-3">
                    <div className="h-12 w-12 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-sm shadow-inner border-2 border-purple-200">
                      🏢
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-purple-600 font-semibold mb-1">Department</p>
                      <p className="text-purple-900 font-bold">{profile.department}</p>
                    </div>
                  </div>
                </div>

                <div className="p-5 rounded-xl border-2 border-indigo-200 bg-indigo-50 hover:shadow-lg transition-all duration-200">
                  <div className="flex items-start gap-3">
                    <div className="h-12 w-12 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm shadow-inner border-2 border-indigo-200">
                      🎓
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-indigo-600 font-semibold mb-1">Designation</p>
                      <p className="text-indigo-900 font-bold">{profile.designation}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                <p className="text-sm text-blue-700">
                  <span className="font-semibold">ℹ️ Note:</span> Profile data loaded from database
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
