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
  try {
    const { id } = req.params;

    const [rows] = await db.query(
      "SELECT * FROM questions WHERE id = ?",
      [id]
    );

    if (!rows || rows.length === 0) {
      return res.status(404).json({ message: "Question not found" });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error("getOneQuestion error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


export const deleteQuestion = async (req, res) => {
  await db.query(
    "DELETE FROM questions WHERE id=?",
    [req.params.id]
  );
  res.sendStatus(200);
};
