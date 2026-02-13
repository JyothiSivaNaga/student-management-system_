"use client";

import { useEffect, useState } from "react";

export default function AdminResultsPage() {
  const [allResults, setAllResults] = useState<any[]>([]);
  const [filteredResults, setFilteredResults] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [exams, setExams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedExam, setSelectedExam] = useState("");

  // Fetch all results and unique courses/exams
  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:5000/api/admin/results")
      .then(res => res.json())
      .then(data => {
        setAllResults(data);
        setFilteredResults(data);

        // Extract unique courses
        const uniqueCourses = [...new Set(data.map((r: any) => r.course_id))]
          .map(courseId => {
            const courseData = data.find((r: any) => r.course_id === courseId);
            return { id: courseId, name: courseData.course_name };
          });
        setCourses(uniqueCourses);

        // Extract unique exams
        const uniqueExams = [...new Set(data.map((r: any) => r.exam_id))]
          .map(examId => {
            const examData = data.find((r: any) => r.exam_id === examId);
            return { id: examId, name: examData.exam_name };
          });
        setExams(uniqueExams);
      })
      .catch(err => console.error("Error fetching results:", err))
      .finally(() => setLoading(false));
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = allResults;

    if (selectedCourse) {
      filtered = filtered.filter(r => r.course_id === parseInt(selectedCourse));
    }

    if (selectedExam) {
      filtered = filtered.filter(r => r.exam_id === parseInt(selectedExam));
    }

    setFilteredResults(filtered);
  }, [selectedCourse, selectedExam, allResults]);

  const handleCourseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCourse(e.target.value);
  };

  const handleExamChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedExam(e.target.value);
  };

  const clearFilters = () => {
    setSelectedCourse("");
    setSelectedExam("");
  };

  const getResultStats = () => {
    if (filteredResults.length === 0) return { totalStudents: 0, passCount: 0, failCount: 0, avgMarks: 0 };
    
    const passCount = filteredResults.filter(r => r.status === 'Pass').length;
    const failCount = filteredResults.length - passCount;
    const avgMarks = filteredResults.reduce((sum, r) => sum + (r.marks / r.total_marks * 100), 0) / filteredResults.length;
    
    return { totalStudents: filteredResults.length, passCount, failCount, avgMarks: avgMarks.toFixed(1) };
  };

  const stats = getResultStats();

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-7xl px-4 pb-12">
        {/* Header */}
        <div className="mb-10">
          <p className="text-sm uppercase tracking-wide text-gray-500">Academic Performance</p>
          <h2 className="text-4xl font-bold text-gray-800">🎓 Results Overview</h2>
          <p className="text-gray-600 mt-1">Track and analyze student performance</p>
        </div>

        {/* Filter Section */}
        <div className="bg-white/80 backdrop-blur rounded-xl shadow-lg p-6 mb-10 border border-white/20">
          <div className="flex items-center gap-2 mb-6">
            <span className="text-2xl">🔍</span>
            <h3 className="text-xl font-bold text-gray-800">Filter Results</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Subject</label>
              <select
                value={selectedCourse}
                onChange={handleCourseChange}
                className="w-full border-2 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 p-3 rounded-xl shadow-sm transition-all duration-200 font-medium text-gray-700 bg-white hover:border-indigo-300"
              >
                <option value="">All Subjects</option>
                {courses.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Exam Type</label>
              <select
                value={selectedExam}
                onChange={handleExamChange}
                className="w-full border-2 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 p-3 rounded-xl shadow-sm transition-all duration-200 font-medium text-gray-700 bg-white hover:border-green-300"
              >
                <option value="">All Exams</option>
                {exams.map(e => (
                  <option key={e.id} value={e.id}>
                    {e.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={clearFilters}
              className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        {filteredResults.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
            <div className="bg-white/85 backdrop-blur border border-blue-100 p-6 rounded-2xl shadow-md">
              <p className="text-blue-600 text-sm font-semibold mb-2">Total Students</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalStudents}</p>
            </div>
            <div className="bg-white/85 backdrop-blur border border-green-100 p-6 rounded-2xl shadow-md">
              <p className="text-green-600 text-sm font-semibold mb-2">Pass</p>
              <p className="text-3xl font-bold text-gray-900">{stats.passCount}</p>
            </div>
            <div className="bg-white/85 backdrop-blur border border-rose-100 p-6 rounded-2xl shadow-md">
              <p className="text-rose-600 text-sm font-semibold mb-2">Fail</p>
              <p className="text-3xl font-bold text-gray-900">{stats.failCount}</p>
            </div>
            <div className="bg-white/85 backdrop-blur border border-purple-100 p-6 rounded-2xl shadow-md">
              <p className="text-purple-600 text-sm font-semibold mb-2">Average Score</p>
              <p className="text-3xl font-bold text-gray-900">{stats.avgMarks}%</p>
            </div>
          </div>
        )}

        {/* Results Summary */}
        {filteredResults.length > 0 && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <p className="text-gray-700 font-medium">
              <span className="font-bold text-blue-700">Showing {filteredResults.length} result(s)</span>
              {selectedCourse && (
                <span className="ml-2">
                  • <span className="font-semibold">Course:</span> {courses.find(c => c.id === parseInt(selectedCourse))?.name}
                </span>
              )}
              {selectedExam && (
                <span className="ml-2">
                  • <span className="font-semibold">Exam:</span> {exams.find(e => e.id === parseInt(selectedExam))?.name}
                </span>
              )}
            </p>
          </div>
        )}

        {/* Results Table */}
        {filteredResults.length > 0 ? (
          <div className="bg-white/80 backdrop-blur rounded-xl shadow-lg overflow-hidden border border-white/20">
            <table className="w-full text-left">
              <thead className="bg-gradient-to-r from-indigo-100 to-purple-100 border-b-2 border-indigo-200">
                <tr>
                  <th className="p-4 text-gray-800 font-semibold">Student</th>
                  <th className="p-4 text-gray-800 font-semibold">Subject</th>
                  <th className="p-4 text-gray-800 font-semibold">Exam Type</th>
                  <th className="p-4 text-center text-gray-800 font-semibold">Marks</th>
                  <th className="p-4 text-center text-gray-800 font-semibold">Grade</th>
                  <th className="p-4 text-center text-gray-800 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredResults.map(r => {
                  const percentage = (r.marks / r.total_marks * 100).toFixed(1);
                  const initials = r.student_name
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase();
                  
                  const isPassed = r.status === 'Pass';

                  return (
                    <tr key={r.id} className="border-t hover:bg-indigo-50/50 transition-colors duration-200">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className={`h-10 w-10 rounded-full ${isPassed ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'} flex items-center justify-center font-bold text-sm shadow-inner`}>
                            {initials}
                          </div>
                          <span className="font-semibold text-gray-800">{r.student_name}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium">
                          {r.course_name}
                        </span>
                      </td>
                      <td className="p-4 text-gray-700 font-medium">{r.exam_name}</td>
                      <td className="p-4 text-center">
                        <div className="flex flex-col items-center gap-1">
                          <span className="font-bold text-gray-800">
                            {r.marks}/{r.total_marks}
                          </span>
                          <span className={`text-xs font-semibold ${isPassed ? 'text-green-600' : 'text-red-600'}`}>
                            {percentage}%
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <span className={`px-3 py-1 rounded-full font-bold text-sm ${
                          r.grade === 'A' ? 'bg-green-100 text-green-800' :
                          r.grade === 'B' ? 'bg-blue-100 text-blue-800' :
                          r.grade === 'C' ? 'bg-yellow-100 text-yellow-800' :
                          r.grade === 'D' ? 'bg-orange-100 text-orange-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {r.grade}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <span className={`px-4 py-1 rounded-full font-semibold text-sm ${
                          isPassed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {r.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-white shadow-lg rounded-2xl p-12 text-center">
            <div className="text-6xl mb-4">📊</div>
            <p className="text-gray-500 text-lg">No results found matching your filters</p>
            {(selectedCourse || selectedExam) && (
              <button
                onClick={clearFilters}
                className="mt-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
