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

module.exports = {
  findUser,
};
