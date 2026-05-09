import React, { useState, useEffect, useCallback } from "react";
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Search, 
  Filter, 
  Phone, 
  Mail, 
  User, 
  Wallet, 
  TrendingUp, 
  ArrowUpRight, 
  MoreHorizontal,
  ChevronRight,
  Download,
  AlertCircle
} from "lucide-react";
import axios from "axios";
import Swal from "sweetalert2";

const AdminWithdrawals = () => {
  const [withdrawals, setWithdrawals] = useState([]);
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const fetchWithdrawals = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:9000/api/payments/admin/withdrawals", {
        params: { status: statusFilter, search: searchQuery },
        headers: { Authorization: `Bearer ${token}` }
      });
      setWithdrawals(res.data.withdrawals || []);
      setStats(res.data.stats || []);
    } catch (error) {
      console.error("Failed to fetch withdrawals", error);
      Swal.fire("Error", "Failed to load withdrawal requests", "error");
    } finally {
      setLoading(false);
    }
  }, [statusFilter, searchQuery]);

  useEffect(() => {
    fetchWithdrawals();
  }, [fetchWithdrawals]);

  const handleApprove = async (id) => {
    const result = await Swal.fire({
      title: 'Approve Withdrawal?',
      text: "Have you transferred the funds to the user's Vodafone Cash?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, Mark as Paid',
      confirmButtonColor: '#10B981',
      cancelButtonColor: '#EF4444',
      background: '#fff',
      customClass: {
        popup: 'rounded-3xl border-0 shadow-2xl',
        confirmButton: 'rounded-xl px-6 py-3 font-bold',
        cancelButton: 'rounded-xl px-6 py-3 font-bold'
      }
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem("token");
        await axios.post(`http://localhost:9000/api/payments/admin/withdrawals/${id}/approve`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        Swal.fire({
          title: "Success",
          text: "Withdrawal marked as approved.",
          icon: "success",
          timer: 2000,
          showConfirmButton: false
        });
        fetchWithdrawals();
      } catch (error) {
        Swal.fire("Error", "Failed to approve withdrawal", "error");
      }
    }
  };

  const handleReject = async (id) => {
    const { value: reason } = await Swal.fire({
      title: 'Reject Withdrawal',
      input: 'text',
      inputLabel: 'Reason for rejection (sent to user)',
      inputPlaceholder: 'e.g. Invalid phone number',
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) {
          return 'You need to provide a reason!'
        }
      },
      customClass: {
        popup: 'rounded-3xl border-0 shadow-2xl',
        input: 'rounded-xl border-gray-200 focus:ring-[#A78BFA] focus:border-[#A78BFA]'
      }
    });

    if (reason) {
      try {
        const token = localStorage.getItem("token");
        await axios.post(`http://localhost:9000/api/payments/admin/withdrawals/${id}/reject`, { admin_notes: reason }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        Swal.fire({
          title: "Rejected",
          text: "Withdrawal rejected and funds refunded.",
          icon: "info",
          timer: 2000,
          showConfirmButton: false
        });
        fetchWithdrawals();
      } catch (error) {
        Swal.fire("Error", "Failed to reject withdrawal", "error");
      }
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return <span className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-1 w-fit"><CheckCircle2 size={12}/> Approved</span>;
      case 'rejected':
        return <span className="px-3 py-1 bg-red-50 text-red-600 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-1 w-fit"><XCircle size={12}/> Rejected</span>;
      default:
        return <span className="px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-1 w-fit"><Clock size={12}/> Pending</span>;
    }
  };

  const statCards = [
    { 
      label: "Pending Payouts", 
      value: stats.find(s => s.status === 'pending')?.count || 0, 
      amount: stats.find(s => s.status === 'pending')?.total_amount || 0,
      icon: Clock, 
      color: "amber",
      bg: "bg-amber-50",
      text: "text-amber-600"
    },
    { 
      label: "Completed", 
      value: stats.find(s => s.status === 'approved')?.count || 0, 
      amount: stats.find(s => s.status === 'approved')?.total_amount || 0,
      icon: CheckCircle2, 
      color: "green",
      bg: "bg-green-50",
      text: "text-green-600"
    },
    { 
      label: "Rejected", 
      value: stats.find(s => s.status === 'rejected')?.count || 0, 
      amount: stats.find(s => s.status === 'rejected')?.total_amount || 0,
      icon: XCircle, 
      color: "red",
      bg: "bg-red-50",
      text: "text-red-600"
    }
  ];

  return (
    <div className="p-4 md:p-8 bg-[#F8FAFC] min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-black text-[#050F2A] tracking-tight flex items-center gap-3">
            <div className="p-3 bg-white rounded-2xl shadow-sm border border-gray-100">
              <Wallet className="text-[#A78BFA]" size={32} />
            </div>
            Withdrawal Requests
          </h1>
          <p className="text-gray-500 mt-2 font-medium">Manage and verify payout requests from lessors</p>
        </div>
        <button className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-5 py-3 rounded-2xl font-bold hover:bg-gray-50 transition-all shadow-sm">
          <Download size={20} />
          Export Reports
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {statCards.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-4 ${stat.bg} ${stat.text} rounded-2xl`}>
                <stat.icon size={24} />
              </div>
              <div className="flex items-center gap-1 text-green-500 bg-green-50 px-2 py-1 rounded-lg text-xs font-bold">
                <TrendingUp size={12} />
                <span>+12%</span>
              </div>
            </div>
            <p className="text-gray-500 font-bold text-sm uppercase tracking-widest">{stat.label}</p>
            <div className="flex items-baseline gap-2 mt-1">
              <h3 className="text-3xl font-black text-gray-900">{stat.value}</h3>
              <span className="text-gray-400 font-bold text-sm">Requests</span>
            </div>
            <p className="text-gray-400 text-sm mt-1 font-medium">Total: <span className="text-gray-900 font-black">{stat.amount} EGP</span></p>
          </div>
        ))}
      </div>

      {/* Filters & Table Section */}
      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl overflow-hidden">
        {/* Toolbar */}
        <div className="p-6 border-b border-gray-50 flex flex-col lg:flex-row gap-6 justify-between items-center bg-white/50 backdrop-blur-xl">
          {/* Status Tabs */}
          <div className="flex bg-gray-100/50 p-1.5 rounded-2xl w-full lg:w-fit">
            {['all', 'pending', 'approved', 'rejected'].map((tab) => (
              <button
                key={tab}
                onClick={() => { setStatusFilter(tab); setActiveTab(tab); }}
                className={`px-6 py-2.5 rounded-xl text-sm font-black transition-all capitalize ${
                  activeTab === tab 
                  ? "bg-white text-[#050F2A] shadow-md scale-105" 
                  : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative w-full lg:w-96 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#A78BFA] transition-colors" size={20} />
            <input 
              type="text"
              placeholder="Search by name, email or phone..."
              className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#A78BFA]/20 transition-all font-medium placeholder:text-gray-400"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-32 flex flex-col items-center justify-center gap-4">
              <div className="w-12 h-12 border-4 border-[#A78BFA] border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-400 font-black animate-pulse">Syncing data...</p>
            </div>
          ) : withdrawals.length === 0 ? (
            <div className="p-32 text-center flex flex-col items-center">
              <div className="w-24 h-24 bg-gray-50 rounded-[2rem] flex items-center justify-center text-gray-200 mb-6 rotate-12 group-hover:rotate-0 transition-transform">
                <AlertCircle size={48} />
              </div>
              <h3 className="text-2xl font-black text-[#050F2A]">No records found</h3>
              <p className="text-gray-400 mt-2 font-medium max-w-xs">We couldn't find any withdrawal requests matching your current filters.</p>
              <button 
                onClick={() => { setStatusFilter("all"); setActiveTab("all"); setSearchQuery(""); }}
                className="mt-6 text-[#A78BFA] font-black hover:underline underline-offset-4"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/30 border-b border-gray-100">
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Lessor Details</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Amount</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Payment Method</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Date & Status</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {withdrawals.map((req) => (
                  <tr key={req.id} className="hover:bg-blue-50/30 transition-all group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-black text-lg shadow-lg shadow-blue-200 group-hover:scale-110 transition-transform">
                          {req.Firstname?.[0]}{req.LastName?.[0]}
                        </div>
                        <div>
                          <p className="font-black text-[#050F2A] text-lg leading-tight">{req.Firstname} {req.LastName}</p>
                          <div className="flex items-center gap-2 mt-1 text-gray-400 text-sm font-medium">
                            <Mail size={12} />
                            {req.Email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="text-xl font-black text-gray-900 leading-none">{req.amount}</span>
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">EGP Currency</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="inline-flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-xl group-hover:bg-white transition-colors border border-transparent group-hover:border-gray-100">
                        <div className="w-8 h-8 rounded-lg bg-[#FF0000]/10 flex items-center justify-center text-[#FF0000]">
                          <Phone size={16} />
                        </div>
                        <div>
                          <p className="text-xs font-black text-gray-400 uppercase tracking-tighter">Vodafone Cash</p>
                          <p className="text-sm font-black text-gray-700 font-mono tracking-wider">{req.account_details}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col gap-2">
                        {getStatusBadge(req.status)}
                        <p className="text-xs text-gray-400 font-bold ml-1">
                          {new Date(req.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </p>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      {req.status === 'pending' ? (
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0 transition-transform duration-300">
                          <button 
                            onClick={() => handleApprove(req.id)}
                            className="bg-green-500 text-white p-3 rounded-xl shadow-lg shadow-green-100 hover:bg-green-600 transition-all hover:scale-110 active:scale-95"
                            title="Approve & Pay"
                          >
                            <CheckCircle2 size={20} />
                          </button>
                          <button 
                            onClick={() => handleReject(req.id)}
                            className="bg-red-500 text-white p-3 rounded-xl shadow-lg shadow-red-100 hover:bg-red-600 transition-all hover:scale-110 active:scale-95"
                            title="Reject Request"
                          >
                            <XCircle size={20} />
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-1">
                           <p className="text-[10px] font-black text-gray-300 uppercase italic">Admin Logged</p>
                           {req.admin_notes && (
                             <p className="text-xs text-gray-400 truncate max-w-[150px] font-medium" title={req.admin_notes}>
                               "{req.admin_notes}"
                             </p>
                           )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination Placeholder */}
        <div className="p-6 bg-gray-50/50 border-t border-gray-100 flex justify-between items-center">
          <p className="text-sm text-gray-500 font-medium italic">Showing {withdrawals.length} transaction entries</p>
          <div className="flex gap-2">
             <button className="p-2 rounded-lg bg-white border border-gray-200 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50" disabled>
               <MoreHorizontal size={20} />
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminWithdrawals;
