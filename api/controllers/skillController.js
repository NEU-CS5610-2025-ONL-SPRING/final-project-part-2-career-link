const { $Enums } = require("@prisma/client");
const { findUserByUserId, updateUserSkill } = require("../services/UserService");


const getSkill = async (req, res) => {
  try {
    const { userId } = req.params;

    if (parseInt(userId) !== req.userId) {
      return res.status(401).json({ error: "Request Unauthorized" });
    }

    const user = await findUserByUserId(req.userId);
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    if (user.role !== $Enums.Role.JOB_SEEKER) {
      return res.status(400).json({ error: "Employers cannot have a skill" });
    }

    return res.json({ skill: user.skills || "" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateSkill = async (req, res) => {
  try {
    const { userId } = req.params;
    const { skills } = req.body;

    if (parseInt(userId) !== req.userId) {
      return res.status(401).json({ error: "Request Unauthorized" });
    }

    if (!skills || typeof skills !== "string") {
      return res.status(400).json({ error: "Skill must be a valid string" });
    }

    const user = await findUserByUserId(req.userId);
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    if (user.role !== $Enums.Role.JOB_SEEKER) {
      return res.status(400).json({ error: "Employers cannot update a skill" });
    }

    const updatedUser = await updateUserSkill(user.id, skills);
    if (!updatedUser) {
      return res.status(500).json({ error: "Failed to update skill" });
    }

    return res.json({ skills: updatedUser.skills });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  getSkill,
  updateSkill,
};
