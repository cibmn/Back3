// src/routes/petRouter.js
import { Router } from "express";
import { isAuth } from "../middlewares/isAuthMiddleware.js";
import { authRole } from "../middlewares/authRole.js";
import { getPets, createPet, deletePet } from "../controllers/petController.js";

const router = Router();

// Todos pueden listar mascotas
router.get("/", isAuth, getPets);

// Solo admin puede crear y eliminar
router.post("/", isAuth, authRole(["admin"]), createPet);
router.delete("/:id", isAuth, authRole(["admin"]), deletePet);

export default router;
