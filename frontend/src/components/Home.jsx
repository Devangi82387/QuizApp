import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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
    <div>{message}</div>
  );
};

export default Home;
