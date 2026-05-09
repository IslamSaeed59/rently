import React, { useState, useEffect } from "react";
import {
  Star,
  Send,
  Trash2,
  User as UserIcon,
  MessageSquareText,
  MoreVertical,
} from "lucide-react";
import {
  getProductReviews,
  addProductReview,
  deleteProductReview,
} from "../../server/ProductsApi";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const ProductReviews = ({ productId, sellerId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });
  const [submitting, setSubmitting] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  const isAdmin = currentUser.Email === "admin@gmail.com";

  const fetchReviews = async () => {
    try {
      const data = await getProductReviews(productId);
      setReviews(data);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (productId) fetchReviews();
  }, [productId]);

  const handleSubmit = async () => {
    if (!localStorage.getItem("token")) {
      toast.info("Please login to leave a review.");
      return;
    }

    if (!newReview.comment.trim()) return;

    try {
      setSubmitting(true);
      await addProductReview({
        product_id: productId,
        rating: newReview.rating,
        comment: newReview.comment,
      });
      setNewReview({ rating: 5, comment: "" });
      setIsInputFocused(false);
      toast.success("Review posted!");
      fetchReviews();
    } catch (error) {
      toast.error(error.message || "Failed to add review");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Delete comment?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#050F2A",
      cancelButtonColor: "#ef4444",
      confirmButtonText: "Delete",
    });

    if (result.isConfirmed) {
      try {
        await deleteProductReview(id);
        fetchReviews();
      } catch (error) {
        toast.error("Failed to delete review");
      }
    }
  };

  const renderStars = (rating, setRating = null) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={setRating ? 20 : 12}
            className={`${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200"} ${setRating ? "cursor-pointer transition-transform hover:scale-110" : ""}`}
            onClick={() => setRating && setRating(star)}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="mt-16 max-w-[850px] mx-auto border-t border-gray-100 pt-12 px-4">
      <div className="flex items-center gap-4 mb-8">
        <h2 className="text-xl font-bold text-[#050F2A]">
          {reviews.length} Comments
        </h2>
      </div>

      {/* Modern Input Section (YouTube Style) */}
      <div className="flex gap-4 mb-12">
        <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden flex-shrink-0">
          {currentUser.id_front ? (
            <img
              src={
                currentUser.id_front.startsWith("http")
                  ? currentUser.id_front
                  : `http://localhost:9000${currentUser.id_front}`
              }
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-50">
              <UserIcon size={20} />
            </div>
          )}
        </div>
        <div className="flex-1">
          <input
            type="text"
            placeholder="Add a comment..."
            value={newReview.comment}
            onFocus={() => setIsInputFocused(true)}
            onChange={(e) =>
              setNewReview({ ...newReview, comment: e.target.value })
            }
            className="w-full border-b border-gray-200 py-1 text-sm focus:outline-none focus:border-[#050F2A] transition-colors bg-transparent placeholder-gray-500"
          />
          {isInputFocused && (
            <div className="flex flex-col mt-4 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                    Rate:
                  </span>
                  {renderStars(newReview.rating, (val) =>
                    setNewReview({ ...newReview, rating: val }),
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setIsInputFocused(false);
                      setNewReview({ rating: 5, comment: "" });
                    }}
                    className="px-4 py-2 text-sm font-bold text-[#050F2A] hover:bg-gray-100 rounded-full transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={!newReview.comment.trim() || submitting}
                    className={`px-4 py-2 text-sm font-bold rounded-full transition-all ${
                      newReview.comment.trim()
                        ? "bg-[#050F2A] text-white shadow-md hover:bg-[#050F2A]/90"
                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    {submitting ? "Posting..." : "Comment"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-8">
        {loading ? (
          <div className="py-10 text-center">
            <div className="w-6 h-6 border-2 border-[#050F2A]/10 border-t-[#050F2A] rounded-full animate-spin mx-auto"></div>
          </div>
        ) : reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review.id} className="group flex gap-4">
              <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden flex-shrink-0 border border-gray-50">
                {review.user_image ? (
                  <img
                    src={
                      review.user_image.startsWith("http")
                        ? review.user_image
                        : `http://localhost:9000${review.user_image}`
                    }
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <UserIcon size={18} />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[13px] font-bold text-[#050F2A] hover:underline cursor-pointer">
                    @{review.Firstname.toLowerCase()}
                    {review.LastName.toLowerCase()}
                  </span>
                  <span className="text-[11px] text-gray-400 font-medium">
                    {new Date(review.created_at).toLocaleDateString()}
                  </span>
                  {renderStars(review.rating)}
                </div>
                <p className="text-[14px] text-gray-800 leading-normal mb-2 pr-8">
                  {review.comment}
                </p>
                <div className="flex items-center gap-4 text-[12px] font-bold text-gray-500">
                  {(currentUser.id === sellerId || isAdmin) && (
                    <button
                      onClick={() => handleDelete(review.id)}
                      className="text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 ml-auto"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="py-20 text-center border-y border-gray-50">
            <MessageSquareText
              size={32}
              className="mx-auto text-gray-200 mb-2"
            />
            <p className="text-gray-400 text-sm font-medium">
              No comments yet. Start the conversation!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductReviews;
