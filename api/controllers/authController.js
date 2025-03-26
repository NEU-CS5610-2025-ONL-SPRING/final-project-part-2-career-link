const { findUser } = require("../services/UserService");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");


const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await findUser(email);

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const payload = { userId: user.id };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });

    res.cookie("token", token, { httpOnly: true, maxAge: 15 * 60 * 1000 });

    const userData = {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    };

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

module.exports = {
  login,
  logout,
};
