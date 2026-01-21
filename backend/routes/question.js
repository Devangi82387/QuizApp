import express from "express";
import {
  createQuestion,
  getQuestions,
  getOneQuestion,
  deleteQuestion
} from "../controllers/question.js";

const router = express.Router();

router.post("/createQuestion", createQuestion);
router.get("/getQuestions/:name", getQuestions);
router.get("/getOneQuestion/:id", getOneQuestion);
router.delete("/delQuestion/:id", deleteQuestion);

export default router;
