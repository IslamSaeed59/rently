import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const PublicRoute = () => {
  const token = localStorage.getItem("token");

  // If token exists, user is already logged in, redirect to Home
  if (token) {
    return <Navigate to="/" replace />;
  }

  // If no token, allow access to Public routes (Login, Signup, etc.)
  return <Outlet />;
};

export default PublicRoute;
