import { Request, Response, NextFunction } from "express";

const apiKeyMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const apiKey = req.headers["x-api-key"]; 
  const expectedApiKey = process.env.API_KEY; 

  if (!apiKey) {
    res.status(401).json({ message: "API-ключ отсутствует" });
    return;
  }

  if (apiKey !== expectedApiKey) {
    res.status(403).json({ message: "Неверный API-ключ" });
    return;
  }

  next(); 
};

export { apiKeyMiddleware };
