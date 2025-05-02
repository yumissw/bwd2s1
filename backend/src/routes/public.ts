import express from "express";
//import { apiKeyMiddleware } from "@apikey/apikey";

const router = express.Router();
import { getEvents } from "@controllers/eventController";
import {me} from "@controllers/authController"

// Публичный маршрут
router.get("/events", getEvents);
router.get("/me", me);
export default router;
