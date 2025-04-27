import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
export const handleInputErrors = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Aquí no hacemos `return res.json(...)`
    res.status(400).json({ errors: errors.array() });
    return; // <-- solo salimos, devolviendo `undefined`
  }

  next(); // Si no hay errores, seguimos al siguiente handler
};
