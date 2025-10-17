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

router.get("/", isAuth, authRole(), getAdoptions);

router.post("/:uid/:pid", isAuth, authRole(), createAdoption);

router.post("/", isAuth, authRole(), createAdoptionDirect);

router.delete("/:id", isAuth, authRole(), deleteAdoption);

export default router;
