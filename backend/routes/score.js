import express from "express";
import { createScore } from "../controllers/score.js";

const router = express.Router();

router.post("/createScore", createScore);

export default router;
