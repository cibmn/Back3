import petModel from "../models/petModel.js";
import { generateMockPets } from "../services/petsService.js";
import petDto from "../dtos/petDtos.js";

export const listpets = async (req, res) => {
  try {
    const pets = await petModel.find().lean();
    return res.json({ ok: true, payload: pets });
  } catch (err) {
    console.error("listpets error:", err);
    return res.status(500).json({ ok: false, error: "Server error listing pets" });
  }
};

export const mockingpets = async (req, res) => {
  try {
    const pets = generateMockPets(10); 
    const payload = pets.map(p => new petDto(p));
    return res.json({ ok: true, payload });
  } catch (err) {
    console.error("mockingpets error:", err);
    return res.status(500).json({ ok: false, error: "Error generating mocking pets" });
  }
};
