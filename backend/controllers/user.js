import db from "../config/db.js";

export const register = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.sendStatus(404);

  await db.query(
    "INSERT INTO users (username,password) VALUES (?,?)",
    [username, password]
  );
  res.json({ username, password });
};

export const login = async (req, res) => {
  const { username, password } = req.body;
  const [rows] = await db.query(
    "SELECT * FROM users WHERE username=?",
    [username]
  );

  if (!rows.length || rows[0].password !== password)
    return res.sendStatus(404);

  res.json(rows[0]);
};

export const getUser = async (req, res) => {
  const [[user]] = await db.query(
    "SELECT * FROM users WHERE username=?",
    [req.params.username]
  );
  if (!user) return res.sendStatus(404);
  res.json(user);
};

export const getUsers = async (req, res) => {
  const [users] = await db.query(
    "SELECT username FROM users ORDER BY username"
  );
  res.json(users);
};

export const deleteUser = async (req, res) => {
  await db.query("DELETE FROM users WHERE username=?", [
    req.params.username
  ]);
  res.sendStatus(200);
};

export const leaderboard = async (req, res) => {
  const [rows] = await db.query(
    "SELECT username,total FROM users ORDER BY total DESC"
  );
  res.json(rows);
};

export const reduceLifeline = async (req, res) => {
  await db.query(
    "UPDATE users SET lifelines=lifelines-1 WHERE username=?",
    [req.params.username]
  );
  const [[user]] = await db.query(
    "SELECT lifelines FROM users WHERE username=?",
    [req.params.username]
  );
  res.json(user);
};

export const getLifelines = async (req, res) => {
  const [[user]] = await db.query(
    "SELECT lifelines FROM users WHERE username=?",
    [req.params.username]
  );
  res.json(user);
};

export const userScores = async (req, res) => {
  const [scores] = await db.query(
    "SELECT * FROM scores WHERE user=? ORDER BY points DESC",
    [req.params.username]
  );
  res.json(scores);
};
