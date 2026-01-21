import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

import Register from "./components/RegisterUser";
import Login from "./components/LoginUser";
import Navbar from "./components/Navbar";
import Home from "./components/Home";

function App() {
  return (
    <BrowserRouter>
      <Navbar />   

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
