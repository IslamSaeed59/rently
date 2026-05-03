import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Hero from "../components/Home/Hero";
import Footer from "../components/Footer/Footer";
import Chatbot from "../components/Chatbot/Chatbot";

const UserLayout = () => {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
      <Chatbot />
    </>
  );
};

export default UserLayout;
