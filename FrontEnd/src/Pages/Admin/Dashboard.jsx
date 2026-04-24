import React from "react";
import { 
  Package, 
  Users, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight, 
  DollarSign,
  ShoppingCart,
  Star,
  MapPin,
  Heart,
  ArrowRight
} from "lucide-react";
import { Link } from "react-router-dom";

const STATS = [
  { name: "Total Revenue", value: "$45,231.89", trend: "+20.1%", isUp: true, icon: DollarSign },
  { name: "Active Rentals", value: "2,350", trend: "+180.1%", isUp: true, icon: Package },
  { name: "New Customers", value: "+12,234", trend: "+19%", isUp: true, icon: Users },
  { name: "Conversion Rate", value: "3.2%", trend: "-0.4%", isUp: false, icon: TrendingUp },
];

const PRODUCTS = [
  {
    id: 1,
    name: "Luxury Beachfront Villa",
    price: 450,
    unit: "/night",
    rating: 4.9,
    reviews: 124,
    location: "North Coast, Egypt",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 2,
    name: "Classic Sports Coupe",
    price: 120,
    unit: "/day",
    rating: 4.8,
    reviews: 86,
    location: "Cairo, Egypt",
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80",
  },
];

const Dashboard = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-[#050F2A]">Dashboard Overview</h1>
        <p className="text-gray-500 mt-1">Welcome back, Admin. Here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {STATS.map((stat) => (
          <div key={stat.name} className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-[#050F2A]/5 rounded-xl text-[#050F2A]">
                <stat.icon size={20} />
              </div>
              <div className={`flex items-center gap-1 text-xs font-bold ${stat.isUp ? "text-emerald-500" : "text-rose-500"}`}>
                {stat.isUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {stat.trend}
              </div>
            </div>
            <p className="text-gray-500 text-sm font-medium">{stat.name}</p>
            <h3 className="text-2xl font-black text-[#050F2A] mt-1">{stat.value}</h3>
          </div>
        ))}
      </div>

      {/* Main Content Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Products Preview */}
        <div className="lg:col-span-2 bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#050F2A] flex items-center justify-center text-[#A78BFA]">
                <Package size={24} />
              </div>
              <h2 className="text-2xl font-bold text-[#050F2A]">Recent Products</h2>
            </div>
            <Link to="/admin/products" className="text-[#A78BFA] font-bold text-sm hover:underline flex items-center gap-2">
              View All <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {PRODUCTS.map((product) => (
              <div key={product.id} className="group flex gap-4 p-4 rounded-2xl border border-gray-50 hover:border-indigo-100 transition-all">
                <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex flex-col justify-between py-1">
                  <div>
                    <h3 className="font-bold text-[#050F2A] line-clamp-1">{product.name}</h3>
                    <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                      <MapPin size={12} /> {product.location}
                    </p>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="font-black text-[#050F2A]">${product.price}</span>
                    <div className="flex items-center gap-1 bg-yellow-50 px-1.5 py-0.5 rounded text-[10px] font-bold text-yellow-700">
                      <Star size={10} className="fill-yellow-400 text-yellow-400" />
                      {product.rating}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions / Recent Activity */}
        <div className="bg-[#050F2A] rounded-[32px] p-8 text-white">
          <h2 className="text-xl font-bold mb-6">Quick Actions</h2>
          <div className="space-y-4">
            <button className="w-full bg-white/10 hover:bg-white/20 p-4 rounded-2xl flex items-center gap-4 transition-all">
              <div className="w-10 h-10 bg-[#A78BFA] rounded-xl flex items-center justify-center text-white">
                <Package size={20} />
              </div>
              <span className="font-bold text-sm">Add New Product</span>
            </button>
            <button className="w-full bg-white/10 hover:bg-white/20 p-4 rounded-2xl flex items-center gap-4 transition-all">
              <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white">
                <Users size={20} />
              </div>
              <span className="font-bold text-sm">Manage Users</span>
            </button>
            <button className="w-full bg-white/10 hover:bg-white/20 p-4 rounded-2xl flex items-center gap-4 transition-all">
              <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center text-white">
                <TrendingUp size={20} />
              </div>
              <span className="font-bold text-sm">Sales Report</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
