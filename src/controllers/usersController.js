import User from "../models/UserModel.js";
import bcrypt from "bcrypt";

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (updates.password) {
      const salt = await bcrypt.genSalt(10);
      updates.password = await bcrypt.hash(updates.password, salt);
    }

    const updatedUser = await User.findByIdAndUpdate(id, updates, { new: true, runValidators: true });

    if (!updatedUser) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.status(200).json({ message: "Usuario actualizado correctamente", user: updatedUser });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Email ya existe" });
    }
    res.status(400).json({ message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.status(200).json({ message: "Usuario eliminado correctamente", user: deletedUser });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
