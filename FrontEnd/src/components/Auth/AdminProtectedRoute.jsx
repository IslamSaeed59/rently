import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const AdminProtectedRoute = () => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // If no token is found, redirect to login page
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If user is not an admin, redirect to home page
  if (user.Email !== "admin@gmail.com") {
    return <Navigate to="/" replace />;
  }

  // If token exists and user is admin, render the child routes (Outlet)
  return <Outlet />;
};

export default AdminProtectedRoute;
