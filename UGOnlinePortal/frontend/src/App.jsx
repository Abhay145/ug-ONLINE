
import React from "react"
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from "./pages/Register";
import Login from "./pages/Login";
import StudentDashboard from "./pages/StudentDashboard";
import ProfessorDashboard from "./pages/ProfessorDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Landing from "./pages/Landing";
import OpenElective from "./pages/OpenElective"
import OtpVerification from "./pages/OtpVerification.jsx";

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/register" element = {<Register />} />
        <Route path="/login" element = {<Login />} />
        <Route path="/student/dashboard" element={<StudentDashboard/>} />
        <Route path="/professor/dashboard" element={<ProfessorDashboard/>} />
        <Route path="/admin/dashboard" element={<AdminDashboard/>} />
        <Route path="/home-page" element = {<Landing />} />
        <Route path="/OpenElective" element = {<OpenElective />} />
        <Route path="/OTPVerify" element={<OtpVerification />} />
      </Routes>
    </Router>
  )
}

export default App
