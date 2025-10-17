import mongoose from "mongoose";
import supertest from "supertest";
import jwt from "jsonwebtoken";
import { expect } from "chai";

import app from "../app.js";
import Adoption from "../models/Adoption.js";
import UserModel from "../models/userModel.js";
import Pet from "../models/Pet.js";

const requester = supertest(app);

let token, userId, petId, adoptedPetId;

before(async () => {
  await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/back3_test");

  await Adoption.deleteMany({});
  await UserModel.deleteMany({});
  await Pet.deleteMany({});

  const user = await UserModel.create({
    firstName: "Test",
    lastName: "User",
    email: "test@example.com",
    password: "123456",
    role: "admin",
  });

  const pet = await Pet.create({ name: "Firulais", species: "Perro", age: 3 });
  const adoptedPet = await Pet.create({ name: "Adoptado", species: "Gato", age: 2, adopted: true });

  userId = user._id.toString();
  petId = pet._id.toString();
  adoptedPetId = adoptedPet._id.toString();

  token = jwt.sign({ id: userId, role: user.role }, process.env.JWT_SECRET || "secretkey", { expiresIn: "1h" });
});

after(async () => {
  await mongoose.connection.close();
});

describe("Módulo Adoption", () => {
  beforeEach(async () => {
    await Adoption.deleteMany({});
  });

  it("GET /api/adoptions sin token → 401", async () => {
    const res = await requester.get("/api/adoptions");
    expect(res.status).to.equal(401);
    expect(res.body).to.have.property("message", "Token requerido");
  });

  it("GET /api/adoptions con token válido → 200 y array vacío", async () => {
    const res = await requester
      .get("/api/adoptions")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("adoptions").that.is.an("array").that.is.empty;
  });

  it("POST /api/adoptions/:uid/:pid sin token → 401", async () => {
    const res = await requester.post(`/api/adoptions/${userId}/${petId}`);
    expect(res.status).to.equal(401);
    expect(res.body).to.have.property("message", "Token requerido");
  });

  it("POST /api/adoptions/:uid/:pid con usuario válido → 201", async () => {
    const res = await requester
      .post(`/api/adoptions/${userId}/${petId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).to.equal(201);
    expect(res.body).to.have.property("adoption");
  });

  it("POST /api/adoptions con mascota adoptada → 400", async () => {
    const res = await requester
      .post(`/api/adoptions/${userId}/${adoptedPetId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).to.equal(400);
  });
});
