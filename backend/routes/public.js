const express = require("express");
const router = express.Router();
const { apiKeyMiddleware } = require("../apikey/apikey");
const { getEvents } = require("../controllers/eventController");

// Публичный маршрут
router.get("/events", apiKeyMiddleware, getEvents);

module.exports = router;
