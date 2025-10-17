// src/routes/adoptionsRouter.js
import { Router } from "express";
import {
  getAdoptions,
  createAdoption,
  createAdoptionDirect,
} from "../controllers/adoption.controller.js";
import { isAuth } from "../middlewares/isAuthMiddleware.js";
import { authRole } from "../middlewares/authRole.js";

const router = Router();

// GET /api/adoptions
router.get("/", isAuth, getAdoptions);

// POST /api/adoptions/:uid/:pid
router.post("/:uid/:pid", isAuth, authRole(), createAdoption);

// POST /api/adoptions (adopción directa)
router.post("/", isAuth, authRole(), createAdoptionDirect);

// Export default del router
export default router;
