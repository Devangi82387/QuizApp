import db from "../config/db.js";


export const createQuestion = async (req, res) => {
  const q = req.body;
  const correct =
    q.correctA + q.correctB + q.correctC + q.correctD;

  if (!q.question || correct === 0) return res.sendStatus(404);

  await db.query(
    `INSERT INTO questions
     (question,type,optionA,optionB,optionC,optionD,
      correctA,correctB,correctC,correctD,quizName)
     VALUES (?,?,?,?,?,?,?,?,?,?,?)`,
    [
      q.question, q.type, q.optionA, q.optionB,
      q.optionC, q.optionD,
      q.correctA, q.correctB,
      q.correctC, q.correctD,
      q.quizName
    ]
  );
  res.json(q);
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
