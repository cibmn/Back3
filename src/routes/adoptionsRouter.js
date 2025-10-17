import { Router } from "express";
import { isAuth } from "../middlewares/isAuthMiddleware.js";
import { authRole } from "../middlewares/authRole.js";
import {
  getAdoptions,
  createAdoption,
  createAdoptionDirect,
  deleteAdoption
} from "../controllers/adoption.controller.js";

const router = Router();

// Listar adopciones
router.get("/", isAuth, authRole(), getAdoptions);

// Crear adopción usando params
router.post("/:uid/:pid", isAuth, authRole(), createAdoption);

// Crear adopción usando body { user, pet }
router.post("/", isAuth, authRole(), createAdoptionDirect);

// Eliminar adopción por id
router.delete("/:id", isAuth, authRole(), deleteAdoption);

export default router;
