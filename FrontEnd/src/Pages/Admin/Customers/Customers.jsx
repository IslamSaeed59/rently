import React, { useState, useEffect } from "react";
import { getAllUsers } from "../../../server/Api";
import { toast } from "react-toastify";
import { 
  Search, 
  Users, 
  Mail, 
  Phone, 
  Calendar, 
  User as UserIcon,
  ShieldCheck,
  ChevronRight,
  MoreVertical
} from "lucide-react";

const Customers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch (error) {
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => 
    `${user.Firstname} ${user.LastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.Email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#050F2A]">Customers</h1>
          <p className="text-gray-500 mt-1">Manage and view all registered users in your system.</p>
        </div>
        <div className="bg-[#A78BFA]/10 text-[#A78BFA] px-6 py-3 rounded-2xl font-bold flex items-center gap-2 border border-[#A78BFA]/20">
          <Users size={20} />
          {users.length} Total Users
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white p-4 rounded-[24px] border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by name, email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-50 border border-gray-50 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#A78BFA]/20 focus:bg-white transition-all font-medium"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-8 py-5 text-sm font-bold text-[#050F2A] uppercase tracking-wider">User Info</th>
                <th className="px-8 py-5 text-sm font-bold text-[#050F2A] uppercase tracking-wider">Contact</th>
                <th className="px-8 py-5 text-sm font-bold text-[#050F2A] uppercase tracking-wider">Role</th>
                <th className="px-8 py-5 text-sm font-bold text-[#050F2A] uppercase tracking-wider">Joined At</th>
                <th className="px-8 py-5 text-sm font-bold text-[#050F2A] uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-8 py-20 text-center text-gray-400 font-medium">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#050F2A] mx-auto mb-4"></div>
                    Loading users...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-8 py-20 text-center text-gray-400 font-medium">
                    No users found matching your search.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400 group-hover:bg-[#A78BFA] group-hover:text-white transition-all">
                          <UserIcon size={20} />
                        </div>
                        <div>
                          <p className="font-bold text-[#050F2A]">{user.Firstname} {user.LastName}</p>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">User ID: #{user.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                          <Mail size={14} className="text-[#A78BFA]" />
                          {user.Email}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <Phone size={14} />
                          {user.PhoneNumber}
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      {user.role === 'admin' ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-bold border border-emerald-100">
                          <ShieldCheck size={14} /> Admin
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-bold border border-gray-200">
                          Customer
                        </span>
                      )}
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                        <Calendar size={14} className="text-[#A78BFA]" />
                        {new Date(user.created_at).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <button className="p-2.5 rounded-xl text-gray-400 hover:text-[#050F2A] hover:bg-white hover:shadow-sm border border-transparent hover:border-gray-100 transition-all">
                        <MoreVertical size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Customers;