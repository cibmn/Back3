import mongoose from "mongoose";

const petCollection = "pet";

const petSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
});

const petModel =
  mongoose.models[petCollection] || mongoose.model(petCollection, petSchema);

export default petModel;
