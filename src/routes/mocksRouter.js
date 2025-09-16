import { Router } from "express";
import { getMockingUsers, generateData } from "../controllers/mocksController.js";

const router = Router();

router.get("/mockingUsers", getMockingUsers);
router.post("/generateData", generateData);

export default router;
