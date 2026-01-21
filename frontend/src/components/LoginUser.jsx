import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const LoginUser = () => {
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
      const res = await api.post("/user/login", {
        username,
        password,
      });

      if (res.status === 200) {
        localStorage.setItem("username", res.data.username);
        setMessage("Login Successful!");
        setTimeout(() => navigate("/"), 1000);
      }
    } catch (err) {
      if (err.response?.status === 404) {
        setMessage("Incorrect Username or Password");
      } else {
        setMessage("Server error");
      }
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

          <button type="submit">Login</button>
        </form>

        <br />
        <div>{message}</div>
      </div>
    </>
  );
};

export default LoginUser;
