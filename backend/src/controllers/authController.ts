import express, { NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "@models/User";
import RefreshToken from "@models/RefreshToken";
import crypto from "crypto";
import * as dotenv from "dotenv";
import { Request, Response } from "express";

const router = express.Router();
// проверка на наличие JWT_SECRET
if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET не найден");
}

const JWT_SECRET = process.env.JWT_SECRET;
dotenv.config();

const register = async (req: Request, res: Response): Promise<void> => {
  const {
    email,
    name,
    lastName,
    firstName,
    patronymic,
    gender,
    dateOfBirth,
    password,
  } = req.body;
  console.log("req.body:", req.body);

  if (!email || !name || !password || !lastName || !firstName || !patronymic || !gender || !dateOfBirth) {
    res.status(400).json({ message: "Заполните все поля" });
    return;
  }

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      res.status(400).json({ message: "Email уже используется" });
      return;
    }
    const salt = await bcrypt.genSalt(10);
    // Хеширование пароля
    const hashedPassword = await bcrypt.hash(password, salt); // 10 - salt rounds

    const newUser = await User.create({
      ...req.body,
      password: hashedPassword,
    });

    res
      .status(201)
      .json({ message: "Пользователь успешно зарегистрирован", user: newUser });
  } catch (error) {
    console.error("Ошибка при регистрации:", error); // Логирование ошибки
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  console.log("req.body:", req.body);

  if (!email || !password) {
    res.status(400).json({ message: "Заполните все поля" });
    return;
  }

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      res.status(401).json({ message: "Неверный email или пароль" });
      return;
    }

    // Сравниваем введенный пароль с хешем из базы данных
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      res.status(401).json({ message: "Неверный пароль" });
      return;
    }

    // Создаем JWT токен
    const payload = { id: user.id, email: user.email, name: user.name }; // Данные для токена
    const token = jwt.sign(payload, JWT_SECRET, {
      expiresIn: "3h", // Время жизни токена (например, 1 час)
    });

    const refreshToken = crypto.randomBytes(64).toString("hex"); // Генерируем случайный refresh token

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // Refresh Token действует 7 дней (пример)

    // 3. Сохраняем Refresh Token в базе данных
    await RefreshToken.create({
      token: refreshToken,
      expires_at: expiresAt,
      userId: user.id,
      ...req.body,
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
};

const refresh = async (req: Request, res: Response): Promise<void> => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    res.status(400).json({ message: "Refresh Token не предоставлен" });
    return;
  }

  try {
    const refreshTokenRecord = await RefreshToken.findOne({
      where: { token: refreshToken },
    });

    if (!refreshTokenRecord) {
      res.status(401).json({ message: "Неверный Refresh Token" });
      return;
    }

    if (refreshTokenRecord.expires_at < new Date()) {
      await refreshTokenRecord.destroy();
      res.status(401).json({ message: "Срок действия Refresh Token истек" });
      return;
    }

    const userId = refreshTokenRecord.userId;

    const user = await User.findOne({ where: { id: userId } });
    if (!user) {
      res.status(404).json({ message: "Пользователь не найден" });
      return;
    }

    const payload = { id: user.id, email: user.email, name: user.name };
    const accessToken = jwt.sign(payload, JWT_SECRET, {
      expiresIn: "15m", // Новый Access Token действует 15 минут
    });

    res.json({ accessToken: accessToken });
  } catch (error) {
    console.error("Ошибка при обновлении токена:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

const me = async (req: Request, res: Response): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      res.json({ message: "Вы вошли как гость" });
      return;
    }
    const token = authHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
        id: number;
      }; 
      const userId = decoded.id; 
      const user = await User.findByPk(userId);
      if (user) {
        res.json({ id: user.id, email: user.email, name: user.name, lastName: user.lastName, firstName:
          user.firstName, patronymic: 
          user.patronymic, gender: 
          user.gender, dateOfBirth: 
          user.dateOfBirth,});
        return;
      } else {
        res.status(404).json({ message: "Пользователь не найден" });
        return;
      }
    } catch (error: any) {
      console.error("Ошибка верификации токена:", error.message);
      if (error.name === "TokenExpiredError") {
        res.status(401).json({ message: "Токен истек" });
        return;
      } else if (error.name === "JsonWebTokenError") {
        res.status(401).json({ message: "Неверный токен" });
        return;
      }
      res.status(401).json({ message: "Ошибка авторизации" });
      return;
    }
  } catch (error) {
    console.error("Ошибка сервера:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

const logout = async (req: Request, res: Response): Promise<void> => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    res.status(400).json({ message: "Refresh token не предоставлен" });
    return;
  }

  try {
    const deletedToken = await RefreshToken.destroy({
      where: { token: refreshToken },
    });

    if (deletedToken === 0) {
      res.status(404).json({ message: "Refresh token не найден" });
      return;
    }

    res.json({ message: "Выход выполнен успешно" });
  } catch (error) {
    console.error("Ошибка при выходе из аккаунта:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

export { register, login, refresh, me, logout };
export default router;
