import express from "express";
import { apiKeyMiddleware } from "../apikey/apikey";

const router = express.Router();
import { getEvents } from "../controllers/eventController";

// Публичный маршрут
router.get("/events", apiKeyMiddleware, getEvents);

export default router;
