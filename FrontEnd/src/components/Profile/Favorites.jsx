import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Heart, MapPin, Star, ArrowRight, Trash2 } from "lucide-react";
import { getMyFavorites, toggleFavorite } from "../../server/ProductsApi";
import { toast } from "react-toastify";

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const data = await getMyFavorites();
      setFavorites(data);
    } catch (error) {
      console.error("Error fetching favorites:", error);
      toast.error("Failed to load favorites");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (productId) => {
    try {
      await toggleFavorite(productId);
      setFavorites(favorites.filter(fav => fav.product_id !== productId));
      toast.success("Removed from favorites");
    } catch (error) {
      toast.error("Failed to remove from favorites");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-[#050F2A]/10 border-t-[#050F2A] rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-[1000px] mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-[#050F2A] mb-1">My Favorites</h1>
          <p className="text-sm text-gray-500 font-medium">Items you've saved for later</p>
        </div>
        <span className="bg-[#F1F5F9] text-[#475569] text-[12px] font-bold px-3 py-1 rounded-full">
          {favorites.length} Items
        </span>
      </div>

      {favorites.length === 0 ? (
        <div className="bg-white border border-dashed border-gray-200 rounded-3xl py-20 px-6 text-center">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart size={40} className="text-gray-300" />
          </div>
          <h3 className="text-xl font-bold text-[#050F2A] mb-2">No favorites yet</h3>
          <p className="text-gray-500 mb-8 max-w-sm mx-auto">
            Explore our collection and tap the heart icon on any product to save it here.
          </p>
          <Link
            to="/search"
            className="inline-flex items-center gap-2 bg-[#050F2A] text-white font-bold py-3 px-8 rounded-xl hover:opacity-90 transition-opacity"
          >
            Start Exploring
            <ArrowRight size={18} />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((fav) => (
            <div 
              key={fav.id}
              className="bg-white border border-gray-100 rounded-3xl overflow-hidden group hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300"
            >
              {/* Image Container */}
              <div className="relative aspect-[4/3] bg-[#F8FAFC] p-4 flex items-center justify-center overflow-hidden">
                <img 
                  src={fav.main_image ? (fav.main_image.startsWith('http') ? fav.main_image : `http://localhost:9000${fav.main_image}`) : "https://via.placeholder.com/400?text=No+Image"}
                  alt={fav.name}
                  className="w-full h-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-110"
                />
                <button 
                  onClick={() => handleRemove(fav.product_id)}
                  className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-md rounded-xl text-red-500 shadow-sm hover:bg-red-50 transition-colors z-10"
                  title="Remove from favorites"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex text-yellow-400">
                    <Star size={12} className="fill-current" />
                  </div>
                  <span className="text-[11px] font-bold text-gray-400">4.9 (120 reviews)</span>
                </div>
                
                <h3 className="font-bold text-[#050F2A] text-lg mb-1 truncate">
                  {fav.name}
                </h3>
                
                <div className="flex items-center gap-1.5 text-gray-500 mb-4">
                  <MapPin size={14} />
                  <span className="text-[13px] font-medium">{fav.location || "Egypt"}</span>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Price</p>
                    <p className="text-lg font-black text-[#050F2A]">
                      {fav.price_per_day || fav.price_per_hour || 0} <span className="text-sm font-bold">EGP</span>
                    </p>
                  </div>
                  <Link 
                    to={`/product/${fav.product_id}`}
                    className="bg-[#050F2A] text-white p-3 rounded-2xl hover:scale-110 active:scale-95 transition-all shadow-lg shadow-[#050F2A]/10"
                  >
                    <ArrowRight size={20} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;
