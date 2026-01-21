CREATE DATABASE IF NOT EXISTS quiz_app;
USE quiz_app;

CREATE TABLE users (
  username VARCHAR(100) PRIMARY KEY,
  password VARCHAR(255),
  total INT DEFAULT 0,
  lifelines INT DEFAULT 0
);

CREATE TABLE quizzes (
  name VARCHAR(100) PRIMARY KEY,
  genre VARCHAR(100),
  mfc VARCHAR(10),
  mfi VARCHAR(10),
  mfu VARCHAR(10)
);

CREATE TABLE questions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  question TEXT,
  type VARCHAR(50),
  optionA TEXT,
  optionB TEXT,
  optionC TEXT,
  optionD TEXT,
  correctA BOOLEAN,
  correctB BOOLEAN,
  correctC BOOLEAN,
  correctD BOOLEAN,
  quizName VARCHAR(100),
  FOREIGN KEY (quizName) REFERENCES quizzes(name) ON DELETE CASCADE
);

CREATE TABLE scores (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user VARCHAR(100),
  quiz VARCHAR(100),
  correct INT,
  incorrect INT,
  unanswered INT,
  points INT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user) REFERENCES users(username) ON DELETE CASCADE,
  FOREIGN KEY (quiz) REFERENCES quizzes(name) ON DELETE CASCADE
);


-- "/c/Program Files/MySQL/MySQL Server 8.0/bin/mysql.exe" -u root -p
-- Enter password: *********