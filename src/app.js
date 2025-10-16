import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import usersRouter from "./routes/usersRouter.js";
import petsRouter from "./routes/petRouter.js";
import mocksRouter from "./routes/mocksRouter.js";
import adoptionsRouter from "./routes/adoptionsRouter.js";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger.js";

dotenv.config();

const app = express();
app.use(express.json());

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/", (req, res) => res.json({ ok: true, msg: "API Mocks - up" }));
app.use("/api/users", usersRouter);
app.use("/api/pets", petsRouter);
app.use("/api/mocks", mocksRouter);
app.use("/api/adoptions", adoptionsRouter);

if (!process.env.MONGO_URI) {
  console.error("❌ No se encontró MONGO_URI en las variables de entorno");
  process.exit(1);
}

await connectDB();

if (process.env.NODE_ENV !== "test") {
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`✅ Server listening on port ${PORT}`);
    console.log(`📘 Swagger docs available at: http://localhost:${PORT}/api/docs`);
  });
}

export default app;
