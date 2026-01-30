import express from "express";
import {
  register,
  login,
  getUser,
  getUsers,
  deleteUser,
  leaderboard,
  reduceLifeline,
  getLifelines,
  userScores
} from "../controllers/user.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/users/:username", getUser);
router.get("/indexUsers", getUsers);
router.delete("/delUser/:username", deleteUser);
router.get("/leaderboard", leaderboard);
router.get("/reduceLifeline/:username", reduceLifeline);
router.get("/getLifelines/:username", getLifelines);
router.get("/scores/:username", userScores);

export default router;
