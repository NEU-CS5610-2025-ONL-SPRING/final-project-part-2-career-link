const { $Enums } = require("@prisma/client");
const { findEducationByUserId, generateUserEducationResponse } = require("../services/UserService");


const getEducation = async (req, res) => {
  try {
    const {userId} = req.params;
    if(parseInt(userId) != req.userId){
        return res.status(401).json({error : "Request Unauthorized"});
    }
    const user = await findEducationByUserId(req.userId);

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    if (user.role !== $Enums.Role.JOB_SEEKER) {
      return res.status(400).json({ error: "Employer cannot have education" });
    }

    const education = generateUserEducationResponse(user.education);

    return res.json(education);
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: " Internal Server Error" });
  }
};

module.exports = {
    getEducation
}
