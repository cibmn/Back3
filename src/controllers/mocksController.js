import {
  generateMockUsers,
  insertMockUsers,
} from "../services/mockingService.js";
import { generateMockPets, insertMockPets } from "../services/petsService.js";
import UserDto from "../dtos/userDto.js";
import petDto from "../dtos/petDtos.js";

export async function getMockingUsers(req, res) {
  try {
    const users = await generateMockUsers(50);
    const payload = users.map((u) => new UserDto(u));
    res.json({ ok: true, payload });
  } catch (err) {
    res
      .status(500)
      .json({ ok: false, error: "Error generating mocking users" });
  }
}

export async function generateData(req, res) {
  try {
    let { users = 0, pets = 0 } = req.body;

    users = Number(users);
    pets = Number(pets);

    if (
      !Number.isInteger(users) ||
      users < 0 ||
      !Number.isInteger(pets) ||
      pets < 0
    ) {
      return res.status(400).json({
        ok: false,
        error: "'users' y 'pets' estan mal expresados",
      });
    }

    const generatedUsers = await generateMockUsers(users);
    await insertMockUsers(generatedUsers);
    const usersPayload = generatedUsers.map((u) => new UserDto(u));

    const generatedPets = generateMockPets(pets);
    await insertMockPets(generatedPets);
    const petsPayload = generatedPets.map((p) => new petDto(p));

    res.json({
      ok: true,
      summary: {
        requested: { users, pets },
        inserted: { users: usersPayload.length, pets: petsPayload.length },
      },
      preview: {
        users: usersPayload.slice(0, 3),
        pets: petsPayload.slice(0, 3),
      },
      note: "Verifica con GET /api/users y GET /api/pets",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: "Server error generating data" });
  }
}
