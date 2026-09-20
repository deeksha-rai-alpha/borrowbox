const Item = require("../models/Item");
const cloudinary = require("../config/cloudinary");
const { asyncHandler } = require("../middleware/errorHandler");

// @desc    Browse / search / filter items (FR-06, FR-07, FR-08)
// @route   GET /api/items
// @access  Public
const getItems = asyncHandler(async (req, res) => {
  const { search, category, condition, location, status, page = 1, limit = 12 } = req.query;

  const query = { isRemoved: false };

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { category: { $regex: search, $options: "i" } },
      { location: { $regex: search, $options: "i" } },
    ];
  }
  if (category) query.category = category;
  if (condition) query.condition = condition;
  if (location) query.location = { $regex: location, $options: "i" };
  if (status) query.status = status;

  const skip = (Number(page) - 1) * Number(limit);

  const [items, total] = await Promise.all([
    Item.find(query)
      .populate("owner", "name rating profileImage location")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    Item.countDocuments(query),
  ]);

  res.status(200).json({
    success: true,
    count: items.length,
    total,
    page: Number(page),
    totalPages: Math.ceil(total / Number(limit)),
    items,
  });
});

// @desc    Get single item details (FR-09)
// @route   GET /api/items/:id
// @access  Public
const getItemById = asyncHandler(async (req, res) => {
  const item = await Item.findById(req.params.id).populate(
    "owner",
    "name rating profileImage location createdAt"
  );

  if (!item || item.isRemoved) {
    return res.status(404).json({ success: false, message: "Item not found" });
  }

  res.status(200).json({ success: true, item });
});

// @desc    Create a new item listing (FR-04)
// @route   POST /api/items
// @access  Private
const createItem = asyncHandler(async (req, res) => {
  const { title, description, category, condition, location } = req.body;

  const images = (req.files || []).map((file) => ({
    url: file.path,
    publicId: file.filename,
  }));

  const item = await Item.create({
    owner: req.user._id,
    title,
    description,
    category,
    condition,
    location,
    images,
  });

  res.status(201).json({ success: true, item });
});

// @desc    Edit own item (FR-05)
// @route   PUT /api/items/:id
// @access  Private
const updateItem = asyncHandler(async (req, res) => {
  const item = await Item.findById(req.params.id);
  if (!item || item.isRemoved) {
    return res.status(404).json({ success: false, message: "Item not found" });
  }

  if (item.owner.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: "You are not authorized to perform this action",
    });
  }

  const fields = ["title", "description", "category", "condition", "location", "status"];
  fields.forEach((field) => {
    if (req.body[field] !== undefined) item[field] = req.body[field];
  });

  // Optionally add newly uploaded images
  if (req.files && req.files.length > 0) {
    const newImages = req.files.map((file) => ({
      url: file.path,
      publicId: file.filename,
    }));
    item.images.push(...newImages);
  }

  await item.save();

  res.status(200).json({ success: true, item });
});

// @desc    Delete own item (FR-05)
// @route   DELETE /api/items/:id
// @access  Private
const deleteItem = asyncHandler(async (req, res) => {
  const item = await Item.findById(req.params.id);
  if (!item) {
    return res.status(404).json({ success: false, message: "Item not found" });
  }

  if (item.owner.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: "You are not authorized to perform this action",
    });
  }

  // remove images from Cloudinary
  for (const img of item.images) {
    if (img.publicId) await cloudinary.uploader.destroy(img.publicId);
  }

  await item.deleteOne();

  res.status(200).json({ success: true, message: "Item deleted successfully" });
});

// @desc    Get items listed by the logged-in user (FR-15)
// @route   GET /api/items/my/listings
// @access  Private
const getMyItems = asyncHandler(async (req, res) => {
  const items = await Item.find({ owner: req.user._id, isRemoved: false }).sort({
    createdAt: -1,
  });
  res.status(200).json({ success: true, count: items.length, items });
});

module.exports = {
  getItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
  getMyItems,
};
