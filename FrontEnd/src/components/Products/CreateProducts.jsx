import React, { useState, useRef, useEffect } from "react";
import { CloudUpload, Plus, MapPin, X } from "lucide-react";
import { createProduct } from "../../server/ProductsApi";
import { getAllCategories, getProfile } from "../../server/Api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const CreateProducts = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [duration, setDuration] = useState("daily");
  const [formData, setFormData] = useState({
    name: "",
    category_id: "",
    description: "",
    price: "",
    location: "",
    deposit_amount: 0,
  });
  const [selectedMainCategory, setSelectedMainCategory] = useState("");

  const [images, setImages] = useState([]); // { file, preview }
  const [profileComplete, setProfileComplete] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await getAllCategories();
      setCategories(response);

      // Fetch actual profile to ensure location is set
      const profileData = await getProfile();
      if (profileData) {
        const { city, governorate } = profileData;
        if (!city || !governorate) {
          setProfileComplete(false);
          toast.warning("Please complete your profile location (City & Governorate) before creating a product.");
        } else {
          setProfileComplete(true);
          setFormData((prev) => ({ 
            ...prev, 
            location: `${city}, ${governorate}` 
          }));
        }
      }
    } catch (error) {
      console.error("Error fetching categories or profile:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMainCategoryChange = (e) => {
    const value = e.target.value;
    setSelectedMainCategory(value);
    setFormData((prev) => ({ ...prev, category_id: value }));
  };

  const handleSubCategoryChange = (e) => {
    const value = e.target.value;
    setFormData((prev) => ({ 
      ...prev, 
      category_id: value || selectedMainCategory 
    }));
  };

  const handleFiles = (files) => {
    if (!files) return;
    const newImages = Array.from(files).map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setImages((prev) => [...prev, ...newImages].slice(0, 10));
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const onDrop = (e) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  const handleSubmit = async () => {
    if (!profileComplete) {
      toast.error("You must complete your profile location first.");
      navigate("/profile");
      return;
    }

    if (!formData.name || !formData.category_id || !formData.price) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("category_id", formData.category_id);
      
      const selectedCategory = categories.find(c => c.id.toString() === formData.category_id.toString());
      data.append("category_name", selectedCategory ? selectedCategory.name : "Uncategorized");

      data.append("description", formData.description);
      data.append("location", formData.location);
      data.append("deposit_amount", formData.deposit_amount);

      if (duration === "hourly") data.append("price_per_hour", formData.price);
      if (duration === "daily") data.append("price_per_day", formData.price);
      if (duration === "weekly") data.append("price_per_week", formData.price);
      if (duration === "monthly") data.append("price_per_month", formData.price);

      images.forEach((img) => {
        data.append("images", img.file);
      });

      await createProduct(data);
      toast.success("Product published successfully!");
      
      const userStr = localStorage.getItem("user");
      let isAdmin = false;
      if (userStr) {
        try {
          const userObj = JSON.parse(userStr);
          if (userObj.Email === "admin@gmail.com") {
            isAdmin = true;
          }
        } catch (e) {}
      }

      if (isAdmin) {
        navigate("/admin/products");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Error publishing product:", error);
      toast.error("Failed to publish product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <main className="flex-1 py-10 px-20 max-w-[960px] mx-auto w-full">
        <h1 className="text-2xl font-bold mb-8 text-[#050F2A]">
          List a New Product
        </h1>

        {/* Drop Zone */}
        <div
          className="border-2 border-dashed rounded-[16px] text-center cursor-pointer mb-6 px-10 py-12 transition-all duration-[220ms] hover:border-[#6366F1]"
          style={{
            borderColor: "#6366F1",
            background: "rgba(99, 102, 241, 0.04)",
          }}
          onClick={() => fileInputRef.current.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={onDrop}
        >
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ background: "rgba(99, 102, 241, 0.15)", color: "#4F46E5" }}
          >
            <CloudUpload size={24} />
          </div>
          <h3 className="text-[16px] font-semibold mb-1 text-[#050F2A]">
            Drag and drop your photos here
          </h3>
          <p className="text-[13px] text-[#64748B]">
            Or click to browse files (Up to 10 images)
          </p>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
        </div>

        {/* Image Previews */}
        <div className="flex flex-wrap gap-4 mb-8">
          {images.map((img, i) => (
            <div
              key={i}
              className="relative group w-[100px] h-[100px] rounded-[12px] border-2 flex items-center justify-center overflow-hidden"
              style={{
                background: "rgba(99, 102, 241, 0.1)",
                borderColor: "rgba(99, 102, 241, 0.2)",
              }}
            >
              <img
                src={img.preview}
                alt=""
                className="w-full h-full object-cover"
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeImage(i);
                }}
                className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={14} className="text-red-500" />
              </button>
            </div>
          ))}
          {images.length < 10 && (
            <button
              onClick={() => fileInputRef.current.click()}
              className="w-[100px] h-[100px] rounded-[12px] border-2 border-dashed flex items-center justify-center text-[22px] cursor-pointer bg-white transition-all duration-[220ms] hover:border-[#6366F1] hover:text-[#4F46E5]"
              style={{ borderColor: "#CBD5E1", color: "#64748B" }}
            >
              <Plus size={24} />
            </button>
          )}
        </div>

        {/* Form Section */}
        <div
          className="bg-white rounded-[16px] px-10 py-8 mb-8"
          style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}
        >
          {/* Row 1: Title + Category */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-[14px] font-semibold mb-2 text-[#334155]">
                Product Title
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-[12px] border border-[#E2E8F0] focus:border-[#6366F1] outline-none transition-all"
                placeholder="What are you renting?"
              />
            </div>
            <div>
              <label className="block text-[14px] font-semibold mb-2 text-[#334155]">
                Category
              </label>
              <div className="grid grid-cols-1 gap-4">
                {/* Main Category */}
                <select
                  value={selectedMainCategory}
                  onChange={handleMainCategoryChange}
                  className="w-full px-4 py-3 rounded-[12px] border border-[#E2E8F0] focus:border-[#6366F1] outline-none transition-all appearance-none bg-no-repeat bg-[right_1rem_center]"
                >
                  <option value="">Select Main Category</option>
                  {categories
                    .filter((cat) => !cat.parent_id)
                    .map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                </select>

                {/* Sub Category - Only shows if main category is selected and has children */}
                {selectedMainCategory && categories.some(c => c.parent_id?.toString() === selectedMainCategory.toString()) && (
                  <select
                    onChange={handleSubCategoryChange}
                    className="w-full px-4 py-3 rounded-[12px] border border-[#E2E8F0] focus:border-[#6366F1] outline-none transition-all appearance-none bg-no-repeat bg-[right_1rem_center]"
                  >
                    <option value="">Select Sub Category (Optional)</option>
                    {categories
                      .filter((cat) => cat.parent_id?.toString() === selectedMainCategory.toString())
                      .map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                  </select>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <label className="block text-[14px] font-semibold mb-2 text-[#334155]">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-4 py-3 rounded-[12px] border border-[#E2E8F0] focus:border-[#6366F1] outline-none transition-all resize-none"
              placeholder="Describe your product in detail (condition, specs, rules)..."
            />
          </div>

          {/* Row 2: Price + Location */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-[14px] font-semibold mb-2 text-[#334155]">
                Price (EGP)
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-[12px] border border-[#E2E8F0] focus:border-[#6366F1] outline-none transition-all"
                placeholder="0.00"
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <label className="block text-[14px] font-semibold mb-2 text-[#334155]">
                Location & Pickup
              </label>
              <div className="relative">
                <MapPin
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]"
                />
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  readOnly
                  className="w-full pl-12 pr-4 py-3 rounded-[12px] border border-[#E2E8F0] bg-gray-50 text-gray-500 cursor-not-allowed outline-none transition-all"
                  placeholder={profileComplete ? "City or full address" : "Please set location in profile"}
                />
              </div>
            </div>
          </div>

          {/* Row 3: Deposit Amount */}
          <div className="mb-6">
            <label className="block text-[14px] font-semibold mb-2 text-[#334155]">
              Security Deposit (EGP)
            </label>
            <input
              type="number"
              name="deposit_amount"
              value={formData.deposit_amount}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-[12px] border border-[#E2E8F0] focus:border-[#6366F1] outline-none transition-all"
              placeholder="0.00"
              min="0"
              step="0.01"
            />
          </div>

          {/* Duration */}
          <div>
            <label className="block text-[14px] font-semibold mb-3 text-[#334155]">
              Rental Price Basis
            </label>
            <div className="flex gap-8">
              {["hourly", "daily", "weekly", "monthly"].map((d) => (
                <label
                  key={d}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <div className="relative flex items-center justify-center">
                    <input
                      type="radio"
                      name="duration"
                      value={d}
                      checked={duration === d}
                      onChange={() => setDuration(d)}
                      className="peer sr-only"
                    />
                    <div className="w-5 h-5 border-2 border-[#CBD5E1] rounded-full peer-checked:border-[#050F2A] transition-all"></div>
                    <div className="absolute w-2.5 h-2.5 bg-[#050F2A] rounded-full scale-0 peer-checked:scale-100 transition-all"></div>
                  </div>
                  <span className="text-[15px] font-medium text-[#475569] group-hover:text-[#050F2A] transition-colors">
                    {d.charAt(0).toUpperCase() + d.slice(1)}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Publish Button */}
        <button
          onClick={handleSubmit}
          disabled={loading || !profileComplete}
          className="w-full md:w-auto md:px-24 block mx-auto font-bold text-[18px] rounded-[12px] py-4 cursor-pointer transition-all duration-[220ms] hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed"
          style={{
            background: "#050F2A",
            color: "#FFFFFF",
            boxShadow: "0 10px 25px rgba(5, 15, 42, 0.2)",
          }}
        >
          {loading ? "Publishing..." : profileComplete ? "Publish Product" : "Complete Profile First"}
        </button>
      </main>
    </div>
  );
};

export default CreateProducts;
