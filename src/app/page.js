// src/app/page.js
"use client";
// require('dotenv').config();
import { useState } from "react";
import FileUpload from "@/components/FileUpload/FileUpload";
import PointsEditor from "@/components/PointsEditor/PointsEditor";
import ProjectList from "@/components/ProjectList/ProjectList";
import SaveProjectModal from "@/components/SaveProjectModal/SaveProjectModal";
import { saveProject } from "@/utils/storage";
import ProjectImageUpload from "@/components/ImageUpload/ProjectImageUpload";

export default function Home() {
  const [points, setPoints] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProject, setCurrentProject] = useState(null); 

  const handlePointsLoaded = (newPoints) => {
    setPoints(newPoints);
  };

  const handleSaveProject = (projectName) => {
    try {
      saveProject({
        name: projectName,
        points: points,
      });
      setIsModalOpen(false);
    } catch (error) {
      alert("Failed to save project");
    }
  };

  const handleProjectSelect = (project) => {
    setPoints(project.points);
    setCurrentProject(project); // Set currentProject when a project is selected
  };

  return (
    <main className="min-h-screen p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">GCP Editor</h1>
        <div className="flex space-x-4">
          <ProjectList onProjectSelect={handleProjectSelect} />
          <button
            onClick={() => setIsModalOpen(true)}
            disabled={points.length === 0}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-300"
          >
            Save Project
          </button>
        </div>
      </div>

      <div className="grid gap-6">
        <section className="p-4 border rounded-lg">
          <h2 className="text-xl font-bold mb-4">Upload CSV File</h2>
          <FileUpload onPointsLoaded={handlePointsLoaded} />
        </section>
        {/* Drone Images Upload Section - Only show when a project is selected */}
        {points.length > 0  && ( //&& isModalOpen
          <section className="p-4 border rounded-lg">
            <h2 className="text-xl font-bold mb-4">Upload Drone Images</h2>
            <ProjectImageUpload projectId={currentProject?.id} />
          </section>
        )}

        <section className="p-4 border rounded-lg">
          <h2 className="text-xl font-bold mb-4">GCP Points Editor</h2>
          <PointsEditor points={points} />
        </section>
        
      </div>

      <SaveProjectModal
        isOpen={isModalOpen}
        onSave={handleSaveProject}
        onClose={() => setIsModalOpen(false)}
      />
    </main>
  );
}
