import React, { useMemo } from 'react';

const BRAND_GREEN = '#0F9D78';

export default function SubmissionReview() {
  const submissions = useMemo(
    () => [
      { student: '21A91A05A1', course: 'CSE - Data Structures', time: '09:00 AM', status: 'Active' },
      { student: '21A91A05B7', course: 'CSE - DBMS', time: '10:15 AM', status: 'Active' },
      { student: '21A91A05C3', course: 'CSE - Operating Systems', time: '12:00 PM', status: 'Active' }
    ],
    []
  );

  return (
    <div className="min-h-screen bg-[#f8faf5] px-4 sm:px-6 py-6">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-extrabold text-gray-900">Submission Review</h1>
              <p className="text-sm text-gray-600 mt-1">Review attendance submissions and take action.</p>
            </div>
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
              Active
            </span>
          </div>

          <div className="mt-6 space-y-3">
            {submissions.map((s) => (
              <div key={`${s.student}-${s.course}`} className="border border-gray-100 rounded-2xl p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="font-semibold text-gray-900 truncate">{s.course}</h2>
                    <div className="mt-1 text-sm text-gray-600">
                      <span className="me-3"><i className="bi bi-person-badge me-1" aria-hidden="true" />{s.student}</span>
                      <span><i className="bi bi-clock me-1" aria-hidden="true" />{s.time}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="btn btn-sm rounded-xl text-white"
                      style={{ backgroundColor: BRAND_GREEN, borderColor: BRAND_GREEN }}
                    >
                      Approve
                    </button>
                    <button type="button" className="btn btn-sm rounded-xl border border-gray-300 text-gray-700 bg-white hover:bg-gray-50">
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
