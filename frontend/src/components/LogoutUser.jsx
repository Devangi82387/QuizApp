import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const logoutUser = async () => {
      const username = localStorage.getItem("username");

      if (!username) {
        setMessage("First Login Please");
      } else {
        try {
          // Optional: call logout API if your backend supports it
          // await api.post("/user/logout", { username });

          // Remove user from localStorage
          localStorage.removeItem("username");
          setMessage("Logged Out Successfully!");
        } catch (err) {
          setMessage("Server Error while logging out");
        }
      }

      // Redirect after 1.5 seconds
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    };

    logoutUser();
  }, [navigate]);

  return (
    <div style={{ marginTop: "50px", textAlign: "center", fontSize: "18px" }}>
      {message}
    </div>
  );
};

export default Logout;
