// src/controllers/adoption.controller.js
import AdoptionModel from "../models/Adoption.js"; // Asegúrate de tener este modelo

// GET /api/adoptions
export const getAdoptions = async (req, res) => {
  try {
    const adoptions = await AdoptionModel.find({});
    return res.status(200).json(adoptions);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// POST /api/adoptions/:uid/:pid
export const createAdoption = async (req, res) => {
  try {
    const { uid, pid } = req.params;

    const existing = await AdoptionModel.findOne({ pet: pid });
    if (existing) return res.status(400).json({ error: "Mascota ya adoptada" });

    const adoption = await AdoptionModel.create({ user: uid, pet: pid });

    return res.status(201).json({ message: "Adopción creada", adoption });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// POST /api/adoptions (adopción directa)
export const createAdoptionDirect = async (req, res) => {
  try {
    const { user, pet } = req.body;

    const existing = await AdoptionModel.findOne({ pet });
    if (existing) return res.status(400).json({ error: "Mascota ya adoptada" });

    const adoption = await AdoptionModel.create({ user, pet });

    return res.status(201).json({ message: "Adopción creada", adoption });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
