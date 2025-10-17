export const authRole = (roles = []) => {
  return (req, res, next) => {
    if (!roles.length) return next(); 
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ ok: false, error: "Forbidden" });
    }
    next();
  };
};
