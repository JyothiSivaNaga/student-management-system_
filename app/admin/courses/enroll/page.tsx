"use client";

import { useEffect, useState } from "react";

type Student = {
  id: number;
  name: string;
  roll_no: string;
  department: string;
};

type Course = {
  id: number;
  course_name: string;
  course_code: string;
};

export default function EnrollStudentPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<number[]>([]);
  const [courseId, setCourseId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/students")
      .then(res => res.json())
      .then(data => setStudents(data));

    fetch("http://localhost:5000/api/admin/courses")
      .then(res => res.json())
      .then(data => setCourses(data));
  }, []);

  const toggleStudent = (id: number) => {
    if (selectedStudents.includes(id)) {
      setSelectedStudents(selectedStudents.filter(sid => sid !== id));
    } else {
      setSelectedStudents([...selectedStudents, id]);
    }
  };

  const toggleAll = () => {
    const filtered = students.filter(s => 
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.roll_no.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (selectedStudents.length === filtered.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(filtered.map(s => s.id));
    }
  };

  const enroll = async () => {
    if (!courseId) {
      alert("Please select a course");
      return;
    }
    if (selectedStudents.length === 0) {
      alert("Please select at least one student");
      return;
    }

    let successCount = 0;
    let failCount = 0;

    for (const studentId of selectedStudents) {
      const res = await fetch("http://localhost:5000/api/admin/enroll-student", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student_id: studentId,
          course_id: courseId,
        }),
      });

      if (res.ok) {
        successCount++;
      } else {
        failCount++;
      }
    }

    alert(`Enrollment complete!\nSuccessful: ${successCount}\nFailed: ${failCount}`);
    setSelectedStudents([]);
    setCourseId("");
  };

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.roll_no.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-5xl px-4">
        <h2 className="text-3xl font-bold mb-8 text-gray-800">Enroll Students to Course</h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Course Selection */}
          <div className="lg:col-span-1">
            <div className="bg-white/80 backdrop-blur p-6 rounded-2xl shadow-xl border border-white/20 sticky top-4">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Select Course
              </label>
              <select
                className="w-full border-2 border-gray-300 p-3 rounded-lg focus:border-green-500 focus:outline-none transition-colors duration-200 bg-white mb-4"
                value={courseId}
                onChange={e => setCourseId(e.target.value)}
              >
                <option value="">Choose a course...</option>
                {courses.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.course_code} - {c.course_name}
                  </option>
                ))}
              </select>

              <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg p-4 mb-4">
                <p className="text-sm font-semibold text-green-800 mb-1">Selected Students</p>
                <p className="text-3xl font-bold text-green-900">{selectedStudents.length}</p>
              </div>

              <button
                onClick={enroll}
                disabled={!courseId || selectedStudents.length === 0}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                Enroll Selected Students
              </button>
            </div>
          </div>

          {/* Students List */}
          <div className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur rounded-2xl shadow-xl border border-white/20 p-6">
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Search by name or roll number..."
                  className="w-full border-2 border-gray-300 p-3 rounded-lg focus:border-blue-500 focus:outline-none transition-colors duration-200"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="flex items-center justify-between mb-4 pb-3 border-b-2 border-gray-200">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedStudents.length === filteredStudents.length && filteredStudents.length > 0}
                    onChange={toggleAll}
                    className="w-5 h-5 text-green-600 rounded focus:ring-2 focus:ring-green-500"
                  />
                  <span className="font-semibold text-gray-700">Select All</span>
                </label>
                <span className="text-sm text-gray-600">{filteredStudents.length} students</span>
              </div>

              <div className="max-h-96 overflow-y-auto space-y-2">
                {filteredStudents.map(student => (
                  <label
                    key={student.id}
                    className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                      selectedStudents.includes(student.id)
                        ? 'bg-green-50 border-green-300 shadow-md'
                        : 'bg-white border-gray-200 hover:border-green-200 hover:bg-green-50/50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedStudents.includes(student.id)}
                      onChange={() => toggleStudent(student.id)}
                      className="w-5 h-5 text-green-600 rounded focus:ring-2 focus:ring-green-500"
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">{student.name}</p>
                      <p className="text-sm text-gray-600">{student.roll_no} • {student.department}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
