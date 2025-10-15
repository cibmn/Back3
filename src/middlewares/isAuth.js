export const isAuth = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ status: "error", message: "Unauthorized" });
  }
  next();
};

export const authRole = (roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ status: "error", message: "Forbidden" });
    }
    next();
  };
};
