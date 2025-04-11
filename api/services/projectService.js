const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const createProject = async (user, project) => {
  try {
    let startDate = project.startDate ? new Date(project.startDate).toISOString() : undefined;
    let endDate = project.endDate ? new Date(project.endDate).toISOString() : undefined;

    const newProject = await prisma.project.create({
      data: {
        userId: user.id,
        title: project.title,
        description: project.description,
        technologies: project.technologies || null,
        projectUrl: project.projectUrl || null,
        startDate: startDate || null,
        endDate: endDate || null,
      },
    });

    return newProject;
  } catch (e) {
    console.error("Error creating project:", e);
    throw new Error("Unable to create project record");
  }
};


const getProjectById = async (id) => {
  try {
    const project = await prisma.project.findUnique({
      where: {
        id: id,
      },
    });
    return project;
  } catch (e) {
    console.error("Error finding project:", e);
    throw new Error("Unable to find project record");
  }
};


const updateProjectById = async (id, projectData) => {
  try {
    let startDate = projectData.startDate ? new Date(projectData.startDate).toISOString() : undefined;
    let endDate = projectData.endDate ? new Date(projectData.endDate).toISOString() : undefined;

    const updatedProject = await prisma.project.update({
      where: {
        id: id,
      },
      data: {
        title: projectData.title,
        description: projectData.description,
        technologies: projectData.technologies || null,
        projectUrl: projectData.projectUrl || null,
        startDate: startDate || null,
        endDate: endDate || null,
      },
    });

    return updatedProject;
  } catch (e) {
    console.error("Error updating project:", e);
    throw new Error("Unable to update project record");
  }
};


const removeProject = async (id) => {
  try {
    const project = await prisma.project.delete({
      where: {
        id: id,
      },
    });
    return project;
  } catch (error) {
    console.error("Error removing project:", error);
    throw new Error("Failed to remove project: " + error);
  }
};

module.exports = {
  createProject,
  getProjectById,
  updateProjectById,
  removeProject,
};
