import db from "../config/db.js";


export const createScore = async (req, res) => {
  const s = req.body;

  const [[user]] = await db.query(
    "SELECT * FROM users WHERE username=?",
    [s.user]
  );

  if (user) {
    let total = user.total + s.points;
    let lifelines = user.lifelines;

    const sum = s.correct + s.incorrect + s.unanswered;
    if (s.correct > 0.8 * sum) lifelines++;

    await db.query(
      "UPDATE users SET total=?, lifelines=? WHERE username=?",
      [total, lifelines, s.user]
    );
  }

  await db.query(
    `INSERT INTO scores
     (user,quiz,correct,incorrect,unanswered,points)
     VALUES (?,?,?,?,?,?)`,
    [
      s.user, s.quizPlayed,
      s.correct, s.incorrect,
      s.unanswered, s.points
    ]
  );

  res.json(s);
};
