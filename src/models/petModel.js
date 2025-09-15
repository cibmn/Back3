import mongoose from "mongoose";

const petSchema = new mongoose.Schema({
  name: { type: String, required: true },
  species: { type: String, required: true },
  age: { type: Number, default: 0 },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null }
}, { timestamps: true });

const PetModel = mongoose.model("Pet", petSchema);

export default PetModel;
