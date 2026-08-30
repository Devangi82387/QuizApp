
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import "../css/ListQuizzes.css";

const ListQuizzes = () => {
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const username = localStorage.getItem("username");

    if (!username) {
      setTimeout(() => navigate("/login"), 1500);
    } else {
      fetchQuizzes("All");
    }
  }, [navigate]);

  // Fetch quizzes by genre
  const fetchQuizzes = async (genre) => {
    try {
      const res = await api.get(`/quiz/indexer/${genre}`);
      setData(res.data || []);
    } catch (err) {
      console.error("Error fetching quizzes", err);
      setData([]);
    }
  };

  // Delete quiz
  const deleteQuiz = async (quizName) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${quizName}"?`
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/quiz/${encodeURIComponent(quizName)}`);

      // Remove deleted quiz from the current list
      setData((prev) =>
        prev.filter((quiz) => quiz.name !== quizName)
      );
    } catch (error) {
      console.error("Error deleting quiz:", error);
    }
  };

  // Handle genre button click
  const handleGenre = (genreId) => {
    let genre = "";

    switch (genreId) {
      case 1:
        genre = "All";
        break;
      case 2:
        genre = "Comics";
        break;
      case 3:
        genre = "Sports";
        break;
      case 4:
        genre = "History";
        break;
      case 5:
        genre = "Other";
        break;
      default:
        genre = "All";
    }

    fetchQuizzes(genre);
  };

  return (
    <div className="list-quizzes-page">
      <div className="list-quizzes-card">

        <h1>List of Quizzes</h1>

        <div className="quiz-filters">
          <button onClick={() => handleGenre(1)}>All</button>
          <button onClick={() => handleGenre(2)}>Comics</button>
          <button onClick={() => handleGenre(3)}>Sports</button>
          <button onClick={() => handleGenre(4)}>History</button>
          <button onClick={() => handleGenre(5)}>Other</button>
        </div>

        <ul className="quiz-list">
          {data.length > 0 ? (
            data.map((quiz, index) => (
              <li key={index} className="quiz-item">

                <Link to={`/attemptQuiz/${quiz.name}`}>
                  {quiz.name}
                </Link>

                <button
                  className="delete-quiz-btn"
                  onClick={() => deleteQuiz(quiz.name)}
                >
                  Delete
                </button>

              </li>
            ))
          ) : (
            <li className="no-quizzes">
              No quizzes available
            </li>
          )}
        </ul>

      </div>
    </div>
  );
};

export default ListQuizzes;

