const express = require("express");
const router = express.Router();

const { getUserProfile, updateUserProfile } = require("../controllers/userController");
const { protect } = require("../middleware/auth");
const { uploadProfileImage } = require("../middleware/upload");

router.get("/:id", getUserProfile);
router.put("/profile", protect, uploadProfileImage.single("profileImage"), updateUserProfile);

module.exports = router;
