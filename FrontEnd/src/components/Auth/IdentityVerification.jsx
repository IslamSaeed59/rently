import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { verifyId } from "../../server/Api";
import { toast, ToastContainer } from "react-toastify";
import { Upload, CheckCircle, AlertCircle } from "lucide-react";

const IdentityVerification = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState({
    id_front: null,
    id_back: null,
  });
  const [previews, setPreviews] = useState({
    id_front: null,
    id_back: null,
  });

  const [idNumber, setIdNumber] = useState("");

  const handleFileChange = (e) => {
    const { name, files: selectedFiles } = e.target;
    if (selectedFiles && selectedFiles[0]) {
      const file = selectedFiles[0];
      setFiles((prev) => ({ ...prev, [name]: file }));
      setPreviews((prev) => ({ ...prev, [name]: URL.createObjectURL(file) }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!files.id_front || !files.id_back) {
      toast.error("يرجى رفع صورة وجه وخلفية البطاقة");
      return;
    }

    if (!idNumber || idNumber.length !== 14 || !/^\d+$/.test(idNumber)) {
      toast.error("يرجى إدخال الرقم القومي المكون من 14 رقماً صحيحاً");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("id_front", files.id_front);
    formData.append("id_back", files.id_back);
    formData.append("id_number", idNumber); // Pass manual ID to backend

    try {
      const response = await verifyId(formData);

      // Update local storage user status
      const user = JSON.parse(localStorage.getItem("user"));
      user.verification_status = response.status;
      localStorage.setItem("user", JSON.stringify(user));

      if (response.status === "verified") {
        toast.success(response.message);
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else {
        toast.info(response.message);
      }
    } catch (error) {
      const errorMessage =
        typeof error === "string"
          ? error
          : error.message || "فشل التحقق من البطاقة";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#4A3E85] via-[#2D245B] to-[#0B0915] flex items-center justify-center p-4 sm:p-10 text-white">
      <ToastContainer theme="dark" />
      <div className="w-full max-w-4xl bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-[#B1A1FF] to-white bg-clip-text text-transparent">
            توثيق الهوية
          </h1>
          <p className="text-gray-400 max-w-md mx-auto">
            من أجل سلامتك وسلامة الآخرين، يرجى إدخال الرقم القومي ورفع صورة
            واضحة لبطاقة الهوية. سيتم فحص البيانات آلياً لضمان هويتك.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-10">
          {/* National ID Input */}
          <div className="space-y-4">
            <label
              htmlFor="id_number"
              className="block text-sm font-medium text-gray-300"
            >
              الرقم القومي (14 رقم)
            </label>
            <input
              type="text"
              id="id_number"
              value={idNumber}
              onChange={(e) =>
                setIdNumber(e.target.value.replace(/\D/g, "").slice(0, 14))
              }
              className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-[#B1A1FF] focus:ring-1 focus:ring-[#B1A1FF] transition-all text-left"
              dir="ltr"
              maxLength={14}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Front ID Upload */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                وجه البطاقة
              </label>
              <div
                onClick={() => document.getElementById("id_front").click()}
                className="relative h-56 border-2 border-dashed border-white/20 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-[#B1A1FF] hover:bg-white/5 transition-all overflow-hidden group"
              >
                {previews.id_front ? (
                  <img
                    src={previews.id_front}
                    alt="Front"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <>
                    <Upload className="text-4xl text-gray-500 mb-3 group-hover:text-[#B1A1FF] transition-colors" />
                    <span className="text-gray-500 text-sm">
                      اضغط لرفع وجه البطاقة
                    </span>
                  </>
                )}
                <input
                  type="file"
                  id="id_front"
                  name="id_front"
                  className="hidden"
                  onChange={handleFileChange}
                  accept="image/*"
                />
              </div>
            </div>

            {/* Back ID Upload */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                ظهر البطاقة
              </label>
              <div
                onClick={() => document.getElementById("id_back").click()}
                className="relative h-56 border-2 border-dashed border-white/20 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-[#B1A1FF] hover:bg-white/5 transition-all overflow-hidden group"
              >
                {previews.id_back ? (
                  <img
                    src={previews.id_back}
                    alt="Back"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <>
                    <Upload className="text-4xl text-gray-500 mb-3 group-hover:text-[#B1A1FF] transition-colors" />
                    <span className="text-gray-500 text-sm">
                      اضغط لرفع ظهر البطاقة
                    </span>
                  </>
                )}
                <input
                  type="file"
                  id="id_back"
                  name="id_back"
                  className="hidden"
                  onChange={handleFileChange}
                  accept="image/*"
                />
              </div>
            </div>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 flex items-start gap-4">
            <AlertCircle className="text-blue-400 text-xl mt-1 shrink-0" />
            <p className="text-sm text-blue-200">
              تأكد من إدخال الرقم القومي بشكل صحيح ومطابق تماماً للصورة المرفقة.
              سيتم مراجعة البيانات آلياً لتوثيق هويتك.
            </p>
          </div>

          <div className="flex justify-center pt-4">
            <button
              disabled={loading}
              type="submit"
              className="bg-[#B1A1FF] text-black font-bold py-4 px-16 rounded-xl hover:bg-[#9a89f0] transition-all shadow-[0_0_20px_rgba(177,161,255,0.3)] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                  جاري الفحص...
                </>
              ) : (
                "إرسال للتحقق"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default IdentityVerification;
