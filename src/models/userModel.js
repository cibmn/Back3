import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  role: { type: String, default: "user" }, 
  pets: [{ type: mongoose.Schema.Types.ObjectId, ref: "Pet" }]
});

export default mongoose.models.User || mongoose.model("User", userSchema);
