const { $Enums } = require("@prisma/client");
const {
  findEducationByUserId,
  findUserByUserId,
} = require("../services/UserService");

const {
  removeEducation,
  createEducation,
} = require("../services/educationService");

const getEducation = async (req, res) => {
  try {
    const { userId } = req.params;
    if (parseInt(userId) != req.userId) {
      return res.status(401).json({ error: "Request Unauthorized" });
    }
    const user = await findEducationByUserId(req.userId);

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    if (user.role !== $Enums.Role.JOB_SEEKER) {
      return res.status(400).json({ error: "Employer cannot have education" });
    }

    const education = user.education;

    return res.json(education);
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: " Internal Server Error" });
  }
};

const addEducation = async (req, res) => {
  try {
    const education = req.body;

    validateUserId(req, education);

    const user = await findUserByUserId(req.userId);

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    if (user.role !== $Enums.Role.JOB_SEEKER) {
      return res.status(400).json({ error: "Employer cannot have education" });
    }

    const edu = await createEducation(user, education);

    if (!edu) {
      res.status(500).json({ error: " Internal Server Error" });
    }

    return res.json(edu);
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: " Internal Server Error" + e });
  }
};

const deleteEducation = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const user = await findUserByUserId(req.userId);

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    if (user.role !== $Enums.Role.JOB_SEEKER) {
      return res.status(400).json({ error: "Employer cannot have education" });
    }

    const edu = await removeEducation(id);

    if (!edu) {
      res.status(404).json({ error: " Education with id not found" });
    }

    return res.json(edu);
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: " Internal Server Error" + e });
  }
};

const validateUserId = (req, education) => {
  const userId = education.userId;

  if (parseInt(userId) != req.userId) {
    return res.status(401).json({ error: "Request Unauthorized" });
  }
};

module.exports = {
  getEducation,
  addEducation,
  deleteEducation
};
