import React from "react";
import { Outlet } from "react-router-dom";
import AdminSidbar from "../Pages/Admin/AdminSidbar";

const AdminLayout = () => {
  return (
    <div className="flex bg-[#F8FAFC] min-h-screen">
      {/* Sidebar - Fixed width */}
      <AdminSidbar />

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto h-screen">
        <div className="p-8 max-w-[1600px] mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
