import { BrowserRouter, Routes, Route } from "react-router-dom";
import UserLayout from "./Layout/UserLayout";
import SingUp from "./components/Auth/SingUp";
import Login from "./components/Auth/Login";
import OTP from "./components/Auth/OTP";
import ForgotPassword from "./components/Auth/ForgotPassword";
import ResetPassword from "./components/Auth/ResetPassword";

import ProtectedRoute from "./components/Auth/ProtectedRoute";
import PublicRoute from "./components/Auth/PublicRoute";
import NotFound from "./Pages/NotFound";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<UserLayout />}>
          {/* Protected Routes: Only for logged-in users */}
          <Route element={<ProtectedRoute />}>
            <Route index element={<div>Home Page (Coming Soon)</div>} />
          </Route>

          {/* Public Routes: Only for guests (non-logged-in users) */}
          <Route element={<PublicRoute />}>
            <Route path="signup" element={<SingUp />} />
            <Route path="login" element={<Login />} />
            <Route path="verify-otp" element={<OTP />} />
            <Route path="forgot-password" element={<ForgotPassword />} />
            <Route path="reset-password" element={<ResetPassword />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
