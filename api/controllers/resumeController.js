const { updateUserResumeUrl } = require("../services/UserService");
const { findUserByUserId } = require("../services/UserService");
const axios = require("axios");
const pdfParse = require("pdf-parse");

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
    const userId = parseInt(req.params.userId);

    const user = await findUserByUserId(userId);
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    if (user.role !== $Enums.Role.JOB_SEEKER) {
      return res
        .status(400)
        .json({ error: "Employers cannot upload a resume" });
    }

    return res.json({ resumeUrl: user.resumeUrl || "" });
  } catch (error) {
    console.error("Resume Fetch Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const analyzeResume = async (req, res) => {
  try {
    const { userId } = req.params;

    if (parseInt(userId) !== req.userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = await findUserByUserId(req.userId);
    if (!user || !user.resumeUrl) {
      return res.status(404).json({ error: "Resume not found" });
    }

    const resumeUrl = user.resumeUrl;

    const response = await axios.get(resumeUrl, {
      responseType: "arraybuffer",
    });

    const pdfData = await pdfParse(response.data);
    const resumeText = pdfData.text.slice(0, 8000);

    const prompt = `
You are a professional resume reviewer.

Please suggest the top 3 improvements for the resume below.

Resume:
${resumeText}
    `;

    const geminiResponse = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GOOGLE_AI_API_KEY}`,
        {
          contents: [
            {
              role: "user",
              parts: [{ text: prompt }],
            },
          ],
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      

    const review =
      geminiResponse.data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No feedback generated.";
    return res.json({ review });
  } catch (err) {
    console.error("Resume Review Error:", err?.response?.data || err.message);
    return res.status(500).json({ error: "Failed to review resume." });
  }
};

module.exports = { uploadResume, getResumeUrl, analyzeResume };
