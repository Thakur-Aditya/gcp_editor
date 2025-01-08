// src/utils/storage.js

// Saves a new project with basic details and empty images array
export const saveProject = (projectData) => {
  try {
    // Get existing projects or initialize empty array
    const existingProjects = JSON.parse(localStorage.getItem('gcpProjects') || '[]');

    // Create new project object
    const newProject = {
      id: Date.now(),
      name: projectData.name,
      points: projectData.points,
      images: [], // Empty images array for new projects
      createdAt: new Date().toISOString(),
    };

    existingProjects.push(newProject);
    localStorage.setItem('gcpProjects', JSON.stringify(existingProjects));
    return newProject;

  } catch (error) {
    console.error('Error saving project:', error);
    throw new Error('Failed to save project');
  }
};

// Gets all projects from localStorage
export const getProjects = () => {
  try {
    return JSON.parse(localStorage.getItem('gcpProjects') || '[]');
  } catch {
    return [];
  }
};

// Finds and returns a specific project by ID
export const getProjectById = (id) => {
  const projects = getProjects();
  return projects.find(project => project.id === id);
};

// Adds or updates images for an existing project
export const saveProjectImages = (projectId, images) => {
  try {
    const projects = getProjects();
    const projectIndex = projects.findIndex(p => p.id === projectId);
    
    if (projectIndex === -1) {
      throw new Error('Project not found');
    }

    // Add or update images array in project
    projects[projectIndex] = {
      ...projects[projectIndex],
      images: [...(projects[projectIndex].images || []), ...images]
    };

    localStorage.setItem('gcpProjects', JSON.stringify(projects));
    return projects[projectIndex];
    
  } catch (error) {
    console.error('Error saving project images:', error);
    throw new Error('Failed to save project images');
  }
};