import { useState } from "react";
import Modal from "./Modal";
import Button from "./Button";
import { Textarea } from "./FormFields";
import "./ReviewModal.css";

const ReviewModal = ({ isOpen, onClose, onSubmit, itemTitle, loading }) => {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState("");

  const handleSubmit = () => {
    if (rating === 0) return;
    onSubmit({ rating, comment });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Review "${itemTitle}"`}>
      <div className="bb-review">
        <div className="bb-review__stars">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              className={`bb-review__star ${(hovered || rating) >= star ? "is-filled" : ""}`}
              onMouseEnter={() => setHovered(star)}
              onMouseLeave={() => setHovered(0)}
              onClick={() => setRating(star)}
              aria-label={`Rate ${star} stars`}
            >
              ★
            </button>
          ))}
        </div>

        <Textarea
          label="Comment (optional)"
          placeholder="How was the item's condition? Anything the next borrower should know?"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        <Button variant="primary" fullWidth onClick={handleSubmit} disabled={rating === 0 || loading}>
          {loading ? "Submitting..." : "Submit review"}
        </Button>
      </div>
    </Modal>
  );
};

export default ReviewModal;
