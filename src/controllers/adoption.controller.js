// src/controllers/adoption.controller.js
import Adoption from "../models/Adoption.js";
import UserModel from "../models/userModel.js";
import Pet from "../models/Pet.js";

export const getAdoptions = async (req, res) => {
  try {
    const adoptions = await Adoption.find().populate("user").populate("pet");
    res.status(200).json({ adoptions });
  } catch (error) {
    res.status(500).json({ message: "Error al obtener las adopciones" });
  }
};

export const createAdoption = async (req, res) => {
  try {
    const { uid, pid } = req.params;

    // Validar usuario y mascota
    const user = await User.findById(uid);
    const pet = await Pet.findById(pid);

    if (!user || !pet) {
      return res.status(400).json({ message: "Usuario o mascota no válidos" });
    }

    // Si la mascota ya fue adoptada
    if (pet.adopted) {
      return res.status(400).json({ message: "La mascota ya fue adoptada" });
    }

    // Crear adopción
    const adoption = await Adoption.create({
      user: user._id,
      pet: pet._id,
    });

    // Marcar mascota como adoptada y agregarla al usuario
    pet.adopted = true;
    await pet.save();

    user.pets.push(pet._id);
    await user.save();

    res.status(201).json({ message: "Adopción creada con éxito", adoption });
  } catch (error) {
    res.status(500).json({ message: "Error al crear la adopción" });
  }
};
