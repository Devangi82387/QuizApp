import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const CreateQuestion = () => {
  const [quizName, setQuizName] = useState("");
  const [type, setType] = useState("1");
  const [question, setQuestion] = useState("");
  const [optionA, setOptionA] = useState("");
  const [optionB, setOptionB] = useState("");
  const [optionC, setOptionC] = useState("");
  const [optionD, setOptionD] = useState("");
  const [options, setOptions] = useState([false, false, false, false]);
  const [quizExists, setQuizExists] = useState(false);
  const [questionsTillNow, setQuestionsTillNow] = useState([]);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  /* ---------------- ADMIN CHECK ---------------- */
  useEffect(() => {
    const user = localStorage.getItem("username");

    if (!user) {
      setMessage("First Login Please");
      setTimeout(() => navigate("/login"), 1500);
      return;
    }

    if (user !== "admin") {
      setMessage("Access Denied (Admin only)");
    }
  }, [navigate]);

  /* ---------------- RESET FORM ---------------- */
  const resetForm = () => {
    setQuestion("");
    setOptionA("");
    setOptionB("");
    setOptionC("");
    setOptionD("");
    setOptions([false, false, false, false]);
  };

  /* ---------------- FETCH QUESTIONS ---------------- */
  const fetchQuestions = async (name) => {
    try {
      const res = await api.get(`/question/getQuestions/${name}`);
      setQuestionsTillNow(res.data || []);
    } catch {
      setQuestionsTillNow([]);
    }
  };

  /* ---------------- CHECK QUIZ ---------------- */
  const checkQuiz = async () => {
    if (!quizName.trim()) return;

    try {
      await api.get(`/quiz/quizzes/${quizName}`);
      setQuizExists(true);
      setMessage("Quiz exists");
      fetchQuestions(quizName);
    } catch {
      setQuizExists(false);
      setQuestionsTillNow([]);
      setMessage("Quiz does not exist");
    }
  };

  /* ---------------- CORRECT OPTION HANDLER ---------------- */
  const handleCorrectChange = (index) => {
    const updated = [...options];
    updated[index] = !updated[index];
    setOptions(updated);
  };

  /* ---------------- SUBMIT QUESTION ---------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const correctCount = options.filter(Boolean).length;

    if (type === "1" && correctCount > 1) {
      setMessage("Single correct type cannot have multiple correct answers");
      return;
    }

    if (!quizExists) {
      setMessage("Quiz does not exist");
      return;
    }

    const payload = {
      quizName,            
      question,
      type,
      optionA,
      optionB,
      optionC,
      optionD,
      correcta: options[0],
      correctb: options[1],
      correctc: options[2],
      correctd: options[3],
    };

    try {
      await api.post("/question/createQuestion", payload);
      setMessage("Question added successfully");
      fetchQuestions(quizName);
      resetForm();
    } catch {
      setMessage("Server error or empty fields");
    }
  };

  return (
    <div id="main" style={{ padding: "20px" }}>
      <h3>Create Question</h3>
      <p>{message}</p>

      {/* QUIZ INPUT */}
      <label>
        Quiz Name:
        <input
          type="text"
          value={quizName}
          onChange={(e) => setQuizName(e.target.value)}
        />
        <button type="button" onClick={checkQuiz}>
          Check Quiz
        </button>
      </label>

      <hr />

      {/* QUESTION FORM */}
      <form onSubmit={handleSubmit}>
        <label>
          Type:
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="1">Single Correct</option>
            <option value="2">Multiple Correct</option>
          </select>
        </label>

        <br />

        <label>
          Question:
          <input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
        </label>

        <br />

        <label>
          Option A:
          <input value={optionA} onChange={(e) => setOptionA(e.target.value)} />
        </label>

        <br />

        <label>
          Option B:
          <input value={optionB} onChange={(e) => setOptionB(e.target.value)} />
        </label>

        <br />

        <label>
          Option C:
          <input value={optionC} onChange={(e) => setOptionC(e.target.value)} />
        </label>

        <br />

        <label>
          Option D:
          <input value={optionD} onChange={(e) => setOptionD(e.target.value)} />
        </label>

        <br />

        <label>Correct Answer:</label>
        <br />
        {[optionA, optionB, optionC, optionD].map((opt, idx) => (
          <label key={idx}>
            <input
              type="checkbox"
              checked={options[idx]}
              onChange={() => handleCorrectChange(idx)}
            />{" "}
            {opt || `Option ${String.fromCharCode(65 + idx)}`}
          </label>
        ))}

        <br />
        <button type="submit">Add Question</button>
      </form>

      {/* QUESTIONS LIST */}
      <hr />
      <h4>Questions Till Now ({questionsTillNow.length})</h4>

      {questionsTillNow.length === 0 ? (
        <p>No questions added yet</p>
      ) : (
        <ul>
          {questionsTillNow.map((q, i) => (
            <li key={i}>
              <strong>Q{i + 1}.</strong> {q.question}
              <ul>
                <li>A. {q.optionA}</li>
                <li>B. {q.optionB}</li>
                <li>C. {q.optionC}</li>
                <li>D. {q.optionD}</li>
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CreateQuestion;
