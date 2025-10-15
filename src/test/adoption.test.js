import mongoose from "mongoose";
import supertest from "supertest";
import jwt from "jsonwebtoken";
import { expect } from "chai";

import app from "../app.js";
import Adoption from "../models/Adoption.js";
import UserModel from "../models/UserModel.js";
import Pet from "../models/Pet.js";

const requester = supertest(app);

let token, userId, petId, adoptedPetId;

before(async () => {
  // Conectar a la DB de test
  await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/back3_test");
  
  // Limpiar colecciones
  await Adoption.deleteMany({});
  await UserModel.deleteMany({});
  await Pet.deleteMany({});

  // Crear usuario y mascotas de prueba
  const user = await UserModel.create({
    firstName: "Test",
    lastName: "User",
    email: "test@example.com",
    password: "123456",
  });

  const pet = await Pet.create({ name: "Firulais", species: "Perro", age: 3 });
  const adoptedPet = await Pet.create({ name: "Adoptado", species: "Gato", age: 2, adopted: true });

  userId = user._id.toString();
  petId = pet._id.toString();
  adoptedPetId = adoptedPet._id.toString();

  token = jwt.sign(
    { id: userId, role: "admin" },
    process.env.JWT_SECRET || "secretkey",
    { expiresIn: "1h" }
  );
});

after(async () => {
  await mongoose.connection.close();
});

describe("Módulo Adoption", () => {
  it("GET /api/adoptions", async () => {
    const res = await requester.get("/api/adoptions").set("Authorization", `Bearer ${token}`);
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("adoptions").that.is.an("array");
  });

  it("POST /api/adoptions/:uid/:pid crea adopción", async () => {
    const res = await requester.post(`/api/adoptions/${userId}/${petId}`).set("Authorization", `Bearer ${token}`);
    expect(res.status).to.equal(201);
    expect(res.body).to.have.property("adoption");
  });

  it("POST /api/adoptions con mascota adoptada debe fallar", async () => {
    const res = await requester.post(`/api/adoptions/${userId}/${adoptedPetId}`).set("Authorization", `Bearer ${token}`);
    expect(res.status).to.equal(400);
  });

  it("POST /api/adoptions sin token debe devolver 401", async () => {
    const res = await requester.post(`/api/adoptions/${userId}/${petId}`);
    expect(res.status).to.equal(401);
  });
});
