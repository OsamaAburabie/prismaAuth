import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { nanoid } from "nanoid";
import {
  CreateSessionInput,
  CreateUserInput,
  RefreshTokenInput,
} from "../schema/auth.schema";
import {
  addNewSession,
  findSessionById,
  revokeAllSessions,
} from "../services/auth.service";
import {
  createUserByEmailAndPassword,
  findUserByEmail,
  findUserById,
} from "../services/user.service";
import { generateAccessToken, generateTokens } from "../utils/jwt";
import argon2 from "argon2";
import log from "../utils/logger";
import { hashToken } from "../utils/hashToken";
import { User } from "@prisma/client";
export const register = async (
  req: Request<{}, {}, CreateUserInput>,
  res: Response
) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const existingUser = await findUserByEmail(email);

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const user = await createUserByEmailAndPassword({
      firstName,
      lastName,
      email,
      password,
    } as User);

    const sessionId = nanoid();
    const { accessToken, refreshToken } = generateTokens(user, sessionId);
    await addNewSession({
      sessionId,
      refreshToken,
      userId: user.id,
    });

    return res.json({
      accessToken,
      refreshToken,
    });
  } catch (err) {
    log.info(err);
    res.sendStatus(500);
  }
};

export const login = async (
  req: Request<{}, {}, CreateSessionInput>,
  res: Response
) => {
  try {
    const { email, password } = req.body;
    const existingUser = await findUserByEmail(email);
    if (!existingUser) {
      return res.status(403).json({
        message: "Invalid email or password",
      });
    }

    const validPassword = await argon2.verify(existingUser.password, password);
    if (!validPassword) {
      return res.status(403).json({
        message: "Invalid email or password",
      });
    }
    const sessionId = nanoid();
    const { accessToken, refreshToken } = generateTokens(
      existingUser,
      sessionId
    );
    await addNewSession({
      sessionId,
      refreshToken,
      userId: existingUser.id,
    });

    return res.json({
      accessToken,
      refreshToken,
    });
  } catch (err) {
    log.info(err);
    res.sendStatus(500);
  }
};

export const refreshToken = async (
  req: Request<{}, {}, RefreshTokenInput>,
  res: Response
) => {
  try {
    const { refreshToken } = req.body;

    const payload = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET as string
    ) as any;
    if (!payload) return res.sendStatus(401).json({ message: "Unauthorized" });

    const currentSession = await findSessionById(payload.sessionId);

    if (!currentSession || currentSession.revoked === true) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const hashedToken = hashToken(refreshToken);
    if (hashedToken !== currentSession.hashedToken) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const user = await findUserById(payload.userId);
    if (!user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const accessToken = generateAccessToken(user);

    return res.json({
      accessToken,
    });
  } catch (err) {
    log.info(err);
    res.status(401).json({
      message: "Unauthorized",
    });
  }
};

export const revokeAll = async (_req: Request, res: Response) => {
  try {
    await revokeAllSessions(res.locals.user.id);
    return res.json({ message: `Sessions Revoked` });
  } catch (err) {
    log.info(err);
    res.sendStatus(500);
  }
};
