// src/routes/petRouter.js
import { Router } from "express";
import { isAuth } from "../middlewares/isAuthMiddleware.js";
import { authRole } from "../middlewares/authRole.js";
import {
  listPets,
  createPet,
  deletePet,
  updatePet,
} from "../controllers/petController.js";

const router = Router();

// Rutas
router.get("/", isAuth, listPets);
router.post("/", isAuth, authRole(["admin"]), createPet);
router.patch("/:id", isAuth, authRole(["admin"]), updatePet);
router.delete("/:id", isAuth, authRole(["admin"]), deletePet);

// Export default del router
export default router;
