const express = require("express");
const router = express.Router();

const {
  createRequest,
  getMyRequests,
  getReceivedRequests,
  acceptRequest,
  rejectRequest,
  activateRequest,
  markReturned,
  confirmReturn,
  cancelRequest,
} = require("../controllers/requestController");
const { protect } = require("../middleware/auth");
const { validate, borrowRequestSchema } = require("../utils/validators");

router.post("/", protect, validate(borrowRequestSchema), createRequest);
router.get("/my", protect, getMyRequests);
router.get("/received", protect, getReceivedRequests);
router.put("/:id/accept", protect, acceptRequest);
router.put("/:id/reject", protect, rejectRequest);
router.put("/:id/activate", protect, activateRequest);
router.put("/:id/return", protect, markReturned);
router.put("/:id/confirm-return", protect, confirmReturn);
router.put("/:id/cancel", protect, cancelRequest);

module.exports = router;
