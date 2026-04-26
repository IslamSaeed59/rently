import React, { useState, useEffect, useRef } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { 
  Search as SearchIcon, 
  MapPin, 
  Filter, 
  ChevronDown, 
  Star, 
  Heart, 
  Eye, 
  ArrowRight,
  LayoutGrid,
  SlidersHorizontal,
  Check
} from "lucide-react";
import { getAllProducts, toggleFavorite, getMyFavorites } from "../../server/ProductsApi";
import { getAllCategories } from "../../server/Api";
import locations from "../../locations.json";
import { toast } from "react-toastify";

const SearchPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [userFavorites, setUserFavorites] = useState(new Set());
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  // Filter states
  const [keyword, setKeyword] = useState(queryParams.get("q") || "");
  const [governorate, setGovernorate] = useState(queryParams.get("gov") || "");
  const [selectedCategory, setSelectedCategory] = useState(queryParams.get("cat") || "");
  const [sortBy, setSortBy] = useState("newest");
  const [showFilters, setShowFilters] = useState(true);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    fetchData();
    fetchFavorites();
    // Sync states with URL when it changes (e.g. back button)
    setKeyword(queryParams.get("q") || "");
    setGovernorate(queryParams.get("gov") || "");
    setSelectedCategory(queryParams.get("cat") || "");
  }, [location.search]);

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

  const fetchData = async () => {
    setLoading(true);
    try {
      const [productsData, categoriesData] = await Promise.all([
        getAllProducts(),
        getAllCategories()
      ]);
      
      setAllCategories(categoriesData);
      
      const q = queryParams.get("q")?.toLowerCase() || "";
      const gov = queryParams.get("gov") || "";
      const catId = queryParams.get("cat") || "";
      
      // Client-side filtering
      let filtered = productsData.filter(p => {
        const matchesQuery = !q || p.name.toLowerCase().includes(q) || (p.description && p.description.toLowerCase().includes(q));
        const matchesGov = !gov || (p.location && p.location.includes(gov));
        
        let matchesCat = true;
        if (catId) {
          const selectedCat = categoriesData.find(c => c.id.toString() === catId);
          // Match if it's the category itself OR if the product's category has this cat as parent
          matchesCat = p.category_id.toString() === catId || 
                       categoriesData.some(c => c.id === p.category_id && c.parent_id?.toString() === catId);
        }
        
        return p.is_active && matchesQuery && matchesGov && matchesCat;
      });
      
      // Sorting
      if (sortBy === "price_low") filtered.sort((a, b) => (a.price_per_day || 0) - (b.price_per_day || 0));
      if (sortBy === "price_high") filtered.sort((a, b) => (b.price_per_day || 0) - (a.price_per_day || 0));
      
      setProducts(filtered);
    } catch (error) {
      console.error("Error fetching search data:", error);
      toast.error("Failed to load results");
    } finally {
      setLoading(false);
    }
  };

  const handleApplyFilters = () => {
    const params = new URLSearchParams();
    if (keyword) params.append("q", keyword);
    if (governorate) params.append("gov", governorate);
    if (selectedCategory) params.append("cat", selectedCategory);
    navigate(`/search?${params.toString()}`);
  };

  const handleCategoryClick = (catId) => {
    const params = new URLSearchParams(location.search);
    if (catId) {
      params.set("cat", catId);
    } else {
      params.delete("cat");
    }
    navigate(`/search?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-[#FDFDFF] pb-20">
      {/* Search Header */}
      <div className="bg-[#050F2A] pt-32 pb-20 px-6 md:px-20 relative">
        {/* Background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#A78BFA]/10 blur-[100px] rounded-full" />
        </div>
        
        <div className="relative z-20 max-w-[1200px] mx-auto">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-8">
            Search Results
          </h1>
          
          {/* Main Search Bar */}
          <div className="flex flex-col md:flex-row items-center bg-white rounded-3xl p-2 gap-2 shadow-2xl relative z-30">
            <div className="flex items-center flex-1 w-full px-5">
              <SearchIcon size={20} className="text-[#A78BFA]" />
              <input 
                type="text"
                placeholder="Search for something else..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleApplyFilters()}
                className="flex-1 bg-transparent border-none outline-none px-4 py-4 text-[16px] font-bold text-[#050F2A]"
              />
            </div>
            
            <div className="hidden md:block w-px h-10 bg-gray-100" />
            
            {/* Custom Modern Dropdown */}
            <div className="relative w-full md:w-auto min-w-[200px]" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full flex items-center justify-between gap-4 px-6 py-4 hover:bg-gray-50/50 transition-colors rounded-2xl"
              >
                <div className="flex items-center gap-3">
                  <MapPin size={18} className="text-[#A78BFA]" />
                  <span className={`text-[14px] font-black whitespace-nowrap ${governorate ? 'text-[#050F2A]' : 'text-gray-400'}`}>
                    {governorate || "All Regions"}
                  </span>
                </div>
                <ChevronDown size={14} className={`text-gray-300 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute top-[calc(100%+10px)] left-0 w-full md:w-[250px] bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-gray-100 py-4 z-[100] max-h-[300px] overflow-y-auto animate-in fade-in slide-in-from-top-4 duration-300">
                  <button
                    onClick={() => { setGovernorate(""); setIsDropdownOpen(false); }}
                    className="w-full px-6 py-2.5 text-left hover:bg-[#F8F7FF] transition-all flex items-center justify-between group"
                  >
                    <span className={`text-[13px] font-bold ${!governorate ? 'text-[#A78BFA]' : 'text-gray-600'}`}>All Regions</span>
                    {!governorate && <Check size={14} className="text-[#A78BFA]" />}
                  </button>
                  {locations.governorates.map((gov) => (
                    <button
                      key={gov.id}
                      onClick={() => { setGovernorate(gov.name); setIsDropdownOpen(false); }}
                      className="w-full px-6 py-2.5 text-left hover:bg-[#F8F7FF] transition-all flex items-center justify-between group"
                    >
                      <span className={`text-[13px] font-bold ${governorate === gov.name ? 'text-[#A78BFA]' : 'text-gray-600 group-hover:text-[#050F2A]'}`}>
                        {gov.name}
                      </span>
                      {governorate === gov.name && <Check size={14} className="text-[#A78BFA]" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <button 
              onClick={handleApplyFilters}
              className="w-full md:w-auto bg-[#A78BFA] text-[#050F2A] px-10 py-4 rounded-2xl font-black transition-all hover:bg-[#050F2A] hover:text-white"
            >
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-20 mt-12">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Sidebar Filters */}
          <aside className={`lg:w-72 space-y-10 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div>
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-6">Categories</h3>
              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => handleCategoryClick("")}
                  className={`text-left px-4 py-3 rounded-xl font-bold text-sm transition-all ${!selectedCategory ? 'bg-[#050F2A] text-white shadow-lg' : 'text-gray-500 hover:bg-gray-100'}`}
                >
                  All Products
                </button>
                {allCategories.filter(c => !c.parent_id).map(cat => (
                  <button 
                    key={cat.id}
                    onClick={() => handleCategoryClick(cat.id.toString())}
                    className={`text-left px-4 py-3 rounded-xl font-bold text-sm transition-all ${selectedCategory === cat.id.toString() ? 'bg-[#050F2A] text-white shadow-lg' : 'text-gray-500 hover:bg-gray-100'}`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-6">Sort By</h3>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full bg-white border border-gray-100 px-4 py-3 rounded-xl font-bold text-sm outline-none focus:ring-2 ring-[#A78BFA]/20"
              >
                <option value="newest">Newest First</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
              </select>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <div className="flex items-center justify-between mb-10">
              <p className="text-gray-400 font-bold">
                Showing <span className="text-[#050F2A]">{products.length}</span> results
              </p>
              
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg font-bold text-xs"
              >
                <SlidersHorizontal size={14} /> {showFilters ? 'Hide Filters' : 'Show Filters'}
              </button>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-12">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse bg-gray-50 aspect-square rounded-[2.5rem]" />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-32 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200">
                <SearchIcon size={48} className="mx-auto text-gray-200 mb-6" />
                <h3 className="text-2xl font-black text-[#050F2A] mb-2">No Results Found</h3>
                <p className="text-gray-400 font-medium">Try adjusting your filters or search keywords.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-12">
                {products.map((product) => {
                  const price = product.price_per_day || product.price_per_hour || 0;
                  const unit = product.price_per_day ? "day" : "hour";
                  const imageUrl = product.primary_image 
                    ? (product.primary_image.startsWith("http") ? product.primary_image : `http://localhost:9000${product.primary_image}`)
                    : "https://via.placeholder.com/800?text=No+Image";

                  return (
                    <Link
                      key={product.id}
                      to={`/product/${product.id}`}
                      className="group flex flex-col h-full transition-all duration-500"
                    >
                      <div className="relative aspect-square mb-6 flex items-center justify-center p-4">
                        <img
                          src={imageUrl}
                          alt={product.name}
                          className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute top-2 right-0 flex flex-col gap-3">
                          <button 
                            onClick={(e) => handleToggleFavorite(e, product.id)}
                            className={`w-11 h-11 rounded-full flex items-center justify-center transition-all shadow-sm active:scale-90 ${
                              userFavorites.has(product.id) 
                                ? "bg-red-50 text-red-500" 
                                : "bg-[#E5E1FF] text-[#050F2A] hover:bg-[#A78BFA] hover:text-white"
                            }`}
                          >
                            <Heart size={20} className={userFavorites.has(product.id) ? "fill-current" : ""} />
                          </button>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <h3 className="text-[19px] font-bold text-[#050F2A] group-hover:text-[#A78BFA] transition-colors line-clamp-1">
                          {product.name}
                        </h3>
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-[18px] font-black text-[#050F2A]">{price} EGP</span>
                          <span className="text-gray-400 font-bold text-sm">/{unit}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex items-center gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} size={16} className={i < 4 ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"} />
                            ))}
                          </div>
                          <span className="text-gray-400 font-bold text-sm">(65)</span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
