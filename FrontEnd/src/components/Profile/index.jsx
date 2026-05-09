import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  Key,
  Building2,
  Calendar,
  Receipt,
  LogOut,
  ChevronRight,
  Loader2,
  Heart,
  Wallet,
} from "lucide-react";
import { getProfile } from "../../server/Api";

const ProfileIndex = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        setProfile(data);
      } catch (error) {
        console.error("Failed to fetch profile", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const menuItems = [
    {
      icon: <User size={18} className="text-white" strokeWidth={2.5} />,
      title: "Edit Profile",
      description: "Update your personal information",
      path: "/profile/edit",
    },
    {
      icon: <Key size={18} className="text-white" strokeWidth={2.5} />,
      title: "My Rentals",
      description: "View and manage your active bookings",
      path: "/profile/my-rentals",
    },
    {
      icon: <Building2 size={18} className="text-white" strokeWidth={2.5} />,
      title: "My Listings",
      description: "Manage the properties you've posted",
      path: "/profile/listings",
    },
    {
      icon: <Calendar size={18} className="text-white" strokeWidth={2.5} />,
      title: "Booking Requests",
      description: "Track pending and past requests",
      path: "/profile/booking-requests",
    },
    {
      icon: <Heart size={18} className="text-white" strokeWidth={2.5} />,
      title: "My Favorites",
      description: "Items you've saved for later",
      path: "/profile/favorites",
    },
    {
      icon: <Wallet size={18} className="text-white" strokeWidth={2.5} />,
      title: "My Wallet",
      description: "Manage your balance and withdrawals",
      path: "/profile/wallet",
    },
    // {
    //   icon: <Receipt size={18} className="text-white" strokeWidth={2.5} />,
    //   title: "Order History",
    //   description: "View receipts and transaction history",
    //   path: "#",
    // },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[80vh]">
        <Loader2 className="w-12 h-12 animate-spin text-[#0F172A]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans py-12 px-6">
      <div className="max-w-2xl mx-auto flex flex-col items-center">
        {/* Profile Info */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-[140px] h-[140px] rounded-full bg-[#526077] flex items-center justify-center overflow-hidden shadow-sm mb-5">
            {profile?.profile_image ? (
              <img
                src={profile.profile_image}
                alt="Profile Avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <User
                size={72}
                className="text-white/60 mt-5"
                strokeWidth={1.5}
              />
            )}
          </div>
          <h1 className="text-[26px] font-bold text-[#0F172A] tracking-tight mb-1">
            {profile?.Firstname || "Your"} {profile?.LastName || "Name"}
          </h1>
          <p className="text-[15px] text-[#334155] font-semibold">
            {profile?.Email || "email@example.com"}
          </p>
        </div>

        {/* Menu Items */}
        <div className="w-full max-w-xl">
          <div className="flex flex-col">
            <div className="border-t-[1.5px] border-gray-300 w-full" />
            {menuItems.map((item, index) => (
              <Link
                key={index}
                to={item.path}
                className="flex items-center justify-between py-5 border-b-[1.5px] border-gray-200 hover:border-transparent hover:bg-white hover:-translate-y-1 hover:-translate-x-1 hover:shadow-lg rounded-xl transition-all duration-300 ease-out px-4 group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-full bg-[#0F172A] flex items-center justify-center shadow-sm">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="text-[15px] font-extrabold text-[#0F172A] mb-0.5">
                      {item.title}
                    </h3>
                    <p className="text-[13px] text-gray-400 font-medium">
                      {item.description}
                    </p>
                  </div>
                </div>
                <ChevronRight
                  size={18}
                  className="text-gray-400 group-hover:text-gray-700 transition-colors"
                />
              </Link>
            ))}
          </div>
        </div>

        {/* Logout Button */}
        <div className="mt-12 flex justify-center w-full">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <div className="w-11 h-11 rounded-2xl bg-red-50 flex items-center justify-center">
              <LogOut
                size={20}
                className="text-red-500 ml-1"
                strokeWidth={2.5}
              />
            </div>
            <span className="text-[15px] font-bold text-red-500">Log Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileIndex;
