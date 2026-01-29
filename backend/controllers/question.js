import db from "../config/db.js";


export const createQuestion = async (req, res) => {
  const q = req.body;

  // convert boolean → number
  const correctA = q.correcta ? 1 : 0;
  const correctB = q.correctb ? 1 : 0;
  const correctC = q.correctc ? 1 : 0;
  const correctD = q.correctd ? 1 : 0;

  const correctCount =
    correctA + correctB + correctC + correctD;

  // validations
  if (!q.question || correctCount === 0) {
    return res.status(400).json({ message: "Invalid question data" });
  }

  await db.query(
    `INSERT INTO questions
     (question, type, optionA, optionB, optionC, optionD,
      correctA, correctB, correctC, correctD, quizName)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      q.question,
      q.type,
      q.optionA,
      q.optionB,
      q.optionC,
      q.optionD,
      correctA,
      correctB,
      correctC,
      correctD,
      q.quizName   
    ]
  );

  res.status(201).json({ message: "Question added successfully" });
};

export const getQuestions = async (req, res) => {
  const [rows] = await db.query(
    "SELECT * FROM questions WHERE quizName=?",
    [req.params.name]
  );
  res.json(rows);
};

export const getOneQuestion = async (req, res) => {
  const [[row]] = await db.query(
    "SELECT * FROM questions WHERE id=?",
    [req.params.id]
  );
  if (!row) return res.sendStatus(404);
  res.json(row);
};

export const deleteQuestion = async (req, res) => {
  await db.query(
    "DELETE FROM questions WHERE id=?",
    [req.params.id]
  );
  res.sendStatus(200);
};
