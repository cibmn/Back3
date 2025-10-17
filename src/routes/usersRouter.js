// src/routes/usersRouter.js
import { Router } from "express";
import { isAuth } from "../middlewares/isAuthMiddleware.js";
import { authRole } from "../middlewares/authRole.js";
import {
  getUsers,
  createUser,
  deleteUser,
} from "../controllers/usersController.js";

const router = Router();

// GET /api/users → todos autenticados pueden
router.get("/", isAuth, getUsers);

// POST /api/users → cualquiera puede crear un usuario (registro)
router.post("/", createUser);

// DELETE /api/users/:id → solo admin puede
router.delete("/:id", isAuth, authRole(["admin"]), deleteUser);

export default router;
