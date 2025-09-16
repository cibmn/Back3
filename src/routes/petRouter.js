import { Router } from "express";
import PetDao from "../daos/petDao.js";
import PetDto from "../dtos/petDtos.js";

const router = Router();
const petDao = new PetDao();

router.get("/", async (req, res) => {
  try {
    const pets = await petDao.getAll();
    const payload = pets.map((p) => new PetDto(p));
    res.json({ ok: true, payload });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

export default router;
