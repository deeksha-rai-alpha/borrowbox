const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: [true, "Item title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: [
        "Books",
        "Cameras & Electronics",
        "Tools",
        "Camping & Outdoor",
        "Sports Equipment",
        "Party & Decorations",
        "Agricultural Tools",
        "Study Materials",
        "Other",
      ],
    },
    condition: {
      type: String,
      required: [true, "Condition is required"],
      enum: ["New", "Good", "Fair", "Worn"],
    },
    images: [
      {
        url: { type: String, required: true },
        publicId: { type: String, required: true },
      },
    ],
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
    },
    status: {
      type: String,
      enum: ["Available", "Reserved", "Borrowed"],
      default: "Available",
    },
    isRemoved: {
      type: Boolean,
      default: false, // used when admin removes an inappropriate item
    },
  },
  { timestamps: true }
);

// Useful indexes for search & filter performance (NFR-02)
itemSchema.index({ title: "text", description: "text" });
itemSchema.index({ category: 1, location: 1, status: 1 });

module.exports = mongoose.model("Item", itemSchema);
