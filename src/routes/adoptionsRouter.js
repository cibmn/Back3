import { Router } from "express";
import { isAuth } from "../middlewares/isAuth.js";
import { getAdoptions, createAdoption } from "../controllers/adoption.controller.js";

const router = Router();

router.get("/api/adoptions", getAdoptions);
router.post("/api/adoptions/:uid/:pid", isAuth, createAdoption);

export default router;
