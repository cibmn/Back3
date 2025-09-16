import petModel from "../models/petModel.js";

export default class petDao {
  async create(pet) {
    return petModel.create(pet);
  }

  async insertMany(pets) {
    return petModel.insertMany(pets, { ordered: false });
  }

  async getAll() {
    return petModel.find({});
  }
}
