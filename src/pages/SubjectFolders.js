import React from 'react';

export default function SubjectFolders({ folders, onOpenFolder }) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 sm:p-8 transition-all duration-200">
      <h2 className="text-xl font-bold mb-6">Subject Folders</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {folders.map((folder) => (
          <button
            key={folder.id}
            type="button"
            onClick={() => onOpenFolder(folder.id)}
            className="w-full aspect-square max-w-xs mx-auto rounded-2xl overflow-hidden cursor-pointer flex flex-col transform transition-transform duration-200 hover:scale-[1.03] hover:shadow-lg"
            style={{ minWidth: '140px', minHeight: '140px', border: '1px solid #e5e7eb', background: 'white' }}
          >
            {/* Solid colored upper section */}
            <div
              className="flex-1 w-full flex items-end"
              style={{
                background: folder.grad,
                borderBottomLeftRadius: 0,
                borderBottomRightRadius: 0,
                borderTopLeftRadius: '1rem',
                borderTopRightRadius: '1rem',
                minHeight: 0,
              }}
            />
            {/* Bottom label with icon and name, always white */}
            <div
              className="w-full py-2 flex items-center justify-center gap-2 text-sm font-bold tracking-wide bg-white text-black"
              style={{
                borderTopLeftRadius: 0,
                borderTopRightRadius: 0,
                borderBottomLeftRadius: '1rem',
                borderBottomRightRadius: '1rem',
              }}
            >
              <span className="text-xl" aria-hidden="true">📁</span>
              {folder.name}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
