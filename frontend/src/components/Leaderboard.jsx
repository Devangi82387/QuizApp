import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios"; 

const Leaderboard = () => {
  const [user, setUser] = useState("");
  const [scores, setScores] = useState([]);
  const [board, setBoard] = useState([]);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const username = localStorage.getItem("username");
    if (!username) {
      setMessage("First Login Please");
      setTimeout(() => navigate("/login"), 1500);
    } else {
      setUser(username);
      fetchUserScores(username);
      fetchGlobalLeaderboard();
    }
  }, [navigate]);

  const fetchUserScores = async (username) => {
    try {
      const res = await api.get(`/user/scores/${username}`);
      setScores(res.data || []);
    } catch (err) {
      if (err.response?.status === 404) {
        setMessage("Invalid Username");
      } else {
        setMessage("Error fetching scores");
      }
    }
  };

  const fetchGlobalLeaderboard = async () => {
    try {
      const res = await api.get("/user/leaderboard");
      setBoard(res.data || []);
    } catch (err) {
      setMessage("Error fetching global leaderboard");
    }
  };

  return (
    <>
      <div id="main" style={{ padding: "20px" }}>
        <p id="msg">{message}</p>

        <h3>Quizzes Played By You:</h3>
        {scores.length > 0 ? (
          <table border="1">
            <thead>
              <tr>
                <th>Quiz Name</th>
                <th>Correct</th>
                <th>Incorrect</th>
                <th>Unanswered</th>
                <th>Final Score</th>
              </tr>
            </thead>
            <tbody>
              {scores.map((item, idx) => (
                <tr key={idx}>
                  <td>{item.quizPlayed}</td>
                  <td>{item.correct}</td>
                  <td>{item.incorrect}</td>
                  <td>{item.unanswered}</td>
                  <td>{item.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No quizzes played yet.</p>
        )}

        <h3>Global Leaderboard:</h3>
        {board.length > 0 ? (
          <table border="1">
            <thead>
              <tr>
                <th>User</th>
                <th>Points</th>
              </tr>
            </thead>
            <tbody>
              {board.map((item, idx) => (
                <tr key={idx}>
                  <td>{item.username}</td>
                  <td>{item.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No leaderboard data available.</p>
        )}
      </div>
    </>
  );
};

export default Leaderboard;
