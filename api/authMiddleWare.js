export function requireAuth(req, res, next) {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    req.userId = payload.userId;

    next();
    
  } catch (err) {
    return res.status(401).json({ error: "Unauthorized" });
  }
}
