import UserModel from "../models/userModel.js";

export const listUsers = async (req, res) => {
  try {
    const users = await UserModel.find().lean();
    return res.json({ ok: true, payload: users });
  } catch (err) {
    console.error("listUsers error:", err);
    return res.status(500).json({ ok: false, error: "Server error listing users" });
  }
};
