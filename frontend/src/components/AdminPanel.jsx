import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

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
    <>
      <div id="main">
        {message && <div>{message}</div>}

        <br />

        <Link to="/createQuiz">
          <button>Create Quiz</button>
        </Link>

        <Link to="/createQuestion">
          <button>Create Question</button>
        </Link>

        <Link to="/editQuiz">
          <button>Edit Quiz</button>
        </Link>

        <Link to="/viewUsers">
          <button>View Users</button>
        </Link>
      </div>
    </>
  );
};

export default AdminPanel;
