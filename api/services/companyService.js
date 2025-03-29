const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const findCompanybyId = async (id) => {
  try {
    if(!id)
        return null;
    const company = await prisma.company.findUnique({
      where: {
        id: id,
      },
    });

    if (!company) return null;
    return company;
  } catch (e) {
    console.log(e);
  }
};

const createCompany = async (companyName, location, website) => {
  try {
    company = await prisma.company.create({
      data: {
        name: companyName,
        location,
        website,
      },
    });

    if (company) return company
    return null;
  } catch (e) {
    console.log(e);
  }
};

module.exports = {
  findCompanybyId,
  createCompany
};
