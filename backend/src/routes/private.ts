import express from "express";
import passport from "passport";
import { apiKeyMiddleware } from "@apikey/apikey";

const router = express.Router();

import {
  createEvent,
  getEventById,
  updateEvent,
  deleteEvent,
} from "@controllers/eventController";

import {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "@controllers/userController";

// Middleware для защиты маршрутов
const authenticate = passport.authenticate("jwt", { session: false });

// Защищенные маршруты
router.post("/events", authenticate, apiKeyMiddleware, createEvent);
router.get("/events/:id", authenticate, apiKeyMiddleware, getEventById);
router.put("/events/:id", authenticate, apiKeyMiddleware, updateEvent);
router.delete("/events/:id", authenticate, apiKeyMiddleware, deleteEvent);

router.post("/users", authenticate, apiKeyMiddleware, createUser);
router.get("/users", authenticate, apiKeyMiddleware, getUsers);
router.get("/users/:id", authenticate, apiKeyMiddleware, getUserById);
router.put("/users/:id", authenticate, apiKeyMiddleware, updateUser);
router.delete("/users/:id", authenticate, apiKeyMiddleware, deleteUser);

//module.exports = router;
export default router;
