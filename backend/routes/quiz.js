import express from "express";
import {
  createQuiz,
  getQuiz,
  genreIndexer
} from "../controllers/quiz.js";

const router = express.Router();

router.post("/createQuiz", createQuiz);
router.get("/quizzes/:name", getQuiz);
router.get("/indexer/:genre", genreIndexer);

export default router;
