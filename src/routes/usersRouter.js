import { Router } from "express";
import { isAuth } from "../middlewares/isAuthMiddleware.js";
import { authRole } from "../middlewares/authRole.js";
import {
  getUsers,
  createUser,
  deleteUser,
} from "../controllers/usersController.js";

const router = Router();

router.get("/", isAuth, getUsers);

router.post("/", createUser);

router.delete("/:id", isAuth, authRole(["admin"]), deleteUser);

export default router;
