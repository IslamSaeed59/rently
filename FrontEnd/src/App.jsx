import { BrowserRouter, Routes, Route } from "react-router-dom";
import UserLayout from "./Layout/UserLayout";
import SingUp from "./components/Auth/SingUp";
import Login from "./components/Auth/Login";
import OTP from "./components/Auth/OTP";
import ForgotPassword from "./components/Auth/ForgotPassword";
import ResetPassword from "./components/Auth/ResetPassword";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<UserLayout />}>
          <Route index element={<div>Home Page (Coming Soon)</div>} />
          <Route path="signup" element={<SingUp />} />
          <Route path="login" element={<Login />} />
          <Route path="verify-otp" element={<OTP />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="reset-password" element={<ResetPassword />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
