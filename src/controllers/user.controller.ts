import { Request, Response } from "express";
import { db } from "../utils/db";

// export const getPosts = async (req: Request, res: Response) => {
//   const limit = 10;
//   const cursor = req.query.cursor;
//   const cursorObj = !cursor ? undefined : { id: cursor as string };

//   const posts = await db.post.findMany({
//     take: limit,
//     cursor: cursorObj,
//     skip: cursor === "" ? 0 : 1,
//   });

//   res.json({
//     posts,
//     nextId: posts.length === limit ? posts[posts.length - 1].id : undefined,
//   });
// };

export async function updateProfile(req: Request, res: Response) {
  const { firstName, lastName } = req.body;
  const user = await db.user.update({
    where: { id: res.locals.user.id },
    data: { firstName, lastName },
  });
  res.json(user);
}
