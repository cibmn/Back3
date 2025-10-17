import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Back3 API",
      version: "1.0.0",
      description:
        "Documentacion de la API para usuarios, mascotas y adopciones",
    },
    servers: [{ url: "http://localhost:4000" }],
  },
  apis: ["./src/docs/*.yaml"],
};

const swaggerSpec = swaggerJSDoc(options);

const setupSwagger = (app) => {
  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

export { swaggerSpec, setupSwagger };
