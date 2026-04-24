import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getMyListings, deleteProduct } from "../../../server/ProductsApi";
import { Search, MapPin, Calendar, Clock, Plus } from "lucide-react";
import { toast } from "react-toastify";

const MyListings = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const fetchListings = async () => {
    try {
      const data = await getMyListings();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching listings:", error);
      toast.error("Failed to load your listings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct(id);
        toast.success("Product deleted successfully");
        fetchListings();
      } catch (error) {
        toast.error("Failed to delete product");
      }
    }
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[1200px] mx-auto px-6 py-8">
        {/* Breadcrumbs */}
        <div className="text-[13px] text-gray-400 font-medium mb-8 flex items-center gap-2">
          <Link to="/" className="hover:text-gray-600 transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="hover:text-gray-600 transition-colors cursor-pointer">
            My Account
          </span>
          <span>/</span>
          <span className="hover:text-gray-600 transition-colors cursor-pointer">
            My Profile
          </span>
          <span>/</span>
          <span className="text-[#050F2A] font-bold">My Listings</span>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Sidebar - Categories */}
          <div className="w-full md:w-[220px] flex-shrink-0">
            <h3 className="text-[14px] font-bold text-[#050F2A] mb-4">
              Category:
            </h3>
            <div className="flex flex-col gap-3">
              {[
                { id: "all", label: "ALL" },
                { id: "electronics", label: "Electronics" },
                { id: "sports", label: "Sports & Fitness" },
                { id: "cameras", label: "Cameras & Creator Gear" },
                { id: "events", label: "Events" },
              ].map((cat) => (
                <label
                  key={cat.id}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <div
                    className={`w-4 h-4 border rounded ${cat.id === "all" ? "border-gray-400 bg-gray-50" : "border-gray-300 group-hover:border-gray-400"} flex items-center justify-center transition-colors`}
                  >
                    {cat.id === "all" && (
                      <div className="w-2 h-2 bg-gray-400 rounded-sm"></div>
                    )}
                  </div>
                  <span className="text-[13px] font-medium text-gray-600 group-hover:text-[#050F2A] transition-colors">
                    {cat.label}
                  </span>
                </label>
              ))}
            </div>
            <hr className="my-6 border-gray-100" />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Header: Title & Actions */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
              <h1 className="text-3xl font-black text-[#050F2A]">My Listing</h1>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="relative flex-1 sm:flex-none">
                  <input
                    type="text"
                    placeholder="Search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full sm:w-[240px] bg-gray-100 rounded-lg py-2.5 pl-4 pr-10 text-[13px] font-medium text-[#050F2A] outline-none focus:ring-1 focus:ring-gray-300 transition-all"
                  />
                  <Search
                    size={16}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  />
                </div>
                <button className="bg-[#050F2A] text-white px-6 py-2.5 rounded-lg text-[13px] font-bold hover:opacity-90 transition-opacity flex items-center gap-2">
                  Sort
                  <svg
                    width="10"
                    height="6"
                    viewBox="0 0 10 6"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1 1L5 5L9 1"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {loading ? (
                <div className="col-span-full py-10 text-center text-gray-500">
                  Loading your listings...
                </div>
              ) : (
                <>
                  {filteredProducts.map((product) => {
                    const imageUrl = product.primary_image
                      ? product.primary_image.startsWith("http")
                        ? product.primary_image
                        : `http://localhost:9000${product.primary_image}`
                      : "https://via.placeholder.com/400x300?text=No+Image";

                    const price = product.price_per_hour || product.price_per_day || product.price_per_week || product.price_per_month || 0;
                    const unit = product.price_per_hour ? "/ hour" : product.price_per_day ? "/ day" : product.price_per_week ? "/ week" : product.price_per_month ? "/ month" : "";
                    
                    const createdAtDate = product.created_at ? new Date(product.created_at) : new Date();
                    const formattedDate = createdAtDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
                    const formattedTime = createdAtDate.toLocaleTimeString("en-US", { hour: 'numeric', minute: '2-digit', hour12: true });

                    return (
                      <div
                        key={product.id}
                        className="border border-gray-200 rounded-[20px] overflow-hidden bg-white hover:shadow-lg transition-all flex flex-col h-[380px]"
                      >
                        <div className="p-4 flex-1 flex flex-col">
                          <h3 className="font-bold text-[13px] text-[#050F2A] mb-3 line-clamp-2 min-h-[40px] leading-tight">
                            {product.name}
                          </h3>
                          <div className="w-full h-[150px] bg-white rounded-lg mb-4 flex items-center justify-center p-2 relative group-hover:scale-105 transition-transform">
                            <img
                              src={imageUrl}
                              alt={product.name}
                              className="max-w-full max-h-full object-contain mix-blend-multiply"
                            />
                          </div>

                          <div className="flex items-center gap-3 text-[9px] text-gray-400 font-medium mb-4 mt-auto">
                            <div className="flex items-center gap-1">
                              <Calendar size={10} /> {formattedDate}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock size={10} /> {formattedTime}
                            </div>
                            <div className="flex items-center gap-1 line-clamp-1">
                              <MapPin size={10} />{" "}
                              {product.location || "N/A"}
                            </div>
                          </div>

                          <div className="text-[11px] text-gray-400 font-medium mb-5">
                            Total:{" "}
                            <span className="font-bold text-[#050F2A]">
                              {price} EGP {unit}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-2 mt-auto">
                            <button
                              onClick={() => navigate(`/product/${product.id}`)}
                              className="bg-[#050F2A] text-white text-[12px] font-bold py-2.5 rounded-[10px] hover:opacity-90 transition-opacity"
                            >
                              View Product
                            </button>
                            <button
                              onClick={() => handleDelete(product.id)}
                              className="bg-[#E2E8F0] text-[#050F2A] text-[12px] font-bold py-2.5 rounded-[10px] hover:bg-gray-300 transition-colors"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {/* Add Product Card */}
                  <div
                    onClick={() => navigate("/products/create")}
                    className="border border-gray-200 rounded-[20px] bg-white hover:border-gray-300 transition-all cursor-pointer flex flex-col items-center justify-center min-h-[380px] p-6 group shadow-sm"
                  >
                    <h3 className="font-bold text-[13px] text-[#050F2A] mb-auto w-full text-left">
                      Choose Product
                    </h3>
                    <div className="w-16 h-16 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 group-hover:border-gray-400 group-hover:text-gray-500 transition-all mb-auto mt-12">
                      <Plus size={28} strokeWidth={1.5} />
                    </div>
                    <button className="w-[140px] bg-[#050F2A] text-white text-[12px] font-bold py-3 rounded-[10px] hover:opacity-90 transition-opacity mt-auto">
                      Add Product
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyListings;
