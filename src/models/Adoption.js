import mongoose from "mongoose";

const adoptionSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  pet: { type: mongoose.Schema.Types.ObjectId, ref: "Pet" },
  date: { type: Date, default: Date.now },
});

export default mongoose.model("Adoption", adoptionSchema);
