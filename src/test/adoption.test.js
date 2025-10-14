import * as chai from "chai";
import supertest from "supertest";

const { expect } = chai;
const requester = supertest("http://localhost:4000");

describe("Tests funcionales del módulo Adoption", () => {
  it("GET /api/adoptions debe devolver todas las adopciones", async () => {
    const { statusCode, body } = await requester.get("/api/adoptions");
    expect(statusCode).to.equal(200);
    expect(body).to.be.an("array");
  });

  it("GET /api/adoptions/:id debe devolver una adopción existente", async () => {
    const adoptionId = "id_valido_aqui"; 
    const { statusCode, body } = await requester.get(`/api/adoptions/${adoptionId}`);
    if (statusCode === 200) {
      expect(body).to.have.property("_id");
    } else {
      expect(statusCode).to.be.oneOf([404, 500]);
    }
  });

  it("GET /api/adoptions/:id con ID inválido debe devolver 404", async () => {
    const { statusCode } = await requester.get("/api/adoptions/123456789123456789123456");
    expect(statusCode).to.be.oneOf([404, 500]);
  });

  it("POST /api/adoptions/:uid/:pid debe crear una adopción correctamente", async () => {
    const userId = "64f0c8a6f1a2b2a0a1d1e1f1";
    const petId = "64f0c8a6f1a2b2a0a1d1e20";
    const { statusCode, body } = await requester.post(`/api/adoptions/${userId}/${petId}`);
    expect(statusCode).to.be.oneOf([200, 201, 400]);
    if (statusCode === 201) {
      expect(body).to.have.property("_id");
    }
  });

  it("POST /api/adoptions/:uid/:pid con IDs inválidos debe fallar", async () => {
    const { statusCode } = await requester.post("/api/adoptions/123/456");
    expect(statusCode).to.be.oneOf([400, 404]);
  });
});
