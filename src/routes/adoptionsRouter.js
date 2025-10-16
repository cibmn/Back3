import { Router } from "express";
import { isAuth } from "../middlewares/isAuthMiddleware.js";
import { getAdoptions, createAdoption } from "../controllers/adoption.controller.js";

const router = Router();

router.get("/", isAuth(["admin"]), getAdoptions);
router.post("/:uid/:pid", isAuth(["admin"]), createAdoption);

export default router;
