import mongoose from "mongoose";
import supertest from "supertest";
import jwt from "jsonwebtoken";
import { expect } from "chai";

import app from "../app.js";
import Pet from "../models/Pet.js";
import UserModel from "../models/userModel.js";

const requester = supertest(app);

let adminToken, userToken, petId;

describe("Modulo Pets", function () {
  this.timeout(5000);

  before(async () => {
    await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/back3_test");
    await Pet.deleteMany({});
    await UserModel.deleteMany({});

    const admin = await UserModel.create({
      firstName: "Admin",
      lastName: "Pet",
      email: "adminpet@example.com",
      password: "123456",
      role: "admin",
    });

    const user = await UserModel.create({
      firstName: "User",
      lastName: "Pet",
      email: "userpet@example.com",
      password: "123456",
      role: "user",
    });

    adminToken = jwt.sign({ id: admin._id, role: "admin" }, process.env.JWT_SECRET || "secretkey", { expiresIn: "1h" });
    userToken = jwt.sign({ id: user._id, role: "user" }, process.env.JWT_SECRET || "secretkey", { expiresIn: "1h" });

    const pet = await Pet.create({ name: "Boby", species: "Perro", age: 2 });
    petId = pet._id.toString();
  });

  after(async () => {
    await mongoose.connection.close();
  });

  it("GET /api/pets → 200", async () => {
    const res = await requester
      .get("/api/pets")
      .set("Authorization", `Bearer ${userToken}`);
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("payload");
    expect(res.body.payload).to.be.an("array");
  });

  it("POST /api/pets con rol admin → 201", async () => {
    const res = await requester
      .post("/api/pets")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ name: "Luna", species: "Gato", age: 1 });
    expect(res.status).to.equal(201); // creación exitosa
  });

  it("POST /api/pets con rol user → 403", async () => {
    const res = await requester
      .post("/api/pets")
      .set("Authorization", `Bearer ${userToken}`)
      .send({ name: "Rocky", species: "Perro", age: 5 });
    expect(res.status).to.equal(403); // usuario sin rol suficiente
  });

  it("DELETE /api/pets/:id inexistente → 404", async () => {
    const res = await requester
      .delete("/api/pets/66a111111111111111111111")
      .set("Authorization", `Bearer ${adminToken}`);
    expect(res.status).to.equal(404); // pet inexistente
  });

  it("POST /api/pets sin token → 401", async () => {
    const res = await requester
      .post("/api/pets")
      .send({ name: "SinToken", species: "Perro", age: 3 });
    expect(res.status).to.equal(401); // token faltante
  });
});
