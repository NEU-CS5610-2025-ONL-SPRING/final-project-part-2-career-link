const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const createExperience = async (user, experience) => {
  try {
    let startDate;
    let endDate;

    if (experience.startDate) {
      startDate = new Date(experience.startDate).toISOString();
    }
    if (experience.endDate) {
      endDate = new Date(experience.endDate).toISOString();
    }

    const newExperience = await prisma.experience.create({
      data: {
        userId: user.id,
        company: experience.company,
        jobTitle: experience.jobTitle,
        description: experience.description || null,
        startDate: startDate,
        endDate: endDate || null,
      },
    });

    return newExperience;
  } catch (e) {
    console.error("Error creating experience:", e);
    throw new Error("Unable to create experience record");
  }
};

const getExperienceById = async (id) => {
  try {
    const experience = await prisma.experience.findUnique({
      where: {
        id: id,
      },
    });
    return experience;
  } catch (e) {
    console.error("Error finding experience:", e);
    throw new Error("Unable to find experience record");
  }
};

const updateExperienceById = async (id, experienceData) => {
  try {
    let startDate;
    let endDate;

    if (experienceData.startDate) {
      startDate = new Date(experienceData.startDate).toISOString();
    }
    if (experienceData.endDate) {
      endDate = new Date(experienceData.endDate).toISOString();
    }

    const updatedExperience = await prisma.experience.update({
      where: {
        id: id,
      },
      data: {
        company: experienceData.company,
        jobTitle: experienceData.jobTitle,
        description: experienceData.description || null,
        startDate: startDate,
        endDate: endDate || null,
      },
    });

    return updatedExperience;
  } catch (e) {
    console.error("Error updating experience:", e);
    throw new Error("Unable to update experience record");
  }
};

const removeExperience = async (id) => {
  try {
    const exp = await prisma.experience.delete({
      where: {
        id: id,
      },
    });
    return exp;
  } catch (error) {
    console.error("Error removing experience:", error);
    throw new Error("Failed to remove experience: " + error);
  }
};

module.exports = {
  createExperience,
  getExperienceById,
  updateExperienceById,
  removeExperience,
};
