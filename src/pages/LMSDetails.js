import React from 'react';

export default function LMSDetails() {
  return (
    <div className="min-h-screen bg-[#f8faf5] px-4 sm:px-6 py-10">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold mb-4">LMS Portal Details</h1>
        <p className="text-gray-700 text-base mb-2">
          Welcome to the Learning Management System. Here you can access subject folders, view files, and manage your learning resources.
        </p>
        <ul className="list-disc pl-6 text-gray-700">
          <li>Browse subject folders</li>
          <li>Open folders to view files</li>
          <li>Download or preview learning materials</li>
        </ul>
      </div>
    </div>
  );
}
