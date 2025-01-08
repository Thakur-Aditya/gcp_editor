// src/components/ProjectList/ProjectList.js
'use client';
import { useState, useEffect } from 'react';
import { getProjects } from '@/utils/storage';

export default function ProjectList({ onProjectSelect }) {
  const [projects, setProjects] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setProjects(getProjects());
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        {isOpen ? 'Hide Projects' : 'Show Projects'} ({projects.length})
      </button>

      {isOpen && (
        <div className="absolute top-12 left-0 w-80 max-h-56 overflow-y-auto bg-white rounded-lg shadow-lg border p-4 z-50">
          {projects.length === 0 ? (
            <p className="text-gray-500">No saved projects</p>
          ) : (
            <ul className="space-y-2">
              {projects.map((project) => (
                <li 
                  key={project.id}
                  className="border rounded text-black p-2 hover:bg-gray-50 cursor-pointer"
                  onClick={() => onProjectSelect(project)}
                >
                  <div className="font-medium">{project.name}</div>
                  <div className="text-sm text-gray-500">
                    Points: {project.points.length}
                  </div>
                  <div className="text-xs text-gray-400">
                    {formatDate(project.createdAt)}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}