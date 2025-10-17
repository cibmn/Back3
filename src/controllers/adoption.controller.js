import AdoptionModel from "../models/Adoption.js";

// GET /api/adoptions
export const getAdoptions = async (req, res) => {
  try {
    const adoptions = await AdoptionModel.find({});
    const payload = adoptions.map(a => ({ id: a._id, user: a.user, pet: a.pet }));
    res.status(200).json({ ok: true, payload });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
};

// POST /api/adoptions/:uid/:pid
export const createAdoption = async (req, res) => {
  try {
    const { uid, pid } = req.params;
    const existing = await AdoptionModel.findOne({ pet: pid });
    if (existing) return res.status(400).json({ ok: false, error: "Mascota ya adoptada" });

    const adoption = await AdoptionModel.create({ user: uid, pet: pid });
    res.status(201).json({ ok: true, payload: { id: adoption._id, user: adoption.user, pet: adoption.pet } });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
};

// POST /api/adoptions (adopción directa)
export const createAdoptionDirect = async (req, res) => {
  try {
    const { user, pet } = req.body;
    const existing = await AdoptionModel.findOne({ pet });
    if (existing) return res.status(400).json({ ok: false, error: "Mascota ya adoptada" });

    const adoption = await AdoptionModel.create({ user, pet });
    res.status(201).json({ ok: true, payload: { id: adoption._id, user: adoption.user, pet: adoption.pet } });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
};
