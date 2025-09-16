import ProductModel from "../models/productModel.js";

export default class ProductDao {
  async create(product) {
    return ProductModel.create(product);
  }

  async insertMany(products) {
    return ProductModel.insertMany(products, { ordered: false });
  }

  async getAll() {
    return ProductModel.find({});
  }
}
