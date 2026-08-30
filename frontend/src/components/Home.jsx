import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Home.css";

const Home = () => {
  const [message, setMessage] = useState("Home");
  const navigate = useNavigate();

  useEffect(() => {
    const username = localStorage.getItem("username");

    if (!username) {
      setMessage("First Login Please");

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    }
  }, [navigate]);

  return (
    <div className="home-page">
      <h1>{message}</h1>
    </div>
  );
};

export default Home;