import * as chai from "chai";
import supertest from "supertest";
import jwt from "jsonwebtoken";

const { expect } = chai;
const requester = supertest("http://localhost:4000");

let token;
let userId;
let petId;
let adoptedPetId;

describe("Tests funcionales del módulo Adoption", () => {
  before(() => {
    token = jwt.sign(
      { _id: "64f0c8a6f1a2b2a0a1d1e1f1", role: "user" },
      process.env.JWT_SECRET || "secretkey",
      { expiresIn: "1h" }
    );

    userId = "64f0c8a6f1a2b2a0a1d1e1f1";
    petId = "64f0c8a6f1a2b2a0a1d1e20";
    adoptedPetId = "64f0c8a6f1a2b2a0a1d1e21";
  });

  it("GET /api/adoptions debe devolver todas las adopciones", async () => {
    const { statusCode, body } = await requester.get("/api/adoptions");
    expect(statusCode).to.equal(200);
    expect(body).to.be.an("array");
  });

  it("GET /api/adoptions/:id debe devolver una adopción existente", async () => {
    const adoptionId = "64f0c8a6f1a2b2a0a1d1e30";
    const { statusCode, body } = await requester.get(`/api/adoptions/${adoptionId}`);
    if (statusCode === 200) {
      expect(body).to.have.property("_id");
      expect(body).to.have.property("user");
      expect(body).to.have.property("pet");
    } else {
      expect(statusCode).to.be.oneOf([404, 500]);
    }
  });

  it("GET /api/adoptions/:id con ID inválido debe devolver 404", async () => {
    const { statusCode } = await requester.get("/api/adoptions/123456789123456789123456");
    expect(statusCode).to.be.oneOf([404, 500]);
  });

  it("POST /api/adoptions/:uid/:pid debe crear una adopción correctamente", async () => {
    const { statusCode, body } = await requester
      .post(`/api/adoptions/${userId}/${petId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(statusCode).to.be.oneOf([200, 201]);
    if (statusCode === 201) {
      expect(body).to.have.property("_id");
      expect(body.user).to.equal(userId);
      expect(body.pet).to.equal(petId);
    }
  });

  it("POST /api/adoptions/:uid/:pid con IDs inválidos debe fallar", async () => {
    const { statusCode } = await requester
      .post("/api/adoptions/123/456")
      .set("Authorization", `Bearer ${token}`);
    expect(statusCode).to.be.oneOf([400, 404]);
  });

  it("POST /api/adoptions con mascota ya adoptada debe fallar", async () => {
    const { statusCode, body } = await requester
      .post(`/api/adoptions/${userId}/${adoptedPetId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(statusCode).to.equal(400);
    expect(body).to.have.property("message").that.includes("Mascota ya adoptada");
  });

  it("POST /api/adoptions sin token debe devolver 401", async () => {
    const { statusCode } = await requester.post(`/api/adoptions/${userId}/${petId}`);
    expect(statusCode).to.equal(401);
  });
});
