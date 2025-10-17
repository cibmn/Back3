import { Router } from "express";
import Pet from "../models/Pet.js";

const router = Router();

router.get("/pets", async (req, res) => {
  try {
    const pets = await Pet.find();
    res.status(200).json({ ok: true, pets }); 
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ ok: false, error: "Error interno al listar mascotas" });
  }
});

router.post("/pets", async (req, res) => {
  if (!req.body.name || !req.body.species) {
    return res
      .status(400)
      .json({ ok: false, error: "Faltan campos requeridos" });
  }

  try {
    const pet = await Pet.create(req.body);
    res.status(201).json({ ok: true, pet }); 
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ ok: false, error: "Error interno al crear mascota" });
  }
});

router.delete("/pets/:id", async (req, res) => {
  if (!req.params.id || !mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(404).json({ ok: false, error: "ID inválido" });
  }

  try {
    const pet = await Pet.findByIdAndDelete(req.params.id);
    if (!pet)
      return res
        .status(404)
        .json({ ok: false, error: "Mascota no encontrada" });
    res.status(200).json({ ok: true, pet }); 
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ ok: false, error: "Error interno al eliminar mascota" });
  }
});

export default router;
