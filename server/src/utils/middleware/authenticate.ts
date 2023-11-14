import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWTPayload } from "../../types";

// Middleware function for JWT authentication
const authenticateJWT = (req: Request, _res: Response, next: NextFunction) => {
  const authHeader = req.header("Authorization");
  if (authHeader == undefined) {
    req.guest = true;
    return next();
  }
  const token = authHeader && authHeader.split(" ")[1];

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET as string, (err, decoded) => {
      if (!err) {
        req.user = decoded as JWTPayload;
        req.guest = false;
      } else {
        req.guest = true;
      }
    });
  } else {
    req.guest = true;
  }

  next();
};

export default authenticateJWT;
