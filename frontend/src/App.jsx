import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

import Register from "./components/RegisterUser";
import Login from "./components/LoginUser";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import AdminPanel from "./components/AdminPanel";
import ViewUsers from "./components/ViewUsers";
import Logout from "./components/LogoutUser";
import CreateQuestion from "./components/CreateQuestion";
import ListQuizzes from "./components/ListQuizzes";
import Leaderboard from "./components/Leaderboard";




function App() {
  return (
    <>
    
      <Navbar />   

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/adminPanel" element={<AdminPanel />} />
        <Route path="/viewUsers" element={<ViewUsers />} />
        <Route path="/logout" element={<Logout />} /> 
        <Route path="/createQuestion" element={<CreateQuestion />} />
        <Route path="/listQuizzes" element={<ListQuizzes />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
         
      </Routes>
    </>
  );
}

export default App;

