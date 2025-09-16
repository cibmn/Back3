import { Router } from "express";
import { getMockingUsers, generateData } from "../controllers/mocksController.js";
import { mockingpets } from "../controllers/petController.js";

const router = Router();

router.get("/mockingUsers", getMockingUsers);   
router.get("/mockingpets", mockingpets);       
router.post("/generateData", generateData);

export default router;
