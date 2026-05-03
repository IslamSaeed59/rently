const { execFile } = require("child_process");
const path = require("path");
const User = require("../Models/User");

// Helper function to validate Egyptian National ID mathematically and against profile
const validateEgyptianID = (idNumber, userDateOfBirth, userGender) => {
  if (!/^\d{14}$/.test(idNumber)) {
    return { isValid: false, message: "الرقم القومي يجب أن يتكون من 14 رقماً" };
  }

  // Check Century (2 for 1900s, 3 for 2000s)
  const centuryDigit = parseInt(idNumber.charAt(0));
  if (centuryDigit !== 2 && centuryDigit !== 3) {
    return { isValid: false, message: "الرقم القومي غير صالح (خطأ في قرن الميلاد)" };
  }
  const century = centuryDigit === 2 ? 1900 : 2000;

  // Extract Date of Birth from ID
  const year = century + parseInt(idNumber.substring(1, 3));
  const month = parseInt(idNumber.substring(3, 5));
  const day = parseInt(idNumber.substring(5, 7));

  // Date validation
  if (month < 1 || month > 12 || day < 1 || day > 31) {
    return { isValid: false, message: "تاريخ الميلاد في الرقم القومي غير صالح" };
  }

  // Cross-match with user profile (if they entered their DoB during signup)
  if (userDateOfBirth && userDateOfBirth !== "0000-00-00") {
    const userDob = new Date(userDateOfBirth);
    if (!isNaN(userDob.getTime())) {
      if (userDob.getFullYear() !== year || (userDob.getMonth() + 1) !== month || userDob.getDate() !== day) {
        return { isValid: false, message: "الرقم القومي المدخل لا يطابق تاريخ ميلادك المسجل في الحساب" };
      }
    }
  }

  // Cross-match Gender
  const genderDigit = parseInt(idNumber.charAt(12));
  const expectedGender = genderDigit % 2 === 0 ? 'female' : 'male';
  
  if (userGender && userGender !== "Other") {
    if (userGender.toLowerCase() !== expectedGender) {
       return { isValid: false, message: "الرقم القومي المدخل لا يطابق نوعك (ذكر/أنثى) المسجل في الحساب" };
    }
  }
  
  return { isValid: true, message: "الرقم القومي صالح" };
}

exports.verifyId = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id_number } = req.body; // Manually entered ID

    if (!req.files || !req.files.id_front || !req.files.id_back) {
      return res.status(400).json({ message: "الرجاء رفع صورة وجه وخلفية البطاقة" });
    }

    if (!id_number) {
      return res.status(400).json({ message: "الرجاء إدخال الرقم القومي" });
    }

    // 1. Fetch user data to cross-match
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "المستخدم غير موجود" });
    }

    // 2. Validate National ID mathematically & cross-match
    const validation = validateEgyptianID(id_number, user.DateofBrith, user.Gender);
    if (!validation.isValid) {
      return res.status(400).json({ message: validation.message });
    }

    const frontImagePath = req.files.id_front[0].path;

    console.log("Valid ID entered. Running Python OCR to verify image authenticity...");

    const pythonScriptPath = path.join(__dirname, "..", "Python", "extract_id.py");

    // 3. Execute Python script to check if image IS an ID card
    execFile("python", [pythonScriptPath, frontImagePath], (error, stdout, stderr) => {
      if (error) {
        console.error("Python Execution Error:", error);
        console.error("stderr:", stderr);
        return res.status(500).json({ message: "حدث خطأ أثناء فحص الصورة عبر الذكاء الاصطناعي." });
      }

      try {
        const result = JSON.parse(stdout);

        if (result.error) {
          console.error("OCR Script Error:", result.error);
          return res.status(500).json({ message: "فشل فحص الصورة المرفقة." });
        }

        console.log("Python Keywords Result:", result.has_keywords);

        // Verify Keywords (MUST be an ID card)
        if (!result.has_keywords) {
          return res.status(400).json({ 
            message: "الصورة المرفقة لا يبدو أنها بطاقة هوية حقيقية. يرجى تصوير البطاقة الأصلية بوضوح." 
          });
        }

        // Success! ID is mathematically correct, matches user profile, AND the photo is a real ID card
        const updateData = {
          id_front: req.files.id_front[0].filename,
          id_back: req.files.id_back[0].filename,
          verification_status: "verified",
          id_number: id_number
        };

        User.updateVerification(userId, updateData)
          .then(() => {
            res.status(200).json({ 
              message: "تم توثيق هويتك بنجاح!",
              status: "verified",
              id_number: id_number
            });
          })
          .catch(dbError => {
            console.error("Database Error:", dbError);
            res.status(500).json({ message: "حدث خطأ في تحديث قاعدة البيانات." });
          });

      } catch (parseError) {
        console.error("Error parsing Python output:", parseError);
        console.log("Raw Output:", stdout);
        res.status(500).json({ message: "خطأ في قراءة مخرجات نظام الفحص." });
      }
    });

  } catch (error) {
    console.error("Verification Controller Error:", error);
    res.status(500).json({ message: "حدث خطأ غير متوقع." });
  }
};
