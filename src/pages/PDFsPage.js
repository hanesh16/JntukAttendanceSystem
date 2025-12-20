import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function PDFsPage() {
  const navigate = useNavigate();

  // Mock PDFs data
  const pdfs = [
    { title: 'Syllabus - Data Structures', subject: 'Data Structures', date: '2025-01-10' },
    { title: 'Lecture Notes - Week 1', subject: 'Web Development', date: '2025-01-15' },
    { title: 'Assignment 1 - Database Design', subject: 'Database Systems', date: '2025-01-20' },
    { title: 'Exam Study Guide - Algorithms', subject: 'Algorithms', date: '2025-01-25' },
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

      {/* PDFs card */}
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-emerald-800 mb-6">Syllabus & PDFs</h1>

        <div className="space-y-3">
          {pdfs.map((pdf, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-4 border rounded-lg bg-emerald-50 hover:bg-emerald-100 cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-4">
                <span className="text-3xl">📄</span>
                <div>
                  <h3 className="font-semibold text-emerald-800">{pdf.title}</h3>
                  <p className="text-sm text-gray-600">{pdf.subject} • {pdf.date}</p>
                </div>
              </div>
              <button className="px-3 py-1 bg-emerald-700 text-white rounded text-sm hover:bg-emerald-800 transition-colors">
                Download
              </button>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-[#f8faf5] rounded border border-emerald-200">
          <p className="text-sm text-yellow-800">
            ⚠️ These are sample PDFs. In production, integrate with your document storage service (Google Drive, OneDrive, S3).
          </p>
        </div>
      </div>
    </div>
  );
}
