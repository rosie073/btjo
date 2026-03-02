import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import ForgotReset from "./pages/ForgotReset.jsx";
import Dashboard from "./pages/Dashboard.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot" element={<ForgotReset />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/Dashboard"/>} />
      </Routes>
    </BrowserRouter>
  );
}