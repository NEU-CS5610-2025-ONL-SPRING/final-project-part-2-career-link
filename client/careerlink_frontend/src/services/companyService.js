import axios from "axios";

const API_URL = "http://localhost:8000/api/companies";

export const getAllCompanies = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching companies:", error);
    throw error;
  }
};
