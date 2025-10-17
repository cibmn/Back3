// src/controllers/adoption.controller.js
import mongoose from "mongoose";
import Adoption from "../models/Adoption.js";
import UserModel from "../models/userModel.js";
import Pet from "../models/Pet.js";

/**
 * GET /api/adoptions
 * Lista todas las adopciones
 */
export const getAdoptions = async (req, res) => {
  try {
    const adoptions = await Adoption.find();
    const payload = adoptions.map((a) => ({
      _id: a._id,
      user: a.user,
      pet: a.pet,
    }));
    res.status(200).json({ ok: true, payload });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: "Error retrieving adoptions" });
  }
};

/**
 * POST /api/adoptions/:uid/:pid
 * Crear adopción usando params
 */
export const createAdoption = async (req, res) => {
  const { uid, pid } = req.params;

  try {
    const user = await UserModel.findById(uid);
    if (!user)
      return res.status(404).json({ ok: false, error: "User not found" });

    const pet = await Pet.findById(pid);
    if (!pet)
      return res.status(404).json({ ok: false, error: "Pet not found" });

    if (pet.adopted)
      return res.status(400).json({ ok: false, error: "Mascota ya adoptada" });

    const adoption = await Adoption.create({ user: uid, pet: pid });
    pet.adopted = true;
    await pet.save();

    res.status(201).json({
      ok: true,
      message: "Adopción creada",
      payload: { _id: adoption._id, user: adoption.user, pet: adoption.pet },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: "Error creando adopción" });
  }
};

/**
 * POST /api/adoptions
 * Crear adopción usando body { user, pet }
 */
export const createAdoptionDirect = async (req, res) => {
  const { user, pet } = req.body;

  try {
    const existingUser = await UserModel.findById(user);
    if (!existingUser)
      return res.status(404).json({ ok: false, error: "User not found" });

    const existingPet = await Pet.findById(pet);
    if (!existingPet)
      return res.status(404).json({ ok: false, error: "Pet not found" });

    if (existingPet.adopted)
      return res.status(400).json({ ok: false, error: "Mascota ya adoptada" });

    const adoption = await Adoption.create({ user, pet });
    existingPet.adopted = true;
    await existingPet.save();

    res.status(201).json({
      ok: true,
      message: "Adopción creada",
      payload: { _id: adoption._id, user: adoption.user, pet: adoption.pet },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: "Error creando adopción" });
  }
};

/**
 * DELETE /api/adoptions/:id
 * Eliminar adopción por id
 */
export const deleteAdoption = async (req, res) => {
  const { id } = req.params;
  try {
    const adoption = await Adoption.findById(id);
    if (!adoption)
      return res.status(404).json({ ok: false, error: "Adopción no encontrada" });

    const pet = await Pet.findById(adoption.pet);
    if (pet) {
      pet.adopted = false;
      await pet.save();
    }

    await adoption.deleteOne();
    res.status(200).json({ ok: true, message: "Adopción eliminada" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: "Error eliminando adopción" });
  }
};
