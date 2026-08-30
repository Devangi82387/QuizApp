import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import "../css/CreateQuestion.css";

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
  <div className="create-question-page">

    <div className="create-question-container">

      {/* HEADER */}
      <div className="create-question-header">
        <h1>Create Question</h1>
        <p>Add questions to an existing quiz.</p>
      </div>

      {/* MESSAGE */}
      {message && (
        <div className="create-question-message">
          {message}
        </div>
      )}

      {/* QUIZ SELECTION */}
      <div className="quiz-check-card">

        <div className="cq-field">
          <label>Quiz Name</label>

          <div className="quiz-check-row">
            <input
              type="text"
              value={quizName}
              onChange={(e) => setQuizName(e.target.value)}
              placeholder="Enter quiz name"
            />

            <button
              type="button"
              className="check-quiz-btn"
              onClick={checkQuiz}
            >
              Check Quiz
            </button>
          </div>
        </div>

      </div>


      {/* QUESTION FORM */}
      <form
        className="create-question-form"
        onSubmit={handleSubmit}
      >

        <div className="form-section-header">
          <h2>Question Details</h2>
          <p>Configure the question and its answer options.</p>
        </div>


        {/* TYPE */}
        <div className="cq-field">
          <label>Question Type</label>

          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="1">Single Correct</option>
            <option value="2">Multiple Correct</option>
          </select>
        </div>


        {/* QUESTION */}
        <div className="cq-field">
          <label>Question</label>

          <input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Enter your question"
          />
        </div>


        {/* OPTIONS */}
        <div className="options-section">

          <h3>Answer Options</h3>

          <div className="cq-option-field">
            <span>A</span>

            <input
              value={optionA}
              onChange={(e) => setOptionA(e.target.value)}
              placeholder="Option A"
            />
          </div>

          <div className="cq-option-field">
            <span>B</span>

            <input
              value={optionB}
              onChange={(e) => setOptionB(e.target.value)}
              placeholder="Option B"
            />
          </div>

          <div className="cq-option-field">
            <span>C</span>

            <input
              value={optionC}
              onChange={(e) => setOptionC(e.target.value)}
              placeholder="Option C"
            />
          </div>

          <div className="cq-option-field">
            <span>D</span>

            <input
              value={optionD}
              onChange={(e) => setOptionD(e.target.value)}
              placeholder="Option D"
            />
          </div>

        </div>


        {/* CORRECT ANSWER */}
        <div className="correct-answer-section">

          <h3>Correct Answer</h3>

          <div className="correct-options">

            {[optionA, optionB, optionC, optionD].map(
              (opt, idx) => (
                <label
                  className={`correct-option ${
                    options[idx] ? "selected" : ""
                  }`}
                  key={idx}
                >

                  <input
                    type="checkbox"
                    checked={options[idx]}
                    onChange={() =>
                      handleCorrectChange(idx)
                    }
                  />

                  <span className="correct-letter">
                    {String.fromCharCode(65 + idx)}
                  </span>

                  <span>
                    {opt ||
                      `Option ${String.fromCharCode(
                        65 + idx
                      )}`}
                  </span>

                </label>
              )
            )}

          </div>

        </div>


        <button
          type="submit"
          className="add-question-btn"
        >
          Add Question
        </button>

      </form>


      {/* QUESTIONS LIST */}
      <div className="questions-list-card">

        <div className="questions-list-header">
          <div>
            <h2>Questions Till Now</h2>
            <p>Questions currently added to this quiz.</p>
          </div>

          <span className="question-count">
            {questionsTillNow.length}
          </span>
        </div>


        {questionsTillNow.length === 0 ? (

          <div className="empty-questions">
            No questions added yet
          </div>

        ) : (

          <div className="questions-list">

            {questionsTillNow.map((q, i) => (

              <div
                className="question-preview"
                key={i}
              >

                <div className="preview-question">
                  <span>Q{i + 1}</span>
                  <strong>{q.question}</strong>
                </div>

                <div className="preview-options">

                  <div>
                    <b>A</b>
                    {q.optionA}
                  </div>

                  <div>
                    <b>B</b>
                    {q.optionB}
                  </div>

                  <div>
                    <b>C</b>
                    {q.optionC}
                  </div>

                  <div>
                    <b>D</b>
                    {q.optionD}
                  </div>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>

  </div>
);
};

export default CreateQuestion;
