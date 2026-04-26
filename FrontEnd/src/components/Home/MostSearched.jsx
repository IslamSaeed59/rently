import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart, Star, ArrowRight, Eye } from "lucide-react";
import { getAllProducts, toggleFavorite, getMyFavorites } from "../../server/ProductsApi";
import { toast } from "react-toastify";

const MostSearched = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userFavorites, setUserFavorites] = useState(new Set());
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const favs = await getMyFavorites();
        setUserFavorites(new Set(favs.map(f => f.product_id)));
      } catch (error) {
        console.error("Error fetching favorites:", error);
      }
    }
  };

  const handleToggleFavorite = async (e, productId) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      toast.info("Please login to manage favorites.");
      navigate("/login");
      return;
    }

    try {
      const res = await toggleFavorite(productId);
      const newFavorites = new Set(userFavorites);
      if (res.isFavorite) {
        newFavorites.add(productId);
      } else {
        newFavorites.delete(productId);
      }
      setUserFavorites(newFavorites);
      toast.success(res.message);
    } catch (error) {
      toast.error("Failed to update favorites");
    }
  };

  const fetchProducts = async () => {
    try {
      const allProducts = await getAllProducts();
      // Shuffle and pick 4 random products
      const shuffled = [...allProducts]
        .filter((p) => p.is_active)
        .sort(() => 0.5 - Math.random());
      setProducts(shuffled.slice(0, 4));
    } catch (error) {
      console.error("Error fetching products for Most Searched:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return null; // Or a skeleton

  return (
    <section className="px-6 md:px-20 py-24 bg-[#FDFDFF]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
        <div>
          {/* Sub label */}
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-5 rounded-full bg-[#A78BFA]" />
            <span className="text-[13px] font-black text-[#A78BFA] uppercase tracking-[0.2em]">
              Trending Now
            </span>
          </div>
          {/* Heading */}
          <h2 className="text-4xl md:text-5xl font-black text-[#050F2A] tracking-tight">
            Most Searched
          </h2>
        </div>

        {/* View All button */}
        <Link
          to="/search"
          className="inline-flex items-center gap-3 bg-[#E5E1FF] text-[#050F2A] px-8 py-4 rounded-2xl font-black hover:bg-[#A78BFA] hover:text-white transition-all duration-500 group"
        >
          Explore All Products
          <ArrowRight
            size={20}
            className="group-hover:translate-x-1 transition-transform"
          />
        </Link>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
        {products.map((product) => {
          const price =
            product.price_per_day ||
            product.price_per_hour ||
            product.price_per_week ||
            0;
          const unit = product.price_per_day
            ? "day"
            : product.price_per_hour
              ? "hour"
              : "week";
          const imageUrl = product.primary_image
            ? product.primary_image.startsWith("http")
              ? product.primary_image
              : `http://localhost:9000${product.primary_image}`
            : "https://via.placeholder.com/800?text=No+Image";

          return (
            <Link
              key={product.id}
              to={`/product/${product.id}`}
              className="group flex flex-col h-full transition-all duration-500"
            >
              {/* Image Area */}
              <div className="relative aspect-square mb-6 flex items-center justify-center p-4">
                <img
                  src={imageUrl}
                  alt={product.name}
                  className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105"
                />

                {/* Floating Action Buttons */}
                <div className="absolute top-2 right-0 flex flex-col gap-3">
                  <button
                    onClick={(e) => handleToggleFavorite(e, product.id)}
                    className={`w-11 h-11 rounded-full flex items-center justify-center transition-all shadow-sm active:scale-90 ${
                      userFavorites.has(product.id) 
                        ? "bg-red-50 text-red-500 hover:bg-red-100" 
                        : "bg-[#E5E1FF] text-[#050F2A] hover:bg-[#A78BFA] hover:text-white"
                    }`}
                  >
                    <Heart size={20} className={userFavorites.has(product.id) ? "fill-current" : ""} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(`/product/${product.id}`);
                    }}
                    className="w-11 h-11 rounded-full bg-[#E5E1FF] text-[#050F2A] flex items-center justify-center hover:bg-[#A78BFA] hover:text-white transition-all shadow-sm active:scale-90"
                  >
                    <Eye size={20} className="stroke-[2.5]" />
                  </button>
                </div>
              </div>

              {/* Content Area */}
              <div className="flex flex-col gap-2">
                <h3 className="text-[19px] font-bold text-[#050F2A] group-hover:text-[#A78BFA] transition-colors duration-300">
                  {product.name}
                </h3>

                <div className="flex items-baseline gap-1.5">
                  <span className="text-[18px] font-black text-[#050F2A]">
                    {price} EGP
                  </span>
                  <span className="text-gray-400 font-bold text-sm">
                    /{unit}
                  </span>
                </div>

                <div className="flex items-center gap-2 mt-1">
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={
                          i < 4
                            ? "fill-yellow-400 text-yellow-400"
                            : "fill-gray-200 text-gray-200"
                        }
                      />
                    ))}
                  </div>
                  <span className="text-gray-400 font-bold text-sm">(65)</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default MostSearched;
