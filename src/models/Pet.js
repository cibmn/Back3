import mongoose from "mongoose";

const petSchema = new mongoose.Schema({
  name: String,
  species: String,
  age: Number,
  adopted: { type: Boolean, default: false }
});

export default mongoose.models.Pet || mongoose.model("Pet", petSchema);
