// src/controllers/petController.js
import Pet from "../models/Pet.js";
import mongoose from "mongoose";

/**
 * GET /api/pets
 * Lista todas las mascotas
 */
export const getPets = async (req, res) => {
  try {
    const pets = await Pet.find();
    res.status(200).json({ ok: true, payload: pets });
  } catch (err) {
    res.status(500).json({ ok: false, error: "Error retrieving pets" });
  }
};

/**
 * POST /api/pets
 * Crear nueva mascota (solo admin)
 */
export const createPet = async (req, res) => {
  try {
    const { name, species, age } = req.body;
    if (!name || !species || age === undefined) {
      return res.status(400).json({ ok: false, error: "Missing fields" });
    }

    const pet = await Pet.create({ name, species, age, adopted: false });
    res.status(201).json({ ok: true, message: "Pet created", payload: pet });
  } catch (err) {
    res.status(500).json({ ok: false, error: "Error creating pet" });
  }
};

/**
 * DELETE /api/pets/:id
 * Eliminar mascota por id (solo admin)
 */
export const deletePet = async (req, res) => {
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ ok: false, error: "Pet not found" });
    }

    const pet = await Pet.findById(id);
    if (!pet) {
      return res.status(404).json({ ok: false, error: "Pet not found" });
    }

    await pet.deleteOne();
    res.status(200).json({ ok: true, message: "Pet deleted" });
  } catch (err) {
    res.status(500).json({ ok: false, error: "Error deleting pet" });
  }
};
