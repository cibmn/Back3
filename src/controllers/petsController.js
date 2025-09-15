import PetModel from "../models/petModel.js";

export const listPets = async (req, res) => {
  try {
    const pets = await PetModel.find().lean();
    return res.json({ ok: true, payload: pets });
  } catch (err) {
    console.error("listPets error:", err);
    return res.status(500).json({ ok: false, error: "Server error listing pets" });
  }
};
