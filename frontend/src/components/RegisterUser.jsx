import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const RegisterUser = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("username");
    if (user) {
      setMessage("Already Logged In!");
      setTimeout(() => navigate("/"), 1500);
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // check if user exists
      await api.get(`/user/users/${username}`);

      // if 200 → user exists
      setMessage("Username already taken");
      return;

    } catch (err) {
      // 404 → user not found → continue register
      if (err.response?.status !== 404) {
        setMessage("Server error");
        return;
      }
    }

    try {
      const res = await api.post("/user/register", {
        username,
        password,
      });

      if (res.status === 200) {
        setMessage("New User Added");
        setUsername("");
        setPassword("");
      }
    } catch (err) {
      setMessage("Empty username/password not allowed");
    }
  };

  return (
    <>

      <div id="main">
        <br /><br /><br />

        <form onSubmit={handleSubmit}>
          Username:
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <br />

          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <br />

          <button type="submit">Register</button>
        </form>

        <br />
        <div>{message}</div>
      </div>
    </>
  );
};

export default RegisterUser;
