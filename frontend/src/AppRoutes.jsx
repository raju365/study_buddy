/*
 * -------------------------------------------------------
 * File : AppRoutes.jsx
 * Description : Central route definitions for the app
 * Author : Raju Barman
 * -------------------------------------------------------
 */

import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DoubtSolver from "./pages/DoubtSolver";
import StudyRooms from "./pages/StudyRooms";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import StudyRoom from "./pages/StudyRoom";
import Layout from "./components/common/Layout";
import Profile from "./pages/Profile";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout>
              <DoubtSolver />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/rooms"
        element={
          <ProtectedRoute>
            <Layout>
              <StudyRooms />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/rooms/:roomId"
        element={
          <ProtectedRoute>
            <Layout>
              <StudyRoom />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Layout>
              <Profile />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
    </Routes>
  );
}
