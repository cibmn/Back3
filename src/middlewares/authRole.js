export const authRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ ok: false, error: "Unauthorized" }); // token faltante o inválido → 401
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ ok: false, error: "Insufficient role" }); // rol insuficiente → 403
    }

    next();
  };
};
