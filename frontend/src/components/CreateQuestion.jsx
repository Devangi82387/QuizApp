import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios"; 

const CreateQuestion = () => {
  const [quiz, setQuiz] = useState("");
  const [type, setType] = useState("1");
  const [question, setQuestion] = useState("");
  const [optionA, setOptionA] = useState("");
  const [optionB, setOptionB] = useState("");
  const [optionC, setOptionC] = useState("");
  const [optionD, setOptionD] = useState("");
  const [options, setOptions] = useState([false, false, false, false]);
  const [toBeOrNotToBe, setToBeOrNotToBe] = useState(false);
  const [data, setData] = useState([]);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  // check admin access
  useEffect(() => {
    const username = localStorage.getItem("username");
    if (!username) {
      setMessage("First Login Please");
      setTimeout(() => navigate("/login"), 1500);
    } else if (username !== "admin") {
      setMessage("Access Denied (Not admin)");
    }
  }, [navigate]);

  // reset form
  const resetForm = () => {
    setQuestion("");
    setOptionA("");
    setOptionB("");
    setOptionC("");
    setOptionD("");
    setOptions([false, false, false, false]);
  };

  // fetch quiz questions
  const fetchQuestions = async (quizId) => {
    try {
      const res = await api.get(`/getQuestions/${quizId}`);
      setData(res.data || []);
    } catch (err) {
      setData([]);
    }
  };

  // on quiz change
  const handleQuizChange = async (e) => {
    const quizId = e.target.value;
    setQuiz(quizId);

    if (!quizId) return;

    try {
      const res = await api.get(`/quiz/quizzes/${quizId}`);
      if (res.status === 200) {
        setToBeOrNotToBe(true);
        setMessage("Quiz Exists. Questions till now ->");
        fetchQuestions(quizId);
      }
    } catch (err) {
      setToBeOrNotToBe(false);
      setData([]);
      setMessage("Quiz Does Not Exist");
    }
  };

  // handle correct checkbox
  const handleCorrectChange = (index) => {
    const newOptions = [...options];
    newOptions[index] = !newOptions[index];
    setOptions(newOptions);
  };

  // handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const countCorrect = options.filter((o) => o).length;

    if (type === "1" && countCorrect > 1) {
      setMessage(
        "Type is Single Correct Answer but multiple correct answers given."
      );
      return;
    }

    if (!toBeOrNotToBe) {
      setMessage("No such quiz exists");
      return;
    }

    const questionData = {
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
      quiz,
    };

    try {
      const res = await api.post("/question/createQuestion", questionData);
      if (res.status === 200) {
        setMessage("New question added to quiz. Questions till now ->");
        fetchQuestions(quiz);
        resetForm();
      }
    } catch (err) {
      setMessage(
        err.response?.status === 404
          ? "Question/Correct Answer fields can't be empty."
          : "Server error"
      );
    }
  };

  return (
    <>
     
      <div id="main" style={{ padding: "20px" }}>
        <h3>Make question for Quiz {quiz}</h3>
        <p>{message}</p>
        <form onSubmit={handleSubmit}>
          <label>
            Quiz:
            <input type="text" value={quiz} onChange={handleQuizChange} />
          </label>
          <br />
          <label>
            Type of Question:
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
            />
          </label>
          <br />
          <label>
            Option A:
            <input
              type="text"
              value={optionA}
              onChange={(e) => setOptionA(e.target.value)}
            />
          </label>
          <br />
          <label>
            Option B:
            <input
              type="text"
              value={optionB}
              onChange={(e) => setOptionB(e.target.value)}
            />
          </label>
          <br />
          <label>
            Option C:
            <input
              type="text"
              value={optionC}
              onChange={(e) => setOptionC(e.target.value)}
            />
          </label>
          <br />
          <label>
            Option D:
            <input
              type="text"
              value={optionD}
              onChange={(e) => setOptionD(e.target.value)}
            />
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
              {opt}
            </label>
          ))}
          <br />
          <button type="submit">Add</button>
        </form>

        <div id="tillNow">
          <h4>Questions Till Now:</h4>
          <ul>
            {data.map((item, key) => (
              <li key={key}>
                {"Q" + (key + 1) + " -> " + item.question}
                    <ul type="A">
                    <li>{item.optionA}</li>
                    <li>{item.optionB}</li>
                    <li>{item.optionC}</li>
                    <li>{item.optionD}</li>
                    </ul>
                <hr />
              </li>

            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default CreateQuestion;
