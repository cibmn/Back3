import Pet from "../models/Pet.js";

export const listPets = async (req, res) => {
  try {
    const pets = await Pet.find();
    res.json({ ok: true, pets }); 
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
};

export const createPet = async (req, res) => {
  try {
    const pet = await Pet.create(req.body);
    res.status(201).json({ ok: true, pet });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
};

export const deletePet = async (req, res) => {
  try {
    const pet = await Pet.findByIdAndDelete(req.params.id);
    if (!pet)
      return res.status(404).json({ ok: false, error: "Pet not found" });
    res.json({ ok: true, pet });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
};
