import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import ForgotReset from "./pages/ForgotReset.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import VerifyEmail from "./pages/VerifyEmail.jsx";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import Documents from "./pages/Documents.jsx";
import Profile from "./pages/Profile.jsx";
import Trackingmain from "./pages/Trackingmain.jsx";
import Trackingdetails from "./pages/Trackingdetails.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* default */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot" element={<ForgotReset />} />
        

        {/* verification page */}
        <Route path="/verify-email" element={<VerifyEmail />} />

        {/* protected dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
            path="/tracking"
            element={
              <ProtectedRoute>
                <Trackingmain />
              </ProtectedRoute>
            }
          />

          <Route
            path="/tracking/:docId"
            element={
              <ProtectedRoute>
                <Trackingdetails />
              </ProtectedRoute>
            }
          />

        {/* 404 / catch-all */}
        <Route path="*" element={<Navigate to="/login" replace />} />
        <Route path="/documents" element={<Documents />} />
         <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
}