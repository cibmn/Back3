import { Router } from "express";
import {
  generateMockPets,
  generateMockUsers
} from "../services/mockingService.js";
import UserModel from "../models/userModel.js";
import PetModel from "../models/petModel.js";

const router = Router();


router.get("/mockingpets", (req, res) => {
  const pets = generateMockPets(10);
  const payload = pets.map(p => ({ ...p, _id: p._id.toHexString() }));
  return res.json({ ok: true, payload });
});


router.get("/mockingUsers", async (req, res) => {
  try {
    const users = await generateMockUsers(50);
    const payload = users.map(u => ({ ...u, _id: u._id.toHexString() }));
    return res.json({ ok: true, payload });
  } catch (err) {
    console.error("mockingusers error:", err);
    return res.status(500).json({ ok: false, error: "Error generating mocking users" });
  }
});


router.post("/generateData", async (req, res) => {
  try {
    const { users = 0, pets = 0 } = req.body || {};
    const numUsers = Number(users) || 0;
    const numPets = Number(pets) || 0;

    if (numUsers < 0 || numPets < 0) {
      return res.status(400).json({ ok: false, error: "users and pets must be non-negative numbers" });
    }



    // userios
    const generatedUsers = await generateMockUsers(numUsers);
    const usersDocs = generatedUsers.map(u => ({
      _id: u._id,
      firstName: u.firstName,
      lastName: u.lastName,
      email: u.email,
      password: u.password,
      role: u.role,
      pets: []
    }));

    let usersInserted = 0;
    if (usersDocs.length > 0) {
      try {
        const inserted = await UserModel.insertMany(usersDocs, { ordered: false });
        usersInserted = inserted.length;
      } catch (insertErr) {
        if (insertErr && insertErr.insertedDocs) {
          usersInserted = insertErr.insertedDocs.length;
        } else {
          console.warn("users insert warning:", insertErr.message || insertErr);
        }
      }
    }



    // pets
    const petsDocs = generateMockPets(numPets).map(p => ({
      _id: p._id,
      name: p.name,
      species: p.species,
      age: p.age,
      owner: null
    }));

    let petsInserted = 0;
    if (petsDocs.length > 0) {
      try {
        const inserted = await PetModel.insertMany(petsDocs, { ordered: false });
        petsInserted = inserted.length;
      } catch (insertErr) {
        if (insertErr && insertErr.insertedDocs) {
          petsInserted = insertErr.insertedDocs.length;
        } else {
          console.warn("pets insert warning:", insertErr.message || insertErr);
        }
      }
    }

    return res.json({
      ok: true,
      summary: {
        requested: { users: numUsers, pets: numPets },
        inserted: { users: usersInserted, pets: petsInserted }
      },
      note: "Verifica con GET /api/users y GET /api/pets"
    });
  } catch (err) {
    console.error("generateData error:", err);
    return res.status(500).json({ ok: false, error: "Server error generating data" });
  }
});

export default router;