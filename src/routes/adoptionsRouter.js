import { Router } from "express";
import { isAuth, authRole } from "../middlewares/isAuthMiddleware.js";
import {
  getAdoptions,
  createAdoption,
  createAdoptionDirect
} from "../controllers/adoption.controller.js";

const router = Router();

// GET /api/adoptions → lista todas
router.get("/", isAuth, getAdoptions);

// POST /api/adoptions/:uid/:pid → crear adopción
router.post("/:uid/:pid", isAuth, authRole(), createAdoption);

// POST /api/adoptions → crear adopción directa
router.post("/", isAuth, authRole(), createAdoptionDirect);

export default router;
