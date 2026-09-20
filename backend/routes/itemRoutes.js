const express = require("express");
const router = express.Router();

const {
  getItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
  getMyItems,
} = require("../controllers/itemController");
const { protect } = require("../middleware/auth");
const { uploadItemImages } = require("../middleware/upload");
const { validate, itemSchema } = require("../utils/validators");

// IMPORTANT: specific routes before the dynamic ":id" route
router.get("/my/listings", protect, getMyItems);

router.get("/", getItems);
router.get("/:id", getItemById);
router.post("/", protect, uploadItemImages.array("images", 5), validate(itemSchema), createItem);
router.put("/:id", protect, uploadItemImages.array("images", 5), updateItem);
router.delete("/:id", protect, deleteItem);

module.exports = router;
