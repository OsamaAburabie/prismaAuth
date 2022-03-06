import express from "express";
import { updateProfile } from "../controllers/user.controller";
import { auth } from "../middleware/auth";
// import { getPosts } from "../controllers/user.controller";

const router = express.Router();

// router.get("/posts", getPosts);
router.put("/profile", auth, updateProfile);

export default router;
