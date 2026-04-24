import React, { useState, useEffect } from "react";
import * as LucideIcons from "lucide-react";
import { getAllCategories } from "../../server/Api";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await getAllCategories();
      // Only show top-level categories on home page
      setCategories(data.filter(cat => !cat.parent_id));
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    } finally {
      setLoading(false);
    }
  };

  // Dynamic Icon Component
  const IconComponent = ({ name, size = 32, strokeWidth = 1.5 }) => {
    const Icon = LucideIcons[name] || LucideIcons.HelpCircle;
    return <Icon size={size} strokeWidth={strokeWidth} />;
  };

  return (
    <section className="px-6 md:px-20 pt-16 pb-10 bg-white">
      {/* Section Title */}
      <div className="flex items-center gap-3 mb-10">
        <div className="w-1.5 h-8 rounded-full bg-[#050F2A]" />
        <h2 className="text-3xl font-black text-[#050F2A] tracking-tight">
          Featured categories
        </h2>
      </div>

      {/* Icons Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8">
        {loading ? (
          // Skeleton Loading
          [...Array(5)].map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-4 animate-pulse">
              <div className="w-20 h-20 rounded-full bg-gray-100" />
              <div className="w-20 h-3 bg-gray-100 rounded" />
            </div>
          ))
        ) : categories.length === 0 ? (
          <div className="col-span-full py-10 text-center text-gray-400 font-medium italic">
            No categories available yet.
          </div>
        ) : (
          categories.map((category) => (
            <a
              key={category.id}
              href={`/category/${category.slug}`}
              className="flex flex-col items-center gap-4 no-underline cursor-pointer group"
            >
              <div className="w-20 h-20 rounded-full flex items-center justify-center bg-[#050F2A] text-white transition-all duration-300 ease-out group-hover:bg-[#A78BFA] group-hover:shadow-xl group-hover:shadow-purple-200 group-hover:-translate-y-2">
                <IconComponent name={category.icon} />
              </div>
              <span className="text-[13px] font-bold text-center text-gray-500 group-hover:text-[#050F2A] transition-colors px-2 leading-tight uppercase tracking-tight">
                {category.name}
              </span>
            </a>
          ))
        )}
      </div>
    </section>
  );
};

export default Categories;
