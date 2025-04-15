const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models/User");
const { RefreshToken } = require("../models/RefreshToken");
require("dotenv").config(); //  Добавьте это в начало файла
const crypto = require("crypto"); // Import crypto module

const router = express.Router();

router.post("/register", async (req, res) => {
  const { email, name, password } = req.body;
  console.log("req.body:", req.body);

  if (!email || !name || !password) {
    return res.status(400).json({ message: "Заполните все поля" });
  }

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email уже используется" });
    }
    const salt = await bcrypt.genSalt(10);
    // Хеширование пароля
    const hashedPassword = await bcrypt.hash(password, salt); // 10 - salt rounds

    const newUser = await User.create({
      email,
      name,
      password: hashedPassword,
    });

    res
      .status(201)
      .json({ message: "Пользователь успешно зарегистрирован", user: newUser });
  } catch (error) {
    console.error("Ошибка при регистрации:", error); // Логирование ошибки
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log("req.body:", req.body);

  if (!email || !password) {
    return res.status(400).json({ message: "Заполните все поля" });
  }

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ message: "Неверный email или пароль" });
    }

    // Сравниваем введенный пароль с хешем из базы данных
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Неверный пароль" });
    }

    // Создаем JWT токен
    const payload = { id: user.id, email: user.email, name: user.name }; // Данные для токена
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "15m", // Время жизни токена (например, 1 час)
    });

    const refreshToken = crypto.randomBytes(64).toString("hex"); // Генерируем случайный refresh token

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // Refresh Token действует 7 дней (пример)

    // 3. Сохраняем Refresh Token в базе данных
    await RefreshToken.create({
      token: refreshToken,
      expires_at: expiresAt,
      userId: user.id,
    });

    res.json({
      message: "Авторизация успешна",
      token: token,
      refreshToken: refreshToken,
    });
  } catch (error) {
    console.error("Ошибка при авторизации:", error); // Логирование ошибки
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

router.post("/refresh", async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ message: "Refresh Token не предоставлен" });
  }

  try {
    // 1. Ищем Refresh Token в базе данных
    const refreshTokenRecord = await RefreshToken.findOne({
      where: { token: refreshToken },
    });

    if (!refreshTokenRecord) {
      return res.status(401).json({ message: "Неверный Refresh Token" });
    }

    // 2. Проверяем, не истек ли срок действия Refresh Token
    if (refreshTokenRecord.expires_at < new Date()) {
      // Удаляем устаревший Refresh Token из базы данных
      await refreshTokenRecord.destroy();
      return res
        .status(401)
        .json({ message: "Срок действия Refresh Token истек" });
    }

    // 3. Получаем ID пользователя из Refresh Token
    const userId = refreshTokenRecord.userId;

    // 4. Находим пользователя в базе данных (Опционально, но рекомендуется)
    const user = await User.findOne({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    // 5. Создаем новый Access Token
    const payload = { id: user.id, email: user.email, name: user.name };
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "15m", // Новый Access Token действует 15 минут
    });

    // Отправляем новый Access Token клиенту
    res.json({ accessToken: accessToken });
  } catch (error) {
    console.error("Ошибка при обновлении токена:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

module.exports = router;
