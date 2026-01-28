import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

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
      await api.delete(`user//delUser/${username}`);
      fetchUsers(); // refresh list
    } catch (err) {
      alert("Failed to delete user");
    }
  };

  return (
    <div id="main">
      {message && <p>{message}</p>}

      {users.length > 0 && (
        <ol>
          {users.map((user, index) => (
            <li key={index}>
              {user.username}

              {user.username !== "admin" && (
                <button
                  style={{ marginLeft: "10px" }}
                  onClick={() => deleteUser(user.username)}
                >
                  Delete
                </button>
              )}
            </li>
          ))}
        </ol>
      )}
    </div>
  );
};

export default ViewUsers;
