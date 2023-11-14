import { Request, Response, NextFunction } from "express";

export default function noGuests(
  req: Request,
  res: Response,
  next: NextFunction
): void | Response {
  if (req.guest) {
    return res.status(401).send("You must be logged in to do that");
  }

  next();
}
