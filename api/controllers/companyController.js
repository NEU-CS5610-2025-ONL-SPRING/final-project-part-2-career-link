const {
    getAllCompaniesService,
} = require("../services/companyService");

const getAllCompanies = async (req, res) => {
  try {
    const companies = await getAllCompaniesService();
    res.json(companies);
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: " Internal Server Error" });
  }
};

module.exports = {
    getAllCompanies
}
