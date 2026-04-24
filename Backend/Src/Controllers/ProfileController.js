const Profile = require("../Models/Auth/Profile");
const bcrypt = require("bcrypt");

// Get user profile
const getProfile = async (req, res) => {
  try {
    // Assumes an auth middleware that populates `req.user` with the authenticated user's data
    const userId = req.user.userId || req.user.id;

    let profile = await Profile.getProfileByUserId(userId);

    // Auto-create missing profile for backward compatibility with older users
    if (!profile) {
      await Profile.createProfile(userId);
      profile = await Profile.getProfileByUserId(userId);
      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }
    }

    res.status(200).json(profile);
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Server error while fetching profile" });
  }
};

// Update user profile
const updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;
    const {
      Firstname,
      LastName,
      Email,
      PhoneNumber,
      bio,
      governorate,
      city,
      profile_image,
    } = req.body;

    await Profile.updateProfile(userId, {
      Firstname,
      LastName,
      Email,
      PhoneNumber,
      bio,
      governorate,
      city,
      profile_image,
    });

    res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Server error while updating profile" });
  }
};

// Password
const changePassword = async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;
    const { password, confirmPassword } = req.body;
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await Profile.changePassword(userId, hashedPassword);

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({ message: "Server error while changing password" });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  changePassword,
};
