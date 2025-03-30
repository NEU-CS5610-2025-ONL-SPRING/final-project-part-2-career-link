const jwt = require("jsonwebtoken");
 
const requireAuth = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }
 
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
 
    req.user = {
      userId: payload.userId,
      role: payload.role,
    };
 
    next();
  } catch (err) {
    return res.status(401).json({ error: "Unauthorized" });
  }
};
 
// Role checking
const requireRole = (roles) => {
  return (req, res, next) => {
    requireAuth(req, res, () => {
      if (!roles.map(r => r.toUpperCase()).includes(req.user.role.toUpperCase())) {
        return res.status(403).json({
          error: "Forbidden",
          message: `Requires one of these roles: ${roles.join(", ")}`,
          yourRole: req.user.role,
        });
      }
      next();
    });
  };
};
 
const requireEmployer = requireRole(['EMPLOYER']); 
const requireEmployee = requireRole(['JOB_SEEKER']);
 
module.exports = {
  requireAuth, 
  requireEmployer, 
  requireEmployee, 
};