import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import "../css/ViewUsers.css";

const ViewUsers = () => {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const username = localStorage.getItem("username");

    if (!username) {
      setMessage("First Login Please");
      setTimeout(() => navigate("/login"), 1500);
    } else if (username !== "admin") {
      setMessage("Access Denied (Not admin)");
    } else {
      fetchUsers();
    }
  }, [navigate]);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/user/indexUsers");
      setUsers(res.data);
    } catch (err) {
      setMessage("Failed to fetch users");
    }
  };

  const deleteUser = async (username) => {
    try {
      await api.delete(`user/delUser/${username}`);
      fetchUsers();
    } catch (err) {
      alert("Failed to delete user");
    }
  };

  return (
    <div className="view-users-page">

      <div className="view-users-container">

        <div className="view-users-header">
          <h1>Registered Users</h1>
          <p>Manage users registered on QuizGame</p>
        </div>

        {message && (
          <div className="view-users-message">
            {message}
          </div>
        )}

        {users.length > 0 && (
          <div className="users-card">

            <div className="users-card-header">
              <span>User</span>
              <span>Action</span>
            </div>

            <ol className="users-list">

              {users.map((user, index) => (

                <li
                  key={index}
                  className={
                    user.username === "admin"
                      ? "admin-user"
                      : ""
                  }
                >

                  <div className="user-info">

                    <span className="user-number">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <span className="username">
                      {user.username}
                    </span>

                    {user.username === "admin" && (
                      <span className="admin-badge">
                        ADMIN
                      </span>
                    )}

                  </div>

                  {user.username !== "admin" && (
                    <button
                      className="delete-user-btn"
                      onClick={() =>
                        deleteUser(user.username)
                      }
                    >
                      Delete
                    </button>
                  )}

                </li>

              ))}

            </ol>

          </div>
        )}

      </div>

    </div>
  );
};

export default ViewUsers;