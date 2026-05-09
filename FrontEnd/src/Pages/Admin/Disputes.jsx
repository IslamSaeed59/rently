import React, { useState, useEffect } from "react";
import { 
  AlertTriangle, 
  CheckCircle, 
  User, 
  ShieldAlert,
  ArrowRightLeft,
  Info,
  History,
  Clock,
  ExternalLink,
  ChevronRight,
  Filter
} from "lucide-react";
import { getAllRequests, resolveDispute } from "../../server/ProductsApi";
import Swal from "sweetalert2";

const AdminDisputes = () => {
  const [allDisputes, setAllDisputes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("active"); // "active" or "history"
  const [selectedDispute, setSelectedDispute] = useState(null);
  const [resolution, setResolution] = useState({
    amountToSeller: 0,
    amountToBuyer: 0,
    adminNotes: ""
  });

  const fetchDisputes = async () => {
    try {
      setLoading(true);
      const data = await getAllRequests();
      // Filter for rentals with dispute_status
      const disputesData = data.filter(r => r.dispute_status && r.dispute_status !== "none");
      setAllDisputes(disputesData);
    } catch (error) {
      console.error("Error fetching disputes:", error);
      Swal.fire({
        icon: 'error',
        title: 'Fetch Failed',
        text: 'Failed to load dispute data.',
        confirmButtonColor: '#050F2A'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDisputes();
  }, []);

  const filteredDisputes = allDisputes.filter(d => 
    activeTab === "active" 
      ? d.dispute_status === "pending_resolution" 
      : d.dispute_status === "resolved"
  );

  const stats = {
    active: allDisputes.filter(d => d.dispute_status === "pending_resolution").length,
    resolved: allDisputes.filter(d => d.dispute_status === "resolved").length
  };

  const handleSelectDispute = (dispute) => {
    if (activeTab === "history") return; // History items are view-only or handled differently
    setSelectedDispute(dispute);
    setResolution({
      amountToSeller: 0,
      amountToBuyer: parseFloat(dispute.deposit_paid || 0),
      adminNotes: ""
    });
  };

  const handleResolve = async () => {
    if (!selectedDispute) return;
    
    const totalDeposit = parseFloat(selectedDispute.deposit_paid || 0);
    const sum = parseFloat(resolution.amountToSeller) + parseFloat(resolution.amountToBuyer);
    
    if (Math.abs(sum - totalDeposit) > 0.01) {
      Swal.fire({
        icon: 'warning',
        title: 'Amount Mismatch',
        text: `Total (${sum} EGP) must equal deposit (${totalDeposit} EGP).`,
        confirmButtonColor: '#050F2A'
      });
      return;
    }

    const confirm = await Swal.fire({
      title: 'Resolve Dispute?',
      text: 'This will release the funds as specified. This action is final.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#050F2A',
      confirmButtonText: 'Confirm & Release'
    });

    if (confirm.isConfirmed) {
      try {
        await resolveDispute({
          rental_id: selectedDispute.rental_id,
          amountToSeller: parseFloat(resolution.amountToSeller),
          amountToBuyer: parseFloat(resolution.amountToBuyer),
          adminNotes: resolution.adminNotes
        });
        Swal.fire({
          icon: 'success',
          title: 'Resolved!',
          text: 'Dispute has been resolved and funds released.',
          confirmButtonColor: '#050F2A'
        });
        setSelectedDispute(null);
        fetchDisputes();
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.message || 'Failed to resolve dispute',
          confirmButtonColor: '#050F2A'
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 md:p-8">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto mb-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 bg-red-500 rounded-2xl shadow-lg shadow-red-500/20">
                <ShieldAlert className="text-white" size={24} />
              </div>
              <h1 className="text-3xl font-black text-[#050F2A] tracking-tight">Dispute Resolution</h1>
            </div>
            <p className="text-gray-500 font-medium ml-1">Manage escrow conflicts and security deposit distributions.</p>
          </div>

          {/* Stats Bar */}
          <div className="flex gap-4">
            <div className="bg-white px-6 py-3 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Active</p>
                <p className="text-xl font-black text-[#050F2A] leading-none">{stats.active}</p>
              </div>
            </div>
            <div className="bg-white px-6 py-3 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Resolved</p>
                <p className="text-xl font-black text-[#050F2A] leading-none">{stats.resolved}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mt-8 p-1.5 bg-gray-100/50 rounded-2xl w-fit">
          <button 
            onClick={() => { setActiveTab("active"); setSelectedDispute(null); }}
            className={`px-8 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
              activeTab === "active" 
                ? "bg-white text-[#050F2A] shadow-sm" 
                : "text-gray-500 hover:text-[#050F2A]"
            }`}
          >
            <AlertTriangle size={18} />
            Active Disputes
          </button>
          <button 
            onClick={() => { setActiveTab("history"); setSelectedDispute(null); }}
            className={`px-8 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
              activeTab === "history" 
                ? "bg-white text-[#050F2A] shadow-sm" 
                : "text-gray-500 hover:text-[#050F2A]"
            }`}
          >
            <History size={18} />
            History
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* List Section */}
        <div className={`${activeTab === "active" ? "lg:col-span-8" : "lg:col-span-12"} space-y-4`}>
          {loading ? (
            <div className="bg-white/50 backdrop-blur-xl p-20 rounded-[2.5rem] border border-gray-100 flex flex-col items-center justify-center">
              <div className="w-12 h-12 border-4 border-[#050F2A]/10 border-t-[#A78BFA] rounded-full animate-spin mb-4"></div>
              <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Loading records...</p>
            </div>
          ) : filteredDisputes.length > 0 ? (
            <div className={activeTab === "history" ? "grid grid-cols-1 md:grid-cols-2 gap-4" : "space-y-4"}>
              {filteredDisputes.map((dispute) => (
                <div 
                  key={dispute.id}
                  onClick={() => handleSelectDispute(dispute)}
                  className={`group relative bg-white border p-6 rounded-[2rem] transition-all duration-300 ${
                    activeTab === "active" ? "cursor-pointer hover:shadow-2xl hover:border-[#A78BFA]/30" : "cursor-default"
                  } ${
                    selectedDispute?.id === dispute.id ? "border-[#A78BFA] shadow-xl ring-1 ring-[#A78BFA]/20" : "border-gray-100 shadow-sm"
                  }`}
                >
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 duration-500 ${
                        activeTab === "active" ? "bg-red-50 text-red-500" : "bg-emerald-50 text-emerald-500"
                      }`}>
                        {activeTab === "active" ? <AlertTriangle size={28} /> : <CheckCircle size={28} />}
                      </div>
                      <div>
                        <h3 className="font-black text-[#050F2A] text-lg leading-tight">{dispute.product_name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] font-black text-[#A78BFA] bg-[#A78BFA]/10 px-2 py-0.5 rounded-md uppercase">
                            Rental ID: #{dispute.rental_id}
                          </span>
                          <span className="text-[10px] font-medium text-gray-400 flex items-center gap-1">
                            <Clock size={10} />
                            {new Date(dispute.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-black text-[#050F2A]">{dispute.deposit_paid} <span className="text-sm font-bold text-gray-400">EGP</span></p>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Security Deposit</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-gray-50/80 p-4 rounded-2xl border border-gray-100/50">
                      <div className="flex items-center gap-2 mb-2">
                        <User size={14} className="text-[#A78BFA]" />
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Seller (Plaintiff)</p>
                      </div>
                      <p className="text-sm font-black text-[#050F2A]">{dispute.seller_name}</p>
                    </div>
                    <div className="bg-gray-50/80 p-4 rounded-2xl border border-gray-100/50">
                      <div className="flex items-center gap-2 mb-2">
                        <User size={14} className="text-[#A78BFA]" />
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Buyer</p>
                      </div>
                      <p className="text-sm font-black text-[#050F2A]">{dispute.buyer_name}</p>
                    </div>
                  </div>

                  <div className={`p-5 rounded-2xl border transition-colors ${
                    activeTab === "active" 
                      ? "bg-red-50/30 border-red-100/50 group-hover:bg-red-50/50" 
                      : "bg-emerald-50/30 border-emerald-100/50"
                  }`}>
                    <p className={`text-[11px] font-black uppercase mb-2 flex items-center gap-2 ${
                      activeTab === "active" ? "text-red-500" : "text-emerald-600"
                    }`}>
                      <Info size={14} />
                      {activeTab === "active" ? "Reason for Dispute / سبب الخلاف" : "Resolution Outcome / نتيجة الحل"}
                    </p>
                    <p className={`text-sm font-medium leading-relaxed italic ${
                      activeTab === "active" ? "text-red-900" : "text-emerald-900"
                    }`}>
                      "{activeTab === "active" ? dispute.dispute_reason : dispute.notes?.split('\n').pop() || "Resolved by admin"}"
                    </p>
                    {activeTab === "history" && (
                      <div className="mt-4 pt-4 border-t border-emerald-100/50 flex gap-6">
                        <div>
                          <p className="text-[9px] font-bold text-gray-400 uppercase">To Seller</p>
                          <p className="text-sm font-black text-emerald-700">{dispute.seller_award || 0} EGP</p>
                        </div>
                        <div>
                          <p className="text-[9px] font-bold text-gray-400 uppercase">To Buyer</p>
                          <p className="text-sm font-black text-emerald-700">{dispute.buyer_refund || 0} EGP</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white border border-dashed border-gray-200 rounded-[3rem] p-24 text-center">
              <div className="w-24 h-24 bg-gray-50 text-gray-300 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShieldAlert size={48} />
              </div>
              <h3 className="text-2xl font-black text-[#050F2A] mb-2">No Disputes Found</h3>
              <p className="text-gray-400 font-medium">Everything seems to be running smoothly.</p>
            </div>
          )}
        </div>

        {/* Resolution Panel Section */}
        {activeTab === "active" && (
          <div className="lg:col-span-4">
            <div className="bg-[#050F2A] text-white p-8 md:p-10 rounded-[3rem] shadow-2xl shadow-[#050F2A]/30 sticky top-8 overflow-hidden relative group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 transition-transform group-hover:scale-110 duration-1000"></div>
              
              <h2 className="text-2xl font-black mb-8 flex items-center gap-3 relative z-10">
                <ArrowRightLeft className="text-[#A78BFA]" size={28} />
                Resolution Panel
              </h2>

              {selectedDispute ? (
                <div className="space-y-8 relative z-10">
                  <div className="bg-white/5 p-6 rounded-3xl border border-white/10">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total Available Escrow</p>
                    <p className="text-3xl font-black text-white">{selectedDispute.deposit_paid} <span className="text-sm text-gray-400">EGP</span></p>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="text-[11px] font-black text-[#A78BFA] uppercase tracking-[0.2em] mb-3 block">
                        Refund to Buyer / استرداد للمشتري
                      </label>
                      <div className="relative group/input">
                        <input 
                          type="number"
                          value={resolution.amountToBuyer}
                          onChange={(e) => {
                            const val = e.target.value;
                            setResolution({
                              ...resolution, 
                              amountToBuyer: val,
                              amountToSeller: (parseFloat(selectedDispute.deposit_paid) - parseFloat(val || 0)).toFixed(2)
                            });
                          }}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-8 text-white font-black text-xl focus:outline-none focus:border-[#A78BFA]/50 focus:bg-white/10 transition-all"
                        />
                        <span className="absolute right-8 top-5 font-black text-white/20">EGP</span>
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-black text-[#A78BFA] uppercase tracking-[0.2em] mb-3 block">
                        Award to Seller / تعويض للبائع
                      </label>
                      <div className="relative group/input">
                        <input 
                          type="number"
                          value={resolution.amountToSeller}
                          onChange={(e) => {
                            const val = e.target.value;
                            setResolution({
                              ...resolution, 
                              amountToSeller: val,
                              amountToBuyer: (parseFloat(selectedDispute.deposit_paid) - parseFloat(val || 0)).toFixed(2)
                            });
                          }}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-8 text-white font-black text-xl focus:outline-none focus:border-[#A78BFA]/50 focus:bg-white/10 transition-all"
                        />
                        <span className="absolute right-8 top-5 font-black text-white/20">EGP</span>
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-black text-[#A78BFA] uppercase tracking-[0.2em] mb-3 block">
                        Admin Notes / ملاحظات الإدارة
                      </label>
                      <textarea 
                        placeholder="State the reason for this distribution..."
                        value={resolution.adminNotes}
                        onChange={(e) => setResolution({...resolution, adminNotes: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-3xl py-5 px-8 text-white text-sm focus:outline-none focus:border-[#A78BFA]/50 focus:bg-white/10 transition-all h-32 resize-none"
                      />
                    </div>
                  </div>

                  <button 
                    onClick={handleResolve}
                    className="w-full bg-white text-[#050F2A] font-black py-6 rounded-[1.5rem] hover:bg-[#A78BFA] hover:text-white transition-all duration-500 shadow-xl active:scale-95 flex items-center justify-center gap-3 group/btn"
                  >
                    Release Funds & Resolve
                    <ChevronRight className="group-hover:translate-x-1 transition-transform" size={20} />
                  </button>
                </div>
              ) : (
                <div className="text-center py-24 relative z-10">
                  <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Filter size={32} className="text-white/20" />
                  </div>
                  <p className="text-white/40 font-bold uppercase tracking-widest text-xs">Select a dispute</p>
                  <p className="text-white/60 mt-2">Pick an item from the list to begin the resolution process.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDisputes;
