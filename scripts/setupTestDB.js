import * as chai from "chai";
import supertest from "supertest";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import app from "../app.js";
import UserModel from "../models/userModel.js";
import PetModel from "../models/petModel.js";
import adoption from "../models/adoption.js";

const { expect } = chai;
const requester = supertest(app);

let token;
let userId;
let petId;
let adoptedPetId;

describe("Tests funcionales del módulo Adoption", () => {
  before(async () => {
    await adoption.deleteMany({});
    await PetModel.deleteMany({});
    await UserModel.deleteMany({});

    const user = await UserModel.create({
      firstName: "Test",
      lastName: "User",
      email: "testuser@example.com",
      password: "123456",
      role: "user",
    });

    const pet = await PetModel.create({
      name: "Fido",
      species: "Dog",
      age: 2,
      adopted: false,
      price: 100,
      category: "Dog",
    });

    const adoptedPet = await PetModel.create({
      name: "Max",
      species: "Dog",
      age: 3,
      adopted: true,
      price: 150,
      category: "Dog",
    });

    userId = user._id;
    petId = pet._id;
    adoptedPetId = adoptedPet._id;

    token = jwt.sign(
      { id: userId, role: "user" },
      process.env.JWT_SECRET || "secretkey",
      { expiresIn: "1h" }
    );
  });

  it("GET /api/adoptions debe devolver todas las adopciones", async () => {
    const res = await requester
      .get("/api/adoptions")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("ok", true);
    expect(res.body.payload).to.be.an("array");
  });

  it("POST /api/adoptions/:uid/:pid debe crear una adopción correctamente", async () => {
    const res = await requester
      .post(`/api/adoptions/${userId}/${petId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).to.be.oneOf([200, 201]);
    expect(res.body).to.have.property("ok", true);
    expect(res.body.payload.user).to.equal(String(userId));
    expect(res.body.payload.pet).to.equal(String(petId));
  });

  it("POST /api/adoptions con mascota ya adoptada debe fallar", async () => {
    const res = await requester
      .post(`/api/adoptions/${userId}/${adoptedPetId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).to.equal(400);
    expect(res.body).to.have.property("ok", false);
  });

  it("POST /api/adoptions sin token debe devolver 401", async () => {
    const res = await requester.post(`/api/adoptions/${userId}/${petId}`);
    expect(res.status).to.equal(401);
  });
});
