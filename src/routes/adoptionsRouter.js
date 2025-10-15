import { Router } from "express";
import { isAuth } from "../middlewares/isAuthMiddleware.js";
import { authRole } from "../middlewares/authRole.js";
import { getAdoptions, createAdoption } from "../controllers/adoption.controller.js";

const router = Router();

router.get("/", isAuth, authRole(["admin"]), getAdoptions);
router.post("/:uid/:pid", isAuth, authRole(["admin"]), createAdoption);

export default router;
