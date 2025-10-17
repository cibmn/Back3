// src/controllers/petController.js
import Pet from "../models/Pet.js";

// GET /api/pets
export const listPets = async (req, res) => {
  try {
    const pets = await Pet.find({});
    res.json({ ok: true, payload: pets });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
};

// POST /api/pets
export const createPet = async (req, res) => {
  try {
    const pet = await Pet.create(req.body);
    res.status(201).json({ ok: true, payload: pet });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
};

// PATCH /api/pets/:id
export const updatePet = async (req, res) => {
  try {
    const pet = await Pet.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!pet) return res.status(404).json({ ok: false, error: "Pet not found" });
    res.json({ ok: true, payload: pet });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
};

// DELETE /api/pets/:id
export const deletePet = async (req, res) => {
  try {
    const pet = await Pet.findByIdAndDelete(req.params.id);
    if (!pet) return res.status(404).json({ ok: false, error: "Pet not found" });
    res.json({ ok: true, payload: pet });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
};
