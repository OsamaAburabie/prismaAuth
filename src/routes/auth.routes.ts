import express from "express";
import {
  login,
  refreshToken,
  register,
  revokeAll,
} from "../controllers/auth.controller";
import { auth } from "../middleware/auth";
import validateResource from "../middleware/validateResource";
import {
  createSessionSchema,
  createUserSchema,
  refreshTokenSchema,
} from "../schema/auth.schema";

const router = express.Router();

router.post("/register", validateResource(createUserSchema), register);
router.post("/login", validateResource(createSessionSchema), login);
router.post("/refresh", validateResource(refreshTokenSchema), refreshToken);
router.post("/revokeAll", auth, revokeAll);

export default router;
