const { PrismaClient, $Enums } = require("@prisma/client");
const prisma = new PrismaClient();

const findUser = async (email) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (!user) return null;
    return user;
  } catch (e) {
    console.log(e);
  }
};

const findUserByUserId = async (id) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: id,
      },
    });
    if (!user) return null;
    return user;
  } catch (e) {
    console.log(e);
  }
};

const findEducationByUserId = async (id) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: id,
      },
      include: {
        education: true,
      },
    });
    if (!user) return null;
    return user;
  } catch (e) {
    console.log(e);
  }
};

const findProjectsByUserId = async (id) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: id,
      },
      include: {
        projects: true,
      },
    });

    if (!user) return null;
    return user;
  } catch (e) {
    console.error("Error in findProjectsByUserId:", e);
    return null;
  }
};

const createUser = async (
  username,
  email,
  hashedPassword,
  enumRole,
  company
) => {
  try {
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        role: enumRole,
        companyId: enumRole === $Enums.Role.EMPLOYER ? company.id : null,
      },
    });

    return user;
  } catch (e) {
    console.log(e);
  }
};

const findExperienceByUserId = async (id) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: id,
      },
      include: {
        experiences: true,
      },
    });
    if (!user) return null;
    return user;
  } catch (e) {
    console.log(e);
  }
};

const updateUserSkill = async (userId, skills) => {
  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { skills },
    });
    return updatedUser;
  } catch (error) {
    console.error("Error updating user skill:", error);
    return null;
  }
};

const generateUserResponse = (user) => {
  const userData = {
    id: user.id,
    email: user.email,
    username: user.username,
    role: user.role,
    skills : user.skills || null
  };
  return userData;
};

const getRoleEnum = (role) => {
  let roleEnum = null;
  if (role.toLowerCase() === "employer") {
    roleEnum = $Enums.Role.EMPLOYER;
  } else if (role.toLowerCase() === "job seeker") {
    roleEnum = $Enums.Role.JOB_SEEKER;
  }
  return roleEnum;
};

module.exports = {
  findUser,
  findUserByUserId,
  generateUserResponse,
  findEducationByUserId,
  findExperienceByUserId,
  findProjectsByUserId,
  updateUserSkill,
  createUser,
  getRoleEnum,
};
