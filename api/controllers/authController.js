const {
  findUser: findUserByEmail,
  generateUserResponse,
  findUserByUserId
} = require("../services/UserService");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

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

    const payload = { userId: user.id };

    const token = generateJWTToken(payload);

    res.cookie("token", token, { httpOnly: true, maxAge: 15 * 60 * 1000 });

    const userData = generateUserResponse(user);

    res.json(userData);
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: " Internal Server Error" });
  }
};

const logout = async (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out" });
};

const getUserByToken = async (req, res) => {
  try {
    const user = await findUserByUserId(req.userId);

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
  logout,
  getUserByToken
};
