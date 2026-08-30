import React from "react";
import { Link } from "react-router-dom";
import "../css/navbar.css";

export default function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">
        QUIZGAME
      </Link>

      <div className="navbar-links">

        <Link to="/register">
          <button>Register</button>
        </Link>

        <Link to="/login">
          <button>Login</button>
        </Link>

        <Link to="/logout">
          <button>Logout</button>
        </Link>

        <Link to="/adminPanel">
          <button>Admin Panel</button>
        </Link>

        <Link to="/listQuizzes">
          <button>Quizzes</button>
        </Link>

        <Link to="/leaderboard">
          <button>Leaderboard</button>
        </Link>

      </div>
    </nav>
  );
}