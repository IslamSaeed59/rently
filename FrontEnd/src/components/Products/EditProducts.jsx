import React, { useState, useRef, useEffect } from "react";
import { CloudUpload, Plus, MapPin, X, ArrowLeft } from "lucide-react";
import { getAllCategories } from "../../server/Api";
import { getProductById, updateProduct } from "../../server/ProductsApi";
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";

const EditProducts = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [duration, setDuration] = useState("daily");

  const [formData, setFormData] = useState({
    name: "",
    category_id: "",
    description: "",
    price: "",
    location: "",
    deposit_amount: 0,
    is_active: true,
    is_available: true,
  });

  const [images, setImages] = useState([]); // { file, preview, id }

  const handleNavigation = () => {
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
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const [categoriesData, product] = await Promise.all([
        getAllCategories(),
        getProductById(id),
      ]);

      setCategories(categoriesData);

      // Determine duration based on which price is set
      let currentPrice = product.price_per_day;
      let currentDuration = "daily";
      if (product.price_per_hour) {
        currentPrice = product.price_per_hour;
        currentDuration = "hourly";
      } else if (product.price_per_week) {
        currentPrice = product.price_per_week;
        currentDuration = "weekly";
      } else if (product.price_per_month) {
        currentPrice = product.price_per_month;
        currentDuration = "monthly";
      }

      setFormData({
        name: product.name,
        category_id: product.category_id,
        description: product.description,
        price: currentPrice || "",
        location: product.location,
        deposit_amount: product.deposit_amount,
        is_active: product.is_active,
        is_available: product.is_available,
      });
      setDuration(currentDuration);

      if (product.images) {
        setImages(
          product.images.map((img) => {
            const previewUrl = img.image_url.startsWith("http")
              ? img.image_url
              : `http://localhost:9000${img.image_url}`;
            return {
              preview: previewUrl,
              id: img.id,
            };
          })
        );
      }
    } catch (error) {
      console.error("Error fetching product data:", error);
      toast.error("Failed to load product details");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
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

  const handleSubmit = async () => {
    if (!formData.name || !formData.category_id || !formData.price) {
      toast.error("Please fill in all required fields");
      return;
    }

    setUpdating(true);
    try {
      const productData = {
        ...formData,
        price_per_hour: duration === "hourly" ? formData.price : null,
        price_per_day: duration === "daily" ? formData.price : null,
        price_per_week: duration === "weekly" ? formData.price : null,
        price_per_month: duration === "monthly" ? formData.price : null,
        images: images.map((img, i) => ({
          image_url: img.preview.startsWith("blob:")
            ? "https://via.placeholder.com/400"
            : img.preview,
          is_primary: i === 0,
          sort_order: i,
        })),
      };

      await updateProduct(id, productData);
      toast.success("Product updated successfully!");
      handleNavigation();
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("Failed to update product");
    } finally {
      setUpdating(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">Loading...</div>
    );

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <main className="flex-1 py-10 px-20 max-w-[960px] mx-auto w-full">
        <button
          onClick={handleNavigation}
          className="flex items-center gap-2 text-[#64748B] hover:text-[#050F2A] mb-6 transition-colors"
        >
          <ArrowLeft size={18} />
          <span>Back to Inventory</span>
        </button>

        <h1 className="text-2xl font-bold mb-8 text-[#050F2A]">Edit Product</h1>

        {/* Drop Zone */}
        <div
          className="border-2 border-dashed rounded-[16px] text-center cursor-pointer mb-6 px-10 py-12 transition-all duration-[220ms] hover:border-[#6366F1]"
          style={{
            borderColor: "#6366F1",
            background: "rgba(99, 102, 241, 0.04)",
          }}
          onClick={() => fileInputRef.current.click()}
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
              />
            </div>
            <div>
              <label className="block text-[14px] font-semibold mb-2 text-[#334155]">
                Category
              </label>
              <select
                name="category_id"
                value={formData.category_id}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-[12px] border border-[#E2E8F0] focus:border-[#6366F1] outline-none transition-all"
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

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
            />
          </div>

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
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-3 rounded-[12px] border border-[#E2E8F0] focus:border-[#6366F1] outline-none transition-all"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-[14px] font-semibold mb-2 text-[#334155]">
                Security Deposit (EGP)
              </label>
              <input
                type="number"
                name="deposit_amount"
                value={formData.deposit_amount}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-[12px] border border-[#E2E8F0] focus:border-[#6366F1] outline-none transition-all"
              />
            </div>
            <div className="flex items-end gap-6 pb-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="is_available"
                  checked={formData.is_available}
                  onChange={handleInputChange}
                  className="w-4 h-4"
                />
                <span className="text-[14px] font-medium text-[#334155]">
                  Available for rent
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleInputChange}
                  className="w-4 h-4"
                />
                <span className="text-[14px] font-medium text-[#334155]">
                  Publicly Visible
                </span>
              </label>
            </div>
          </div>

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
                  <input
                    type="radio"
                    name="duration"
                    value={d}
                    checked={duration === d}
                    onChange={() => setDuration(d)}
                    className="peer sr-only"
                  />
                  <div className="w-5 h-5 border-2 border-[#CBD5E1] rounded-full peer-checked:border-[#050F2A] transition-all relative flex items-center justify-center">
                    <div className="w-2.5 h-2.5 bg-[#050F2A] rounded-full scale-0 peer-checked:scale-100 transition-all"></div>
                  </div>
                  <span className="text-[15px] font-medium text-[#475569] group-hover:text-[#050F2A] transition-colors">
                    {d.charAt(0).toUpperCase() + d.slice(1)}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={updating}
          className="w-full md:w-auto md:px-24 block mx-auto font-bold text-[18px] rounded-[12px] py-4 cursor-pointer transition-all duration-[220ms] hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed"
          style={{
            background: "#050F2A",
            color: "#FFFFFF",
            boxShadow: "0 10px 25px rgba(5, 15, 42, 0.2)",
          }}
        >
          {updating ? "Saving Changes..." : "Update Product"}
        </button>
      </main>
    </div>
  );
};

export default EditProducts;
