import Pet from "../models/Pet.js";

export const listPets = async (req, res) => {
  try {
    const pets = await Pet.find({});
    res.status(200).json({ ok: true, payload: pets }); // listado exitoso → 200
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
};

export const createPet = async (req, res) => {
  try {
    if (!req.body.name || !req.body.species) {
      return res.status(400).json({ ok: false, error: "Missing required fields" });
    }

    const pet = await Pet.create(req.body);
    res.status(201).json({ ok: true, payload: pet }); // creación exitosa → 201
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
};

export const updatePet = async (req, res) => {
  try {
    const pet = await Pet.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!pet) return res.status(404).json({ ok: false, error: "Pet not found" }); // pet inexistente → 404
    res.json({ ok: true, payload: pet });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
};

export const deletePet = async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);
    if (!pet) return res.status(404).json({ ok: false, error: "Pet not found" }); // pet inexistente → 404

    await pet.deleteOne();
    res.status(200).json({ ok: true, message: "Pet deleted successfully" }); // eliminación exitosa → 200
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
};
