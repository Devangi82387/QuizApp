import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../css/AdminPanel.css";

const AdminPanel = () => {
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("username");

    if (!user) {
      setMessage("First Login Please");
      setTimeout(() => navigate("/login"), 1500);
    } else if (user !== "admin") {
      setMessage("Access Denied (Not admin)");
    }
  }, [navigate]);

  return (
    <div className="admin-page">

      <div className="admin-container">

        <div className="admin-header">
          <h1>Admin Panel</h1>
          <p>Manage your QuizGame platform</p>
        </div>

        {message && (
          <div className="admin-message">
            {message}
          </div>
        )}

        <div className="admin-actions">

          <Link to="/createQuiz">
            <button className="admin-action primary-action">
              <span>Create Quiz</span>
              <span className="action-arrow">→</span>
            </button>
          </Link>

          <Link to="/createQuestion">
            <button className="admin-action">
              <span>Create Question</span>
              <span className="action-arrow">→</span>
            </button>
          </Link>

          <Link to="/editQuiz">
            <button className="admin-action">
              <span>Edit Quiz</span>
              <span className="action-arrow">→</span>
            </button>
          </Link>

          <Link to="/viewUsers">
            <button className="admin-action">
              <span>View Users</span>
              <span className="action-arrow">→</span>
            </button>
          </Link>

        </div>

      </div>

    </div>
  );
};

export default AdminPanel;