import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

import UserModel from "../models/userModel.js";
import Pet from "../models/Pet.js";

const connectDB = async () => {
  try {
    await mongoose.connect(
      process.env.MONGO_URI || "mongodb://localhost:27017/mocks_db"
    );
    console.log("MongoDB conectado ✅");
  } catch (err) {
    console.error("Error conectando MongoDB:", err);
    process.exit(1);
  }
};

const seed = async () => {
  await connectDB();

  await User.deleteMany({});
  await Pet.deleteMany({});

  const user = await User.create({
    name: "Test User",
    email: "testuser@example.com",
    password: "123456",
  });

  const pet = await Pet.create({
    name: "Firulais",
    type: "Perro",
    age: 3,
  });

  console.log("Usuario ID:", user._id.toString());
  console.log("Mascota ID:", pet._id.toString());

  mongoose.disconnect();
};

seed();
