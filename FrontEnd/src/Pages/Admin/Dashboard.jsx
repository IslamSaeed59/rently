import React, { useState, useEffect } from "react";
import { 
  Package, 
  Users, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight, 
  DollarSign,
  ShoppingCart,
  MapPin,
  ArrowRight,
  Loader2,
  Calendar,
  Zap
} from "lucide-react";
import { Link } from "react-router-dom";
import { getDashboardStats } from "../../server/AdminApi";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';

const Dashboard = () => {
  const [stats, setStats] = useState([]);
  const [recentProducts, setRecentProducts] = useState([]);
  const [latestUsers, setLatestUsers] = useState([]);
  const [topCategories, setTopCategories] = useState([]);
  const [userStatus, setUserStatus] = useState(null);
  const [charts, setCharts] = useState({ revenue: [], users: [] });
  const [loading, setLoading] = useState(true);

  const getIcon = (name) => {
    switch(name) {
      case "Platform Fees (10%)": return DollarSign;
      case "Accepted Volume": return TrendingUp;
      case "Total Products": return Package;
      case "Total Users": return Users;
      case "Pending Requests": return ShoppingCart;
      default: return TrendingUp;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getDashboardStats();
        setStats(data.stats);
        setRecentProducts(data.recentProducts);
        setLatestUsers(data.latestUsers);
        setTopCategories(data.topCategories);
        setUserStatus(data.userStatus);
        setCharts(data.charts || { revenue: [], users: [] });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-12 h-12 animate-spin text-[#050F2A]" />
        <p className="text-gray-500 font-bold">Loading dashboard data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-10 px-2">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-[#050F2A] tracking-tight">Dashboard Overview</h1>
          <p className="text-gray-500 mt-1 font-medium">Analytics and platform performance at a glance.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-500 bg-white px-4 py-2.5 rounded-2xl border border-gray-100 shadow-sm">
            <Calendar size={14} className="text-indigo-500" />
            {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 bg-emerald-50 px-4 py-2.5 rounded-2xl border border-emerald-100 shadow-sm">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            LIVE
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = getIcon(stat.name);
          return (
            <div key={stat.name} className="group bg-white p-7 rounded-[35px] border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-center justify-between mb-5">
                <div className="p-3.5 bg-[#050F2A] rounded-[20px] text-white group-hover:scale-110 transition-transform shadow-lg shadow-gray-200">
                  <Icon size={20} />
                </div>
                <div className={`flex items-center gap-1 text-[10px] font-black ${stat.isUp ? "text-emerald-500" : "text-rose-500"} bg-${stat.isUp ? 'emerald' : 'rose'}-50 px-3 py-1 rounded-full border border-${stat.isUp ? 'emerald' : 'rose'}-100`}>
                  {stat.isUp ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                  {stat.trend}
                </div>
              </div>
              <p className="text-gray-400 text-[11px] font-bold uppercase tracking-widest">{stat.name}</p>
              <h3 className="text-3xl font-black text-[#050F2A] mt-1 tracking-tight">{stat.value}</h3>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue Chart */}
        <div className="bg-white p-8 rounded-[45px] border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-black text-[#050F2A] tracking-tight">Revenue Trend</h2>
              <p className="text-sm text-gray-400 font-bold uppercase tracking-wide mt-1">Growth (Last 14 days)</p>
            </div>
            <div className="p-3.5 bg-indigo-50 text-indigo-600 rounded-[20px]">
              <TrendingUp size={20} />
            </div>
          </div>
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={charts.revenue}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="label" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 700}}
                  dy={15}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 700}}
                />
                <Tooltip 
                  contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '15px'}}
                  cursor={{stroke: '#6366f1', strokeWidth: 2}}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#6366f1" 
                  strokeWidth={5}
                  fillOpacity={1} 
                  fill="url(#colorRevenue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* User Growth Chart */}
        <div className="bg-white p-8 rounded-[45px] border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-black text-[#050F2A] tracking-tight">New Signups</h2>
              <p className="text-sm text-gray-400 font-bold uppercase tracking-wide mt-1">Platform Activity</p>
            </div>
            <div className="p-3.5 bg-emerald-50 text-emerald-600 rounded-[20px]">
              <Zap size={20} />
            </div>
          </div>
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={charts.users}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="label" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 700}}
                  dy={15}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 700}}
                />
                <Tooltip 
                  contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '15px'}}
                />
                <Line 
                  type="stepAfter" 
                  dataKey="value" 
                  stroke="#10b981" 
                  strokeWidth={5}
                  dot={{ r: 6, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 8, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Products */}
        <div className="lg:col-span-2 bg-white rounded-[45px] p-10 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-xl shadow-indigo-100">
                <Package size={28} />
              </div>
              <div>
                <h2 className="text-2xl font-black text-[#050F2A] tracking-tight">Recent Inventory</h2>
                <p className="text-sm text-gray-400 font-bold uppercase tracking-wider">Latest product listings</p>
              </div>
            </div>
            <Link to="/admin/products" className="bg-gray-50 hover:bg-[#050F2A] hover:text-white text-[#050F2A] font-black text-[11px] uppercase tracking-widest px-6 py-3.5 rounded-2xl transition-all duration-300 flex items-center gap-2">
              Explore All <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {recentProducts.length > 0 ? (
              recentProducts.map((product) => (
                <div key={product.id} className="group flex gap-6 p-6 rounded-[35px] border border-gray-50 hover:border-indigo-100 hover:bg-indigo-50/20 transition-all duration-300">
                  <div className="w-28 h-28 rounded-[25px] overflow-hidden shrink-0 shadow-lg group-hover:rotate-2 transition-transform duration-500">
                    <img 
                      src={product.primary_image ? (product.primary_image.startsWith('http') ? product.primary_image : `http://localhost:9000${product.primary_image}`) : "https://via.placeholder.com/150"} 
                      alt={product.name} 
                      className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-700" 
                    />
                  </div>
                  <div className="flex flex-col justify-between py-1 min-w-0">
                    <div>
                      <h3 className="font-black text-[#050F2A] line-clamp-1 text-lg tracking-tight">{product.name}</h3>
                      <p className="text-[11px] text-indigo-400 font-black flex items-center gap-1.5 mt-2 uppercase tracking-widest">
                        <MapPin size={12} /> {product.location || "Egypt"}
                      </p>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <div className="bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm">
                        <span className="font-black text-[#050F2A] text-sm tracking-tight">EGP {product.price_per_day || product.price}</span>
                      </div>
                      <div className="text-[10px] font-black text-gray-400 uppercase truncate ml-2">
                         {product.seller_name}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-2 py-12 text-center text-gray-400 font-black uppercase tracking-widest text-xs">No products found.</div>
            )}
          </div>
        </div>

        {/* Latest Users */}
        <div className="bg-white rounded-[45px] p-10 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-xl font-black text-[#050F2A] tracking-tight">New Members</h2>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Recent Signups</p>
            </div>
            <Link to="/admin/customers" className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 hover:text-[#050F2A] hover:bg-gray-100 transition-all shadow-sm">
              <ArrowRight size={22} />
            </Link>
          </div>
          <div className="space-y-6">
            {latestUsers.map((u) => (
              <div key={u.id} className="flex items-center gap-5 p-4 hover:bg-indigo-50/30 rounded-[30px] transition-all group cursor-pointer border border-transparent hover:border-indigo-100">
                <div className="relative">
                  <div className="w-16 h-16 rounded-[22px] bg-gray-50 flex-shrink-0 flex items-center justify-center overflow-hidden border-4 border-white shadow-md group-hover:scale-105 transition-transform">
                    {u.profile_image ? (
                      <img src={u.profile_image.startsWith('http') ? u.profile_image : `http://localhost:9000${u.profile_image}`} className="w-full h-full object-cover" />
                    ) : (
                      <Users size={28} className="text-gray-200" />
                    )}
                  </div>
                  {u.is_verified ? (
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full border-4 border-white flex items-center justify-center shadow-md">
                      <Zap size={10} className="text-white fill-white" />
                    </div>
                  ) : null}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-black text-[#050F2A] text-[15px] truncate tracking-tight">{u.Firstname} {u.LastName}</h4>
                  <p className="text-[11px] text-gray-400 font-bold truncate mt-0.5">{u.Email}</p>
                </div>
                <div className="text-[10px] font-black text-indigo-300 uppercase tracking-tighter bg-indigo-50 px-2 py-1 rounded-lg">
                  {new Date(u.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Platform Insights Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         {/* Categories */}
         <div className="bg-white rounded-[45px] p-10 border border-gray-100 shadow-sm overflow-hidden">
            <h2 className="text-3xl font-black text-[#050F2A] mb-10 tracking-tight">Category Reach</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {topCategories.map((cat, i) => (
                <div key={cat.name} className="p-6 rounded-[35px] bg-gray-50/50 border border-gray-100 hover:bg-white hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group">
                   <div className="flex items-center justify-between mb-5">
                      <div className={`w-12 h-12 rounded-[18px] flex items-center justify-center text-white ${['bg-indigo-500', 'bg-emerald-500', 'bg-blue-500', 'bg-orange-500', 'bg-rose-500'][i % 5]} shadow-lg group-hover:rotate-12 transition-transform`}>
                        <Package size={22} />
                      </div>
                      <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">{cat.product_count} items</span>
                   </div>
                   <h4 className="font-black text-[#050F2A] mb-4 text-lg tracking-tight">{cat.name}</h4>
                   <div className="h-2 bg-gray-200/50 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${['bg-indigo-500', 'bg-emerald-500', 'bg-blue-500', 'bg-orange-500', 'bg-rose-500'][i % 5]} shadow-[0_0_10px_rgba(0,0,0,0.1)]`}
                        style={{ width: `${(cat.product_count / Math.max(...topCategories.map(c => c.product_count), 1)) * 100}%` }}
                      />
                    </div>
                </div>
              ))}
            </div>
         </div>

         {/* Security & Action */}
         <div className="bg-[#050F2A] rounded-[45px] p-12 text-white relative overflow-hidden flex flex-col justify-between shadow-2xl">
            <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl -mr-40 -mt-40"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -ml-32 -mb-32"></div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-10">
                 <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                    <Zap size={24} className="text-indigo-400" />
                 </div>
                 <h2 className="text-3xl font-black tracking-tight">Security Center</h2>
              </div>
              
              <div className="grid grid-cols-2 gap-8 mb-12">
                <div className="bg-white/5 p-7 rounded-[35px] border border-white/10 backdrop-blur-sm group hover:bg-white/10 transition-colors">
                   <div className="text-5xl font-black text-emerald-400 mb-2 tracking-tighter">{userStatus?.verified}</div>
                   <div className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em]">Verified Users</div>
                </div>
                <div className="bg-white/5 p-7 rounded-[35px] border border-white/10 backdrop-blur-sm group hover:bg-white/10 transition-colors">
                   <div className="text-5xl font-black text-white/10 mb-2 tracking-tighter">{userStatus?.unverified}</div>
                   <div className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em]">Pending Check</div>
                </div>
              </div>
              <p className="text-white/40 text-sm font-bold leading-relaxed max-w-sm mb-10 uppercase tracking-wider">
                System health is optimal. Verify pending requests to maintain community trust and safety standards.
              </p>
            </div>
            <Link to="/admin/customers" className="relative z-10 w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-6 rounded-[24px] flex items-center justify-center gap-4 transition-all duration-300 shadow-xl shadow-indigo-900/40 no-underline group">
              MANAGE VERIFICATIONS
              <ArrowRight size={22} className="group-hover:translate-x-2 transition-transform" />
            </Link>
         </div>
      </div>
    </div>
  );
};

export default Dashboard;
