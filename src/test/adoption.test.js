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

describe("Módulo Adoption", () => {
  before(async () => {
    await Adoption.deleteMany({});
    await UserModel.deleteMany({});
    await Pet.deleteMany({});

    const user = await UserModel.create({ name: "Test User", email: "user@test.com", password: "123456", role: "user" });
    userId = user._id.toString();
    userToken = jwt.sign({ id: userId }, process.env.JWT_SECRET || "secretkey", { expiresIn: "1h" });

    const pet = await Pet.create({ name: "Fido", type: "dog", age: 2, adopted: false });
    petId = pet._id.toString();
  });

  it("GET /api/adoptions sin token → 401", async () => {
    const res = await request.get("/api/adoptions");
    expect(res.status).to.equal(401);
    expect(res.body).to.have.property("message", "Token requerido");
  });

  it("GET /api/adoptions con token válido → 200 y array vacío", async () => {
    const res = await request
      .get("/api/adoptions")
      .set("Authorization", `Bearer ${userToken}`);
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an("array").that.is.empty;
  });

  it("POST /api/adoptions/:uid/:pid sin token → 401", async () => {
    const res = await request.post(`/api/adoptions/${userId}/${petId}`);
    expect(res.status).to.equal(401);
    expect(res.body).to.have.property("message", "Token requerido");
  });

  it("POST /api/adoptions/:uid/:pid con usuario válido → 201", async () => {
    const res = await request
      .post(`/api/adoptions/${userId}/${petId}`)
      .set("Authorization", `Bearer ${userToken}`);
    expect(res.status).to.equal(201);
    expect(res.body).to.have.property("message", "Adopción creada");
  });

  it("POST /api/adoptions con mascota adoptada → 400", async () => {
    const res = await request
      .post(`/api/adoptions/${userId}/${petId}`)
      .set("Authorization", `Bearer ${userToken}`);
    expect(res.status).to.equal(400);
    expect(res.body).to.have.property("error", "Mascota ya adoptada");
  });

  after(async () => {
    await Adoption.deleteMany({});
    await UserModel.deleteMany({});
    await Pet.deleteMany({});
    mongoose.connection.close();
  });
});
