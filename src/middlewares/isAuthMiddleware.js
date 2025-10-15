import jwt from "jsonwebtoken";
import UserModel from "../models/UserModel.js";

export const decodeToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || "secretkey");
  } catch {
    return null;
  }
};

export const isAuth = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Token requerido" });

  const decoded = decodeToken(token);
  if (!decoded) return res.status(401).json({ message: "Token inválido" });

  const user = await UserModel.findById(decoded.id);
  if (!user) return res.status(401).json({ message: "Usuario no válido" });

  req.user = user;
  next();
};
