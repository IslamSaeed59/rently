import React, { useState, useEffect } from "react";
import { Star, MapPin, Heart, ShoppingBag, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getAllProducts, toggleFavorite, getMyFavorites } from "../../server/ProductsApi";

const OurProducts = () => {
  const [products, setProducts] = useState([]);
  const [userFavorites, setUserFavorites] = useState(new Set());
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getAllProducts();
        // Only show products that are active (visible)
        const visibleProducts = data.filter((p) => p.is_active);

        // Shuffle products randomly and pick only 12
        const shuffledProducts = [...visibleProducts].sort(
          () => 0.5 - Math.random(),
        );
        const random12Products = shuffledProducts.slice(0, 12);

        setProducts(random12Products);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

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

    fetchProducts();
    fetchFavorites();
  }, []);

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
  return (
    <section className="py-20 px-6 md:px-12 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="max-w-2xl">
            <span className="text-[#A78BFA] font-bold tracking-wider uppercase text-sm mb-3 block">
              Our Selection
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-[#050F2A] leading-tight">
              Featured{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#050F2A] to-[#A78BFA]">
                Products
              </span>
            </h2>
            <p className="text-gray-500 mt-4 text-lg">
              Hand-picked premium rentals chosen for quality and exceptional
              service.
            </p>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => {
            const price =
              product.price_per_day ||
              product.price_per_hour ||
              product.price_per_week ||
              product.price_per_month ||
              0;
            const unit = product.price_per_day
              ? "/day"
              : product.price_per_hour
                ? "/hour"
                : product.price_per_week
                  ? "/week"
                  : product.price_per_month
                    ? "/month"
                    : "";

            const imageUrl = product.primary_image
              ? product.primary_image.startsWith("http")
                ? product.primary_image
                : `http://localhost:9000${product.primary_image}`
              : "https://via.placeholder.com/800?text=No+Image";

            return (
              <Link
                to={`/product/${product.id}`}
                key={product.id}
                className="group bg-white rounded-[2.5rem] overflow-hidden border border-gray-100/60 hover:border-[#A78BFA]/30 transition-all duration-700 hover:shadow-[0_40px_80px_-15px_rgba(167,139,250,0.18)] flex flex-col h-full"
              >
                {/* Image Container */}
                <div className="relative aspect-square bg-[#F8FAFC] overflow-hidden">
                  <img
                    src={imageUrl}
                    alt={product.name}
                    className="w-full h-full object-contain p-8 transition-transform duration-1000 group-hover:scale-110"
                  />

                  {/* Status / Quick Actions */}
                  <div className="absolute top-5 right-5 flex flex-col gap-2 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-500">
                    <button
                      onClick={(e) => handleToggleFavorite(e, product.id)}
                      className={`p-3.5 rounded-full backdrop-blur-md shadow-xl transition-all active:scale-90 ${
                        userFavorites.has(product.id)
                          ? "bg-red-50 text-red-500"
                          : "bg-white/80 text-[#050F2A] hover:bg-[#A78BFA] hover:text-white"
                      }`}
                    >
                      <Heart size={18} className={userFavorites.has(product.id) ? "fill-current" : ""} />
                    </button>
                  </div>

                  {/* Rent Now Overlay */}
                  <div className="absolute inset-0 bg-[#050F2A]/0 group-hover:bg-[#050F2A]/5 transition-colors duration-500 flex items-center justify-center">
                    <div className="translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          const token = localStorage.getItem("token");
                          if (!token) {
                            toast.info("Please login to rent products.");
                            navigate("/login");
                            return;
                          }
                          navigate(`/product/${product.id}`);
                        }}
                        className="bg-[#050F2A] text-white px-8 py-4 rounded-2xl font-black flex items-center gap-3 shadow-2xl hover:bg-[#A78BFA] transition-colors"
                      >
                        <ShoppingBag size={20} />
                        Rent Now
                      </button>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8 flex flex-col flex-1">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1.5 text-gray-400 text-xs font-bold uppercase tracking-widest">
                      <MapPin size={14} className="text-[#A78BFA]" />
                      <span className="line-clamp-1">
                        {product.location || "N/A"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 bg-yellow-50 px-2 py-0.5 rounded-md border border-yellow-100">
                      <Star
                        size={12}
                        className="fill-yellow-400 text-yellow-400"
                      />
                      <span className="text-yellow-700 font-bold text-[10px]">
                        4.9
                      </span>
                    </div>
                  </div>

                  <h4 className="text-xl font-bold text-[#050F2A] mb-6 line-clamp-1 group-hover:text-[#A78BFA] transition-colors duration-300">
                    {product.name}
                  </h4>

                  <div className="mt-auto pt-6 border-t border-gray-50 flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">
                        Starting from
                      </span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-black text-[#050F2A]">
                          {price}
                        </span>
                        <span className="text-[#050F2A] font-bold text-sm">
                          EGP
                        </span>
                        <span className="text-gray-400 text-xs font-medium">
                          / {unit.replace("/", "")}
                        </span>
                      </div>
                    </div>

                    <div className="w-12 h-12 rounded-2xl bg-[#F0EEFF] text-[#050F2A] flex items-center justify-center group-hover:bg-[#A78BFA] group-hover:text-white transition-all duration-500 group-hover:rotate-45">
                      <ArrowRight
                        size={20}
                        className="-rotate-45 group-hover:rotate-0 transition-transform duration-500"
                      />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default OurProducts;
