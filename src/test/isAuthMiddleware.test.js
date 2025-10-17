import jwt from "jsonwebtoken";
import UserModel from "../models/userModel.js";

export const decodeToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || "secretkey");
  } catch {
    return null;
  }
};

export const isAuth = () => async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header) {
      return res.status(401).json({ error: "Token requerido" });
    }

    const token = header.split(" ")[1];
    const decoded = decodeToken(token);
    if (!decoded) {
      return res.status(401).json({ error: "Token invalido" });
    }

    const user = await UserModel.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ error: "Usuario no valido" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Error en isAuth:", error);
    res.status(500).json({ error: "Error en autenticacion" });
  }
};
