import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function AttendancePage() {
  const navigate = useNavigate();

  // Mock attendance data
  const attendanceData = [
    { subject: 'Data Structures', present: 24, total: 30, percentage: 80 },
    { subject: 'Web Development', present: 28, total: 30, percentage: 93 },
    { subject: 'Database Systems', present: 26, total: 30, percentage: 87 },
    { subject: 'Algorithms', present: 22, total: 30, percentage: 73 },
  ];

  return (
    <div className="w-full max-w-2xl">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-6 px-4 py-2 bg-emerald-700 text-white rounded hover:bg-emerald-800 transition-colors"
      >
        ← Back
      </button>

      {/* Attendance card */}
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-emerald-800 mb-6">Attendance Records</h1>

        <div className="space-y-4">
          {attendanceData.map((record, idx) => (
            <div key={idx} className="border rounded-lg p-4 bg-emerald-50">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold text-emerald-800">{record.subject}</h3>
                <span className={`text-xl font-bold ${
                  record.percentage >= 80 ? 'text-green-600' : 'text-orange-600'
                }`}>
                  {record.percentage}%
                </span>
              </div>
              <div className="w-full bg-gray-300 rounded-full h-3">
                <div
                  className="bg-emerald-600 h-3 rounded-full transition-all"
                  style={{ width: `${record.percentage}%` }}
                />
              </div>
              <p className="text-sm text-gray-700 mt-2">
                {record.present} out of {record.total} classes attended
              </p>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded border border-blue-200">
          <p className="text-sm text-blue-800">
            ℹ️ 80% attendance is required to be eligible for exams. Contact your instructor if below threshold.
          </p>
        </div>
      </div>
    </div>
  );
}
