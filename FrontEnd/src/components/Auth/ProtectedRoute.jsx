import { Navigate, Outlet, useLocation } from "react-router-dom";

const ProtectedRoute = () => {
  const location = useLocation();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // If no token is found, redirect to login page
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Paths that are allowed even if the user is not verified
  const allowedPathsForUnverified = [
    "/verify-identity",
    "/profile",
    "/profile/edit"
  ];

  // If user is not verified and not pending, restrict access to certain pages
  if (
    user.verification_status !== "verified" &&
    user.verification_status !== "pending" &&
    !allowedPathsForUnverified.includes(location.pathname)
  ) {
    return <Navigate to="/verify-identity" replace />;
  }

  // If token exists and verified/pending, or on an allowed path, render the child routes
  return <Outlet />;
};

export default ProtectedRoute;
