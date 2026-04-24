import React, { useState, useEffect } from "react";
import { getProfile, updateProfile, changePassword } from "../../server/Api";
import { toast } from "react-toastify";
import {
  User,
  MapPin,
  Shield,
  Camera,
  Loader2,
  ChevronRight,
  X,
  Check,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import locationsData from "../../locations.json";

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    Firstname: "",
    LastName: "",
    Email: "",
    PhoneNumber: "",
    bio: "",
    governorate: "",
    city: "",
    profile_image: "",
    created_at: "",
  });
  const Navigate = useNavigate();
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    password: "",
    confirmPassword: "",
  });
  const [passwordSaving, setPasswordSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        if (data) {
          setFormData({
            Firstname: data.Firstname || "",
            LastName: data.LastName || "",
            Email: data.Email || "",
            PhoneNumber: data.PhoneNumber || "",
            bio: data.bio || "",
            governorate: data.governorate || "",
            city: data.city || "",
            profile_image: data.profile_image || "",
            created_at: data.created_at || "",
          });
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        if (error.message !== "Profile not found") {
          toast.error("Failed to load profile data.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const newData = { ...prev, [name]: value };
      // Reset city if governorate changes
      if (name === "governorate") {
        newData.city = "";
      }
      return newData;
    });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUploadPhoto = () => {
    const url = window.prompt("Enter image URL for your profile photo:");
    if (url !== null) {
      setFormData((prev) => ({ ...prev, profile_image: url }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile(formData);
      toast.success("Profile updated successfully!");

      // Update local storage user object if it exists so other parts of the app update
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const user = JSON.parse(storedUser);
        user.Firstname = formData.Firstname;
        user.LastName = formData.LastName;
        user.Email = formData.Email;
        user.PhoneNumber = formData.PhoneNumber;
        localStorage.setItem("user", JSON.stringify(user));
        Navigate("/profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(error.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    const { password, confirmPassword } = passwordForm;

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    // Password must be at least 6 characters, contain 1 uppercase, 1 lowercase, 1 number, and 1 symbol
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{6,}$/;

    if (!passwordRegex.test(password)) {
      toast.error(
        "Password must be at least 6 characters long and contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 symbol.",
      );
      return;
    }

    setPasswordSaving(true);
    try {
      await changePassword(password, confirmPassword);
      toast.success("Password changed successfully!");
      setShowPasswordModal(false);
      setPasswordForm({ password: "", confirmPassword: "" });
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error(error.message || "Failed to change password.");
    } finally {
      setPasswordSaving(false);
    }
  };

  const getTimeAgo = (dateString) => {
    if (!dateString) return "Last changed recently";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Last changed recently";

    const now = new Date();
    const diffInMs = now - date;
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return "Last changed today";
    if (diffInDays === 1) return "Last changed yesterday";
    if (diffInDays < 30) return `Last changed ${diffInDays} days ago`;
    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) return `Last changed ${diffInMonths} months ago`;
    const diffInYears = Math.floor(diffInMonths / 12);
    return `Last changed ${diffInYears} year${diffInYears > 1 ? "s" : ""} ago`;
  };

  // Get cities for the selected governorate
  const selectedGov = locationsData.governorates.find(
    (g) => g.name === formData.governorate,
  );
  const availableCities = selectedGov ? selectedGov.cities : [];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[80vh] bg-transparent">
        <Loader2 className="w-12 h-12 animate-spin text-[#0F172A]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans pb-16 relative">
      <div className="max-w-4xl mx-auto px-6 pt-8">
        {/* Breadcrumb */}
        <div className="flex items-center text-[12px] text-gray-500 mb-8 font-medium tracking-wide">
          <Link to="/" className="hover:text-gray-900 transition-colors">
            Home
          </Link>
          <ChevronRight size={12} className="mx-1.5 opacity-50" />
          <Link
            to="/profile"
            className="hover:text-gray-900 transition-colors cursor-pointer"
          >
            Profile
          </Link>
          <ChevronRight size={12} className="mx-1.5 opacity-50" />
          <span className="text-gray-900 font-semibold">Edit Profile</span>
        </div>

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-[28px] font-bold text-[#0F172A] tracking-tight mb-1">
            Edit Profile
          </h1>
          <p className="text-[13px] text-gray-500">
            Manage your public profile and personal settings.
          </p>
        </div>

        <div className="max-w-3xl">
          {/* Avatar Section */}
          <div className="flex flex-col items-center mb-12">
            <div className="relative group">
              <div className="w-[120px] h-[120px] rounded-full bg-[#526077] flex items-center justify-center overflow-hidden shadow-sm">
                {formData.profile_image ? (
                  <img
                    src={formData.profile_image}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User
                    size={64}
                    className="text-white/60 mt-4"
                    strokeWidth={1.5}
                  />
                )}
              </div>
              <button
                type="button"
                onClick={handleUploadPhoto}
                className="absolute bottom-0 right-1 bg-[#0F172A] text-white p-1.5 rounded-full border-2 border-white shadow-sm hover:scale-105 transition-transform"
              >
                <Camera size={14} />
              </button>
            </div>
            <button
              type="button"
              onClick={handleUploadPhoto}
              className="mt-5 px-5 py-2 bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[13px] font-semibold text-[#334155] rounded-full transition-colors"
            >
              Upload New Photo
            </button>
            <p className="text-[11px] text-gray-400 mt-2.5">
              JPG, GIF or PNG. Max size of 2MB.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-12">
            {/* Personal Information */}
            <div>
              <div className="flex items-center gap-2 mb-5">
                <User size={18} className="text-indigo-600" />
                <h2 className="text-[15px] font-bold text-[#1E293B]">
                  Personal Information
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                <div>
                  <label className="block text-[13px] font-bold text-[#334155] mb-1.5">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="Firstname"
                    value={formData.Firstname}
                    onChange={handleChange}
                    className="w-full bg-[#F8FAFC] border border-transparent focus:border-gray-200 rounded-[10px] px-4 py-3 text-[14px] text-gray-800 outline-none transition-colors focus:bg-white focus:ring-2 focus:ring-indigo-100"
                  />
                </div>
                <div>
                  <label className="block text-[13px] font-bold text-[#334155] mb-1.5">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="LastName"
                    value={formData.LastName}
                    onChange={handleChange}
                    className="w-full bg-[#F8FAFC] border border-transparent focus:border-gray-200 rounded-[10px] px-4 py-3 text-[14px] text-gray-800 outline-none transition-colors focus:bg-white focus:ring-2 focus:ring-indigo-100"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                <div>
                  <label className="block text-[13px] font-bold text-[#334155] mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="Email"
                    value={formData.Email}
                    onChange={handleChange}
                    className="w-full bg-[#F8FAFC] border border-transparent focus:border-gray-200 rounded-[10px] px-4 py-3 text-[14px] text-gray-800 outline-none transition-colors focus:bg-white focus:ring-2 focus:ring-indigo-100"
                  />
                </div>
                <div>
                  <label className="block text-[13px] font-bold text-[#334155] mb-1.5">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    name="PhoneNumber"
                    value={formData.PhoneNumber}
                    onChange={handleChange}
                    className="w-full bg-[#F8FAFC] border border-transparent focus:border-gray-200 rounded-[10px] px-4 py-3 text-[14px] text-gray-800 outline-none transition-colors focus:bg-white focus:ring-2 focus:ring-indigo-100"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[13px] font-bold text-[#334155] mb-1.5">
                  Bio
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  className="w-full bg-[#F8FAFC] border border-transparent focus:border-gray-200 rounded-[10px] px-4 py-3 h-[100px] resize-none text-[14px] text-gray-800 outline-none transition-colors focus:bg-white focus:ring-2 focus:ring-indigo-100"
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <div className="flex items-center gap-2 mb-5">
                <MapPin size={18} className="text-indigo-600" />
                <h2 className="text-[15px] font-bold text-[#1E293B]">
                  Location
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                <div className="md:col-span-5">
                  <label className="block text-[13px] font-bold text-[#334155] mb-1.5">
                    Governorate
                  </label>
                  <select
                    name="governorate"
                    value={formData.governorate}
                    onChange={handleChange}
                    className="w-full bg-[#F8FAFC] border border-transparent focus:border-gray-200 rounded-[10px] px-4 py-3 text-[14px] text-gray-800 outline-none transition-colors focus:bg-white focus:ring-2 focus:ring-indigo-100"
                  >
                    <option value="">Select Governorate</option>
                    {locationsData.governorates.map((gov) => (
                      <option key={gov.id} value={gov.name}>
                        {gov.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="md:col-span-7">
                  <label className="block text-[13px] font-bold text-[#334155] mb-1.5">
                    City
                  </label>
                  <select
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    disabled={!formData.governorate}
                    className="w-full bg-[#F8FAFC] border border-transparent focus:border-gray-200 rounded-[10px] px-4 py-3 text-[14px] text-gray-800 outline-none transition-colors focus:bg-white focus:ring-2 focus:ring-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="">Select City</option>
                    {availableCities.map((city) => (
                      <option key={city.id} value={city.name}>
                        {city.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Security */}
            <div>
              <div className="flex items-center gap-2 mb-5">
                <Shield size={18} className="text-indigo-600" />
                <h2 className="text-[15px] font-bold text-[#1E293B]">
                  Security
                </h2>
              </div>
              <div className="bg-[#F8FAFC] rounded-[12px] p-5 flex items-center justify-between">
                <div>
                  <div className="text-[14px] font-bold text-[#1E293B]">
                    Password
                  </div>
                  <div className="text-[12px] text-gray-500 mt-0.5">
                    {getTimeAgo(formData.created_at)}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(true)}
                  className="text-[12px] font-bold text-[#0F172A] bg-white border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
                >
                  Change Password
                </button>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="pt-8 border-t border-gray-100 flex items-center justify-end gap-6 pb-8">
              <Link
                to="/profile"
                className="text-[14px] font-semibold text-gray-500 hover:text-gray-800 transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={saving}
                className="bg-[#0F172A] hover:bg-black text-white text-[14px] font-medium px-8 py-3 rounded-full shadow-sm transition-colors flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed min-w-[140px]"
              >
                {saving ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden transform transition-all">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-[#0F172A]">
                Change Password
              </h3>
              <button
                onClick={() => setShowPasswordModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handlePasswordSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-[13px] font-bold text-[#334155] mb-1.5">
                  New Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={passwordForm.password}
                  onChange={handlePasswordChange}
                  required
                  placeholder="Enter new password"
                  className="w-full bg-[#F8FAFC] border border-gray-200 rounded-[10px] px-4 py-3 text-[14px] text-gray-800 outline-none transition-colors focus:bg-white focus:ring-2 focus:ring-indigo-100"
                />

                {/* Password Requirements Checklist */}
                <div className="mt-4 space-y-2">
                  <div
                    className={`flex items-center gap-2 text-[12px] font-medium transition-colors ${passwordForm.password.length >= 6 ? "text-emerald-600" : "text-gray-400"}`}
                  >
                    {passwordForm.password.length >= 6 ? (
                      <Check size={16} />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-gray-300" />
                    )}
                    <span>At least 6 characters</span>
                  </div>
                  <div
                    className={`flex items-center gap-2 text-[12px] font-medium transition-colors ${/[A-Z]/.test(passwordForm.password) ? "text-emerald-600" : "text-gray-400"}`}
                  >
                    {/[A-Z]/.test(passwordForm.password) ? (
                      <Check size={16} />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-gray-300" />
                    )}
                    <span>At least 1 uppercase letter</span>
                  </div>
                  <div
                    className={`flex items-center gap-2 text-[12px] font-medium transition-colors ${/[a-z]/.test(passwordForm.password) ? "text-emerald-600" : "text-gray-400"}`}
                  >
                    {/[a-z]/.test(passwordForm.password) ? (
                      <Check size={16} />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-gray-300" />
                    )}
                    <span>At least 1 lowercase letter</span>
                  </div>
                  <div
                    className={`flex items-center gap-2 text-[12px] font-medium transition-colors ${/[0-9]/.test(passwordForm.password) ? "text-emerald-600" : "text-gray-400"}`}
                  >
                    {/[0-9]/.test(passwordForm.password) ? (
                      <Check size={16} />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-gray-300" />
                    )}
                    <span>At least 1 number</span>
                  </div>
                  <div
                    className={`flex items-center gap-2 text-[12px] font-medium transition-colors ${/[^A-Za-z0-9]/.test(passwordForm.password) ? "text-emerald-600" : "text-gray-400"}`}
                  >
                    {/[^A-Za-z0-9]/.test(passwordForm.password) ? (
                      <Check size={16} />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-gray-300" />
                    )}
                    <span>At least 1 symbol</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[13px] font-bold text-[#334155] mb-1.5">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordForm.confirmPassword}
                  onChange={handlePasswordChange}
                  required
                  placeholder="Confirm new password"
                  className="w-full bg-[#F8FAFC] border border-gray-200 rounded-[10px] px-4 py-3 text-[14px] text-gray-800 outline-none transition-colors focus:bg-white focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="px-4 py-2 text-[14px] font-semibold text-gray-500 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={passwordSaving}
                  className="bg-[#0F172A] hover:bg-black text-white text-[14px] font-medium px-6 py-2 rounded-lg shadow-sm transition-colors flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {passwordSaving ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    "Update Password"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
