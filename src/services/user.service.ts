import { User } from "@prisma/client";
import { db } from "../utils/db";

import argon2 from "argon2";

export async function findUserByEmail(email: string) {
  return db.user.findUnique({
    where: {
      email,
    },
  });
}

export async function createUserByEmailAndPassword(user: User) {
  user.password = await argon2.hash(user.password);
  return db.user.create({
    data: user,
  });
}

export async function findUserById(id: string) {
  return db.user.findUnique({
    where: {
      id,
    },
  });
}
