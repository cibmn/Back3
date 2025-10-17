import Pet from "../models/Pet.js";

export default class PetDao {
  async getAll() {
    return Pet.find({});
  }

  async getById(id) {
    return Pet.findById(id);
  }

  async create(petData) {
    return Pet.create(petData);
  }

  async update(id, data) {
    return Pet.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id) {
    return Pet.findByIdAndDelete(id);
  }
}
