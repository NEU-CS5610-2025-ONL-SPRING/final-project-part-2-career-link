const { PrismaClient } = require("@prisma/client");
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


  const  generateUserResponse = (token, user ) => {
    const userData = {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    };
    return userData;
  }

module.exports = {
  findUser,
  generateUserResponse
};
