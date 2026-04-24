import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import UserLayout from "./Layout/UserLayout";
import SingUp from "./components/Auth/SingUp";
import Login from "./components/Auth/Login";
import OTP from "./components/Auth/OTP";
import ForgotPassword from "./components/Auth/ForgotPassword";
import ResetPassword from "./components/Auth/ResetPassword";

import ProtectedRoute from "./components/Auth/ProtectedRoute";
import PublicRoute from "./components/Auth/PublicRoute";
import NotFound from "./Pages/NotFound";
import ProfileIndex from "./components/Profile/index";
import Profile from "./components/Profile/Profile";
import MyListings from "./components/Profile/My Listings/MyListings";
import Home from "./Pages/Home/Home";
import Products from "./Pages/Products/Products";
import CreateProducts from "./components/Products/CreateProducts";
import EditProducts from "./components/Products/EditProducts";
import ProductDetails from "./components/Home/ProductDetails";
import BookingRequests from "./components/Rentals/BookingRequests";
import MyRentals from "./components/Rentals/MyRentlas";


import AdminLayout from "./Layout/AdminLayout";
import AdminDashboard from "./Pages/Admin/Dashboard";
import AdminProtectedRoute from "./components/Auth/AdminProtectedRoute";

import Categories from "./Pages/Admin/Categories/Categories";
import CreatCategories from "./components/Admin/Categories/CreatCategories";
import EditCategories from "./components/Admin/Categories/EditCategories";
import Customers from "./Pages/Admin/Customers/Customers";

const App = () => {
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<UserLayout />}>
            <Route index element={<Home />} />
            <Route path="product/:id" element={<ProductDetails />} />

            {/* Protected Routes: Only for logged-in users */}
            <Route element={<ProtectedRoute />}>
              <Route path="profile" element={<ProfileIndex />} />
              <Route path="profile/edit" element={<Profile />} />
              <Route path="profile/listings" element={<MyListings />} />
              <Route path="products/create" element={<CreateProducts />} />
              <Route path="products/edit/:id" element={<EditProducts />} />
              <Route path="profile/booking-requests" element={<BookingRequests />} />
              <Route path="profile/my-rentals" element={<MyRentals />} />

            </Route>

            {/* Public Routes: Only for guests (non-logged-in users) */}
            <Route element={<PublicRoute />}>
              <Route path="signup" element={<SingUp />} />
              <Route path="login" element={<Login />} />
              <Route path="verify-otp" element={<OTP />} />
              <Route path="forgot-password" element={<ForgotPassword />} />
              <Route path="reset-password" element={<ResetPassword />} />
            </Route>
          </Route>

          {/* Admin Routes */}
          <Route element={<AdminProtectedRoute />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="products" element={<Products />} />

              <Route path="categories" element={<Categories />} />
              <Route path="categories/create" element={<CreatCategories />} />
              <Route path="categories/edit/:id" element={<EditCategories />} />

              <Route path="customers" element={<Customers />} />
              <Route path="analytics" element={<div>Analytics View</div>} />
              <Route path="messages" element={<div>Messages View</div>} />
              <Route path="settings" element={<div>Admin Settings</div>} />
            </Route>
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
