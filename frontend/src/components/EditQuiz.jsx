import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";

const EditQuiz = () => {
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  // fetch quizzes by genre
  const fetchByGenre = async (genre) => {
    try {
      const res = await api.get(`/quiz/indexer/${genre}`);
      setData(res.data || []);
    } catch (err) {
      console.error("Error fetching quizzes", err);
      setData([]);
    }
  };

  // auth check + initial fetch
  useEffect(() => {
    const username = localStorage.getItem("username");

    if (!username) {
      document.getElementById("main").textContent = "First Login Please";
      setTimeout(() => navigate("/login"), 1500);
    } else {
      fetchByGenre("All");
    }
  }, [navigate]);

  // genre click handler
  const handleGenre = (g) => {
    const genres = {
      1: "All",
      2: "Comics",
      3: "Sports",
      4: "History",
      5: "Other",
    };

    fetchByGenre(genres[g]);
  };

  return (
    <div id="main">
      <h3>List of Quizzes:</h3>

      <div>
        <button onClick={() => handleGenre(1)}>All</button>
        <button onClick={() => handleGenre(2)}>Comics</button>
        <button onClick={() => handleGenre(3)}>Sports</button>
        <button onClick={() => handleGenre(4)}>History</button>
        <button onClick={() => handleGenre(5)}>Other</button>
      </div>

      <ul>
        {data && data.length > 0 ? (
          data.map((quiz) => (
            <li key={quiz.name}>
              <Link to={`/quiz/edit/${quiz.name}`}>{quiz.name}</Link>
            </li>
          ))
        ) : (
          <li>No quizzes found</li>
        )}
      </ul>
    </div>
  );
};

export default EditQuiz;
