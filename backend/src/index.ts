import express from "express";

import dotenv from "dotenv";
dotenv.config();

import cors from "cors";
import morgan from "morgan";

import publicRoutes from "./routes/public";
import authRoutes from "./routes/auth";
import privateRoutes from "./routes/private";

import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import swaggerConfig from "./config/swaggerConfig";
const swaggerDocs = swaggerJsDoc(swaggerConfig);

import passport from "./config/passport";
import { authenticateDB } from "./config/db";

import { syncModel as syncModelEvent } from "./models/Event";
import { syncModel as syncModelUser } from "./models/User";
import { syncModel as syncModelRefreshToken } from "./models/RefreshToken";
import { associationFunction } from "./models/associations";

// определение порта
const PORT = process.env.PORT || 3000; // получение из конфигурации или 3000
const app = express();

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use(morgan("dev")); 
app.use(express.json()); 
app.use(cors()); 
app.use(passport.initialize());

// Подключение маршрутов
app.use("/auth", authRoutes); // Подключаем роуты аутентификации
app.use("/public", publicRoutes);
app.use("/private", privateRoutes);

// для теста маршрут get
app.get("/", (req, res) => {
  res.json({ message: "для теста" });
});

// Запуск сервера
app.listen(PORT, async (err) => {
  if (err) {
    console.error(`Ошибка при запуске сервера: ${err.message}`);
    return;
  }
  console.log(`Сервер запущен на порту ${PORT}`);

  // Проверка соединения с базой данных
  await authenticateDB();
  //await associationFunction();
  // Синхронизация моделей
  await syncModelUser();
  await syncModelEvent();
  await syncModelRefreshToken();
  await associationFunction();
});
