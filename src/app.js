import express from "express";
import dotenv from "dotenv";
dotenv.config();

import connectDB from "./config/db.js";
import usersRouter from "./routes/usersRouter.js";
import petsRouter from "./routes/petsRouter.js";
import mocksRouter from "./routes/mocksRouter.js";

const app = express();

// Middleware global
app.use(express.json());

// Health Check primero
app.get("/", (req, res) => res.json({ ok: true, msg: "API Mocks - up" }));

// Routers
app.use("/api/users", usersRouter);
app.use("/api/pets", petsRouter);
app.use("/api/mocks", mocksRouter);

const PORT = process.env.PORT || 4000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect DB:", err);
    process.exit(1);
  });
