import jwt from "jsonwebtoken";
import UserModel from "../models/userModel.js";

export const decodeToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || "secretkey");
  } catch {
    return null;
  }
};

export const isAuth = async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header)
    return res.status(401).json({ ok: false, error: "No token provided" });

  const token = header.split(" ")[1];
  const decoded = decodeToken(token);
  if (!decoded)
    return res.status(401).json({ ok: false, error: "Invalid token" });

  const user = await UserModel.findById(decoded.id);
  if (!user)
    return res.status(404).json({ ok: false, error: "User not found" });

  req.user = user;
  next();
};
