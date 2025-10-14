import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const swaggerOptions = {
  definition: {
    openapi: "3.0.1",
    info: {
      title: "Back3 - Documentación API",
      version: "1.0.0",
      description: "Documentación del módulo Users del proyecto Back3",
    },
  },
  apis: ["./src/docs/**/*.yaml"], 
};

const swaggerSpecs = swaggerJSDoc(swaggerOptions);

export { swaggerUi, swaggerSpecs };
