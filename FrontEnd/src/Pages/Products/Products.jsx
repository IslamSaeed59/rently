import React, { useState, useEffect } from "react";
import { getAllProducts, deleteProduct } from "../../server/ProductsApi";
import { getAllCategories } from "../../server/Api";
import { Plus, Edit, Trash2, MapPin, Search, Filter } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    name: "",
    seller_name: "",
    category_id: "",
  });

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await getAllCategories();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await getAllProducts(filters);
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleApplyFilters = () => {
    fetchProducts();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct(id);
        toast.success("Product deleted successfully");
        setProducts(products.filter((p) => p.id !== id));
      } catch (error) {
        console.error("Error deleting product:", error);
        toast.error("Failed to delete product");
      }
    }
  };

  // Filtering is now handled on the server side

  if (loading)
    return (
      <div className="flex justify-center items-center h-64 text-[#050F2A]">
        Loading products...
      </div>
    );

  return (
    <div className="py-10 px-8 max-w-[1400px] mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#050F2A]">
            Product Inventory
          </h1>
          <p className="text-[#64748B] mt-1">
            Manage your listings, prices, and availability
          </p>
        </div>
        <Link
          to="/products/create"
          className="flex items-center gap-2 bg-[#050F2A] text-white px-6 py-3 rounded-[12px] font-semibold hover:-translate-y-1 transition-all shadow-lg active:scale-95"
        >
          <Plus size={20} />
          <span>Add New Product</span>
        </Link>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-[16px] border border-[#E2E8F0] mb-6 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]"
          />
          <input
            type="text"
            name="name"
            placeholder="Search product name..."
            className="w-full pl-12 pr-4 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-[10px] focus:outline-none focus:border-[#050F2A] transition-all"
            value={filters.name}
            onChange={handleFilterChange}
          />
        </div>

        <div className="relative flex-1 w-full">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]"
          />
          <input
            type="text"
            name="seller_name"
            placeholder="Search seller name..."
            className="w-full pl-12 pr-4 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-[10px] focus:outline-none focus:border-[#050F2A] transition-all"
            value={filters.seller_name}
            onChange={handleFilterChange}
          />
        </div>

        <div className="relative flex-1 w-full">
          <select
            name="category_id"
            className="w-full px-4 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-[10px] focus:outline-none focus:border-[#050F2A] transition-all text-[#64748B] appearance-none"
            value={filters.category_id}
            onChange={handleFilterChange}
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <button 
          onClick={handleApplyFilters}
          className="flex items-center gap-2 px-6 py-2.5 bg-[#050F2A] text-white rounded-[10px] hover:bg-[#0f172a] transition-colors whitespace-nowrap font-medium"
        >
          <Filter size={18} />
          <span>Apply Filters</span>
        </button>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-[16px] border border-[#E2E8F0] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F8FAFC] border-bottom border-[#E2E8F0]">
                <th className="px-6 py-4 text-[13px] font-bold text-[#64748B] uppercase tracking-wider">
                  Product & Seller
                </th>
                <th className="px-6 py-4 text-[13px] font-bold text-[#64748B] uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-4 text-[13px] font-bold text-[#64748B] uppercase tracking-wider">
                  Rate
                </th>
                <th className="px-6 py-4 text-[13px] font-bold text-[#64748B] uppercase tracking-wider">
                  Deposit
                </th>
                <th className="px-6 py-4 text-[13px] font-bold text-[#64748B] uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-4 text-[13px] font-bold text-[#64748B] uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-[13px] font-bold text-[#64748B] uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {products.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-20 text-center text-[#94A3B8]"
                  >
                    No products found matching your search.
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr
                    key={product.id}
                    className="hover:bg-[#FBFCFE] transition-colors group"
                  >
                    {/* Product, Image & Seller */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-[10px] bg-[#F1F5F9] overflow-hidden flex-shrink-0 border border-[#E2E8F0]">
                          <img
                            src={
                              product.primary_image
                                ? (product.primary_image.startsWith("http") 
                                    ? product.primary_image 
                                    : `http://localhost:9000${product.primary_image}`)
                                : "https://via.placeholder.com/100?text=No+Image"
                            }
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-bold text-[#050F2A] group-hover:text-[#4F46E5] transition-colors">
                            {product.name}
                          </p>
                          <p className="text-[12px] text-[#94A3B8] mb-1">
                            ID: #{product.id.toString().padStart(5, "0")}
                          </p>
                          <p className="text-[12px] text-[#64748B]">
                            <span className="font-medium text-[#475569]">
                              {product.seller_name || "Unknown"}
                            </span>
                            <span className="text-[#94A3B8] ml-1">
                              (Seller ID: #{product.seller_id})
                            </span>
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-6 py-4">
                      <span className="text-[14px] text-[#475569] bg-[#F1F5F9] px-2.5 py-1 rounded-full font-medium">
                        {product.category_name || "Uncategorized"}
                      </span>
                    </td>

                    {/* Rate */}
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-[#050F2A]">
                          {product.price_per_hour ||
                            product.price_per_day ||
                            product.price_per_week ||
                            product.price_per_month ||
                            "0"}{" "}
                          EGP
                        </span>
                        <span className="text-[12px] text-[#94A3B8]">
                          {product.price_per_hour
                            ? "/hour"
                            : product.price_per_day
                              ? "/day"
                              : product.price_per_week
                                ? "/week"
                                : product.price_per_month
                                  ? "/month"
                                  : ""}
                        </span>
                      </div>
                    </td>

                    {/* Deposit */}
                    <td className="px-6 py-4 text-[#475569] font-medium">
                      {product.deposit_amount
                        ? `${product.deposit_amount} EGP`
                        : "No Deposit"}
                    </td>

                    {/* Location */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-[14px] text-[#64748B]">
                        <MapPin size={14} className="text-[#94A3B8]" />
                        <span className="line-clamp-1 max-w-[150px]">
                          {product.location || "N/A"}
                        </span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-2 h-2 rounded-full ${product.is_active ? "bg-[#16A34A]" : "bg-[#EF4444]"}`}
                          ></div>
                          <span
                            className={`text-[13px] font-bold ${product.is_active ? "text-[#16A34A]" : "text-[#EF4444]"}`}
                          >
                            {product.is_active ? "Visible" : "Hidden"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-2 h-2 rounded-full ${product.is_available ? "bg-[#3B82F6]" : "bg-[#94A3B8]"}`}
                          ></div>
                          <span
                            className={`text-[12px] font-medium ${product.is_available ? "text-[#3B82F6]" : "text-[#64748B]"}`}
                          >
                            {product.is_available ? "Available" : "Unavailable"}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Link
                          to={`/products/edit/${product.id}`}
                          className="p-2 text-[#64748B] hover:text-[#050F2A] hover:bg-[#F1F5F9] rounded-full transition-all"
                          title="Edit"
                        >
                          <Edit size={18} />
                        </Link>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-2 text-[#94A3B8] hover:text-[#EF4444] hover:bg-[#FEF2F2] rounded-full transition-all"
                          title="Delete"
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

export default Products;
