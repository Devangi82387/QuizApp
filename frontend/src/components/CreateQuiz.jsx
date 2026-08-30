import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import "../css/CreateQuiz.css";

const CreateQuiz = () => {
  const navigate = useNavigate();

  const [quizName, setQuizName] = useState("");
  const [genre, setGenre] = useState("Other");
  const [mfc, setMfc] = useState("1");
  const [mfi, setMfi] = useState("0");
  const [mfu, setMfu] = useState("0");
  const [message, setMessage] = useState("");

  // auth + admin check
  useEffect(() => {
    const username = localStorage.getItem("username");

    if (!username) {
      setMessage("First Login Please");
      setTimeout(() => navigate("/login"), 1500);
    } else if (username !== "admin") {
      setMessage("Access Denied (Not admin)");
    }
  }, [navigate]);

  // submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!quizName.trim()) {
      setMessage("Quiz name cannot be empty");
      return;
    }

    try {
      // check if quiz exists
      await api.get(`/quiz/quizzes/${quizName}`);
      setMessage("Quiz name already taken");
    } catch (err) {
      // 404 → safe to create
      if (err.response?.status === 404) {
        try {
          await api.post("/quiz/createQuiz", {
            name: quizName,
            genre,
            mfc,
            mfi,
            mfu,
          });
          setMessage("New Quiz Added");
        } catch {
          setMessage("Failed to create quiz");
        }
      } else {
        setMessage("Server error");
      }
    }
  };

  return (
  <div className="create-quiz-page">

    <form className="create-quiz-form" onSubmit={handleSubmit}>

      <div className="create-quiz-header">
        <h1>Create Quiz</h1>
        <p>Create a new quiz and configure its scoring system.</p>
      </div>

      <div className="create-quiz-field">
        <label>Quiz Name</label>
        <input
          type="text"
          value={quizName}
          onChange={(e) => setQuizName(e.target.value)}
          placeholder="Enter quiz name"
        />
      </div>

      <div className="create-quiz-field">
        <label>Genre</label>
        <select
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
        >
          <option value="Other">Other</option>
          <option value="Comics">Comics</option>
          <option value="History">History</option>
          <option value="Sports">Sports</option>
        </select>
      </div>

      <div className="marking-section">

        <h2>Marking Scheme</h2>

        <div className="create-quiz-field">
          <label>Marks for Correct Answer</label>
          <select
            value={mfc}
            onChange={(e) => setMfc(e.target.value)}
          >
            <option value="1">+1</option>
            <option value="2">+2</option>
            <option value="3">+3</option>
            <option value="4">+4</option>
            <option value="5">+5</option>
          </select>
        </div>

        <div className="create-quiz-field">
          <label>Marks for Incorrect Answer</label>
          <select
            value={mfi}
            onChange={(e) => setMfi(e.target.value)}
          >
            <option value="0">0</option>
            <option value="1">-1</option>
            <option value="2">-2</option>
            <option value="3">-3</option>
            <option value="4">-4</option>
            <option value="5">-5</option>
          </select>
        </div>

        <div className="create-quiz-field">
          <label>Marks for Unanswered</label>
          <select
            value={mfu}
            onChange={(e) => setMfu(e.target.value)}
          >
            <option value="0">0</option>
            <option value="1">-1</option>
            <option value="2">-2</option>
            <option value="3">-3</option>
            <option value="4">-4</option>
            <option value="5">-5</option>
          </select>
        </div>

      </div>

      <button
        type="submit"
        className="create-quiz-submit"
      >
        Add Quiz
      </button>

    </form>

    {message && (
      <p className="create-quiz-message">
        {message}
      </p>
    )}

  </div>
);
};

export default CreateQuiz;
