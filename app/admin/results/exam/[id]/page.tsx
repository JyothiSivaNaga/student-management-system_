"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ExamResultsPage() {
  const params = useParams();
  const examId = params?.id;

  const [results, setResults] = useState<any[]>([]);
  const [examInfo, setExamInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!examId) return;

    fetch(`http://localhost:5000/api/admin/results/exam/${examId}`)
      .then(res => res.json())
      .then(data => {
        setResults(data);
        if (data.length > 0) {
          setExamInfo({
            exam_name: data[0].exam_name,
            course_name: data[0].course_name,
            total_marks: data[0].total_marks
          });
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Error:", err);
        setLoading(false);
      });
  }, [examId]);

  if (loading) return <p className="p-6">Loading results...</p>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-4">
        {examInfo?.exam_name || "Exam Results"}
      </h2>
      <p className="text-gray-600 mb-6">
        {examInfo?.course_name}
      </p>

      {results.length === 0 ? (
        <p className="text-gray-500">No results for this exam yet</p>
      ) : (
        <table className="w-full bg-white shadow rounded">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Student</th>
              <th className="p-3 text-center">Marks</th>
              <th className="p-3 text-center">Grade</th>
              <th className="p-3 text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r, i) => (
              <tr key={i} className="border-t hover:bg-gray-50">
                <td className="p-3">{r.student_name}</td>
                <td className="p-3 text-center">
                  {r.marks} / {r.total_marks}
                </td>
                <td className="p-3 text-center font-semibold">{r.grade}</td>
                <td
                  className={`p-3 text-center font-semibold ${
                    r.status === "Pass"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {r.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
