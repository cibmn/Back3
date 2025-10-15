import { Router } from "express";
import mongoose from "mongoose";
import PetDao from "../daos/petDao.js";
import PetDto from "../dtos/petDtos.js";
import { isAuth, authRole } from "../middlewares/isAuth.js";

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

router.post("/", isAuth, authRole(["admin"]), async (req, res) => {
  try {
    const pet = await petDao.create(req.body);
    const payload = new PetDto(pet);
    res.status(201).json({ ok: true, payload });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

router.patch("/:id", isAuth, authRole(["admin"]), async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ ok: false, error: "Invalid pet ID" });
  }

  try {
    const pet = await petDao.update(id, req.body);
    if (!pet) return res.status(404).json({ ok: false, error: "Pet not found" });
    const payload = new PetDto(pet);
    res.json({ ok: true, payload });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

router.delete("/:id", isAuth, authRole(["admin"]), async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ ok: false, error: "Invalid pet ID" });
  }

  try {
    const pet = await petDao.delete(id);
    if (!pet) return res.status(404).json({ ok: false, error: "Pet not found" });
    const payload = new PetDto(pet);
    res.json({ ok: true, payload });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

export default router;
