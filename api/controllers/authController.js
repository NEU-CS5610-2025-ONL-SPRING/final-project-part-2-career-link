const {
  findUser: findUserByEmail,
  generateUserResponse,
  findUserByUserId,
  createUser,
  getRoleEnum,
} = require("../services/UserService");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const {
  findCompanybyName,
  createCompany,
} = require("../services/companyService");
const { $Enums } = require("@prisma/client");

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await findUserByEmail(email);

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const payload = { userId: user.id, role: user.role};

    const token = generateJWTToken(payload);

    const isProduction = process.env.NODE_ENV === "production";
    console.log(isProduction);

    res.cookie("token", token, { httpOnly: true, secure: isProduction, sameSite: isProduction ? "None" : "Lax", maxAge: 60 * 60 * 1000 });

    const userData = generateUserResponse(user);

    res.json(userData);
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: " Internal Server Error" });
  }
};

const signup = async (req, res) => {
  const {
    username,
    email,
    password,
    rePassword,
    role,
    companyName,
    location,
    website,
  } = req.body;

  try {

    if(password !== rePassword){
      return res.status(400).json({ message: "Password doesn't match" });
    }
    const enumRole = getRoleEnum(role);
    if(!enumRole){
      return res.status(400).json({ message: "Role can either be job seeker or employer" });
    }

    let existingUser = await findUserByEmail(email);

    if (existingUser) {
      return res.status(400).json({ message: "Email is already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let company;
    if (enumRole == $Enums.Role.EMPLOYER) {
      company = await findCompanybyName(companyName);

      if (!company) {
        company = await createCompany(companyName, location, website);
        if (!company) {
          return res
            .status(500)
            .json({ message: "Something went wrong creating new company" });
        }
      }
    }

    const user = await createUser(username, email, hashedPassword, enumRole, company);

    if (!user) {
      return res
        .status(500)
        .json({ message: "Something went wrong creating new user" });
    }

    const payload = { userId: user.id, role: user.role };

    const token = generateJWTToken(payload);

    const isProduction = process.env.NODE_ENV === "production";

    res.cookie("token", token, { httpOnly: true, secure: isProduction, sameSite: isProduction ? "None" : "Lax", maxAge: 60 * 60 * 1000 });

    const userData = generateUserResponse(user);

    res.status(201).json(userData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const logout = async (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out" });
};

const getUserByToken = async (req, res) => {
  try {
    const user = await findUserByUserId(req.user.userId);

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const userData = generateUserResponse(user);

    res.json(userData);
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: " Internal Server Error" });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await findUserByUserId(parseInt(req.params.employeeId));

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const userData = generateUserResponse(user);

    res.json(userData);
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: " Internal Server Error" });
  }
};

const generateJWTToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "15m",
  });
};

module.exports = {
  login,
  signup,
  logout,
  getUserByToken,
  getUserById
};
