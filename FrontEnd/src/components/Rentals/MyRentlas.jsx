import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Search, 
  Calendar, 
  Clock, 
  ChevronDown, 
  Trash2, 
  ArrowRight,
  Filter,
  Package,
  AlertCircle,
  Timer,
  CheckCircle2,
  XCircle,
  History
} from "lucide-react";
import { toast } from "react-toastify";
import { getMyRequests, updateRequestStatus } from "../../server/ProductsApi";
import { getAllCategories } from "../../server/Api";

const MyRentals = () => {
  const [rentals, setRentals] = useState([]);
  const [categories, setCategories] = useState(["ALL"]);
  const [filteredRentals, setFilteredRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [sortBy, setSortBy] = useState("latest");
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    fetchInitialData();
    const interval = setInterval(fetchRentals, 5000); // Background refresh every 5s
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    applyFilters();
  }, [rentals, searchQuery, selectedCategory, sortBy, activeTab]);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [requestsData, categoriesData] = await Promise.all([
        getMyRequests(),
        getAllCategories()
      ]);
      setRentals(requestsData);
      
      // Get all main categories (no parent_id)
      const mainCats = categoriesData.filter(c => !c.parent_id);
      setCategories([{ id: "ALL", name: "All Products" }, ...mainCats]);
    } catch (error) {
      console.error("Fetch initial data error:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRentals = async () => {
    try {
      const data = await getMyRequests();
      setRentals(data);
    } catch (error) {
      console.error("Fetch rentals error:", error);
    }
  };

  const getRentalStatus = (rental) => {
    const status = rental.request_status;
    if (status === "pending") return { label: "Pending Approval", color: "amber", icon: <Timer size={14} /> };
    if (status === "rejected") return { label: "Declined", color: "red", icon: <XCircle size={14} /> };
    if (status === "cancelled_by_buyer") return { label: "Cancelled", color: "gray", icon: <XCircle size={14} /> };
    
    if (status === "accepted") {
      const now = new Date();
      const start = new Date(rental.start_datetime);
      const end = new Date(rental.end_datetime);

      if (now < start) return { label: "Starting Soon", color: "blue", icon: <Calendar size={14} /> };
      if (now >= start && now <= end) return { label: "Active Now", color: "green", icon: <CheckCircle2 size={14} /> };
      if (now > end) return { label: "Completed", color: "purple", icon: <History size={14} /> };
    }
    return { label: status, color: "gray", icon: null };
  };

  const calculateTimeDisplay = (rental) => {
    const now = new Date();
    const start = new Date(rental.start_datetime);
    const end = new Date(rental.end_datetime);

    if (rental.request_status !== "accepted") return null;

    if (now < start) {
      const diff = start - now;
      return { text: `Starts in ${formatTimeDiff(diff)}`, subtext: "Preparation Phase", progress: 0 };
    }
    
    if (now >= start && now <= end) {
      const total = end - start;
      const elapsed = now - start;
      const remaining = end - now;
      const percentage = Math.max(2, Math.min(100, Math.round((elapsed / total) * 100)));
      return { text: `${formatTimeDiff(remaining)} left`, subtext: "Return on " + end.toLocaleDateString(), progress: percentage };
    }

    return { text: "Rental Ended", subtext: "Please leave a review", progress: 100 };
  };

  const formatTimeDiff = (ms) => {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    if (days > 0) return `${days}d ${hours % 24}h`;
    const mins = Math.floor((ms / (1000 * 60)) % 60);
    return `${hours}h ${mins}m`;
  };

  const applyFilters = () => {
    let result = [...rentals];

    // Tab Filter
    if (activeTab === "active") {
      result = result.filter(r => {
        const status = getRentalStatus(r);
        return status.label === "Active Now" || status.label === "Starting Soon";
      });
    } else if (activeTab === "pending") {
      result = result.filter(r => r.request_status === "pending");
    } else if (activeTab === "history") {
      result = result.filter(r => r.request_status === "rejected" || r.request_status === "cancelled_by_buyer" || (r.request_status === "accepted" && new Date() > new Date(r.end_datetime)));
    }

    // Category Filter
    if (selectedCategory !== "ALL") {
      result = result.filter(r => r.category_id?.toString() === selectedCategory.toString());
    }

    // Search Filter
    if (searchQuery) {
      result = result.filter(r => 
        r.product_name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sorting
    if (sortBy === "latest") result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    else if (sortBy === "price-low") result.sort((a, b) => a.total_price - b.total_price);
    else if (sortBy === "price-high") result.sort((a, b) => b.total_price - a.total_price);

    setFilteredRentals(result);
  };

  const handleCancelRequest = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this request?")) return;
    try {
      await updateRequestStatus(id, "cancelled_by_buyer");
      toast.success("Request cancelled");
      fetchRentals();
    } catch (error) {
      toast.error("Error cancelling request");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
            <Package className="text-gray-300" size={32} />
          </div>
          <div className="h-4 w-32 bg-gray-100 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFDFD] pb-20">
      {/* Premium Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-30">
        <div className="max-w-[1400px] mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-[11px] text-gray-400 font-bold uppercase tracking-widest mb-3">
                <Link to="/" className="hover:text-black">Marketplace</Link>
                <ArrowRight size={10} />
                <span className="text-gray-900">My Rentals</span>
              </div>
              <h1 className="text-4xl font-black text-[#050F2A] tracking-tight">My Rentals</h1>
            </div>

            <div className="flex items-center gap-4 flex-1 max-w-2xl">
              <div className="relative flex-1 group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#050F2A] transition-colors" size={20} />
                <input
                  type="text"
                  placeholder="Search by product name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 pr-4 text-[15px] focus:bg-white focus:ring-4 focus:ring-[#050F2A]/5 transition-all outline-none"
                />
              </div>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-white border border-gray-100 text-[#050F2A] px-6 py-4 pr-12 rounded-2xl text-sm font-bold outline-none cursor-pointer hover:bg-gray-50 transition-all"
                >
                  <option value="latest">Sort: Newest</option>
                  <option value="price-low">Price: Lowest</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              </div>
            </div>
          </div>

          {/* Sub-tabs */}
          <div className="flex items-center gap-8 mt-10">
            {['all', 'active', 'pending', 'history'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative pb-4 text-sm font-bold transition-all ${activeTab === tab ? 'text-[#050F2A]' : 'text-gray-400 hover:text-gray-600'}`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-[#050F2A] rounded-full"></div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 mt-10">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Enhanced Sidebar */}
          <div className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm sticky top-44">
              <h3 className="text-[12px] font-black text-gray-400 uppercase tracking-widest mb-6">Filter by Category</h3>
              <div className="flex flex-col gap-4">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`flex items-center justify-between group transition-all ${selectedCategory.toString() === cat.id.toString() ? 'text-[#050F2A]' : 'text-gray-500 hover:text-gray-900'}`}
                  >
                    <span className="text-[14px] font-bold">{cat.name || cat}</span>
                    <div className={`w-2 h-2 rounded-full transition-all ${selectedCategory.toString() === cat.id.toString() ? 'bg-[#050F2A] scale-150' : 'bg-gray-100 group-hover:bg-gray-300'}`}></div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Grid Area */}
          <div className="flex-1">
            {filteredRentals.length === 0 ? (
              <div className="bg-white rounded-[3rem] p-24 flex flex-col items-center text-center border border-gray-100 shadow-sm">
                <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center text-gray-200 mb-8">
                  <Package size={48} strokeWidth={1.5} />
                </div>
                <h2 className="text-2xl font-black text-[#050F2A] mb-4 text-balance">Your rental list is empty</h2>
                <p className="text-gray-400 max-w-sm mb-10 leading-relaxed text-[15px]">
                  You haven't made any requests in this category yet. Start exploring the marketplace!
                </p>
                <Link to="/" className="bg-[#050F2A] text-white px-10 py-4 rounded-2xl font-bold hover:scale-105 transition-transform shadow-xl shadow-[#050F2A]/20">
                  Explore Products
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {filteredRentals.map((rental) => {
                  const status = getRentalStatus(rental);
                  const timeInfo = calculateTimeDisplay(rental);
                  
                  return (
                    <div key={rental.id} className="bg-white rounded-[2rem] border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(5,15,42,0.1)] transition-all duration-700 group flex flex-col overflow-hidden h-full">
                      {/* Image Section with Overlay Status */}
                      <div className="relative h-64 w-full overflow-hidden bg-[#F8FAFC]">
                        <img
                          src={rental.primary_image ? (rental.primary_image.startsWith('http') ? rental.primary_image : `http://localhost:9000${rental.primary_image.startsWith('/') ? '' : '/'}${rental.primary_image}`) : "https://via.placeholder.com/400"}
                          alt={rental.product_name}
                          className="w-full h-full object-contain p-6 group-hover:scale-105 transition-transform duration-700"
                        />
                        
                        {/* Floating Status Badge */}
                        <div className="absolute top-4 left-4 z-10">
                          <div className={`backdrop-blur-md px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-sm border ${
                            status.color === 'amber' ? 'bg-amber-500/10 border-amber-500/20 text-amber-600' :
                            status.color === 'blue' ? 'bg-blue-500/10 border-blue-500/20 text-blue-600' :
                            status.color === 'green' ? 'bg-green-500/10 border-green-500/20 text-green-600' :
                            status.color === 'red' ? 'bg-red-500/10 border-red-500/20 text-red-600' :
                            'bg-gray-500/10 border-gray-500/20 text-gray-600'
                          }`}>
                            <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${
                              status.color === 'amber' ? 'bg-amber-500' :
                              status.color === 'blue' ? 'bg-blue-500' :
                              status.color === 'green' ? 'bg-green-500' :
                              status.color === 'red' ? 'bg-red-500' : 'bg-gray-500'
                            }`}></div>
                            {status.label}
                          </div>
                        </div>

                        {rental.request_status === "pending" && (
                          <button
                            onClick={() => handleCancelRequest(rental.id)}
                            className="absolute top-4 right-4 p-2.5 bg-white/80 backdrop-blur text-red-500 rounded-full shadow-lg hover:bg-red-500 hover:text-white transition-all transform hover:rotate-90"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}

                        {/* Glassy Timer Overlay at bottom of image */}
                        {timeInfo && (
                          <div className="absolute bottom-0 left-0 right-0 backdrop-blur-xl bg-white/40 border-t border-white/50 p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-[#050F2A] flex items-center justify-center text-white">
                                <Clock size={14} />
                              </div>
                              <div>
                                <p className="text-[11px] font-black text-[#050F2A] uppercase leading-none mb-1">{timeInfo.text}</p>
                                <p className="text-[9px] font-bold text-gray-500 uppercase tracking-tighter">{timeInfo.subtext}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="text-[12px] font-black text-[#050F2A]">{timeInfo.progress}%</span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Content Section */}
                      <div className="p-6 flex flex-col flex-1">
                        <div className="mb-4">
                          <h3 className="text-lg font-black text-[#050F2A] mb-1 line-clamp-1 group-hover:text-blue-600 transition-colors">
                            {rental.product_name}
                          </h3>
                          <div className="flex items-center gap-2">
                            <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-400">S</div>
                            <span className="text-[12px] text-gray-500 font-bold">{rental.seller_name || "Premium Seller"}</span>
                          </div>
                        </div>

                        {/* Slim Progress Bar */}
                        {timeInfo && (
                          <div className="mb-6">
                            <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                              <div 
                                className={`h-full transition-all duration-1000 ease-out ${
                                  status.color === 'green' ? 'bg-gradient-to-r from-green-400 to-green-600' : 
                                  'bg-gradient-to-r from-blue-400 to-blue-600'
                                }`}
                                style={{ width: `${timeInfo.progress}%` }}
                              ></div>
                            </div>
                          </div>
                        )}

                        {/* Date Timeline Style */}
                        <div className="flex items-center gap-4 bg-[#F8FAFC] rounded-2xl p-4 mb-6 relative">
                          <div className="flex flex-col items-center gap-1 relative z-10">
                            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                            <div className="w-0.5 h-6 border-l-2 border-dashed border-gray-200"></div>
                            <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                          </div>
                          <div className="flex-1 flex flex-col gap-3">
                            <div className="flex justify-between items-center">
                              <span className="text-[11px] font-bold text-[#050F2A]">
                                {new Date(rental.start_datetime).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                                <span className="text-gray-400 font-medium ml-2">@ {new Date(rental.start_datetime).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</span>
                              </span>
                              <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Start</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-[11px] font-bold text-[#050F2A]">
                                {new Date(rental.end_datetime).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                                <span className="text-gray-400 font-medium ml-2">@ {new Date(rental.end_datetime).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</span>
                              </span>
                              <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">End</span>
                            </div>
                          </div>
                        </div>

                        {/* Price & Primary Action */}
                        <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                          <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Total Paid</p>
                            <p className="text-xl font-black text-[#050F2A]">{rental.total_price} <span className="text-[10px]">EGP</span></p>
                          </div>
                          <Link 
                            to={`/product/${rental.product_id}`}
                            className="bg-[#050F2A] text-white px-5 py-3 rounded-xl font-bold text-xs hover:bg-blue-600 transition-all flex items-center gap-2 group/btn"
                          >
                            Details
                            <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyRentals;
