import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || "secret_key";

export default function authenticate(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers["authorization"] as string | undefined;
  if (!authHeader) return res.status(401).json({ message: "Sem Autorização" });

  const parts = authHeader.split(" ");
  const token = parts.length === 2 ? parts[1] : parts[0];

  try {
    const decoded = jwt.verify(token!, JWT_SECRET);
    (req as any).user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
}
