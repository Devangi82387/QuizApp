import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import "../css/AttemptQuiz.css";

const AttemptQuiz = () => {
  const { name } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState({});
  const [user, setUser] = useState("");
  const [started, setStarted] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [lifelinesLeft, setLifelinesLeft] = useState(0);
  const [lifelineQ, setLifelineQ] = useState(1);
  const [result, setResult] = useState(null);

  // ================= LOAD QUIZ =================

  useEffect(() => {
    const u = localStorage.getItem("username");

    if (!u) {
      navigate("/login");
      return;
    }

    setUser(u);

    const loadData = async () => {
      try {
        const quizRes = await api.get(`/quiz/quizzes/${name}`);

        console.log("Quiz data:", quizRes.data);

        setQuiz(quizRes.data);

        const lifeRes = await api.get(`/user/getLifelines/${u}`);

        setLifelinesLeft(Number(lifeRes.data.lifelines) || 0);
      } catch (error) {
        console.error("Error loading quiz:", error);
        navigate("/createQuiz");
      }
    };

    loadData();
  }, [name, navigate]);

  // ================= START QUIZ =================

  const startQuiz = async (e) => {
    e.preventDefault();

    try {
      const res = await api.get(
        `/question/getQuestions/${quiz.name}`
      );

      console.log("Questions:", res.data);

      setQuestions(res.data);

      // Initially no answers selected
      setAnswers(
        res.data.map(() => [
          false,
          false,
          false,
          false,
        ])
      );

      setStarted(true);
    } catch (error) {
      console.error("Error loading questions:", error);
      alert("Unable to load questions.");
    }
  };

  // ================= SELECT ANSWER =================

  const updateSelection = (
    qIndex,
    optIndex,
    type,
    checked
  ) => {
    setAnswers((prev) => {
      const copy = [...prev];

      if (Number(type) === 1) {
        // Single correct answer
        copy[qIndex] = [
          false,
          false,
          false,
          false,
        ];

        copy[qIndex][optIndex] = true;
      } else {
        // Multiple correct answers
        copy[qIndex][optIndex] = checked;
      }

      return copy;
    });
  };

  // ================= SUBMIT QUIZ =================

  const submitQuiz = async (e) => {
    e.preventDefault();

    let correct = 0;
    let incorrect = 0;
    let unanswered = 0;
    let score = 0;

    // Convert quiz marks to numbers
    const correctMarks = Number(quiz.mfc) || 0;
    const incorrectMarks = Number(quiz.mfi) || 0;
    const unansweredMarks = Number(quiz.mfu) || 0;

    console.log("Marks:", {
      correctMarks,
      incorrectMarks,
      unansweredMarks,
    });

    answers.forEach((ans, i) => {
      const q = questions[i];

      // ================= UNANSWERED =================

      const isUnanswered = ans.every(
        (value) => value === false
      );

      if (isUnanswered) {
        unanswered++;

        score -= unansweredMarks;

        return;
      }

      // ================= CORRECT ANSWER =================

      // IMPORTANT:
      // Database columns are correctA, correctB,
      // correctC and correctD

      const correctAns = [
        Boolean(Number(q.correctA)),
        Boolean(Number(q.correctB)),
        Boolean(Number(q.correctC)),
        Boolean(Number(q.correctD)),
      ];

      console.log(`Question ${i + 1}`);
      console.log("User:", ans);
      console.log("Correct:", correctAns);

      // Compare all four options
      const isCorrect = ans.every(
        (value, index) =>
          value === correctAns[index]
      );

      if (isCorrect) {
        correct++;

        score += correctMarks;
      } else {
        incorrect++;

        score -= incorrectMarks;
      }
    });

    console.log("FINAL SCORE:", {
      correct,
      incorrect,
      unanswered,
      score,
    });

    // ================= SET RESULT =================

    setResult({
      correct,
      incorrect,
      unanswered,
      score,
    });

    // ================= SAVE SCORE =================

    try {
      await api.post("/score/createScore", {
        quizPlayed: quiz.name,
        user,
        correct,
        incorrect,
        unanswered,
        points: score,
      });

      console.log("Score saved successfully");
    } catch (error) {
      console.error(
        "Error saving score:",
        error
      );
    }
  };

  // ================= SHOW ANSWER LIFELINE =================

  const showAnswer = async () => {
    if (lifelinesLeft < 1) {
      alert("No lifelines remaining.");
      return;
    }

    if (!questions.length) {
      return;
    }

    const q = lifelineQ - 1;

    const question = questions[q];

    if (!question) {
      return;
    }

    let ans = "";

    if (Boolean(Number(question.correctA))) {
      ans += "A ";
    }

    if (Boolean(Number(question.correctB))) {
      ans += "B ";
    }

    if (Boolean(Number(question.correctC))) {
      ans += "C ";
    }

    if (Boolean(Number(question.correctD))) {
      ans += "D ";
    }

    alert(`Correct option(s): ${ans}`);

    try {
      await api.get(
        `/user/reduceLifeline/${user}`
      );

      setLifelinesLeft(
        (previous) => previous - 1
      );
    } catch (error) {
      console.error(
        "Error reducing lifeline:",
        error
      );
    }
  };

  // ================= UI =================

  return (
    <div className="attempt-quiz-page">
      <div className="attempt-quiz-container">

        {!started ? (

          /* ================= START SCREEN ================= */

          <div className="quiz-start-card">

            <div className="quiz-start-icon">
              ?
            </div>

            <h1>
              Welcome to{" "}
              <span>{quiz.name}</span>
            </h1>

            <p>
              Test your knowledge and see how well
              you can score.
            </p>

            {/* Show marks before starting */}

            <div className="quiz-rules">

              <div>
                <strong>
                  +{Number(quiz.mfc) || 0}
                </strong>
                <span>Correct</span>
              </div>

              <div>
                <strong>
                  -{Number(quiz.mfi) || 0}
                </strong>
                <span>Incorrect</span>
              </div>

              <div>
                <strong>
                  -{Number(quiz.mfu) || 0}
                </strong>
                <span>Unanswered</span>
              </div>

            </div>

            <form onSubmit={startQuiz}>
              <button
                type="submit"
                className="start-quiz-btn"
              >
                Start Playing
                <span>→</span>
              </button>
            </form>

          </div>

        ) : (

          /* ================= QUIZ ================= */

          <div className="quiz-playing">

            {/* HEADER */}

            <div className="quiz-header">

              <div>
                <p className="quiz-label">
                  NOW PLAYING
                </p>

                <h1>{quiz.name}</h1>
              </div>

              <div className="lifeline-box">

                <div className="lifeline-count">
                  <span>♥</span>
                  {lifelinesLeft}
                </div>

                <select
                  value={lifelineQ}
                  onChange={(e) =>
                    setLifelineQ(
                      Number(e.target.value)
                    )
                  }
                >

                  {questions.map((_, i) => (
                    <option
                      key={i}
                      value={i + 1}
                    >
                      Q{i + 1}
                    </option>
                  ))}

                </select>

                <button
                  type="button"
                  className="lifeline-btn"
                  onClick={showAnswer}
                  disabled={lifelinesLeft < 1}
                >
                  Show Answer
                </button>

              </div>

            </div>

            {/* QUESTIONS */}

            <form
              className="quiz-form"
              onSubmit={submitQuiz}
            >

              {questions.map((q, i) => (

                <div
                  className="question-card"
                  key={q.id || i}
                >

                  <div className="question-number">
                    Question {i + 1}
                  </div>

                  <h2>
                    {q.question}
                  </h2>

                  <div className="options-container">

                    {[
                      q.optionA,
                      q.optionB,
                      q.optionC,
                      q.optionD,
                    ].map((opt, j) => (

                      <label
                        className="option"
                        key={j}
                      >

                        <input
                          type={
                            Number(q.type) === 1
                              ? "radio"
                              : "checkbox"
                          }
                          name={`q-${i}`}
                          checked={
                            answers[i]
                              ? answers[i][j]
                              : false
                          }
                          onChange={(e) =>
                            updateSelection(
                              i,
                              j,
                              q.type,
                              e.target.checked
                            )
                          }
                        />

                        <span className="option-letter">
                          {String.fromCharCode(
                            65 + j
                          )}
                        </span>

                        <span className="option-text">
                          {opt}
                        </span>

                      </label>

                    ))}

                  </div>

                </div>

              ))}

              {/* SUBMIT */}

              <div className="submit-container">

                <button
                  type="submit"
                  className="submit-quiz-btn"
                >
                  Submit Quiz
                  <span>→</span>
                </button>

              </div>

            </form>

          </div>

        )}

        {/* ================= RESULT ================= */}

        {result && (

          <div className="quiz-result-card">

            <div className="result-icon">
              ✓
            </div>

            <h2>
              Quiz Completed!
            </h2>

            <p className="result-subtitle">
              Here is your final performance
            </p>

            <div className="result-grid">

              <div className="result-item">

                <span>
                  Correct
                </span>

                <strong className="result-correct">
                  {result.correct}
                </strong>

              </div>

              <div className="result-item">

                <span>
                  Incorrect
                </span>

                <strong className="result-incorrect">
                  {result.incorrect}
                </strong>

              </div>

              <div className="result-item">

                <span>
                  Unanswered
                </span>

                <strong className="result-unanswered">
                  {result.unanswered}
                </strong>

              </div>

              <div className="result-item score-result">

                <span>
                  Final Score
                </span>

                <strong>
                  {result.score}
                </strong>

              </div>

            </div>

          </div>

        )}

      </div>
    </div>
  );
};

export default AttemptQuiz;