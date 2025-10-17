// src/routes/mocksRouter.js
import { Router } from "express";
import Pet from "../models/Pet.js";

const router = Router();

// Obtener todas las mascotas
router.get("/pets", async (req, res) => {
  try {
    const pets = await Pet.find();
    res.json({ ok: true, pets });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// Crear una mascota (mock o real)
router.post("/pets", async (req, res) => {
  try {
    const pet = await Pet.create(req.body);
    res.status(201).json({ ok: true, pet });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// Eliminar una mascota por ID
router.delete("/pets/:id", async (req, res) => {
  try {
    const pet = await Pet.findByIdAndDelete(req.params.id);
    if (!pet) return res.status(404).json({ ok: false, error: "Pet not found" });
    res.json({ ok: true, pet });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

export default router;
