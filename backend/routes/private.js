const express = require("express");
const router = express.Router();
const passport = require("passport");
const { apiKeyMiddleware } = require("../apikey/apikey");
const {
  createEvent,
  getEventById,
  updateEvent,
  deleteEvent,
} = require("../controllers/eventController");
const {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require("../controllers/userController");

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

module.exports = router;
