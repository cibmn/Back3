import { Router } from "express";
import { listUsers } from "../controllers/usersController.js";

const router = Router();

router.get("/", listUsers);

export default router;