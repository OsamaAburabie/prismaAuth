import { NextFunction, Request, Response } from "express";

//create middleware to check jwt token
import jwt from "jsonwebtoken";

export const auth = (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  const token = authorization.split(" ")[1];

  //verify token
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_ACCESS_SECRET as string
    ) as any;
    res.locals.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ message: "Unauthorized" });
  }
};
