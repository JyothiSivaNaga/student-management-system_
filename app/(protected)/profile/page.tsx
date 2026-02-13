"use client";

import { useEffect, useState } from "react";

type Course = {
  id: number;
  course_name: string;
  course_code: string;
};

type StudentProfile = {
  id: number;
  name: string;
  email: string;
  department: string;
  year: number;
};

export default function StudentProfilePage() {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    if (user.role !== "student") {
      window.location.href = "/login";
      return;
    }

    // 1️⃣ Get student profile using userId
    fetch(`http://localhost:5000/api/student/profile/${user.id}`)
      .then(res => res.json())
      .then(student => {
        setProfile(student);

        // 2️⃣ Get enrolled courses using studentId
        return fetch(
          `http://localhost:5000/api/student/courses/${student.id}`
        );
      })
      .then(res => res.json())
      .then(courseData => {
        setCourses(courseData);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

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

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-6xl px-4 pb-12">
        {/* Header */}
        <div className="mb-10">
          <p className="text-sm uppercase tracking-wide text-gray-500">Student Portal</p>
          <h2 className="text-4xl font-bold text-gray-800">👤 My Profile</h2>
          <p className="text-gray-600 mt-1">View your personal information and courses</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT COLUMN - Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white/80 backdrop-blur rounded-xl shadow-lg p-8 border border-white/20">
              {/* Profile Picture */}
              <div className="flex flex-col items-center mb-6">
                <div className="relative">
                  <div className="h-32 w-32 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-xl">
                    <span className="text-white text-4xl font-bold">
                      {profile ? getInitials(profile.name) : "?"}
                    </span>
                  </div>
                  <div className="absolute bottom-0 right-0 h-8 w-8 bg-green-500 rounded-full border-4 border-white shadow-lg"></div>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mt-4">{profile?.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{profile?.email}</p>
              </div>

              {/* Profile Details */}
              <div className="space-y-4 pt-6 border-t border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-600 text-lg">🎓</span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Department</p>
                    <p className="text-gray-800 font-semibold">{profile?.department}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
                    <span className="text-purple-600 text-lg">📚</span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Academic Year</p>
                    <p className="text-gray-800 font-semibold">Year {profile?.year}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                    <span className="text-green-600 text-lg">📖</span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Enrolled Courses</p>
                    <p className="text-gray-800 font-semibold">{courses.length} Courses</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                    <span className="text-indigo-600 text-lg">🆔</span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Student ID</p>
                    <p className="text-gray-800 font-semibold">#{profile?.id}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN - Courses */}
          <div className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur rounded-xl shadow-lg p-8 border border-white/20">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">My Courses</h3>
                  <p className="text-gray-600 text-sm mt-1">
                    {courses.length} course{courses.length !== 1 ? 's' : ''} enrolled
                  </p>
                </div>
                <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center">
                  <span className="text-2xl">📚</span>
                </div>
              </div>

              {courses.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📭</div>
                  <p className="text-gray-500 text-lg">You are not enrolled in any courses yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {courses.map((course, index) => {
                    const courseInitials = course.course_name
                      .split(" ")
                      .map(n => n[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase();

                    const colors = [
                      { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200' },
                      { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200' },
                      { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-200' },
                      { bg: 'bg-rose-100', text: 'text-rose-700', border: 'border-rose-200' },
                      { bg: 'bg-indigo-100', text: 'text-indigo-700', border: 'border-indigo-200' },
                      { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-200' },
                    ];
                    const colorScheme = colors[index % colors.length];

                    return (
                      <div
                        key={`${course.id}-${index}`}
                        className={`p-5 rounded-xl border-2 ${colorScheme.border} ${colorScheme.bg} hover:shadow-lg transition-all duration-200 transform hover:scale-105`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`h-12 w-12 rounded-lg ${colorScheme.bg} ${colorScheme.text} flex items-center justify-center font-bold text-sm shadow-inner border-2 ${colorScheme.border}`}>
                            {courseInitials}
                          </div>
                          <div className="flex-1">
                            <h4 className={`font-bold ${colorScheme.text} mb-1 leading-tight`}>
                              {course.course_name}
                            </h4>
                            <p className="text-xs text-gray-600 font-medium">
                              {course.course_code}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Quick Stats */}
            {courses.length > 0 && (
              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="bg-white/80 backdrop-blur border border-blue-100 p-4 rounded-xl shadow-md">
                  <p className="text-blue-600 text-xs font-semibold mb-1">Active</p>
                  <p className="text-2xl font-bold text-gray-900">{courses.length}</p>
                </div>
                <div className="bg-white/80 backdrop-blur border border-green-100 p-4 rounded-xl shadow-md">
                  <p className="text-green-600 text-xs font-semibold mb-1">Credits</p>
                  <p className="text-2xl font-bold text-gray-900">{courses.length * 3}</p>
                </div>
                <div className="bg-white/80 backdrop-blur border border-purple-100 p-4 rounded-xl shadow-md">
                  <p className="text-purple-600 text-xs font-semibold mb-1">Semester</p>
                  <p className="text-2xl font-bold text-gray-900">{profile?.year}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
