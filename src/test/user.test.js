import supertest from "supertest";
import { expect } from "chai";
import app from "../app.js";
import UserModel from "../models/userModel.js";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

const requester = supertest(app);
let adminToken, userId;

describe("Modulo Users", function () {
  before(async () => {
    await mongoose.connect(process.env.MONGO_URI_TEST);
    await UserModel.deleteMany({});

    const admin = await UserModel.create({
      firstName: "Admin",
      lastName: "User",
      email: "admin@example.com",
      password: "123456",
      role: "admin",
    });

    adminToken = jwt.sign({ id: admin._id, role: "admin" }, process.env.JWT_SECRET || "secretkey", { expiresIn: "1h" });
  });

  it("GET /api/users → 200", async () => {
    const res = await requester.get("/api/users").set("Authorization", `Bearer ${adminToken}`);
    expect(res.status).to.equal(200);
    expect(res.body.payload).to.be.an("array");
  });

  it("POST /api/users → 201", async () => {
    const res = await requester
      .post("/api/users")
.set("Authorization", `Bearer ${adminToken}`)
      .send({ firstName: "Test", lastName: "User", email: "test@example.com", password: "123456", role: "user" });
    expect(res.status).to.equal(201);
    expect(res.body.payload).to.have.property("email", "test@example.com");
    userId = res.body.payload._id;
  });

  it("DELETE /api/users/:id → 200", async () => {
    const res = await requester
      .delete(`/api/users/${userId}`)
      .set("Authorization", `Bearer ${adminToken}`);
    expect(res.status).to.equal(200);
  });

  after(async () => {
    await mongoose.connection.close();
  });
});
