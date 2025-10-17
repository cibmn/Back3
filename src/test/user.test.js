import mongoose from "mongoose";
import supertest from "supertest";
import jwt from "jsonwebtoken";
import { expect } from "chai";

import app from "../app.js";
import UserModel from "../models/userModel.js";

const requester = supertest(app);

let adminToken, userToken, adminId;

describe("Modulo Users", function () {
  this.timeout(5000);

  before(async () => {
    await mongoose.connect(
      process.env.MONGO_URI || "mongodb://127.0.0.1:27017/back3_test"
    );
    await UserModel.deleteMany({});

    const admin = await UserModel.create({
      firstName: "Admin",
      lastName: "Test",
      email: "admin@example.com",
      password: "123456",
      role: "admin",
    });

    const user = await UserModel.create({
      firstName: "User",
      lastName: "Test",
      email: "user@example.com",
      password: "123456",
      role: "user",
    });

    adminId = admin._id.toString();

    adminToken = jwt.sign(
      { id: adminId, role: "admin" },
      process.env.JWT_SECRET || "secretkey",
      { expiresIn: "1h" }
    );
    userToken = jwt.sign(
      { id: user._id, role: "user" },
      process.env.JWT_SECRET || "secretkey",
      { expiresIn: "1h" }
    );
  });

  after(async () => {
    await mongoose.connection.close();
  });

  it("POST /api/users/register crea un nuevo usuario → 201", async () => {
    const res = await requester.post("/api/users/register").send({
      firstName: "Nuevo",
      lastName: "Usuario",
      email: "nuevo@example.com",
      password: "123456",
    });
    expect(res.status).to.equal(201);
    expect(res.body).to.have.property("user");
  });

  it("POST /api/users/register con email duplicado → 400", async () => {
    const res = await requester.post("/api/users/register").send({
      firstName: "Repetido",
      lastName: "User",
      email: "user@example.com",
      password: "123456",
    });
    expect(res.status).to.equal(400);
  });

  it("GET /api/users con rol admin → 200", async () => {
    const res = await requester
      .get("/api/users")
      .set("Authorization", `Bearer ${adminToken}`);
    expect(res.status).to.equal(200);
  });

  it("GET /api/users con rol user → 403", async () => {
    const res = await requester
      .get("/api/users")
      .set("Authorization", `Bearer ${userToken}`);
    expect(res.status).to.equal(403);
  });
});
