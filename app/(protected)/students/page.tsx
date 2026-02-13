"use client";

import { useEffect, useState } from "react";

type Student = {
  id: number;
  name: string;
  email: string;
  department: string;
  year: number;
};

type User = {
  role?: "admin" | "faculty" | "student";
};

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [user, setUser] = useState<User>({});

  // 🔐 GET LOGGED-IN USER
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    setUser(storedUser);
  }, []);

  // 📥 FETCH STUDENTS
  const fetchStudents = async () => {
    const res = await fetch("http://localhost:5000/api/students");
    const data = await res.json();
    setStudents(data);
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // ❌ DELETE (ADMIN ONLY)
  const handleDelete = async (id: number) => {
    if (user.role !== "admin") {
      alert("You are not allowed to delete students");
      return;
    }

    const confirmDelete = confirm("Are you sure you want to delete?");
    if (!confirmDelete) return;

    await fetch(`http://localhost:5000/api/students/${id}`, {
      method: "DELETE",
    });

    fetchStudents();
  };

  // ✏️ EDIT (ADMIN ONLY)
  const handleEdit = async (student: Student) => {
    if (user.role !== "admin") {
      alert("You are not allowed to edit students");
      return;
    }

    const name = prompt("Enter name", student.name);
    const email = prompt("Enter email", student.email);
    const department = prompt("Enter department", student.department);
    const year = prompt("Enter year", String(student.year));

    if (!name || !email || !department || !year) return;

    await fetch(`http://localhost:5000/api/students/${student.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        department,
        year: Number(year),
      }),
    });

    fetchStudents();
  };

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-6xl px-4">
      <h2 className="text-3xl font-bold mb-8 text-gray-800">Students</h2>

      <div className="bg-white/80 backdrop-blur rounded-xl shadow-lg overflow-hidden border border-white/20">
        <table className="w-full text-left">
          <thead className="bg-gradient-to-r from-blue-100 to-indigo-100 border-b-2 border-blue-200">
            <tr>
              <th className="p-4 text-gray-800 font-semibold">Name</th>
              <th className="p-4 text-gray-800 font-semibold">Email</th>
              <th className="p-4 text-gray-800 font-semibold">Department</th>
              <th className="p-4 text-gray-800 font-semibold">Year</th>
              <th className="p-4 text-gray-800 font-semibold">Actions</th>
            </tr>
          </thead>

          <tbody>
            {students.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-4 text-center text-gray-500">
                  No students found
                </td>
              </tr>
            ) : (
              students.map(student => (
                <tr key={student.id} className="border-t hover:bg-blue-50/50 transition-colors duration-200">
                  <td className="p-4 text-gray-800 font-medium">{student.name}</td>
                  <td className="p-4 text-gray-700">{student.email}</td>
                  <td className="p-4 text-gray-700">{student.department}</td>
                  <td className="p-4 text-gray-700">{student.year}</td>

                  <td className="p-4 space-x-3">
                    {user.role === "admin" ? (
                      <>
                        <button
                          className="text-blue-600 hover:text-blue-800 hover:underline font-semibold transition-colors"
                          onClick={() => handleEdit(student)}
                        >
                          Edit
                        </button>

                        <button
                          className="text-red-600 hover:text-red-800 hover:underline font-semibold transition-colors"
                          onClick={() => handleDelete(student.id)}
                        >
                          Delete
                        </button>
                      </>
                    ) : (
                      <span className="text-gray-500 text-sm font-medium">
                        View only
                      </span>
                    )}
                  </td>
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
