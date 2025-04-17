const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const createEducation = async (user, education) => {
  try {
    let startDate;
    let endDate;
    if (education.startDate) {
      startDate = new Date(education.startDate).toISOString();
    }
    if (education.endDate) {
      endDate = new Date(education.endDate).toISOString();
    }
    const newEducation = await prisma.education.create({
      data: {
        userId: user.id,
        institution: education.institution,
        degree: education.degree,
        fieldOfStudy: education.fieldOfStudy,
        startDate: startDate,
        endDate: endDate,
      },
    });

    return newEducation;
  } catch (e) {
    console.error("Error creating education:", e);
    throw new Error("Unable to create education record");
  }
};

const getEducationById = async (id) => {
  try {
    const education = await prisma.education.findUnique({
      where: {
        id: id,
      },
    });
    return education;
  } catch (e) {
    console.error("Error finding education:", e);
    throw new Error("Unable to find education record");
  }
};

const updateEducationById = async (id, educationData) => {
  try {
    let startDate;
    let endDate;
    if (educationData.startDate) {
      startDate = new Date(educationData.startDate).toISOString();
    }
    if (educationData.endDate) {
      endDate = new Date(educationData.endDate).toISOString();
    }
    const updatedEducation = await prisma.education.update({
      where: {
        id: id,
      },
      data: {
        institution: educationData.institution,
        degree: educationData.degree,
        fieldOfStudy: educationData.fieldOfStudy || null,
        startDate: startDate,
        endDate: endDate || null,
      },
    });
    return updatedEducation;
  } catch (e) {
    console.error("Error updating education:", e);
    throw new Error("Unable to update education record");
  }
};


const removeEducation = async (id) => {
  try {
    const edu = await prisma.education.delete({
      where: {
        id: id,
      },
    });
    return edu;
  } catch (error) {
    console.error("Error removing education:", error);
    throw new Error("Failed to remove education" + error);
  }
};

module.exports = {
  createEducation,
  removeEducation,
  getEducationById,
  updateEducationById
};
