import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ChevronRight,
  Filter,
  LayoutList,
  MapPin,
  Search,
  ChevronDown,
  Star,
  Heart,
  ShoppingBag,
  ArrowRight,
  ChevronLeft,
} from "lucide-react";
import { getAllCategories } from "../../server/Api";
import {
  getAllProducts,
  toggleFavorite,
  getMyFavorites,
} from "../../server/ProductsApi";
import { toast } from "react-toastify";
import locations from "../../locations.json";

const CategoriesProducts = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState(null);
  const [allCategories, setAllCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userFavorites, setUserFavorites] = useState(new Set());
  const [showFilters, setShowFilters] = useState(true);

  // Filter states
  const [filterName, setFilterName] = useState("");
  const [filterGovernorate, setFilterGovernorate] = useState("");
  const [filterCity, setFilterCity] = useState("");
  const [filterCategory, setFilterCategory] = useState(slug || "");

  useEffect(() => {
    fetchData();
    fetchFavorites();
  }, [slug]);

  const fetchFavorites = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const favs = await getMyFavorites();
        setUserFavorites(new Set(favs.map((f) => f.product_id)));
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

  const fetchData = async () => {
    setLoading(true);
    try {
      const [categoriesData, productsData] = await Promise.all([
        getAllCategories(),
        getAllProducts(),
      ]);

      setAllCategories(categoriesData);

      // Find current category
      const currentCat = categoriesData.find((c) => c.slug === slug);
      setCategory(currentCat);

      // Filter products by category (including children if it's a parent)
      let categoryProducts = productsData.filter((p) => {
        if (!currentCat) return false;
        // Match current category or its subcategories
        const isMatch =
          p.category_id === currentCat.id ||
          categoriesData.some(
            (c) => c.parent_id === currentCat.id && p.category_id === c.id,
          );
        return isMatch && p.is_active;
      });

      setProducts(categoryProducts);

      // Get all featured products (including subcategories)
      const featured = categoryProducts.filter((p) => p.is_featured == 1);

      if (featured.length > 0) {
        setFeaturedProducts(featured);
      } else {
        // Fallback to one random product from main category if none are featured
        const mainCategoryProducts = categoryProducts.filter(
          (p) => p.category_id === currentCat.id,
        );
        if (mainCategoryProducts.length > 0) {
          const randomIndex = Math.floor(
            Math.random() * mainCategoryProducts.length,
          );
          setFeaturedProducts([mainCategoryProducts[randomIndex]]);
        } else {
          setFeaturedProducts([]);
        }
      }
      setCurrentIndex(0);
    } catch (error) {
      console.error("Error fetching category products:", error);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const nextFeatured = () => {
    setCurrentIndex((prev) => (prev + 1) % featuredProducts.length);
  };

  const prevFeatured = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + featuredProducts.length) % featuredProducts.length,
    );
  };

  const currentFeatured = featuredProducts[currentIndex];

  const filteredProducts = products.filter((product) => {
    const matchesName = product.name
      .toLowerCase()
      .includes(filterName.toLowerCase());
    const matchesGov = filterGovernorate
      ? product.location && product.location.includes(filterGovernorate)
      : true;
    const matchesCity = filterCity
      ? product.location && product.location.includes(filterCity)
      : true;
    return matchesName && matchesGov && matchesCity;
  });

  // Countdown timer for random product (mock)
  const [timeLeft, setTimeLeft] = useState({
    days: 20,
    hours: 15,
    minutes: 54,
    seconds: 35,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        }
        if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        if (prev.days > 0) {
          return {
            ...prev,
            days: prev.days - 1,
            hours: 23,
            minutes: 59,
            seconds: 59,
          };
        }
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#A78BFA]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFDFF]">
      {/* Header Section */}
      <div className="px-6 md:px-20 pt-10 pb-6">
        <h1 className="text-4xl font-black text-[#050F2A] mb-4">
          Rent {category?.name || "Products"}
        </h1>

        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-gray-400 font-medium">
          <Link
            to="/"
            className="hover:text-[#A78BFA] transition-colors flex items-center gap-1"
          >
            Home
          </Link>
          <ChevronRight size={14} />
          <span className="hover:text-[#A78BFA] cursor-pointer">Search</span>
          <ChevronRight size={14} />
          <span className="text-[#050F2A]">{category?.name}</span>
        </nav>
      </div>

      {/* Control Buttons Row */}
      <div className="px-6 md:px-20 flex flex-wrap items-center justify-between gap-4 mb-8">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-3 bg-[#E5E1FF] text-[#050F2A] px-6 py-3 rounded-xl font-bold hover:bg-[#DED9FF] transition-all"
        >
          <Filter size={18} />
          Filter Products
        </button>
      </div>

      {/* Filter Inputs Bar */}
      {showFilters && (
        <div className="px-6 md:px-20 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
            {/* Product Name */}
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">
                <Search size={14} /> Product Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for any product..."
                  value={filterName}
                  onChange={(e) => setFilterName(e.target.value)}
                  className="w-full bg-[#050F2A] text-white px-5 py-4 rounded-xl font-medium placeholder:text-gray-500 focus:ring-2 ring-[#A78BFA]/50 outline-none transition-all"
                />
              </div>
            </div>

            {/* Governorate */}
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">
                <MapPin size={14} /> Governorate
              </label>
              <div className="relative">
                <select
                  value={filterGovernorate}
                  onChange={(e) => {
                    setFilterGovernorate(e.target.value);
                    setFilterCity(""); // Reset city when governorate changes
                  }}
                  className="w-full bg-[#050F2A] text-white px-5 py-4 rounded-xl font-medium appearance-none focus:ring-2 ring-[#A78BFA]/50 outline-none transition-all cursor-pointer"
                >
                  <option value="">All Governorates</option>
                  {locations.governorates.map((gov) => (
                    <option key={gov.id} value={gov.name}>
                      {gov.name}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                  size={20}
                />
              </div>
            </div>

            {/* City */}
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">
                <MapPin size={14} /> City
              </label>
              <div className="relative">
                <select
                  value={filterCity}
                  onChange={(e) => setFilterCity(e.target.value)}
                  className="w-full bg-[#050F2A] text-white px-5 py-4 rounded-xl font-medium appearance-none focus:ring-2 ring-[#A78BFA]/50 outline-none transition-all cursor-pointer"
                  disabled={!filterGovernorate}
                >
                  <option value="">All Cities</option>
                  {filterGovernorate &&
                    locations.governorates
                      .find((gov) => gov.name === filterGovernorate)
                      ?.cities.map((city) => (
                        <option key={city.id} value={city.name}>
                          {city.name}
                        </option>
                      ))}
                </select>
                <ChevronDown
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                  size={20}
                />
              </div>
            </div>

            {/* Category */}
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">
                <LayoutList size={14} /> Category
              </label>
              <div className="relative">
                <select
                  value={filterCategory}
                  onChange={(e) => {
                    setFilterCategory(e.target.value);
                    navigate(`/category/${e.target.value}`);
                  }}
                  className="w-full bg-[#050F2A] text-white px-5 py-4 rounded-xl font-medium appearance-none focus:ring-2 ring-[#A78BFA]/50 outline-none transition-all cursor-pointer"
                >
                  {allCategories
                    .filter((cat) => !cat.parent_id)
                    .map((cat) => (
                      <option key={cat.id} value={cat.slug}>
                        {cat.name}
                      </option>
                    ))}
                </select>
                <ChevronDown
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                  size={20}
                />
              </div>
            </div>

            {/* Date Filter removed as requested */}
          </div>
        </div>
      )}

      {/* Hero Section / Limited Offer */}
      {currentFeatured && (
        <div className="px-6 md:px-20 mb-20 relative group/hero">
          <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#050F2A] via-[#0A1A40] to-[#050F2A] min-h-[450px] flex flex-col md:flex-row items-center p-10 md:p-20 group">
            {/* Content */}
            <div className="relative z-10 flex-1 text-white text-center md:text-left mb-10 md:mb-0">
              <span className="text-[#A78BFA] font-bold tracking-[0.2em] uppercase text-sm mb-6 block opacity-80">
                {category?.name}
              </span>
              <h2 className="text-4xl md:text-5xl font-black mb-10 leading-tight">
                Limited time offer
              </h2>

              {/* Countdown */}
              <div className="flex items-center justify-center md:justify-start gap-4 mb-12">
                {[
                  { value: timeLeft.days, label: "Days" },
                  { value: timeLeft.hours, label: "Hours" },
                  { value: timeLeft.minutes, label: "Minutes" },
                  { value: timeLeft.seconds, label: "Seconds" },
                ].map((unit, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <div className="w-14 h-14 rounded-full bg-white text-[#050F2A] flex items-center justify-center text-lg font-black shadow-lg shadow-white/10 mb-2">
                      {unit.value}
                    </div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400">
                      {unit.label}
                    </span>
                  </div>
                ))}
              </div>

              <Link
                to={`/product/${currentFeatured.id}`}
                className="inline-flex items-center gap-3 bg-[#A78BFA] text-[#050F2A] px-10 py-4 rounded-2xl font-black text-lg hover:bg-white transition-all duration-500 hover:-translate-y-1 shadow-xl shadow-[#A78BFA]/20 group-hover:shadow-[#A78BFA]/40"
              >
                Rent Now
                <ArrowRight size={20} />
              </Link>
            </div>

            {/* Image */}
            <div className="relative z-10 flex-1 flex justify-center items-center">
              <div className="relative w-full max-w-[500px]">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[#A78BFA]/10 blur-[100px] rounded-full" />
                <img
                  key={currentFeatured.id}
                  src={
                    currentFeatured.primary_image
                      ? currentFeatured.primary_image.startsWith("http")
                        ? currentFeatured.primary_image
                        : `http://localhost:9000${currentFeatured.primary_image}`
                      : "https://via.placeholder.com/800?text=No+Image"
                  }
                  alt={currentFeatured.name}
                  className="w-full h-auto object-contain relative z-10 drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-transform duration-700 group-hover:scale-105 animate-in fade-in slide-in-from-right-4"
                />
              </div>
            </div>

            {/* Background elements */}
            <div className="absolute top-0 right-0 w-1/3 h-full bg-[#A78BFA]/5 blur-[80px] -rotate-12 translate-x-20" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/5 rounded-full blur-[40px]" />
          </div>

          {/* Slider Controls */}
          {featuredProducts.length > 1 && (
            <>
              <button
                onClick={prevFeatured}
                className="absolute left-10 md:left-24 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-[#A78BFA] hover:border-[#A78BFA] transition-all z-20 opacity-0 group-hover/hero:opacity-100"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={nextFeatured}
                className="absolute right-10 md:right-24 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-[#A78BFA] hover:border-[#A78BFA] transition-all z-20 opacity-0 group-hover/hero:opacity-100"
              >
                <ChevronRight size={24} />
              </button>

              {/* Indicators */}
              <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                {featuredProducts.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentIndex(i)}
                    className={`w-2 h-2 rounded-full transition-all ${i === currentIndex ? "w-8 bg-[#A78BFA]" : "bg-white/30 hover:bg-white/50"}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* Product Grid Sections */}
      <div className="px-6 md:px-20 pb-32">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-200">
            <p className="text-gray-400 text-xl font-medium">
              No products found in this category.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-24">
            {Object.entries(
              filteredProducts.reduce((acc, product) => {
                // Find if the product belongs to a subcategory of the current category
                const subCat = allCategories.find(
                  (c) => c.id === product.category_id,
                );
                // If it's the current category itself, call it "General" or use category name
                const groupName =
                  subCat && subCat.id !== category?.id
                    ? subCat.name
                    : category?.name;

                if (!acc[groupName]) acc[groupName] = [];
                acc[groupName].push(product);
                return acc;
              }, {}),
            ).map(([groupName, groupProducts]) => (
              <div key={groupName} className="space-y-10">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-8 rounded-full bg-[#050F2A]" />
                  <h3 className="text-3xl font-black text-[#050F2A]">
                    {groupName}
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {groupProducts.map((product) => {
                    const price =
                      product.price_per_day ||
                      product.price_per_hour ||
                      product.price_per_week ||
                      0;
                    const unit = product.price_per_day
                      ? "/day"
                      : product.price_per_hour
                        ? "/hour"
                        : "/week";
                    const imageUrl = product.primary_image
                      ? product.primary_image.startsWith("http")
                        ? product.primary_image
                        : `http://localhost:9000${product.primary_image}`
                      : "https://via.placeholder.com/800?text=No+Image";

                    return (
                      <Link
                        key={product.id}
                        to={`/product/${product.id}`}
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
                              onClick={(e) =>
                                handleToggleFavorite(e, product.id)
                              }
                              className={`p-3.5 rounded-full backdrop-blur-md shadow-xl transition-all active:scale-90 ${
                                userFavorites.has(product.id)
                                  ? "bg-red-50 text-red-500"
                                  : "bg-white/80 text-[#050F2A] hover:bg-[#A78BFA] hover:text-white"
                              }`}
                            >
                              <Heart
                                size={18}
                                className={
                                  userFavorites.has(product.id)
                                    ? "fill-current"
                                    : ""
                                }
                              />
                            </button>
                          </div>

                          {/* Rent Now Overlay */}
                          <div className="absolute inset-0 bg-[#050F2A]/0 group-hover:bg-[#050F2A]/5 transition-colors duration-500 flex items-center justify-center">
                            {!product.is_available && (
                              <div className="absolute top-5 left-5 bg-red-500 text-white px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider shadow-lg z-20">
                                Unavailable
                              </div>
                            )}
                            <div className="translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  if (!product.is_available) {
                                    toast.warning(
                                      "This product is currently not available for rent.",
                                    );
                                    return;
                                  }
                                  navigate(`/product/${product.id}`);
                                }}
                                className={`${
                                  product.is_available
                                    ? "bg-[#050F2A]"
                                    : "bg-gray-400 cursor-not-allowed"
                                } text-white px-8 py-4 rounded-2xl font-black flex items-center gap-3 shadow-2xl hover:bg-[#A78BFA] transition-colors`}
                              >
                                <ShoppingBag size={20} />
                                {product.is_available
                                  ? "Rent Now"
                                  : "Unavailable"}
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
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoriesProducts;
