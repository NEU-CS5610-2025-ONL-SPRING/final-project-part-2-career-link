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
};
