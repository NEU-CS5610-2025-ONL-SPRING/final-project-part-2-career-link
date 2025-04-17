const { updateUserResumeUrl } = require("../services/UserService");
const { findUserByUserId } = require("../services/UserService");
const { $Enums } = require("@prisma/client");


const uploadResume = async (req, res) => {
  try {
    const resumeUrl = req.file?.path;
    if (!resumeUrl) {
      return res.status(400).json({ error: "Resume file is required" });
    }

    const updatedUser = await updateUserResumeUrl(req.userId, resumeUrl);
    if (!updatedUser) {
      return res.status(500).json({ error: "Failed to update resume" });
    }

    return res.status(200).json({
      message: "Resume uploaded successfully",
      resumeUrl: updatedUser.resumeUrl,
    });
  } catch (err) {
    console.error("Resume Upload Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getResumeUrl = async (req, res) => {
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
        return res.status(400).json({ error: "Employers cannot upload a resume" });
      }
  
      return res.json({ resumeUrl: user.resumeUrl || "" });
    } catch (error) {
      console.error("Resume Fetch Error:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  };

module.exports = { uploadResume, getResumeUrl };
