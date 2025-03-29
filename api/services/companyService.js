const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const findCompanybyName = async (name) => {
  try {
    const company = await prisma.company.findUnique({
      where: {
        name: name,
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

    if (company) return company;
    return null;
  } catch (e) {
    console.log(e);
  }
};

const getAllCompaniesService = async () => {
  try {
    const companies = await prisma.company.findMany({
      select: {
        id: true,
        name: true,
      },
    });
    return companies;
  } catch (e) {
    console.log(e);
  }
};

module.exports = {
  findCompanybyName,
  createCompany,
  getAllCompaniesService,
};
