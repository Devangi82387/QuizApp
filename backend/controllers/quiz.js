import db from "../config/db.js";


export const createQuiz = async (req, res) => {
  const q = req.body;
  if (!q.name || !q.genre) return res.sendStatus(404);

  await db.query(
    "INSERT INTO quizzes (name,genre,mfc,mfi,mfu) VALUES (?,?,?,?,?)",
    [q.name, q.genre, q.mfc, q.mfi, q.mfu]
  );
  res.json(q);
};

export const getQuiz = async (req, res) => {
  const [[quiz]] = await db.query(
    "SELECT * FROM quizzes WHERE name=?",
    [req.params.name]
  );
  if (!quiz) return res.sendStatus(404);
  res.json(quiz);
};

export const genreIndexer = async (req, res) => {
  let rows;
  if (req.params.genre === "All") {
    [rows] = await db.query("SELECT * FROM quizzes");
  } else {
    [rows] = await db.query(
      "SELECT * FROM quizzes WHERE genre=?",
      [req.params.genre]
    );
  }
  res.json(rows);
};
