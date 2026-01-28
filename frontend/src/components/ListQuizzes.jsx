import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios"; 

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
    <>
      <div id="main" style={{ padding: "20px" }}>
        <h3>List of Quizzes:</h3>
        <div style={{ marginBottom: "10px" }}>
          <button onClick={() => handleGenre(1)}>All</button>
          <button onClick={() => handleGenre(2)}>Comics</button>
          <button onClick={() => handleGenre(3)}>Sports</button>
          <button onClick={() => handleGenre(4)}>History</button>
          <button onClick={() => handleGenre(5)}>Other</button>
        </div>

        <ul style={{ listStyleType: "decimal" }}>
          {data.length > 0 ? (
            data.map((quiz, index) => (
              <li key={index}>
                <Link to={`/attemptQuiz/${quiz.name}`}>{quiz.name}</Link>
              </li>
            ))
          ) : (
            <li>No quizzes available</li>
          )}
        </ul>
      </div>
    </>
  );
};

export default ListQuizzes;
