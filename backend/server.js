import "dotenv/config";
import express from "express";
import cors from "cors";

import userRoutes from "./routes/user.js";
import quizRoutes from "./routes/quiz.js";
import questionRoutes from "./routes/question.js";
import scoreRoutes from "./routes/score.js";

const app = express();

app.use(cors());
app.use(express.json());

// Use the routes
app.use("/user", userRoutes);
app.use("/quiz", quizRoutes);
app.use("/question", questionRoutes);
app.use("/score", scoreRoutes);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
