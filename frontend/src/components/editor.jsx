import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";

const Editor = () => {
  const { quizName } = useParams();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [message, setMessage] = useState("");

  // auth check + fetch questions
  useEffect(() => {
    const username = localStorage.getItem("username");

    if (!username) {
      setMessage("First Login Please");
      setTimeout(() => navigate("/login"), 1500);
      return;
    }

    fetchQuestions();
  }, [navigate, quizName]);

  // fetch questions of quiz
  const fetchQuestions = async () => {
    try {
      const res = await api.get(`/question/getQuestions/${quizName}`);
      setQuestions(res.data || []);
    } catch (err) {
      if (err.response?.status === 404) {
        setMessage("No such quiz exists");
      } else {
        setMessage("Server error");
      }
    }
  };

  // delete question
  const deleteQuestion = async (id, index) => {
    try {
      await api.delete(`/question/delQuestion/${id}`);

      const updated = [...questions];
      updated.splice(index, 1);
      setQuestions(updated);
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  return (
    <div id="main">
      {message && <div>{message}</div>}

      <h3>Questions present in quiz '{quizName}'</h3>
      <hr />

      {questions.length > 0 ? (
        <ol>
          {questions.map((item, index) => (
            <li key={item.id}>
              <b>{item.question}</b> (
              {item.type === 1 ? "Single Correct" : "Multiple Correct"})
              <br />

              <Link to={`/editQuestion/${item.id}`}>
                <button>Edit</button>
              </Link>

              <button onClick={() => deleteQuestion(item.id, index)}>
                Delete
              </button>

              <br />
              A: {item.optionA} <br />
              B: {item.optionB} <br />
              C: {item.optionC} <br />
              D: {item.optionD}
              <hr />
            </li>
          ))}
        </ol>
      ) : (
        !message && <div>No questions found</div>
      )}
    </div>
  );
};

export default Editor;
