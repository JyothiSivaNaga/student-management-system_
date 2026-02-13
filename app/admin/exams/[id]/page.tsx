"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Exam {
  id: number;
  course_id: number;
  exam_name: string;
  exam_date: string;
  total_marks: number;
}

export default function EditExamPage() {
  const params = useParams();
  const router = useRouter();
  const examId = params?.id;

  const [formData, setFormData] = useState<Exam>({
    id: 0,
    course_id: 0,
    exam_name: "",
    exam_date: "",
    total_marks: 0,
  });

  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!examId) return;

    const fetchData = async () => {
      try {
        // Fetch exam details
        const examRes = await fetch(`http://localhost:5000/api/admin/exams/${examId}`);
        if (!examRes.ok) throw new Error("Failed to fetch exam");
        const examData = await examRes.json();
        setFormData(examData);

        // Fetch courses for dropdown
        const coursesRes = await fetch("http://localhost:5000/api/courses");
        if (!coursesRes.ok) throw new Error("Failed to fetch courses");
        const coursesData = await coursesRes.json();
        setCourses(coursesData);
      } catch (err) {
        console.error("Error:", err);
        setError("Failed to load exam details");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [examId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "course_id" || name === "total_marks" ? parseInt(value) : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.exam_name || !formData.exam_date || !formData.total_marks) {
      setError("All fields are required");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/admin/exams/${examId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to update exam");

      alert("Exam updated successfully");
      router.push("/admin/exams");
    } catch (err) {
      console.error("Error:", err);
      setError("Failed to update exam");
    }
  };

  if (loading) return <p className="p-6">Loading exam details...</p>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">Edit Exam</h2>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="bg-white shadow rounded p-6">
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Course</label>
          <select
            name="course_id"
            value={formData.course_id}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded px-4 py-2"
            required
          >
            <option value="">Select Course</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.course_name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Exam Name</label>
          <input
            type="text"
            name="exam_name"
            value={formData.exam_name}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded px-4 py-2"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Exam Date</label>
          <input
            type="date"
            name="exam_date"
            value={formData.exam_date}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded px-4 py-2"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">Total Marks</label>
          <input
            type="number"
            name="total_marks"
            value={formData.total_marks}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded px-4 py-2"
            required
          />
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Update Exam
          </button>
          <button
            type="button"
            onClick={() => router.push("/admin/exams")}
            className="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
