import React, { useState, useEffect } from "react";
import { Star, MapPin, Heart, ShoppingBag, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getAllProducts } from "../../server/ProductsApi";

const OurProducts = () => {
  const [products, setProducts] = useState([]);
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
    fetchProducts();
  }, []);
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
          <button className="flex items-center gap-2 text-[#050F2A] font-bold hover:gap-3 transition-all duration-300 group">
            View All Products{" "}
            <ArrowRight
              size={20}
              className="text-[#A78BFA] group-hover:translate-x-1 transition-transform"
            />
          </button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => {
            const price =
              product.price_per_hour ||
              product.price_per_day ||
              product.price_per_week ||
              product.price_per_month ||
              0;
            const unit = product.price_per_hour
              ? "/hour"
              : product.price_per_day
                ? "/day"
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
                className="group relative bg-white overflow-hidden border border-gray-100 hover:border-indigo-100 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(167,139,250,0.15)] flex flex-col h-full"
              >
                {/* Image Container */}
                <div className="relative aspect-[4/5] overflow-hidden">
                  <img
                    src={imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />

                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      const token = localStorage.getItem("token");
                      if (!token) {
                        toast.info("Please login to add to favorites.");
                        navigate("/login");
                        return;
                      }
                      toast.success("Added to favorites!");
                    }}
                    className="absolute top-4 right-4 p-2.5 rounded-full bg-white/80 backdrop-blur-md text-[#050F2A] hover:bg-red-500 hover:text-white transition-all duration-300 shadow-sm active:scale-90"
                  >
                    <Heart size={18} />
                  </button>

                  {/* Quick Add Button */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-500 bg-gradient-to-t from-black/60 to-transparent">
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
                      className="w-full bg-white text-[#050F2A] py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-[#A78BFA] hover:text-white transition-colors duration-300"
                    >
                      <ShoppingBag size={18} />
                      Rent Now
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-1 text-gray-400 text-sm mb-2">
                    <MapPin size={14} className="text-[#A78BFA]" />
                    <span className="line-clamp-1">
                      {product.location || "N/A"}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-[#050F2A] mb-3 group-hover:text-[#A78BFA] transition-colors line-clamp-1">
                    {product.name}
                  </h3>

                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center gap-1 bg-yellow-50 px-2 py-0.5 rounded-md">
                      <Star
                        size={14}
                        className="fill-yellow-400 text-yellow-400"
                      />
                      <span className="text-yellow-700 font-bold text-xs">
                        4.9
                      </span>
                    </div>
                    <span className="text-gray-400 text-xs font-medium">
                      (120 reviews)
                    </span>
                  </div>

                  <div className="mt-auto flex items-end justify-between">
                    <div>
                      <span className="text-2xl font-black text-[#050F2A]">
                        {price} EGP
                      </span>
                      <span className="text-gray-400 text-sm font-medium">
                        {" "}
                        {unit}
                      </span>
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
