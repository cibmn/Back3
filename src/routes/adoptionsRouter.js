import { Router } from "express";
import mongoose from "mongoose";

import User from "../models/User.js";
import Pet from "../models/Pet.js";
import Adoption from "../models/Adoption.js";

const router = Router();

// GET todas las adopciones
router.get("/", async (req, res) => {
  try {
    const adoptions = await Adoption.find().populate("owner pet");
    res.json(adoptions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET adopción por ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "Invalid adoption ID" });
  }

  try {
    const adoption = await Adoption.findById(id).populate("owner pet");
    if (!adoption) return res.status(404).json({ error: "Adoption not found" });
    res.json(adoption);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST nueva adopción
router.post("/:uid/:pid", async (req, res) => {
  const { uid, pid } = req.params;

  if (!mongoose.Types.ObjectId.isValid(uid) || !mongoose.Types.ObjectId.isValid(pid)) {
    return res.status(400).json({ error: "Invalid User or Pet ID" });
  }

  try {
    const user = await User.findById(uid);
    const pet = await Pet.findById(pid);

    if (!user || !pet) return res.status(404).json({ error: "User or Pet not found" });
    if (pet.adopted) return res.status(400).json({ error: "Pet already adopted" });

    const newAdoption = await Adoption.create({
      owner: user._id,
      pet: pet._id,
      date: new Date(),
    });

    pet.adopted = true;
    await pet.save();

    res.status(201).json(newAdoption);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
