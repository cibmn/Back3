import express from "express";
import dotenv from "dotenv";
dotenv.config();

import connectDB from "./config/db.js";
import usersRouter from "./routes/usersRouter.js";
import petsRouter from "./routes/petRouter.js";
import mocksRouter from "./routes/mocksRouter.js";

import { swaggerUi, swaggerSpecs } from "./config/swagger.js";
import adoptionsRouter from "./routes/adoptionsRouter.js";

const app = express();

app.use(express.json());

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

app.get("/", (req, res) => res.json({ ok: true, msg: "API Mocks - up" }));

app.use("/api/users", usersRouter);
app.use("/api/pets", petsRouter);
app.use("/api/mocks", mocksRouter);
app.use("/api/adoptions", adoptionsRouter);


const PORT = process.env.PORT || 4000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Server listening on port ${PORT}`);
      console.log(`📘 Swagger docs available at: http://localhost:${PORT}/api/docs`);
    });
  })
  .catch((err) => {
    console.error("❌ Failed to connect DB:", err);
    process.exit(1);
  });
