import { User } from "@prisma/client";
import jwt from "jsonwebtoken";

// Usually I keep the token between 5 minutes - 15 minutes
export function generateAccessToken(user: User) {
  return jwt.sign({ user }, process.env.JWT_ACCESS_SECRET as string, {
    expiresIn: "5m",
  });
}

// I choosed 8h because i prefer to make the user login again each day.
// But keep him logged in if he is using the app.
// You can change this value depending on your app logic.
// I would go for a maximum of 7 days, and make him login again after 7 days of inactivity.
export function generateRefreshToken(user: User, sessionId: string) {
  return jwt.sign(
    {
      userId: user.id,
      sessionId,
    },
    process.env.JWT_REFRESH_SECRET as string,
    {
      expiresIn: "8h",
    }
  );
}

export function generateTokens(user: User, sessionId: string) {
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user, sessionId);

  return {
    accessToken,
    refreshToken,
  };
}
