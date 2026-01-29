import express from "express";
import {
  createQuiz,
  getQuiz,
  genreIndexer,
  updateQuiz
} from "../controllers/quiz.js";

const router = express.Router();

router.post("/createQuiz", createQuiz);
router.get("/quizzes/:name", getQuiz);
router.get("/indexer/:genre", genreIndexer);
router.put("/update/:name", updateQuiz);

export default router;
