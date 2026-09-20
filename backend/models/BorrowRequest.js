const mongoose = require("mongoose");

const borrowRequestSchema = new mongoose.Schema(
  {
    item: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
      required: true,
    },
    borrower: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    startDate: {
      type: Date,
      required: [true, "Start date is required"],
    },
    endDate: {
      type: Date,
      required: [true, "End date is required"],
    },
    message: {
      type: String,
      default: "",
      maxlength: 300,
    },
    status: {
      type: String,
      enum: [
        "REQUESTED",
        "ACCEPTED",
        "REJECTED",
        "CANCELLED",
        "ACTIVE",
        "RETURN_PENDING",
        "COMPLETED",
      ],
      default: "REQUESTED",
    },
    requestedAt: {
      type: Date,
      default: Date.now,
    },
    completedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

borrowRequestSchema.index({ item: 1, status: 1 });

module.exports = mongoose.model("BorrowRequest", borrowRequestSchema);
