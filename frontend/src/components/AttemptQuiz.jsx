import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";

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

  /* -------------------- AUTH + QUIZ LOAD -------------------- */
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
        setQuiz(quizRes.data);

        const lifeRes = await api.get(`/user/getLifelines/${u}`);
        setLifelinesLeft(lifeRes.data.lifelines);
      } catch {
        navigate("/createQuiz");
      }
    };

    loadData();
  }, [name, navigate]);

  /* -------------------- START QUIZ -------------------- */
  const startQuiz = async (e) => {
    e.preventDefault();
    const res = await api.get(`/question/getQuestions/${quiz.name}`);
    setQuestions(res.data);
    setAnswers(res.data.map(() => [false, false, false, false]));
    setStarted(true);
  };

  /* -------------------- ANSWER UPDATE -------------------- */
  const updateSelection = (qIndex, optIndex, type, checked) => {
    setAnswers((prev) => {
      const copy = [...prev];
      if (type === 1) {
        copy[qIndex] = [false, false, false, false];
        copy[qIndex][optIndex] = true;
      } else {
        copy[qIndex][optIndex] = checked;
      }
      return copy;
    });
  };

  /* -------------------- SUBMIT QUIZ -------------------- */
  const submitQuiz = async (e) => {
    e.preventDefault();

    let correct = 0, incorrect = 0, unanswered = 0, score = 0;

    answers.forEach((ans, i) => {
      const empty = ans.every((v) => !v);
      const correctAns = [
        questions[i].correcta,
        questions[i].correctb,
        questions[i].correctc,
        questions[i].correctd,
      ];

      if (empty) {
        unanswered++;
        score -= parseInt(quiz.mfu);
      } else if (JSON.stringify(ans) === JSON.stringify(correctAns)) {
        correct++;
        score += parseInt(quiz.mfc);
      } else {
        incorrect++;
        score -= parseInt(quiz.mfi);
      }
    });

    setResult({ correct, incorrect, unanswered, score });

    await api.post("/score/createScore", {
      quizPlayed: quiz.name,
      user,
      correct,
      incorrect,
      unanswered,
      points: score,
    });
  };

  /* -------------------- LIFELINE -------------------- */
  const showAnswer = async () => {
    if (lifelinesLeft < 1) return;

    const q = lifelineQ - 1;
    const ans =
      (questions[q].correcta ? "A" : "") +
      (questions[q].correctb ? "B" : "") +
      (questions[q].correctc ? "C" : "") +
      (questions[q].correctd ? "D" : "");

    alert(`Correct options: ${ans}`);

    await api.get(`/user/reduceLifeline/${user}`);
    setLifelinesLeft((l) => l - 1);
  };

  /* -------------------- UI -------------------- */
  return (
    <>

      <div id="main">
        {!started ? (
          <>
            <h1>Welcome to quiz '{quiz.name}'</h1>
            <form onSubmit={startQuiz}>
              <button type="submit">Start playing!</button>
            </form>
          </>
        ) : (
          <>
            <h2>Playing quiz '{quiz.name}'</h2>

            <p>
              Lifelines Left: {lifelinesLeft}
              <select onChange={(e) => setLifelineQ(e.target.value)}>
                {questions.map((_, i) => (
                  <option key={i} value={i + 1}>{i + 1}</option>
                ))}
              </select>
              <button onClick={showAnswer}>Show Answer</button>
            </p>

            <form onSubmit={submitQuiz}>
              {questions.map((q, i) => (
                <div key={i}>
                  <h4>{q.question}</h4>
                  {[q.optionA, q.optionB, q.optionC, q.optionD].map((opt, j) => (
                    <label key={j}>
                      <input
                        type={q.type === 1 ? "radio" : "checkbox"}
                        name={`q-${i}`}
                        onChange={(e) =>
                          updateSelection(i, j, q.type, e.target.checked)
                        }
                      />
                      {opt}
                    </label>
                  ))}
                  <hr />
                </div>
              ))}
              <button type="submit">Submit</button>
            </form>
          </>
        )}

        {result && (
          <div>
            <h3>Result</h3>
            Correct: {result.correct}<br />
            Incorrect: {result.incorrect}<br />
            Unanswered: {result.unanswered}<br />
            Score: {result.score}
          </div>
        )}
      </div>
    </>
  );
};

export default AttemptQuiz;
