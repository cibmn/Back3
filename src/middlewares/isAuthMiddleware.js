import jwt from "jsonwebtoken";
import UserModel from "../models/UserModel.js";

export const decodeToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || "secretkey");
  } catch {
    return null;
  }
};

export const isAuth =
  (roles = []) =>
  async (req, res, next) => {
    try {
      const header = req.headers.authorization;
      if (!header) {
        return res.status(401).json({ message: "Token requerido" });
      }

      const token = header.split(" ")[1];
      const decoded = decodeToken(token);
      if (!decoded) {
        return res.status(401).json({ message: "Token inválido" });
      }

      const user = await UserModel.findById(decoded.id);
      if (!user) {
        return res.status(401).json({ message: "Usuario no válido" });
      }

      if (roles.length && !roles.includes(user.role)) {
        return res.status(403).json({ message: "No autorizado" });
      }

      req.user = user;
      next();
    } catch (error) {
      console.error("Error en isAuth:", error);
      res.status(500).json({ message: "Error en autenticación" });
    }
  };
