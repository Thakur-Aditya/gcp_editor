// src/components/SaveProjectModal/SaveProjectModal.js
'use client';
import { useState } from 'react';

export default function SaveProjectModal({ onSave, onClose, isOpen }) {
  const [projectName, setProjectName] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (projectName.trim()) {
      onSave(projectName.trim());
      setProjectName('');
    }
  };

  return (
    <div className=" inset-y-10 inset-x-10 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white text-black rounded-lg p-6 w-96">
        <h3 className="text-lg font-bold mb-4">Save Project</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="Enter project name"
            className="w-full text-black p-2 border rounded mb-4"
            autoFocus
          />
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              disabled={!projectName.trim()}
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}