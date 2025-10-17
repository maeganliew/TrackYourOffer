import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Track Your Offer API',
      version: '1.0.0',
      description: 'Interactive API documentation for your job tracking app',
    },
    servers: [
      {
        url: 'http://localhost:3000', // dev backend
        description: 'Local dev backend',
      },
      {
        url: 'https://apptracker-production.up.railway.app', // deployed backend
        description: 'Deployed backend',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.ts', './src/models/*.ts'],
};

const specs = swaggerJsdoc(options);

// mount Swagger on Express app
export const setupSwagger = (app: Express) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
  console.log('Swagger docs available at /api-docs');
};
