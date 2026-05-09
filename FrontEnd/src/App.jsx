import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import UserLayout from "./Layout/UserLayout";
import SingUp from "./components/Auth/SingUp";
import Login from "./components/Auth/Login";
import OTP from "./components/Auth/OTP";
import ForgotPassword from "./components/Auth/ForgotPassword";
import ResetPassword from "./components/Auth/ResetPassword";
import IdentityVerification from "./components/Auth/IdentityVerification";

import ProtectedRoute from "./components/Auth/ProtectedRoute";
import PublicRoute from "./components/Auth/PublicRoute";
import NotFound from "./Pages/NotFound";
import ComingSoon from "./Pages/ComingSoon";
import ProfileIndex from "./components/Profile/index";
import Profile from "./components/Profile/Profile";
import MyListings from "./components/Profile/My Listings/MyListings";
import Home from "./Pages/Home/Home";
import Products from "./Pages/Products/Products";
import SearchPage from "./components/Home/SearchPage";
import CreateProducts from "./components/Products/CreateProducts";
import EditProducts from "./components/Products/EditProducts";
import ProductDetails from "./components/Home/ProductDetails";
import BookingRequests from "./components/Rentals/BookingRequests";
import MyRentals from "./components/Rentals/MyRentlas";
import CategoriesProducts from "./components/Categories/CategoriesProducts";
import CheckOut from "./components/CheckOut/CheckOut";
import Favorites from "./components/Profile/Favorites";
import Wallet from "./components/Profile/Wallet";
import Chat from "./Pages/Chat/Chat";
import Contact from "./Pages/Contact/Contact";
import About from "./Pages/About/About";
import FAQ from "./Pages/FAQ/FAQ";
import PrivacyPolicy from "./Pages/Legal/PrivacyPolicy";
import TermsOfUse from "./Pages/Legal/TermsOfUse";

import AdminLayout from "./Layout/AdminLayout";
import AdminDashboard from "./Pages/Admin/Dashboard";
import AdminProtectedRoute from "./components/Auth/AdminProtectedRoute";

import Categories from "./Pages/Admin/Categories/Categories";
import CreatCategories from "./components/Admin/Categories/CreatCategories";
import EditCategories from "./components/Admin/Categories/EditCategories";
import Customers from "./Pages/Admin/Customers/Customers";
import AdminWithdrawals from "./Pages/Admin/Withdrawals";
import ALLChat from "./components/Admin/Messages/ALLChat";
import AdminDisputes from "./Pages/Admin/Disputes";

const App = () => {
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<UserLayout />}>
            <Route index element={<Home />} />
            <Route path="search" element={<SearchPage />} />
            <Route path="category/:slug" element={<CategoriesProducts />} />
            <Route path="product/:id" element={<ProductDetails />} />
            <Route path="contact" element={<Contact />} />
            <Route path="about" element={<About />} />
            <Route path="faq" element={<FAQ />} />
            <Route path="privacy-policy" element={<PrivacyPolicy />} />
            <Route path="terms-of-use" element={<TermsOfUse />} />

            {/* Protected Routes: Only for logged-in users */}
            <Route element={<ProtectedRoute />}>
              <Route path="profile" element={<ProfileIndex />} />
              <Route path="profile/edit" element={<Profile />} />
              <Route path="profile/listings" element={<MyListings />} />
              <Route path="products/create" element={<CreateProducts />} />
              <Route path="products/edit/:id" element={<EditProducts />} />
              <Route path="profile/booking-requests" element={<BookingRequests />} />
              <Route path="profile/my-rentals" element={<MyRentals />} />
              <Route path="checkout" element={<CheckOut />} />
              <Route path="profile/favorites" element={<Favorites />} />
              <Route path="profile/wallet" element={<Wallet />} />
              <Route path="chat" element={<Chat />} />
              <Route path="verify-identity" element={<IdentityVerification />} />
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
              <Route path="withdrawals" element={<AdminWithdrawals />} />
              <Route path="disputes" element={<AdminDisputes />} />
              <Route path="analytics" element={<div>Analytics View</div>} />
              <Route path="messages" element={<ALLChat />} />
              <Route path="settings" element={<div>Admin Settings</div>} />
            </Route>
          </Route>

           <Route path="/coming-soon" element={<ComingSoon />} />
           <Route path="*" element={<NotFound />} />
         </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
