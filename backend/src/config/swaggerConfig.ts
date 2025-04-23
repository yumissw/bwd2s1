export default {
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
          type: "apiKey",
          in: "header",
          name: "x-api-key",
          description: "API ключ для аутентификации",
        },
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description:
            "Для авторизации используйте JWT токен в формате: Bearer <ваш_токен>",
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
            password: {
              type: "string",
              description: "Пароль пользователя",
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
        LoginRequest: {
          // <-- Новая схема для запроса на логин
          type: "object",
          properties: {
            email: {
              type: "string",
              description: "Email пользователя",
            },
            password: {
              type: "string",
              description: "Пароль пользователя",
            },
          },
          required: ["email", "password"], // Указываем, что эти поля обязательны
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
              //readOnly: "true",
            },
          },
        },
        RefreshTokenRequest: {
          type: "object",
          properties: {
            refreshToken: {
              type: "string",
              description: "Refresh Token для получения нового Access Token",
              example:
                "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTY3ODg4ODAwMH0.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
            },
          },
          required: ["refreshToken"],
        },
        ErrorResponse: {
          // Пример схемы для ошибок
          type: "object",
          properties: {
            error: {
              type: "string",
              description: "Сообщение об ошибке",
            },
          },
        },
      },
    },
    security: [
      {
        ApiKeyAuth: [],
        BearerAuth: [],
      },
    ],
  },

  apis: ["./src/routes/*.ts", "./src/swaggers/*.ts"],
};
