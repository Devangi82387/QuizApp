import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import "../css/Leaderboard.css";

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
    <div className="leaderboard-page">

      <div className="leaderboard-container">

        {/* HEADER */}
        <div className="leaderboard-header">
          <h1>Leaderboard</h1>
          <p>Track your quiz performance and compare your score with others.</p>
        </div>

        {/* MESSAGE */}
        {message && (
          <div className="leaderboard-message">
            {message}
          </div>
        )}

        {/* YOUR SCORES */}
        <section className="leaderboard-section">

          <div className="section-header">
            <div>
              <h2>Your Quiz Performance</h2>
              <p>Quizzes played by you</p>
            </div>
          </div>

          {scores.length > 0 ? (
            <div className="table-wrapper">

              <table className="leaderboard-table">

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
                      <td className="quiz-name">
                        {item.quiz}
                      </td>

                      <td className="correct">
                        {item.correct}
                      </td>

                      <td className="incorrect">
                        {item.incorrect}
                      </td>

                      <td className="unanswered">
                        {item.unanswered}
                      </td>

                      <td className="score">
                        {item.points}
                      </td>
                    </tr>
                  ))}
                </tbody>

              </table>

            </div>
          ) : (
            <div className="empty-state">
              No quizzes played yet.
            </div>
          )}

        </section>


        {/* GLOBAL LEADERBOARD */}
        <section className="leaderboard-section">

          <div className="section-header">
            <div>
              <h2>Global Leaderboard</h2>
              <p>See how you rank against other players</p>
            </div>
          </div>

          {board.length > 0 ? (
            <div className="table-wrapper">

              <table className="leaderboard-table global-table">

                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>User</th>
                    <th>Points</th>
                  </tr>
                </thead>

                <tbody>
                  {board.map((item, idx) => (
                    <tr
                      key={idx}
                      className={
                        item.username === user
                          ? "current-user"
                          : ""
                      }
                    >

                      <td className="rank">
                        #{idx + 1}
                      </td>

                      <td className="leaderboard-user">
                        {item.username}

                        {item.username === user && (
                          <span className="you-badge">
                            YOU
                          </span>
                        )}
                      </td>

                      <td className="points">
                        {item.total}
                      </td>

                    </tr>
                  ))}
                </tbody>

              </table>

            </div>
          ) : (
            <div className="empty-state">
              No leaderboard data available.
            </div>
          )}

        </section>

      </div>

    </div>
  );
};

export default Leaderboard;