module.exports = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Event and User API",
      version: "1.0.0",
      description: "API для управления событиями и пользователями",
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT}`,
        description: "Локальный сервер",
      },
    ],
    components: {
      securitySchemes: {
        ApiKeyAuth: {
          // Обратите внимание на имя (без 'key' в конце)
          type: "apiKey",
          in: "header",
          name: "x-api-key",
          description: "API ключ для аутентификации",
        },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              description: "ID пользователя",
              readOnly: "true",
            },
            name: {
              type: "string",
              description: "Имя пользователя",
            },
            email: {
              type: "string",
              description: "Email пользователя",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "Дата создания пользователя",
              readOnly: "true",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              description: "Дата последнего обновления пользователя",
              readOnly: "true",
            },
          },
        },
        Event: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              description: "ID события",
              readOnly: "true",
            },
            title: {
              type: "string",
              description: "Название события",
            },
            description: {
              type: "string",
              description: "Описание события",
            },
            date: {
              type: "string",
              format: "date-time",
              description: "Дата события",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "Дата создания события",
              readOnly: "true",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              description: "Дата последнего обновления события",
              readOnly: "true",
            },
            createdBy: {
              type: "integer",
              description: "id пользователя",
              readOnly: "true",
            },
          },
        },
      },
    },
    security: [
      {
        ApiKeyAuth: [],
      },
    ],
  },

  apis: ["./routes/*.js", "./swaggers/*.js"],
};
