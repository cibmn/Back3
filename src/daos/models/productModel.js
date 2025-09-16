import mongoose from "mongoose";

const productCollection = "Product";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true }
});

const ProductModel =
  mongoose.models[productCollection] || mongoose.model(productCollection, productSchema);

export default ProductModel;
