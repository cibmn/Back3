import UserModel from "../models/userModel.js";

export default class UserDao {
  async getAll() {
    return UserModel.find({});
  }

  async getById(id) {
    return UserModel.findById(id);
  }

  async update(id, data) {
    return UserModel.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id) {
    return UserModel.findByIdAndDelete(id);
  }

  async create(user) {
    return UserModel.create(user);
  }
}
