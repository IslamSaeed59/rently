import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Star,
  Calendar,
  MessageSquare,
  CheckCircle,
  Clock,
  XCircle,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import { getReceivedRequests, updateRequestStatus, confirmReturn, reportIssue } from "../../server/ProductsApi";

const BookingRequests = () => {
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [stats, setStats] = useState({ pending: 0, earnings: 0 });

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const data = await getReceivedRequests();
      setRequests(data);
      
      // Calculate stats
      const pendingCount = data.filter(r => r.request_status === "pending").length;
      const totalEarnings = data
        .filter(r => r.request_status === "accepted")
        .reduce((sum, r) => sum + parseFloat(r.total_price), 0);
      
      setStats({ pending: pendingCount, earnings: totalEarnings });
    } catch (error) {
      console.error("Error fetching requests:", error);
      toast.error("Failed to load booking requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  useEffect(() => {
    if (activeTab === "all") {
      setFilteredRequests(requests);
    } else {
      setFilteredRequests(requests.filter((r) => r.request_status === activeTab));
    }
  }, [activeTab, requests]);

  const handleStatusUpdate = async (id, status) => {
    try {
      await updateRequestStatus(id, status);
      toast.success(`Request ${status === 'accepted' ? 'approved' : 'declined'} successfully`);
      fetchRequests(); // Refresh the list
    } catch (error) {
      toast.error(error.message || "Failed to update request");
    }
  };

  const handleConfirmReturn = async (rentalId) => {
    try {
      await confirmReturn(rentalId);
      toast.success("Return confirmed! Funds released successfully.");
      fetchRequests();
    } catch (error) {
      toast.error(error.message || "Failed to confirm return");
    }
  };

  const handleReportIssue = async (rentalId) => {
    const reason = window.prompt("Please describe the issue with the returned item:");
    if (!reason) return;

    try {
      await reportIssue(rentalId, reason);
      toast.warning("Issue reported. Rental fee released, deposit held for admin review.");
      fetchRequests();
    } catch (error) {
      toast.error(error.message || "Failed to report issue");
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return (
          <div className="flex items-center gap-1.5 px-2 py-1 bg-yellow-50 text-yellow-600 rounded-full text-[10px] font-bold">
            <Clock size={12} />
            PENDING APPROVAL
          </div>
        );
      case "accepted":
        return (
          <div className="flex items-center gap-1.5 px-2 py-1 bg-green-50 text-green-600 rounded-full text-[10px] font-bold">
            <CheckCircle size={12} />
            APPROVED
          </div>
        );
      case "rejected":
        return (
          <div className="flex items-center gap-1.5 px-2 py-1 bg-red-50 text-red-600 rounded-full text-[10px] font-bold">
            <XCircle size={12} />
            DECLINED
          </div>
        );
      default:
        return null;
    }
  };

  const getPaymentStatusBadge = (request) => {
    if (request.request_status !== "accepted") return null;

    if (request.payment_status === "held_in_escrow") {
      return (
        <div className="flex items-center gap-1.5 px-2 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-bold border border-blue-100">
          <CheckCircle size={12} />
          PAID & IN ESCROW
        </div>
      );
    }

    if (request.payment_status === "released_to_lessor") {
      return (
        <div className="flex items-center gap-1.5 px-2 py-1 bg-purple-50 text-purple-600 rounded-full text-[10px] font-bold border border-purple-100">
          <TrendingUp size={12} />
          FUNDS RELEASED
        </div>
      );
    }

    return (
      <div className="flex items-center gap-1.5 px-2 py-1 bg-orange-50 text-orange-600 rounded-full text-[10px] font-bold border border-orange-100 animate-pulse">
        <Clock size={12} />
        AWAITING PAYMENT
      </div>
    );
  };

  if (loading && requests.length === 0) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#050F2A]/10 border-t-[#050F2A] rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-[1100px] mx-auto px-6 py-10">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-[13px] text-gray-400 font-medium mb-8">
        <Link to="/" className="hover:text-gray-600">Home</Link>
        <span>/</span>
        <Link to="/profile" className="hover:text-gray-600">Profile</Link>
        <span>/</span>
        <span className="text-[#050F2A] font-bold">Booking Requests</span>
      </div>

      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-black text-[#050F2A] mb-2">Booking Requests</h1>
          <p className="text-gray-500 text-[14px] font-medium">Manage incoming rental inquiries for your gear.</p>
        </div>

        <div className="flex gap-4">
          <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-4 flex items-center gap-4 min-w-[160px]">
            <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
              <Clock size={20} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Pending</p>
              <p className="text-xl font-black text-[#050F2A]">{stats.pending}</p>
            </div>
          </div>
          <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-4 flex items-center gap-4 min-w-[160px]">
            <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
              <TrendingUp size={20} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Earnings</p>
              <p className="text-xl font-black text-[#050F2A]">{stats.earnings} EGP</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex bg-white border border-gray-100 p-1 rounded-xl w-fit mb-10">
        {[
          { id: "all", label: "All Requests" },
          { id: "pending", label: "Pending" },
          { id: "accepted", label: "Approved" },
          { id: "rejected", label: "Declined" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-2.5 rounded-lg text-[13px] font-bold transition-all ${
              activeTab === tab.id
                ? "bg-[#050F2A] text-white shadow-md shadow-[#050F2A]/20"
                : "text-gray-500 hover:text-[#050F2A] hover:bg-gray-50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        {filteredRequests.length > 0 ? (
          filteredRequests.map((request) => (
            <div
              key={request.id}
              className="bg-white border border-gray-100 rounded-2xl p-5 flex flex-col lg:flex-row items-center gap-8 hover:border-gray-200 transition-all group"
            >
              {/* Product Info */}
              <div className="flex items-center gap-5 flex-1 w-full">
                <div className="w-24 h-24 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0">
                  <img
                    src={request.primary_image ? (request.primary_image.startsWith('http') ? request.primary_image : `http://localhost:9000${request.primary_image.startsWith('/') ? '' : '/'}${request.primary_image}`) : "https://via.placeholder.com/150"}
                    alt={request.product_name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div>
                  <h3 className="font-bold text-[#050F2A] text-[16px] mb-2">{request.product_name}</h3>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {getStatusBadge(request.request_status)}
                    {getPaymentStatusBadge(request)}
                    <span className="text-[11px] text-gray-400 font-medium self-center">• Requested {new Date(request.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] font-bold text-[#050F2A]">{request.buyer_name}</span>
                    <div className="flex items-center text-yellow-400 gap-0.5">
                      <Star size={12} className="fill-current" />
                      <span className="text-[11px] text-gray-500 font-bold ml-0.5">4.9</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Rental Dates & Times */}
              <div className="flex items-center gap-4 bg-gray-50 px-5 py-3 rounded-xl border border-gray-100 min-w-[240px]">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-purple-600 shadow-sm">
                  <Calendar size={16} />
                </div>
                <div>
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Rental Duration</p>
                  <p className="text-[12px] font-bold text-[#050F2A]">
                    {new Date(request.start_datetime).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                    <span className="mx-1 text-gray-300">@</span>
                    {new Date(request.start_datetime).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                  <p className="text-[12px] font-bold text-[#050F2A]">
                    {new Date(request.end_datetime).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                    <span className="mx-1 text-gray-300">@</span>
                    {new Date(request.end_datetime).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>

              {/* Price & Actions */}
              <div className="flex flex-col sm:flex-row lg:flex-row items-center gap-6 w-full lg:w-auto">
                <div className="text-right flex-shrink-0 min-w-[100px]">
                  <p className="text-2xl font-black text-[#050F2A]">{request.total_price} EGP</p>
                  <p className="text-[11px] text-gray-400 font-medium">Total for rental</p>
                </div>
                
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button className="p-2.5 bg-white border border-gray-100 text-gray-400 rounded-xl hover:text-[#050F2A] hover:border-gray-200 transition-all shadow-sm">
                    <MessageSquare size={20} />
                  </button>
                  
                  {request.request_status === "pending" ? (
                    <>
                      <button 
                        onClick={() => handleStatusUpdate(request.id, 'rejected')}
                        className="px-6 py-2.5 text-gray-500 font-bold text-[13px] hover:text-red-600 transition-colors"
                      >
                        Decline
                      </button>
                      <button 
                        onClick={() => handleStatusUpdate(request.id, 'accepted')}
                        className="px-8 py-2.5 bg-[#050F2A] text-white font-bold text-[13px] rounded-xl hover:opacity-90 transition-all shadow-lg shadow-[#050F2A]/10"
                      >
                        Approve
                      </button>
                    </>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <button className="px-8 py-2.5 bg-gray-100 text-[#050F2A] font-bold text-[13px] rounded-xl hover:bg-gray-200 transition-all min-w-[140px]">
                        Manage Booking
                      </button>
                      {request.payment_status === "held_in_escrow" && (
                        <button 
                          onClick={() => handleConfirmReturn(request.rental_id)}
                          className="px-8 py-2.5 bg-green-600 text-white font-bold text-[13px] rounded-xl hover:bg-green-700 transition-all shadow-lg shadow-green-600/20"
                        >
                          Confirm Return
                        </button>
                      )}
                      {request.payment_status === "held_in_escrow" && (
                        <button 
                          onClick={() => handleReportIssue(request.rental_id)}
                          className="px-8 py-2.5 bg-red-50 text-red-600 font-bold text-[13px] rounded-xl hover:bg-red-100 transition-all"
                        >
                          Report Issue
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white border border-dashed border-gray-200 rounded-3xl p-20 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-6">
              <AlertCircle size={40} />
            </div>
            <h3 className="text-xl font-bold text-[#050F2A] mb-2">No requests found</h3>
            <p className="text-gray-400 max-w-xs mx-auto">There are currently no booking requests matching your filter.</p>
          </div>
        )}
      </div>

      {filteredRequests.length > 0 && (
        <div className="mt-12 flex justify-center">
          <button className="px-10 py-4 bg-[#050F2A] text-white font-bold text-[14px] rounded-2xl hover:opacity-90 transition-all shadow-xl shadow-[#050F2A]/20">
            Load more requests
          </button>
        </div>
      )}
    </div>
  );
};

export default BookingRequests;