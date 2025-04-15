const express = require("express");
const router = express.Router();
const { apiKeyMiddleware } = require("../apikey/apikey");
const {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
} = require("../controllers/eventController");

router.post("/events", apiKeyMiddleware, createEvent);
router.get("/events", apiKeyMiddleware, getEvents);
router.get("/events/:id", apiKeyMiddleware, getEventById);
router.put("/events/:id", apiKeyMiddleware, updateEvent);
router.delete("/events/:id", apiKeyMiddleware, deleteEvent);
module.exports = router;
