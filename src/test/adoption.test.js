import mongoose from "mongoose";
import supertest from "supertest";
import jwt from "jsonwebtoken";
import { expect } from "chai";

import app from "../app.js";
import Adoption from "../models/Adoption.js";
import UserModel from "../models/userModel.js";
import Pet from "../models/Pet.js";

const request = supertest(app);

let userToken;
let userId;
let petId;
let adoptionId;


before(async () => {
  await UserModel.deleteMany({});
  await Pet.deleteMany({});
  await Adoption.deleteMany({});


  const user = await UserModel.create({ email: "test@test.com", password: "123456", role: "admin" });
  const pet = await Pet.create({ name: "Fido", type: "dog", age: 2 });

  global.testUserId = user._id.toString();
  global.testPetId = pet._id.toString();
});



describe("Módulo Adoption", () => {
  before(async () => {
    await Adoption.deleteMany({});
    await UserModel.deleteMany({});
    await Pet.deleteMany({});

    const user = await UserModel.create({
      firstName: "Test",
      lastName: "User",
      email: "user@test.com",
      password: "123456",
      role: "user"
    });
    userId = user._id.toString();
    userToken = jwt.sign({ id: userId, role: "user" }, process.env.JWT_SECRET || "secretkey", { expiresIn: "1h" });

    const pet = await Pet.create({ name: "Fido", species: "dog", age: 2, adopted: false });
    petId = pet._id.toString();
  });

  after(async () => {
    await Adoption.deleteMany({});
    await UserModel.deleteMany({});
    await Pet.deleteMany({});
    await mongoose.connection.close();
  });

  it("GET /api/adoptions sin token → 401", async () => {
    const res = await request.get("/api/adoptions");
    expect(res.status).to.equal(401);
    expect(res.body).to.have.property("ok", false);
    expect(res.body).to.have.property("error", "No token provided");
  });

  it("GET /api/adoptions con token válido → 200 y array vacío", async () => {
    const res = await request
      .get("/api/adoptions")
      .set("Authorization", `Bearer ${userToken}`);
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("ok", true);
    expect(res.body.payload).to.be.an("array").that.is.empty;
  });

  it("POST /api/adoptions/:uid/:pid sin token → 401", async () => {
    const res = await request.post(`/api/adoptions/${userId}/${petId}`);
    expect(res.status).to.equal(401);
    expect(res.body).to.have.property("ok", false);
    expect(res.body).to.have.property("error", "No token provided");
  });

  it("POST /api/adoptions/:uid/:pid con usuario válido → 201", async () => {
    const res = await request
      .post(`/api/adoptions/${userId}/${petId}`)
      .set("Authorization", `Bearer ${userToken}`);
    expect(res.status).to.equal(201);
    expect(res.body).to.have.property("ok", true);
    expect(res.body).to.have.property("message", "Adopción creada");
    expect(res.body).to.have.property("payload");
    adoptionId = res.body.payload._id;
  });

  it("POST /api/adoptions/:uid/:pid con mascota adoptada → 400", async () => {
    const res = await request
      .post(`/api/adoptions/${userId}/${petId}`)
      .set("Authorization", `Bearer ${userToken}`);
    expect(res.status).to.equal(400);
    expect(res.body).to.have.property("ok", false);
    expect(res.body).to.have.property("error", "Mascota ya adoptada");
  });

  it("POST /api/adoptions/:uid/:pid con usuario inexistente → 404", async () => {
    const res = await request
      .post(`/api/adoptions/000000000000000000000000/${petId}`)
      .set("Authorization", `Bearer ${userToken}`);
    expect(res.status).to.equal(404);
    expect(res.body).to.have.property("ok", false);
    expect(res.body).to.have.property("error").that.includes("User not found");
  });

  it("POST /api/adoptions/:uid/:pid con mascota inexistente → 404", async () => {
    const res = await request
      .post(`/api/adoptions/${userId}/000000000000000000000000`)
      .set("Authorization", `Bearer ${userToken}`);
    expect(res.status).to.equal(404);
    expect(res.body).to.have.property("ok", false);
    expect(res.body).to.have.property("error").that.includes("Pet not found");
  });

  it("DELETE /api/adoptions/:id sin token → 401", async () => {
    const res = await request.delete(`/api/adoptions/${adoptionId}`);
    expect(res.status).to.equal(401);
    expect(res.body).to.have.property("ok", false);
    expect(res.body).to.have.property("error", "No token provided");
  });

  it("DELETE /api/adoptions/:id válido → 200", async () => {
    const res = await request
      .delete(`/api/adoptions/${adoptionId}`)
      .set("Authorization", `Bearer ${userToken}`);
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("ok", true);
    expect(res.body).to.have.property("message", "Adopción eliminada");
  });

  it("DELETE /api/adoptions/:id inexistente → 404", async () => {
    const res = await request
      .delete(`/api/adoptions/000000000000000000000000`)
      .set("Authorization", `Bearer ${userToken}`);
    expect(res.status).to.equal(404);
    expect(res.body).to.have.property("ok", false);
    expect(res.body).to.have.property("error", "Adopción no encontrada");
  });
});
