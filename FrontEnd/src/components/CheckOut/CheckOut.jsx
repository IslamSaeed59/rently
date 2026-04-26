import React, { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
  ChevronLeft,
  Calendar,
  Clock,
  CreditCard,
  ShieldCheck,
  Info,
  ArrowRight,
  MapPin,
  CheckCircle2,
} from "lucide-react";
import { createRentalRequest } from "../../server/ProductsApi";

const CheckOut = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { 
    product, 
    rentalDates, 
    pickupTime, 
    returnTime, 
    rentalType, 
    paymentMethod, 
    totalPrice,
    startDateTime,
    endDateTime
  } = location.state || {};

  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <Info size={40} className="text-gray-400" />
        </div>
        <h1 className="text-2xl font-black text-[#050F2A] mb-2">No Booking Data</h1>
        <p className="text-gray-500 mb-8 max-w-md">
          It seems like you reached this page directly. Please go back to the product details to start a booking.
        </p>
        <Link 
          to="/" 
          className="bg-[#050F2A] text-white font-bold py-3 px-8 rounded-xl hover:opacity-90 transition-opacity"
        >
          Back to Home
        </Link>
      </div>
    );
  }

  const formatToMySQL = (dateStr) => {
    const date = new Date(dateStr);
    const pad = (num) => num.toString().padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
  };

  const handleConfirmBooking = async () => {
    setIsSubmitting(true);
    try {
      const payload = {
        product_id: product.id,
        start_datetime: formatToMySQL(startDateTime),
        end_datetime: formatToMySQL(endDateTime),
        rental_type: rentalType,
        total_price: Number(totalPrice) + Number(product.deposit_amount || 0),
        payment_method: paymentMethod,
      };

      await createRentalRequest(payload);
      toast.success("Booking request sent successfully!");
      navigate("/profile/my-rentals");
    } catch (error) {
      toast.error(error.message || "Failed to confirm booking");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const mainImage = product.images?.[0]?.image_url.startsWith("http")
    ? product.images[0].image_url
    : `http://localhost:9000${product.images?.[0]?.image_url}`;

  return (
    <div className="min-h-screen bg-[#FBFBFE] pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-[1100px] mx-auto px-6 py-4 flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-50 rounded-full transition-colors"
          >
            <ChevronLeft size={24} className="text-[#050F2A]" />
          </button>
          <h1 className="text-xl font-black text-[#050F2A]">Confirm and Pay</h1>
        </div>
      </div>

      <div className="max-w-[1100px] mx-auto px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Left Column: Details */}
          <div className="flex-1 space-y-8">
            {/* Trip Details */}
            <section>
              <h2 className="text-2xl font-black text-[#050F2A] mb-6">Your Rental</h2>
              
              <div className="space-y-6">
                {/* Dates */}
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-[#050F2A] mb-1">Dates</h3>
                    <p className="text-gray-500 text-[15px]">
                      {formatDate(rentalDates.start)} 
                      {rentalDates.end && ` - ${formatDate(rentalDates.end)}`}
                    </p>
                  </div>
                  <button onClick={() => navigate(-1)} className="text-[#050F2A] font-bold text-sm underline hover:text-gray-600">
                    Edit
                  </button>
                </div>

                {/* Times */}
                {rentalType === "hourly" && (
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-[#050F2A] mb-1">Time</h3>
                      <p className="text-gray-500 text-[15px]">
                        Pick-up: {pickupTime} • Return: {returnTime}
                      </p>
                    </div>
                    <button onClick={() => navigate(-1)} className="text-[#050F2A] font-bold text-sm underline hover:text-gray-600">
                      Edit
                    </button>
                  </div>
                )}

                {/* Rental Type */}
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-[#050F2A] mb-1">Rental Type</h3>
                    <p className="text-gray-500 text-[15px] capitalize">
                      {rentalType}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <hr className="border-gray-100" />

            {/* Payment Method */}
            <section>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-black text-[#050F2A]">Payment Method</h2>
                <button onClick={() => navigate(-1)} className="text-[#050F2A] font-bold text-sm underline hover:text-gray-600">
                  Change
                </button>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-2xl p-6 flex items-center gap-4 shadow-sm">
                <div className="w-12 h-12 bg-[#F8FAFC] rounded-xl flex items-center justify-center text-[#050F2A]">
                  <CreditCard size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-[#050F2A] capitalize">
                    {paymentMethod.replace('_', ' ')}
                  </h4>
                  <p className="text-sm text-gray-500">Pay directly to the seller upon arrival or via transfer</p>
                </div>
                <div className="ml-auto">
                  <CheckCircle2 size={20} className="text-green-500" />
                </div>
              </div>
            </section>

            <hr className="border-gray-100" />

            {/* Seller info & Safety */}
            <section className="bg-blue-50/50 rounded-2xl p-6 border border-blue-100">
              <div className="flex gap-4">
                <div className="text-blue-600 flex-shrink-0">
                  <ShieldCheck size={28} />
                </div>
                <div>
                  <h4 className="font-bold text-[#050F2A] mb-1">Antigravity Protection</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    We're here for you. Every rental includes support and protection against unexpected issues. 
                    The seller will review your request and confirm within 24 hours.
                  </p>
                </div>
              </div>
            </section>
          </div>

          {/* Right Column: Price Summary Card */}
          <div className="w-full lg:w-[400px]">
            <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-xl shadow-gray-200/50 sticky top-28">
              {/* Product Info */}
              <div className="flex gap-4 mb-8">
                <div className="w-24 h-24 bg-[#F8FAFC] rounded-xl overflow-hidden flex-shrink-0 border border-gray-100 p-2">
                  <img 
                    src={mainImage} 
                    alt={product.name} 
                    className="w-full h-full object-contain mix-blend-multiply"
                  />
                </div>
                <div className="flex flex-col justify-center">
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                    {product.category_name}
                  </p>
                  <h3 className="font-black text-[#050F2A] leading-tight">
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-1 mt-1">
                    <MapPin size={12} className="text-gray-400" />
                    <span className="text-[12px] text-gray-500">{product.location}</span>
                  </div>
                </div>
              </div>

              <hr className="border-gray-100 mb-6" />

              {/* Price Breakdown */}
              <h4 className="text-lg font-black text-[#050F2A] mb-4">Price details</h4>
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-[15px]">
                  <span className="text-gray-500">Rental Fee ({rentalType})</span>
                  <span className="font-bold text-[#050F2A]">{totalPrice} EGP</span>
                </div>
                <div className="flex justify-between text-[15px]">
                  <span className="text-gray-500 underline decoration-dotted">Service fee</span>
                  <span className="font-bold text-[#050F2A]">0 EGP</span>
                </div>
                <div className="flex justify-between text-[15px]">
                  <span className="text-gray-500 underline decoration-dotted">Security deposit</span>
                  <span className="font-bold text-[#050F2A]">{product.deposit_amount || 0} EGP</span>
                </div>
              </div>

              <hr className="border-gray-100 mb-6" />

              <div className="flex justify-between items-center mb-8">
                <span className="text-lg font-black text-[#050F2A]">Total (EGP)</span>
                <span className="text-2xl font-black text-[#050F2A]">
                  {Number(totalPrice) + Number(product.deposit_amount || 0)} EGP
                </span>
              </div>

              {/* Final Button */}
              <button
                onClick={handleConfirmBooking}
                disabled={isSubmitting}
                className={`w-full bg-[#050F2A] text-white font-black py-4 rounded-2xl flex items-center justify-center gap-3 hover:opacity-90 transition-all active:scale-[0.98] ${isSubmitting ? "opacity-70 cursor-not-allowed" : ""}`}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    Confirm Booking
                    <ArrowRight size={20} />
                  </>
                )}
              </button>

              <p className="text-center text-[12px] text-gray-400 mt-6 px-4">
                By clicking the button above, you agree to our <span className="underline cursor-pointer">Terms of Service</span> and <span className="underline cursor-pointer">Rental Policy</span>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckOut;
