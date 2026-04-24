import React from "react";
import { ChevronRight, Heart, Eye, Star, ArrowUpRight } from "lucide-react";

const StarRating = ({ score, reviews }) => {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={12}
            className={
              i < score ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
            }
          />
        ))}
      </div>
      <span className="text-[12px] text-gray-400 font-medium">
        ({reviews} reviews)
      </span>
    </div>
  );
};

const products = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=600&auto=format&fit=crop",
    title: "Canon EOS R5 Mirrorless Camera",
    price: "$85.00 / day",
    stars: 5,
    reviews: 124,
    href: "#",
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1603302576837-37561b2e2302?q=80&w=600&auto=format&fit=crop",
    title: "MacBook Pro M2 - 16GB RAM",
    price: "$45.00 / day",
    stars: 4,
    reviews: 89,
    href: "#",
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1555680202-c86f0e12f086?q=80&w=600&auto=format&fit=crop",
    title: "PlayStation 5 Console + 2 Controllers",
    price: "$25.00 / day",
    stars: 5,
    reviews: 210,
    href: "#",
  },
  {
    id: 4,
    image:
      "https://images.unsplash.com/photo-1603302576837-37561b2e2302?q=80&w=600&auto=format&fit=crop",
    title: "MacBook Pro M2 - 16GB RAM",
    price: "$45.00 / day",
    stars: 4,
    reviews: 89,
    href: "#",
  },
];

const MostSearched = () => {
  return (
    <section className="px-6 md:px-20 py-16 bg-gray-50/50">
      {/* Header */}
      <div className="flex items-end justify-between mb-10">
        <div>
          {/* Sub label */}
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1.5 h-4 rounded-full bg-[#8B5CF6]" />
            <span className="text-[13px] font-bold text-[#8B5CF6] uppercase tracking-wider">
              This Month
            </span>
          </div>
          {/* Heading */}
          <h2 className="text-[32px] font-black text-[#050F2A] tracking-tight">
            Most Searched
          </h2>
        </div>

        {/* View All button */}
        <a
          href="#"
          className="flex items-center gap-2 px-6 py-3 bg-[#050F2A] text-white rounded-full text-[14px] font-bold no-underline transition-all duration-300 hover:bg-black hover:shadow-lg active:scale-95"
        >
          View All <ChevronRight size={16} />
        </a>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {products.map(({ id, image, title, price, stars, reviews, href }) => (
          <div
            key={id}
            className="group rounded-3xl bg-white overflow-hidden transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] hover:-translate-y-2 border border-gray-100"
          >
            {/* Image area */}
            <div className="relative h-[240px] overflow-hidden">
              <img
                src={image}
                alt={title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors" />

              {/* Action buttons */}
              <div className="absolute top-4 right-4 flex flex-col gap-2 translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
                <button className="w-10 h-10 rounded-full bg-white text-[#050F2A] shadow-lg flex items-center justify-center hover:bg-[#8B5CF6] hover:text-white transition-colors border-none cursor-pointer">
                  <Heart size={18} />
                </button>
                <button className="w-10 h-10 rounded-full bg-white text-[#050F2A] shadow-lg flex items-center justify-center hover:bg-[#8B5CF6] hover:text-white transition-colors border-none cursor-pointer">
                  <Eye size={18} />
                </button>
              </div>
            </div>

            {/* Card Body */}
            <div className="p-6 flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <h3 className="text-[17px] font-bold text-[#050F2A] group-hover:text-[#8B5CF6] transition-colors line-clamp-1">
                  {title}
                </h3>
                <div className="text-[15px] font-extrabold text-gray-900">
                  {price}
                </div>
              </div>

              <StarRating score={stars} reviews={reviews} />

              <button
                onClick={() => (window.location.href = href)}
                className="mt-4 flex items-center justify-center gap-2 w-full py-4 bg-[#8B5CF6] text-white rounded-2xl text-[15px] font-bold cursor-pointer border-none transition-all duration-300 hover:bg-[#7C3AED] hover:shadow-lg active:scale-[0.98]"
              >
                Rent Now <ArrowUpRight size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default MostSearched;
