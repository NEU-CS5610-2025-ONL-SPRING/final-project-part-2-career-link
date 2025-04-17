const { $Enums } = require("@prisma/client");
const {
  findUserByUserId,
  findExperienceByUserId,
} = require("../services/UserService");

const {
  createExperience,
  getExperienceById,
  updateExperienceById,
  removeExperience,
} = require("../services/experienceService");

const getExperience = async (req, res) => {
  try {
    const { userId } = req.params;
    if (parseInt(userId) !== req.userId) {
      return res.status(401).json({ error: "Request Unauthorized" });
    }

    const user = await findExperienceByUserId(req.userId);
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    if (user.role !== $Enums.Role.JOB_SEEKER) {
      return res.status(400).json({ error: "Employer cannot have experience" });
    }

    return res.json(user.experiences);
  } catch (e) {
    console.error("Error fetching experience:", e);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const addExperience = async (req, res) => {
  try {
    const experience = req.body;

    validateUserId(req, experience);

    if (!validateExperience(experience)) {
      return res.status(400).json({
        error: "Company, Job Title, and Start Date are required.",
      });
    }

    const user = await findUserByUserId(req.userId);

    if (!user || user.role !== $Enums.Role.JOB_SEEKER) {
      return res.status(403).json({ error: "Unauthorized to add experience" });
    }

    const created = await createExperience(user, experience);

    if (!created) {
      return res.status(500).json({ error: "Failed to create experience" });
    }

    return res.json(created);
  } catch (e) {
    console.error("Error adding experience:", e);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateExperience = async (req, res) => {
  try {
    const experienceId = parseInt(req.params.id);
    const experience = req.body;

    validateUserId(req, experience);

    if (!validateExperience(experience)) {
      return res.status(400).json({
        error: "Company, Job Title, and Start Date are required.",
      });
    }

    const user = await findUserByUserId(req.userId);

    if (!user || user.role !== $Enums.Role.JOB_SEEKER) {
      return res
        .status(403)
        .json({ error: "Unauthorized to update experience" });
    }

    const existingExperience = await getExperienceById(experienceId);

    if (!existingExperience) {
      return res.status(404).json({ error: "Experience not found" });
    }

    if (existingExperience.userId !== user.id) {
      return res
        .status(403)
        .json({ error: "You are not authorized to update this record" });
    }

    const updated = await updateExperienceById(experienceId, experience);

    if (!updated) {
      return res.status(500).json({ error: "Failed to update experience" });
    }

    return res.json(updated);
  } catch (e) {
    console.error("Error updating experience:", e);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteExperience = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const user = await findUserByUserId(req.userId);

    if (!user || user.role !== $Enums.Role.JOB_SEEKER) {
      return res.status(403).json({ error: "Unauthorized to delete experience" });
    }

    const exp = await removeExperience(id);

    if (!exp) {
      return res.status(404).json({ error: "Experience with ID not found" });
    }

    return res.json(exp);
  } catch (e) {
    console.error("Error deleting experience:", e);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const validateUserId = (req, obj) => {
  if (parseInt(obj.userId) !== req.userId) {
    throw new Error("Request Unauthorized");
  }
};

const validateExperience = (exp) => {
  return exp.company && exp.jobTitle && exp.startDate;
};

module.exports = {
  getExperience,
  addExperience,
  updateExperience,
  deleteExperience,
};
