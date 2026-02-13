"use client";

import { useEffect, useState } from "react";

type FacultyProfile = {
  name: string;
  email: string;
  department: string;
  designation: string;
};

export default function FacultyProfilePage() {
  const [profile, setProfile] = useState<FacultyProfile | null>(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    // 🔐 Only faculty allowed
    if (user.role !== "faculty") {
      window.location.href = "/login";
      return;
    }

    fetch(`http://localhost:5000/api/faculty/profile/${user.id}`)
      .then(res => res.json())
      .then(data => setProfile(data))
      .catch(err => console.error(err));
  }, []);

  if (!profile) {
    return <p className="p-6">Loading faculty profile...</p>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Faculty Profile</h2>

      <div className="bg-white p-6 rounded-xl shadow max-w-lg space-y-3">
        <p><strong>Name:</strong> {profile.name}</p>
        <p><strong>Email:</strong> {profile.email}</p>
        <p><strong>Department:</strong> {profile.department}</p>
        <p><strong>Designation:</strong> {profile.designation}</p>

        <p className="text-gray-500 text-sm mt-4">
          *Profile data loaded from database*
        </p>
      </div>
    </div>
  );
}
