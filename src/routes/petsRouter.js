import { Router } from "express";
import { listPets } from "../controllers/petsController.js";

const router = Router();

router.get("/", listPets);

export default router;