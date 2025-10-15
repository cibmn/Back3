import mongoose from "mongoose";
import supertest from "supertest";
import jwt from "jsonwebtoken";
import { expect } from "chai";

import app from "../app.js";
import Adoption from "../models/Adoption.js";  
import User from "../models/UserModel.js";           
import Pet from "../models/Pet.js";           

const { expect } = chai;
const requester = supertest(app);

let token, userId, petId, adoptedPetId;

before(async () => {
  console.log("=== before start ===");
  await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/back3_test");
  console.log("=== DB connected ===");

  await Adoption.deleteMany({});
  await User.deleteMany({});
  await Pet.deleteMany({});
  console.log("=== Collections cleared ===");

  const user = await User.create({
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

  token = jwt.sign({ id: userId, role: "admin" }, process.env.JWT_SECRET || "secretkey", { expiresIn: "1h" });
});

after(async () => {
  await mongoose.connection.close();
});

describe("Módulo Adoption", () => {
  it("GET /api/adoptions debe devolver todas las adopciones", async () => {
    const res = await requester.get("/api/adoptions").set("Authorization", `Bearer ${token}`);
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("adoptions").that.is.an("array");
  });

  it("POST /api/adoptions/:uid/:pid crea adopción correctamente", async () => {
    const res = await requester.post(`/api/adoptions/${userId}/${petId}`).set("Authorization", `Bearer ${token}`);
    expect(res.status).to.equal(201);
    expect(res.body).to.have.property("adoption");
    expect(res.body.adoption.user.toString()).to.equal(userId);
    expect(res.body.adoption.pet.toString()).to.equal(petId);
  });

  it("POST /api/adoptions con mascota ya adoptada debe fallar", async () => {
    const res = await requester.post(`/api/adoptions/${userId}/${adoptedPetId}`).set("Authorization", `Bearer ${token}`);
    expect(res.status).to.equal(400);
    expect(res.body).to.have.property("message").that.includes("ya fue adoptada");
  });

  it("POST /api/adoptions sin token debe devolver 401", async () => {
    const res = await requester.post(`/api/adoptions/${userId}/${petId}`);
    expect(res.status).to.equal(401);
  });
});
