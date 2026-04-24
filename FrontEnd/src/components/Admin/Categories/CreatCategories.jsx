import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createCategory, getAllCategories } from "../../../server/Api";
import { toast } from "react-toastify";
import { ChevronLeft, Save, LayoutGrid, Link as LinkIcon, Info } from "lucide-react";

const CreatCategories = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    icon: "",
    slug: "",
    parent_id: ""
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await getAllCategories();
      setCategories(data);
    } catch (error) {
      toast.error("Failed to fetch parent categories");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newData = { ...prev, [name]: value };
      // Auto-generate slug from name if slug is empty or user is typing name
      if (name === "name") {
        newData.slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      }
      return newData;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createCategory({
        ...formData,
        parent_id: formData.parent_id === "" ? null : parseInt(formData.parent_id)
      });
      toast.success("Category created successfully!");
      navigate("/admin/categories");
    } catch (error) {
      toast.error(error.message || "Failed to create category");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <button 
            onClick={() => navigate("/admin/categories")}
            className="flex items-center gap-2 text-gray-500 hover:text-[#050F2A] transition-colors mb-2 font-bold text-sm"
          >
            <ChevronLeft size={16} /> Back to Categories
          </button>
          <h1 className="text-3xl font-black text-[#050F2A]">Create New Category</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm space-y-8">
          {/* Main Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-sm font-bold text-[#050F2A] flex items-center gap-2">
                <Info size={14} className="text-[#A78BFA]" /> Category Name
              </label>
              <input
                required
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Real Estate"
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-[#A78BFA]/20 focus:bg-white transition-all font-medium"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-[#050F2A] flex items-center gap-2">
                <LinkIcon size={14} className="text-[#A78BFA]" /> URL Slug
              </label>
              <input
                required
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                placeholder="real-estate"
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-[#A78BFA]/20 focus:bg-white transition-all font-medium"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-[#050F2A] flex items-center gap-2">
                <LayoutGrid size={14} className="text-[#A78BFA]" /> Lucide Icon Name
              </label>
              <input
                type="text"
                name="icon"
                value={formData.icon}
                onChange={handleChange}
                placeholder="Home, Car, Camera..."
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-[#A78BFA]/20 focus:bg-white transition-all font-medium"
              />
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider pl-1">
                Use any name from Lucide React library
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-[#050F2A] flex items-center gap-2">
                <LayoutGrid size={14} className="text-[#A78BFA]" /> Parent Category
              </label>
              <select
                name="parent_id"
                value={formData.parent_id}
                onChange={handleChange}
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-[#A78BFA]/20 focus:bg-white transition-all font-medium appearance-none"
              >
                <option value="">None (Top Level)</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate("/admin/categories")}
            className="px-8 py-4 rounded-2xl font-bold text-gray-500 hover:bg-gray-100 transition-all"
          >
            Cancel
          </button>
          <button
            disabled={loading}
            type="submit"
            className="bg-[#050F2A] text-white px-10 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-black transition-all shadow-[0_10px_20px_rgba(5,15,42,0.2)] active:scale-95 disabled:opacity-50"
          >
            <Save size={18} />
            {loading ? "Creating..." : "Save Category"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatCategories;
