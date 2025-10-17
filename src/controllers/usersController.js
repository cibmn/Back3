import mongoose from "mongoose";
import UserModel from "../models/userModel.js";


export const getUsers = async (req, res) => {
  try {
    const users = await UserModel.find().select("-password"); 
    res.status(200).json({ ok: true, payload: users });
  } catch (err) {
    res.status(500).json({ ok: false, error: "Error retrieving users" });
  }
};


export const createUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, role } = req.body;
    if (!firstName || !lastName || !email || !password || !role) {
      return res.status(400).json({ ok: false, error: "Missing fields" });
    }

    const existing = await UserModel.findOne({ email });
    if (existing) {
      return res.status(400).json({ ok: false, error: "Email already exists" });
    }

    const user = await UserModel.create({ firstName, lastName, email, password, role });
    res.status(201).json({ ok: true, message: "User created", payload: user });
  } catch (err) {
    res.status(500).json({ ok: false, error: "Error creating user" });
  }
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ ok: false, error: "User not found" });
    }

    const user = await UserModel.findById(id);
    if (!user) {
      return res.status(404).json({ ok: false, error: "User not found" });
    }

    await user.deleteOne();
    res.status(200).json({ ok: true, message: "User deleted" });
  } catch (err) {
    res.status(500).json({ ok: false, error: "Error deleting user" });
  }
};
