const { db } = require("../utils/db");
const { hashToken } = require("../utils/hashToken");

// used when we create a refresh token.
export async function addNewSession({
  sessionId,
  refreshToken,
  userId,
}: {
  sessionId: string;
  refreshToken: string;
  userId: string;
}) {
  return db.session.create({
    data: {
      id: sessionId,
      hashedToken: hashToken(refreshToken),
      userId,
    },
  });
}

// used to check if the token sent by the client is in the database.
export async function findSessionById(id: string) {
  return db.session.findUnique({
    where: {
      id,
    },
  });
}

// soft delete tokens after usage.
export async function revokeSingleSession(id: string) {
  return db.session.update({
    where: {
      id,
    },
    data: {
      revoked: true,
    },
  });
}

export async function revokeAllSessions(userId: string) {
  return db.session.updateMany({
    where: {
      userId,
    },
    data: {
      revoked: true,
    },
  });
}
