import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="navbar navbar-light bg-light">
      <div>
        QUIZGAME!
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
          <button>List of Quizzes</button>
        </Link>
        <Link to="/leaderboard">
          <button>Leaderboard</button>
        </Link>
      </div>
    </nav>
  );
}
