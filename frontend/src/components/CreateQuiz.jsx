import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

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
    <div id="main">
    
      <form onSubmit={handleSubmit}>
        <h3>Create Quiz</h3>

        <div>
          <label>Quiz Name:</label>
          <input
            type="text"
            value={quizName}
            onChange={(e) => setQuizName(e.target.value)}
          />
        </div>

        <div>
          <label>Genre:</label>
          <select value={genre} onChange={(e) => setGenre(e.target.value)}>
            <option value="Other">Other</option>
            <option value="Comics">Comics</option>
            <option value="History">History</option>
            <option value="Sports">Sports</option>
          </select>
        </div>

        <h4>Marking Scheme</h4>

        <div>
          <label>Marks for Correct Answer:</label>
          <select value={mfc} onChange={(e) => setMfc(e.target.value)}>
            <option value="1">+1</option>
            <option value="2">+2</option>
            <option value="3">+3</option>
            <option value="4">+4</option>
            <option value="5">+5</option>
          </select>
        </div>

        <div>
          <label>Marks for Incorrect Answer:</label>
          <select value={mfi} onChange={(e) => setMfi(e.target.value)}>
            <option value="0">0</option>
            <option value="1">-1</option>
            <option value="2">-2</option>
            <option value="3">-3</option>
            <option value="4">-4</option>
            <option value="5">-5</option>
          </select>
        </div>

        <div>
          <label>Marks for Unanswered:</label>
          <select value={mfu} onChange={(e) => setMfu(e.target.value)}>
            <option value="0">0</option>
            <option value="1">-1</option>
            <option value="2">-2</option>
            <option value="3">-3</option>
            <option value="4">-4</option>
            <option value="5">-5</option>
          </select>
        </div>

        <button type="submit">Add Quiz</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
};

export default CreateQuiz;
