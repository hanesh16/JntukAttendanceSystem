import React, { useState, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';


const BRAND = {
  green: '#0F9D78',
  greenDark: '#0B7A5E'
};

export default function Files() {
  const location = useLocation();
  const [previewIdx, setPreviewIdx] = useState(null);
  const { profile } = useContext(AuthContext);
  const folder = location.state?.folder;
  if (!folder) return <div className="text-center text-gray-500">No folder selected.</div>;

  if (profile?.role === 'professor') {
    return (
      <>
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 sm:p-8 transition-all duration-200 mt-6">
          <div className="flex items-start sm:items-center justify-between gap-4">
            <div>
              <div className="text-sm text-gray-600">
                <span className="font-semibold" style={{ color: BRAND.green }}>LMS</span> /{' '}
                <span className="text-gray-900 font-semibold">{folder.name}</span>
              </div>
              <h1 className="mt-1 text-2xl sm:text-3xl font-extrabold text-gray-900">
                {folder.name}
              </h1>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {folder.files.map((fileObj, idx) => {
              const isPDF = fileObj && fileObj.type === 'application/pdf';
              return (
                <div
                  key={fileObj.name || idx}
                  className="rounded-xl border border-gray-200 bg-white p-4 flex flex-col gap-2 transition-transform duration-200 hover:scale-[1.01] hover:shadow-md"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-extrabold"
                      style={{ background: `linear-gradient(135deg, ${BRAND.green}, ${BRAND.greenDark})` }}
                      aria-hidden="true"
                    >
                      📄
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{fileObj.name}</div>
                      {isPDF && (
                        <button
                          className="text-xs text-[#0F9D78] underline font-semibold mt-1"
                          onClick={() => setPreviewIdx(pre => pre === idx ? null : idx)}
                        >
                          {previewIdx === idx ? 'Hide Preview' : 'Preview PDF'}
                        </button>
                      )}
                    </div>
                  </div>
                  {isPDF && previewIdx === idx && (
                    <iframe
                      src={URL.createObjectURL(fileObj)}
                      title={fileObj.name}
                      className="w-full mt-2 rounded border"
                      style={{ minHeight: 400, maxHeight: 600 }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </>
    );
  }
  if (profile.role === 'student') {
    return (
      <>
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 sm:p-8 transition-all duration-200 mt-6">
          {/* ...existing code... */}
          <div className="flex items-start sm:items-center justify-between gap-4">
            <div>
              <div className="text-sm text-gray-600">
                <span className="font-semibold" style={{ color: BRAND.green }}>LMS</span> /{' '}
                <span className="text-gray-900 font-semibold">{folder.name}</span>
              </div>
              <h1 className="mt-1 text-2xl sm:text-3xl font-extrabold text-gray-900">
                {folder.name}
              </h1>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {folder.files.map((fileObj, idx) => {
              const isPDF = fileObj && fileObj.type === 'application/pdf';
              return (
                <div
                  key={fileObj.name || idx}
                  className="rounded-xl border border-gray-200 bg-white p-4 flex flex-col gap-2 transition-transform duration-200 hover:scale-[1.01] hover:shadow-md"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-extrabold"
                      style={{ background: `linear-gradient(135deg, ${BRAND.green}, ${BRAND.greenDark})` }}
                      aria-hidden="true"
                    >
                      📄
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{fileObj.name}</div>
                      {isPDF && (
                        <button
                          className="text-xs text-[#0F9D78] underline font-semibold mt-1"
                          onClick={() => setPreviewIdx(pre => pre === idx ? null : idx)}
                        >
                          {previewIdx === idx ? 'Hide Preview' : 'Preview PDF'}
                        </button>
                      )}
                    </div>
                  </div>
                  {isPDF && previewIdx === idx && (
                    <iframe
                      src={URL.createObjectURL(fileObj)}
                      title={fileObj.name}
                      className="w-full mt-2 rounded border"
                      style={{ minHeight: 400, maxHeight: 600 }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </>
    );
  } else {
    return <div className="text-center text-red-500">Unrecognized user role: {profile.role}</div>;
  }
}
