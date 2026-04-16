import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Mini API",
            version: "1.0.0",
        },
    },
    apis: ["./app/routers/*.ts"],
};

export const swaggerSpec = swaggerJsdoc(options);
