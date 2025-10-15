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
    // Aquí reemplazás con los IDs que imprime setupTestDB.js
    userId = "ID_USUARIO_IMPRESO";
    petId = "ID_MASCOTA_ADOPTABLE";
    adoptedPetId = "ID_MASCOTA_ADOPTADA";

    token = jwt.sign(
      { id: userId, role: "user" },
      process.env.JWT_SECRET || "secretkey",
      { expiresIn: "1h" }
    );
  });

  it("GET /api/adoptions debe devolver todas las adopciones", async () => {
    const { statusCode, body } = await requester.get("/api/adoptions");
    expect(statusCode).to.equal(200);
    expect(body).to.be.an("array");
  });

  it("POST /api/adoptions/:uid/:pid debe crear una adopción correctamente", async () => {
    const { statusCode, body } = await requester
      .post(`/api/adoptions/${userId}/${petId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(statusCode).to.be.oneOf([200, 201]);
    expect(body).to.have.property("_id");
    expect(body.owner).to.equal(userId);
    expect(body.pet).to.equal(petId);
  });

  it("POST /api/adoptions con mascota ya adoptada debe fallar", async () => {
    const { statusCode, body } = await requester
      .post(`/api/adoptions/${userId}/${adoptedPetId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(statusCode).to.equal(400);
    expect(body).to.have.property("error").that.includes("already adopted");
  });

  it("POST /api/adoptions sin token debe devolver 401", async () => {
    const { statusCode } = await requester.post(`/api/adoptions/${userId}/${petId}`);
    expect(statusCode).to.equal(401);
  });
});
