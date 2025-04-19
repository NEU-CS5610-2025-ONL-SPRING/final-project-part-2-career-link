const { $Enums } = require("@prisma/client");
const {
  findEducationByUserId,
  findUserByUserId,
} = require("../services/UserService");

const {
  removeEducation,
  createEducation,
  getEducationById,
  updateEducationById
} = require("../services/educationService");

const getEducation = async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const user = await findEducationByUserId(userId);

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

    if(!validateEducation(education)){
      return res
      .status(400)
      .json({ error: "Institution, Degree, and Start Date are required." });
    }

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

const updateEducation = async (req, res) => {
  try {
    const educationId = parseInt(req.params.id);
    const education = req.body;

    validateUserId(req, education);

    if (!validateEducation(education)) {
      return res
        .status(400)
        .json({ error: "Institution, Degree, and Start Date are required." });
    }

    const user = await findUserByUserId(req.userId);

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    if (user.role !== $Enums.Role.JOB_SEEKER) {
      return res
        .status(400)
        .json({ error: "Employer cannot update education" });
    }

    const existingEducation = await getEducationById(educationId);

    if (!existingEducation) {
      return res.status(404).json({ error: "Education not found" });
    }

    if (existingEducation.userId !== user.id) {
      return res
        .status(403)
        .json({ error: "You are not authorized to update this record" });
    }

    const updated = await updateEducationById(educationId, education);

    if (!updated) {
      return res.status(500).json({ error: "Failed to update education" });
    }

    return res.json(updated);
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "Internal Server Error: " + e });
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

const validateEducation = (newEducation) => {
  if (
    !newEducation.institution ||
    !newEducation.degree ||
    !newEducation.startDate
  ) {
      return false;
  }
  return true;
};

module.exports = {
  getEducation,
  addEducation,
  deleteEducation,
  updateEducation
};
