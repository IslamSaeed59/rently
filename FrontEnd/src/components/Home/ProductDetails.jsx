import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Star,
  Heart,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  ShieldCheck,
  MapPin,
  Clock,
  Calendar as CalendarIcon,
} from "lucide-react";
import { getProductById, getProductAvailability, createRentalRequest } from "../../server/ProductsApi";

const FunctionalCalendar = ({ onDateChange, blockedDates = [] }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selection, setSelection] = useState({ start: null, end: null });

  const isBlocked = (day) => {
    const date = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day,
    );
    date.setHours(0, 0, 0, 0);
    return blockedDates.some(d => {
      const bDate = new Date(d);
      bDate.setHours(0, 0, 0, 0);
      return bDate.getTime() === date.getTime();
    });
  };

  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0,
  ).getDate();
  const firstDayOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1,
  ).getDay();

  const handlePrevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1),
    );
  };

  const handleNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1),
    );
  };

  const handleDayClick = (day) => {
    if (isBlocked(day)) return;

    const clickedDate = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day,
    );
    clickedDate.setHours(0, 0, 0, 0);

    let newSelection = { ...selection };
    if (!selection.start || (selection.start && selection.end)) {
      newSelection = { start: clickedDate, end: null };
    } else {
      if (clickedDate < selection.start) {
        newSelection = { start: clickedDate, end: null };
      } else {
        newSelection = { start: selection.start, end: clickedDate };
      }
    }
    setSelection(newSelection);
    if (onDateChange) onDateChange(newSelection);
  };

  const isSelected = (day) => {
    const date = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day,
    );
    date.setHours(0, 0, 0, 0);

    if (selection.start && date.getTime() === selection.start.getTime())
      return "start";
    if (selection.end && date.getTime() === selection.end.getTime())
      return "end";
    if (
      selection.start &&
      selection.end &&
      date > selection.start &&
      date < selection.end
    )
      return "in-range";
    return false;
  };

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const days = ["S", "M", "T", "W", "T", "F", "S"];

  const renderDays = () => {
    const blanks = Array(firstDayOfMonth).fill(null);
    const monthDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const allCells = [...blanks, ...monthDays];

    return allCells.map((day, idx) => {
      if (day === null) {
        return (
          <div key={`blank-${idx}`} className="text-transparent">
            0
          </div>
        );
      }

      const status = isSelected(day);
      const blocked = isBlocked(day);

      if (blocked) {
        return (
          <div
            key={day}
            className="py-1.5 text-gray-300 cursor-not-allowed flex items-center justify-center w-8 h-8 mx-auto line-through"
          >
            {day}
          </div>
        );
      }

      if (status === "start") {
        return (
          <div key={day} className="relative">
            {selection.end && (
              <div className="absolute inset-y-0 right-0 w-1/2 bg-gray-200"></div>
            )}
            <div
              onClick={() => handleDayClick(day)}
              className="relative py-1.5 bg-[#050F2A] text-white rounded-full cursor-pointer z-10 w-8 h-8 flex items-center justify-center mx-auto"
            >
              {day}
            </div>
          </div>
        );
      }

      if (status === "end") {
        return (
          <div key={day} className="relative">
            <div className="absolute inset-y-0 left-0 w-1/2 bg-gray-200"></div>
            <div
              onClick={() => handleDayClick(day)}
              className="relative py-1.5 bg-[#050F2A] text-white rounded-full cursor-pointer z-10 w-8 h-8 flex items-center justify-center mx-auto"
            >
              {day}
            </div>
          </div>
        );
      }

      if (status === "in-range") {
        return (
          <div
            key={day}
            onClick={() => handleDayClick(day)}
            className="py-1.5 bg-gray-200 text-[#050F2A] cursor-pointer h-8 flex items-center justify-center"
          >
            {day}
          </div>
        );
      }

      return (
        <div
          key={day}
          onClick={() => handleDayClick(day)}
          className="py-1.5 cursor-pointer hover:bg-gray-100 rounded-full flex items-center justify-center w-8 h-8 mx-auto"
        >
          {day}
        </div>
      );
    });
  };

  return (
    <div className="border border-gray-200 rounded-lg p-5 mb-6 select-none">
      <div className="flex justify-between items-center mb-6">
        <ChevronLeft
          size={20}
          onClick={handlePrevMonth}
          className="text-gray-400 cursor-pointer hover:text-black transition-colors"
        />
        <span className="font-bold text-sm text-[#050F2A]">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </span>
        <ChevronRight
          size={20}
          onClick={handleNextMonth}
          className="text-gray-400 cursor-pointer hover:text-black transition-colors"
        />
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-bold text-gray-400 mb-4">
        {days.map((d, i) => (
          <div key={i}>{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-y-3 gap-x-0 text-center text-[13px] font-semibold text-[#050F2A] items-center">
        {renderDays()}
      </div>
    </div>
  );
};

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState("");
  const [allImages, setAllImages] = useState([]);
  const [availability, setAvailability] = useState({ blockedDates: [] });

  // State for rent form
  const [rentalDates, setRentalDates] = useState({ start: null, end: null });
  const [pickupTime, setPickupTime] = useState("10:00");
  const [returnTime, setReturnTime] = useState("17:00");
  const [rentalType, setRentalType] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const data = await getProductById(id);
        setProduct(data);

        // Set default rental type
        if (data.price_per_day > 0) setRentalType("daily");
        else if (data.price_per_hour > 0) setRentalType("hourly");
        else if (data.price_per_week > 0) setRentalType("weekly");
        else if (data.price_per_month > 0) setRentalType("monthly");

        let images = [];
        if (data.images && data.images.length > 0) {
          images = data.images.map((img) =>
            img.image_url.startsWith("http")
              ? img.image_url
              : `http://localhost:9000${img.image_url}`,
          );
        } else {
          images = ["https://via.placeholder.com/800?text=No+Image"];
        }

        setAllImages(images);
        setMainImage(images[0]);

        // Fetch availability
        const availData = await getProductAvailability(id);
        
        // Transform availability data: 
        // 1. Identify "Full Day" blocks (where a booking spans across days)
        // 2. Keep raw blackouts for hourly filtering
        const fullDayBlocks = [];
        const rawBlackouts = availData.blackouts || [];
        
        rawBlackouts.forEach(b => {
          const start = new Date(b.start_datetime);
          const end = new Date(b.end_datetime);
          
          // If the booking is more than 24 hours or starts/ends on different days
          // it's a candidate for blocking the whole day in the calendar
          const diffDays = Math.round((end - start) / (1000 * 60 * 60 * 24));
          
          if (diffDays >= 1) {
            let current = new Date(start);
            // We block all days in between fully
            while (current <= end) {
              fullDayBlocks.push(current.toISOString().split('T')[0]);
              current.setDate(current.getDate() + 1);
            }
          }
        });
        
        setAvailability({ 
          blockedDates: fullDayBlocks, 
          rawBlackouts: rawBlackouts 
        });

      } catch (error) {
        console.error("Error fetching product details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  const calculateTotal = () => {
    if (!rentalDates.start || !product) return 0;
    
    const start = new Date(rentalDates.start);
    const end = rentalDates.end ? new Date(rentalDates.end) : new Date(rentalDates.start);
    
    // Difference in days (inclusive, so same day = 1 day)
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.max(1, Math.round(diffTime / (1000 * 60 * 60 * 24)) + 1);
    
    switch (rentalType) {
      case "hourly":
        const [sh, sm] = pickupTime.split(':').map(Number);
        const [eh, em] = returnTime.split(':').map(Number);
        
        // If same day, just diff in hours
        if (diffDays === 1) {
          let hours = eh - sh + (em - sm) / 60;
          if (hours <= 0) hours = 1;
          return (product.price_per_hour || 0) * Math.ceil(hours);
        } else {
          // If multiple days, calculate total hours across days
          let totalHours = (diffDays - 1) * 24 + (eh - sh) + (em - sm) / 60;
          if (totalHours <= 0) totalHours = 1;
          return (product.price_per_hour || 0) * Math.ceil(totalHours);
        }
      case "daily":
        return (product.price_per_day || 0) * diffDays;
      case "weekly":
        const weeks = Math.ceil(diffDays / 7);
        return (product.price_per_week || 0) * weeks;
      case "monthly":
        const months = Math.ceil(diffDays / 30);
        return (product.price_per_month || 0) * months;
      default:
        return 0;
    }
  };

  const totalPrice = calculateTotal();

  const handleRentNow = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.info("Please login to rent this product.");
      navigate("/login");
      return;
    }
    
    if (!rentalDates.start) {
      toast.warning("Please select rental dates from the calendar first.");
      return;
    }

    const formatToMySQL = (date) => {
      const pad = (num) => num.toString().padStart(2, '0');
      return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
    };

    setIsSubmitting(true);
    try {
      const startDateTime = new Date(rentalDates.start);
      const [sh, sm] = pickupTime.split(':');
      startDateTime.setHours(parseInt(sh), parseInt(sm), 0);

      const endDateTime = rentalDates.end ? new Date(rentalDates.end) : new Date(rentalDates.start);
      const [eh, em] = returnTime.split(':');
      endDateTime.setHours(parseInt(eh), parseInt(em), 0);

      const payload = {
        product_id: product.id,
        start_datetime: formatToMySQL(startDateTime),
        end_datetime: formatToMySQL(endDateTime),
        rental_type: rentalType,
        total_price: totalPrice,
        payment_method: paymentMethod,
      };

      await createRentalRequest(payload);
      toast.success("Rental request submitted! Waiting for seller approval.");
      navigate("/profile?tab=requests"); // Assuming this tab exists or just redirect to profile
    } catch (error) {
      toast.error(error.message || "Failed to submit rental request");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Product not found.
      </div>
    );
  }

  const price =
    product.price_per_hour ||
    product.price_per_day ||
    product.price_per_week ||
    product.price_per_month ||
    0;

  // Format description into paragraphs
  const descParagraphs = product.description
    ? product.description.split("\n").filter((p) => p.trim() !== "")
    : [];

  const isTimeBlocked = (time, type) => {
    if (!rentalDates.start || !availability.rawBlackouts) return false;
    
    const selectedDateStr = rentalDates.start.toISOString().split('T')[0];
    const [h, m] = time.split(':').map(Number);
    const checkDateTime = new Date(rentalDates.start);
    checkDateTime.setHours(h, m, 0);

    return availability.rawBlackouts.some(b => {
      const bStart = new Date(b.start_datetime);
      const bEnd = new Date(b.end_datetime);
      // Buffer of 30 mins between rentals
      return checkDateTime >= bStart && checkDateTime <= bEnd;
    });
  };

  const generateTimeOptions = () => {
    const times = [];
    for (let i = 0; i < 24; i++) {
      const hour = i.toString().padStart(2, "0");
      times.push(`${hour}:00`);
      times.push(`${hour}:30`);
    }
    return times;
  };
  const timeOptions = generateTimeOptions();

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[1100px] mx-auto px-6 py-8">
        {/* Breadcrumbs */}
        <div className="text-[13px] text-gray-400 font-medium mb-6 flex items-center gap-2">
          <Link to="/" className="hover:text-gray-600 transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="hover:text-gray-600 transition-colors cursor-pointer">
            {product.category_name || "Category"}
          </span>
          <span>/</span>
          <span className="text-[#050F2A] font-bold">{product.name}</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Left Column (Images & Map) */}
          <div className="flex-1">
            {/* Images Section */}
            <div className="flex gap-4 mb-8">
              {/* Thumbnails */}
              <div className="flex flex-col gap-4 w-[100px] flex-shrink-0">
                {allImages.slice(0, 4).map((img, idx) => (
                  <div
                    key={idx}
                    onClick={() => setMainImage(img)}
                    className={`w-full aspect-square bg-[#F8FAFC] rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${mainImage === img ? "border-[#050F2A]" : "border-transparent hover:border-gray-200"}`}
                  >
                    <img
                      src={img}
                      alt="Thumbnail"
                      className="w-full h-full object-contain p-2 mix-blend-multiply"
                    />
                  </div>
                ))}
              </div>

              {/* Main Image */}
              <div className="flex-1 bg-[#F8FAFC] rounded-xl relative flex items-center justify-center h-[460px]">
                <button 
                  onClick={() => {
                    const token = localStorage.getItem("token");
                    if (!token) {
                      toast.info("Please login to add to favorites.");
                      navigate("/login");
                      return;
                    }
                    toast.success("Added to favorites!");
                  }}
                  className="absolute top-4 right-4 p-2 bg-white rounded border border-gray-200 text-gray-500 hover:text-red-500 transition-colors shadow-sm">
                  <Heart size={20} />
                </button>
                <img
                  src={mainImage}
                  alt={product.name}
                  className="max-w-full max-h-full object-contain p-8 mix-blend-multiply"
                />
              </div>
            </div>

            {/* Map Section */}
            <div className="relative w-full h-[300px] bg-gray-100 rounded-xl overflow-hidden border border-gray-200">
              <iframe
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                src={`https://maps.google.com/maps?q=${encodeURIComponent(product.location || "Egypt")}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
              ></iframe>
            </div>
          </div>

          {/* Right Column (Details) */}
          <div className="w-full lg:w-[400px] flex-shrink-0">
            {/* Title & Rating */}
            <h1 className="text-3xl font-black text-[#050F2A] mb-3">
              {product.name}
            </h1>
            <div className="flex items-center gap-2 mb-6">
              <div className="flex text-yellow-400 gap-0.5">
                <Star size={16} className="fill-current" />
                <Star size={16} className="fill-current" />
                <Star size={16} className="fill-current" />
                <Star size={16} className="fill-current" />
                <Star size={16} className="fill-current opacity-40" />
              </div>
              <span className="text-[13px] text-gray-500 font-medium">
                (150 Reviews)
              </span>
              <span className="text-gray-300 mx-1">|</span>
            </div>

            {/* Price Options */}
            <div className="mb-6 flex flex-wrap gap-3">
              {product.price_per_hour > 0 && (
                <div className="bg-[#F8FAFC] border border-gray-200 px-4 py-2 rounded-lg flex items-baseline">
                  <span className="text-xl font-black text-[#050F2A]">{product.price_per_hour} EGP</span>
                  <span className="text-sm font-medium text-gray-500 ml-1.5">/ hour</span>
                </div>
              )}
              {product.price_per_day > 0 && (
                <div className="bg-[#F8FAFC] border border-gray-200 px-4 py-2 rounded-lg flex items-baseline">
                  <span className="text-xl font-black text-[#050F2A]">{product.price_per_day} EGP</span>
                  <span className="text-sm font-medium text-gray-500 ml-1.5">/ day</span>
                </div>
              )}
              {product.price_per_week > 0 && (
                <div className="bg-[#F8FAFC] border border-gray-200 px-4 py-2 rounded-lg flex items-baseline">
                  <span className="text-xl font-black text-[#050F2A]">{product.price_per_week} EGP</span>
                  <span className="text-sm font-medium text-gray-500 ml-1.5">/ week</span>
                </div>
              )}
              {product.price_per_month > 0 && (
                <div className="bg-[#F8FAFC] border border-gray-200 px-4 py-2 rounded-lg flex items-baseline">
                  <span className="text-xl font-black text-[#050F2A]">{product.price_per_month} EGP</span>
                  <span className="text-sm font-medium text-gray-500 ml-1.5">/ month</span>
                </div>
              )}
              {(!product.price_per_hour && !product.price_per_day && !product.price_per_week && !product.price_per_month) && (
                <div className="bg-[#F8FAFC] border border-gray-200 px-4 py-2 rounded-lg flex items-baseline">
                  <span className="text-xl font-black text-[#050F2A]">0 EGP</span>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="text-[14px] text-gray-600 leading-relaxed mb-8 break-words">
              {descParagraphs.length > 0 ? (
                descParagraphs.map((p, i) => (
                  <p key={i} className="mb-3 last:mb-0">
                    {p}
                  </p>
                ))
              ) : (
                <p>No description available for this product.</p>
              )}
            </div>

            <hr className="border-gray-200 mb-8" />

            {/* Date & Time */}
            <div className="mb-8">
              <h3 className="text-center font-bold text-[#050F2A] mb-4 flex items-center justify-center gap-2">
                <CalendarIcon size={18} />
                Select Dates
              </h3>
              <FunctionalCalendar onDateChange={setRentalDates} blockedDates={availability.blockedDates} />

              <div className="mb-6">
                <label className="block text-[12px] font-bold text-[#050F2A] mb-3">
                  Rental Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {product.price_per_hour > 0 && (
                    <button
                      onClick={() => setRentalType("hourly")}
                      className={`py-2 px-3 rounded-lg text-[12px] font-bold border transition-all ${rentalType === "hourly" ? "bg-[#050F2A] text-white border-[#050F2A]" : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"}`}
                    >
                      Hourly
                    </button>
                  )}
                  {product.price_per_day > 0 && (
                    <button
                      onClick={() => setRentalType("daily")}
                      className={`py-2 px-3 rounded-lg text-[12px] font-bold border transition-all ${rentalType === "daily" ? "bg-[#050F2A] text-white border-[#050F2A]" : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"}`}
                    >
                      Daily
                    </button>
                  )}
                  {product.price_per_week > 0 && (
                    <button
                      onClick={() => setRentalType("weekly")}
                      className={`py-2 px-3 rounded-lg text-[12px] font-bold border transition-all ${rentalType === "weekly" ? "bg-[#050F2A] text-white border-[#050F2A]" : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"}`}
                    >
                      Weekly
                    </button>
                  )}
                  {product.price_per_month > 0 && (
                    <button
                      onClick={() => setRentalType("monthly")}
                      className={`py-2 px-3 rounded-lg text-[12px] font-bold border transition-all ${rentalType === "monthly" ? "bg-[#050F2A] text-white border-[#050F2A]" : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"}`}
                    >
                      Monthly
                    </button>
                  )}
                </div>
              </div>

              {rentalType === "hourly" && (
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-[12px] font-bold text-[#050F2A] mb-2 flex items-center gap-1.5">
                      <Clock size={14} />
                      Pick-up
                    </label>
                    <select
                      value={pickupTime}
                      onChange={(e) => setPickupTime(e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-[13px] font-medium text-[#050F2A] outline-none focus:border-[#050F2A] appearance-none bg-no-repeat bg-[right_1rem_center]"
                      style={{
                        backgroundImage:
                          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E\")",
                      }}
                    >
                      {timeOptions.map((time) => (
                        <option 
                          key={`pickup-${time}`} 
                          value={time}
                          disabled={isTimeBlocked(time, 'pickup')}
                          className={isTimeBlocked(time, 'pickup') ? "text-gray-300" : ""}
                        >
                          {time} {isTimeBlocked(time, 'pickup') ? "(Booked)" : ""}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[12px] font-bold text-[#050F2A] mb-2 flex items-center gap-1.5">
                      <Clock size={14} />
                      Return
                    </label>
                    <select
                      value={returnTime}
                      onChange={(e) => setReturnTime(e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-[13px] font-medium text-[#050F2A] outline-none focus:border-[#050F2A] appearance-none bg-no-repeat bg-[right_1rem_center]"
                      style={{
                        backgroundImage:
                          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E\")",
                      }}
                    >
                      {timeOptions.map((time) => (
                        <option 
                          key={`return-${time}`} 
                          value={time}
                          disabled={isTimeBlocked(time, 'return')}
                          className={isTimeBlocked(time, 'return') ? "text-gray-300" : ""}
                        >
                          {time} {isTimeBlocked(time, 'return') ? "(Booked)" : ""}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* Payment Method Selection */}
            <div className="mb-8">
              <label className="block text-[12px] font-bold text-[#050F2A] mb-3">
                Payment Method
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {[
                  { id: "cash", label: "Cash" },
                  { id: "vodafone_cash", label: "Vodafone Cash" },
                  { id: "instapay", label: "InstaPay" },
                ].map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id)}
                    className={`py-2 px-3 rounded-lg text-[12px] font-bold border transition-all ${
                      paymentMethod === method.id
                        ? "bg-[#050F2A] text-white border-[#050F2A]"
                        : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    {method.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Total Summary */}
            {rentalDates.start && (
              <div className="bg-[#F8FAFC] border border-gray-100 rounded-xl p-4 mb-6">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[13px] text-gray-500 font-medium">Estimated Total</span>
                  <span className="text-xl font-black text-[#050F2A]">{totalPrice} EGP</span>
                </div>
                <p className="text-[11px] text-gray-400">
                  Including deposit and service fees
                </p>
              </div>
            )}

            {/* Rent Button */}
            <button
              onClick={handleRentNow}
              disabled={isSubmitting}
              className={`w-full bg-[#050F2A] text-white font-bold py-4 rounded-xl mb-6 hover:opacity-90 transition-opacity flex items-center justify-center gap-2 ${isSubmitting ? "opacity-70 cursor-not-allowed" : ""}`}
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Processing...
                </>
              ) : (
                "Rent Now"
              )}
            </button>

            {/* Seller Card */}
            <div className="bg-[#FAF8FF] rounded-xl p-4 flex items-center justify-between border border-[#F3EFFF]">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-black rounded-full overflow-hidden flex-shrink-0 relative">
                  {/* Mock profile image */}
                  <img
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&q=80"
                    alt="Seller"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-[14px] text-[#050F2A]">
                    {product.seller_name || "Unknown Seller"}
                  </h4>
                  <p className="text-[11px] text-gray-500 mb-1">
                    Top Lender • 450+ Rentals
                  </p>
                  <div className="flex items-center gap-1 text-[10px] font-bold text-green-500">
                    <ShieldCheck size={12} />
                    VERIFIED
                  </div>
                </div>
              </div>
              <button 
                onClick={() => {
                  const token = localStorage.getItem("token");
                  if (!token) {
                    toast.info("Please login to chat with the seller.");
                    navigate("/login");
                    return;
                  }
                  alert("Opening chat...");
                }}
                className="bg-[#050F2A] text-white text-[11px] font-bold px-4 py-2 rounded-lg hover:opacity-90 transition-opacity flex items-center gap-1.5">
                <MessageSquare size={12} />
                Chat Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
