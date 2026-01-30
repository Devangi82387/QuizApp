import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";

const EditQuestion = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState("");
  const [question, setQuestion] = useState("");
  const [type, setType] = useState("1");
  const [options, setOptions] = useState({ A: "", B: "", C: "", D: "" });
  const [correct, setCorrect] = useState([false, false, false, false]);
  const [questionId, setQuestionId] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const username = localStorage.getItem("username");
    if (!username) {
      setMessage("First Login Please");
      setTimeout(() => navigate("/login"), 1500);
      return;
    }
    fetchQuestion();
  }, [id, navigate]);

  const fetchQuestion = async () => {
    try {
      const res = await api.get(`/question/getOneQuestion/${id}`);
      const q = res.data;

      setQuestionId(q.id ?? null);
      setQuiz(q.quizName ?? "");
      setQuestion(q.question ?? "");
      setType(String(q.type ?? "1"));
      setOptions({
        A: q.optionA ?? "",
        B: q.optionB ?? "",
        C: q.optionC ?? "",
        D: q.optionD ?? "",
      });
      setCorrect([!!q.correctA, !!q.correctB, !!q.correctC, !!q.correctD]);
    } catch (err) {
      if (err.response?.status === 404) setMessage("Question not found");
      else setMessage("Failed to load question");
    }
  };

  const resetForm = () => {
    setQuestion("");
    setOptions({ A: "", B: "", C: "", D: "" });
    setCorrect([false, false, false, false]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const correctCount = correct.filter(Boolean).length;
    if (type === "1" && correctCount > 1) {
      setMessage("Single correct answer allowed only");
      return;
    }

    const payload = {
      question,
      type,
      optionA: options.A,
      optionB: options.B,
      optionC: options.C,
      optionD: options.D,
      correcta: correct[0], // must match backend
      correctb: correct[1],
      correctc: correct[2],
      correctd: correct[3],
      quizName: quiz,
    };

    try {
      await api.post("/question/createQuestion", payload);
      if (questionId) {
        await api.delete(`/question/delQuestion/${questionId}`);
      }

      setMessage("Question updated successfully");
      resetForm();
      navigate(`/edit/${quiz}`);  

    } catch (err) {
      setMessage(
        "Failed to update question. Fields may be empty or server error"
      );
      console.error(err);
    }
  };

  return (
    <div id="main">
      <h3>Edit Question for Quiz: {quiz}</h3>
      {message && <div>{message}</div>}

      <form onSubmit={handleSubmit}>
        <label>
          Type:
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="1">Single Correct Answer</option>
            <option value="2">Multiple Correct Answer</option>
          </select>
        </label>
        <br />

        <label>
          Question:
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            required
          />
        </label>
        <br />

        {["A", "B", "C", "D"].map((opt, i) => (
          <div key={opt}>
            <label>
              Option {opt}:
              <input
                type="text"
                value={options[opt]}
                onChange={(e) =>
                  setOptions({ ...options, [opt]: e.target.value })
                }
                required
              />
            </label>

            <label>
              Correct:
              <input
                type="checkbox"
                checked={correct[i]}
                onChange={(e) => {
                  const newCorrect = [...correct];
                  newCorrect[i] = e.target.checked;
                  setCorrect(newCorrect);
                }}
              />
            </label>
          </div>
        ))}

        <br />
        <button type="submit">Update Question</button>
      </form>
    </div>
  );
};

export default EditQuestion;
