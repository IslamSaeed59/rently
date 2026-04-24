import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAllCategories, deleteCategory } from "../../../server/Api";
import { toast } from "react-toastify";
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Grid, 
  ExternalLink,
  MoreVertical,
  ChevronRight
} from "lucide-react";
import * as LucideIcons from "lucide-react";

const Categories = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await getAllCategories();
      setCategories(data);
    } catch (error) {
      toast.error("Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this category? All subcategories will also be deleted.")) {
      try {
        await deleteCategory(id);
        toast.success("Category deleted successfully");
        fetchCategories();
      } catch (error) {
        toast.error("Failed to delete category");
      }
    }
  };

  const filteredCategories = categories.filter(cat => 
    cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cat.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Dynamic Icon Component
  const IconComponent = ({ name, size = 20, className = "" }) => {
    const Icon = LucideIcons[name] || LucideIcons.HelpCircle;
    return <Icon size={size} className={className} />;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#050F2A]">Categories</h1>
          <p className="text-gray-500 mt-1">Manage your product categories and hierarchy.</p>
        </div>
        <Link 
          to="/admin/categories/create"
          className="bg-[#050F2A] text-white px-6 py-3.5 rounded-2xl font-bold flex items-center gap-2 hover:bg-black transition-all shadow-[0_10px_20px_rgba(5,15,42,0.1)] active:scale-95"
        >
          <Plus size={20} /> Add Category
        </Link>
      </div>

      {/* Controls */}
      <div className="bg-white p-4 rounded-[24px] border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search categories by name or slug..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-50 border border-gray-50 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#A78BFA]/20 focus:bg-white transition-all font-medium"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-8 py-5 text-sm font-bold text-[#050F2A] uppercase tracking-wider">Category</th>
                <th className="px-8 py-5 text-sm font-bold text-[#050F2A] uppercase tracking-wider">Slug</th>
                <th className="px-8 py-5 text-sm font-bold text-[#050F2A] uppercase tracking-wider">Parent</th>
                <th className="px-8 py-5 text-sm font-bold text-[#050F2A] uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan="4" className="px-8 py-20 text-center text-gray-400 font-medium">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#050F2A] mx-auto mb-4"></div>
                    Loading categories...
                  </td>
                </tr>
              ) : filteredCategories.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-8 py-20 text-center text-gray-400 font-medium">
                    No categories found.
                  </td>
                </tr>
              ) : (
                filteredCategories.map((category) => (
                  <tr key={category.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-[#A78BFA] group-hover:bg-white transition-colors border border-transparent group-hover:border-gray-100">
                          <IconComponent name={category.icon} />
                        </div>
                        <div>
                          <p className="font-bold text-[#050F2A]">{category.name}</p>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">ID: #{category.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className="bg-gray-50 text-gray-500 px-3 py-1 rounded-lg text-xs font-mono font-medium">
                        {category.slug}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      {category.parent_id ? (
                        <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                          <Grid size={14} className="text-[#A78BFA]" />
                          {categories.find(c => c.id === category.parent_id)?.name || "Unknown"}
                        </div>
                      ) : (
                        <span className="text-gray-300 text-xs font-bold uppercase tracking-widest italic">Top Level</span>
                      )}
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => navigate(`/admin/categories/edit/${category.id}`)}
                          className="p-2.5 rounded-xl text-gray-400 hover:text-[#050F2A] hover:bg-white hover:shadow-sm border border-transparent hover:border-gray-100 transition-all"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(category.id)}
                          className="p-2.5 rounded-xl text-gray-400 hover:text-rose-500 hover:bg-rose-50 transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Categories;
