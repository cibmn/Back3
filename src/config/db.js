import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/mocks_db";

const connectDB = async () => {
  try {
    mongoose.set("strictQuery", false);
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("MongoDB connected:", MONGO_URI);
  } catch (err) {
    console.error("MongoDB connection error:", err);
    throw err;
  }
};

export default connectDB;
