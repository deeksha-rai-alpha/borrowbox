const User = require("../models/User");
const Item = require("../models/Item");
const BorrowRequest = require("../models/BorrowRequest");
const cloudinary = require("../config/cloudinary");
const { asyncHandler } = require("../middleware/errorHandler");

// @desc    Get a user's public profile + basic activity stats (FR-03)
// @route   GET /api/users/:id
// @access  Public
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  const [itemsListed, itemsLent, itemsBorrowed] = await Promise.all([
    Item.countDocuments({ owner: user._id, isRemoved: false }),
    BorrowRequest.countDocuments({ owner: user._id, status: "COMPLETED" }),
    BorrowRequest.countDocuments({ borrower: user._id, status: "COMPLETED" }),
  ]);

  res.status(200).json({
    success: true,
    user: {
      _id: user._id,
      name: user.name,
      profileImage: user.profileImage,
      location: user.location,
      bio: user.bio,
      rating: user.rating,
      createdAt: user.createdAt,
    },
    stats: { itemsListed, itemsLent, itemsBorrowed },
  });
});

// @desc    Update own profile (name, phone, location, bio, image)
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  user.name = req.body.name ?? user.name;
  user.phone = req.body.phone ?? user.phone;
  user.location = req.body.location ?? user.location;
  user.bio = req.body.bio ?? user.bio;

  // If a new profile image file was uploaded via multer-cloudinary
  if (req.file) {
    // remove old image from Cloudinary if one exists
    if (user.profileImage?.publicId) {
      await cloudinary.uploader.destroy(user.profileImage.publicId);
    }
    user.profileImage = {
      url: req.file.path,
      publicId: req.file.filename,
    };
  }

  await user.save();

  res.status(200).json({
    success: true,
    user,
  });
});

module.exports = { getUserProfile, updateUserProfile };
