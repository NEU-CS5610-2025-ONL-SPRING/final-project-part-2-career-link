const { $Enums } = require("@prisma/client");
const {
  getProjectById,
  createProject,
  updateProjectById,
  removeProject,
} = require("../services/projectService");

const {
    findUserByUserId,
    findProjectsByUserId,
  } = require("../services/UserService");

const getProjects = async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);

    const user = await findUserByUserId(userId);
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    if (user.role !== $Enums.Role.JOB_SEEKER) {
      return res.status(400).json({ error: "Employers cannot have projects" });
    }

    const projects = await findProjectsByUserId(userId);
    return res.json(projects);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const addProject = async (req, res) => {
  try {
    const project = req.body;
    validateUserId(req, project);

    if (!validateProject(project)) {
      return res.status(400).json({ error: "Title and Description are required." });
    }

    const user = await findUserByUserId(req.userId);
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    if (user.role !== $Enums.Role.JOB_SEEKER) {
      return res.status(400).json({ error: "Employers cannot add projects" });
    }

    const created = await createProject(user, project);
    if (!created) {
      return res.status(500).json({ error: "Internal Server Error" });
    }

    return res.json(created);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Internal Server Error: " + e });
  }
};

const updateProject = async (req, res) => {
  try {
    const projectId = parseInt(req.params.id);
    const project = req.body;

    validateUserId(req, project);

    if (!validateProject(project)) {
      return res.status(400).json({ error: "Title and Description are required." });
    }

    const user = await findUserByUserId(req.userId);
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    if (user.role !== $Enums.Role.JOB_SEEKER) {
      return res.status(400).json({ error: "Employers cannot update projects" });
    }

    const existing = await getProjectById(projectId);
    if (!existing) {
      return res.status(404).json({ error: "Project not found" });
    }

    if (existing.userId !== user.id) {
      return res.status(403).json({ error: "You are not authorized to update this project" });
    }

    const updated = await updateProjectById(projectId, project);
    if (!updated) {
      return res.status(500).json({ error: "Failed to update project" });
    }

    return res.json(updated);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Internal Server Error: " + e });
  }
};

const deleteProject = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const user = await findUserByUserId(req.userId);
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    if (user.role !== $Enums.Role.JOB_SEEKER) {
      return res.status(400).json({ error: "Employers cannot delete projects" });
    }

    const deleted = await removeProject(id);
    if (!deleted) {
      return res.status(404).json({ error: "Project with given ID not found" });
    }

    return res.json(deleted);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Internal Server Error: " + e });
  }
};

const validateUserId = (req, entity) => {
  if (parseInt(entity.userId) !== req.userId) {
    throw { status: 401, message: "Request Unauthorized" };
  }
};

const validateProject = (project) => {
  return project.title && project.description;
};

module.exports = {
  getProjects,
  addProject,
  updateProject,
  deleteProject,
};
