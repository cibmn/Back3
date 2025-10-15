import UserModel from "./models/userModel.js";
import bcrypt from "bcrypt";

export default class UserDao {
  async getAll() {
    return await UserModel.find();
  }

  async getById(id) {
    return await UserModel.findById(id);
  }

  async create(data) {
    if (data.password) {
      const salt = await bcrypt.genSalt(10);
      data.password = await bcrypt.hash(data.password, salt);
    }
    return await UserModel.create(data);
  }

  async update(id, data) {
    try {
      if (data.password) {
        const salt = await bcrypt.genSalt(10);
        data.password = await bcrypt.hash(data.password, salt);
      }

      if (data.role && !["user", "admin"].includes(data.role)) {
        throw new Error("Rol inválido");
      }

      const updatedUser = await UserModel.findByIdAndUpdate(id, data, { new: true, runValidators: true });
      return updatedUser;
    } catch (error) {
      if (error.code === 11000 && error.keyPattern.email) {
        throw new Error("Email ya existe");
      }
      throw error;
    }
  }

  async delete(id) {
    return await UserModel.findByIdAndDelete(id);
  }
}
