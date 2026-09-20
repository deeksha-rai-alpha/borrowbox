const express = require("express");
const router = express.Router();

const {
  getStats,
  getAllUsers,
  toggleSuspendUser,
  getAllItemsAdmin,
  removeItem,
} = require("../controllers/adminController");
const { protect } = require("../middleware/auth");
const { authorize } = require("../middleware/roleCheck");

// All admin routes require login AND the "admin" role
router.use(protect, authorize("admin"));

router.get("/stats", getStats);
router.get("/users", getAllUsers);
router.put("/users/:id/suspend", toggleSuspendUser);
router.get("/items", getAllItemsAdmin);
router.put("/items/:id/remove", removeItem);

module.exports = router;
