import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Loader from "../components/ui/Loader";
import { Textarea } from "../components/ui/FormFields";
import { getItemImage } from "../utils/imageConfig";
import { itemStatusMeta, formatDate, getErrorMessage, getInitials } from "../utils/helpers";
import "./ItemDetails.css";

const ItemDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [item, setItem] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [itemRes, reviewsRes] = await Promise.all([
          api.get(`/items/${id}`),
          api.get(`/reviews/item/${id}`),
        ]);
        setItem(itemRes.data.item);
        setReviews(reviewsRes.data.reviews);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) return <Loader label="Loading item..." />;
  if (!item) return <section className="section container">Item not found.</section>;

  const images = item.images?.length > 0 ? item.images.map((i) => i.url) : [getItemImage(item)];
  const isOwner = user && item.owner?._id === user._id;
  const status = itemStatusMeta(item.status);

  const handleRequest = async (e) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");

    if (!user) {
      navigate("/login");
      return;
    }
    if (!startDate || !endDate) {
      setFormError("Please enter a valid date.");
      return;
    }
    if (new Date(endDate) <= new Date(startDate)) {
      setFormError("End date must be after start date.");
      return;
    }

    setSubmitting(true);
    try {
      await api.post("/requests", { item: item._id, startDate, endDate, message });
      setFormSuccess("Your borrow request has been sent to the owner.");
      setStartDate("");
      setEndDate("");
      setMessage("");
    } catch (err) {
      setFormError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="section container bb-item">
      <div className="bb-item__grid">
        {/* ---- Gallery ---- */}
        <div className="bb-item__gallery">
          <div className="bb-item__gallery-main">
            <img src={images[activeImage]} alt={item.title} />
          </div>
          {images.length > 1 && (
            <div className="bb-item__gallery-thumbs">
              {images.map((img, i) => (
                <button
                  key={i}
                  className={`bb-item__thumb ${activeImage === i ? "is-active" : ""}`}
                  onClick={() => setActiveImage(i)}
                >
                  <img src={img} alt={`${item.title} ${i + 1}`} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ---- Info ---- */}
        <div className="bb-item__info">
          <div className="bb-item__top">
            <Badge tone={status.tone}>{status.label}</Badge>
            {isOwner && (
              <Link to={`/edit-item/${item._id}`}>
                <Button variant="ghost" size="sm">Edit item</Button>
              </Link>
            )}
          </div>

          <h1>{item.title}</h1>
          <p className="bb-item__meta">
            {item.category} · {item.condition} · {item.location}
          </p>
          <p className="bb-item__description">{item.description}</p>

          <Link to={`/profile`} className="bb-item__owner">
            <span className="bb-item__owner-avatar">
              {item.owner?.profileImage?.url ? (
                <img src={item.owner.profileImage.url} alt={item.owner.name} />
              ) : (
                <span>{getInitials(item.owner?.name)}</span>
              )}
            </span>
            <span>
              <strong>{item.owner?.name}</strong>
              <span className="text-muted">
                {" "}
                {item.owner?.rating?.average > 0
                  ? `★ ${item.owner.rating.average} rating`
                  : "New lender"}
              </span>
            </span>
          </Link>

          {/* ---- Borrow request form ---- */}
          {!isOwner && (
            <div className="bb-item__request">
              <h4>Request to borrow</h4>
              <form onSubmit={handleRequest} className="bb-item__request-form">
                <div className="bb-item__dates">
                  <div className="bb-field">
                    <label className="bb-field__label">Start date</label>
                    <input
                      type="date"
                      className="bb-field__input"
                      value={startDate}
                      min={new Date().toISOString().split("T")[0]}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </div>
                  <div className="bb-field">
                    <label className="bb-field__label">End date</label>
                    <input
                      type="date"
                      className="bb-field__input"
                      value={endDate}
                      min={startDate || new Date().toISOString().split("T")[0]}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </div>
                </div>

                <Textarea
                  label="Message (optional)"
                  placeholder="Let the owner know what you'll use it for..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={3}
                />

                {formError && <p className="bb-item__form-msg bb-item__form-msg--error">{formError}</p>}
                {formSuccess && <p className="bb-item__form-msg bb-item__form-msg--success">{formSuccess}</p>}

                <Button
                  type="submit"
                  variant="primary"
                  fullWidth
                  disabled={submitting || item.status !== "Available"}
                >
                  {submitting
                    ? "Sending..."
                    : item.status !== "Available"
                    ? "Currently unavailable"
                    : "Send request"}
                </Button>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* ---- Reviews ---- */}
      <div className="bb-item__reviews">
        <h3>Reviews {reviews.length > 0 && `(${reviews.length})`}</h3>
        {reviews.length === 0 ? (
          <p className="text-muted">No reviews yet for this item.</p>
        ) : (
          <div className="bb-item__review-list">
            {reviews.map((review) => (
              <div className="bb-item__review" key={review._id}>
                <div className="flex-between">
                  <strong>{review.borrower?.name}</strong>
                  <span className="bb-item__review-stars">{"★".repeat(review.rating)}</span>
                </div>
                {review.comment && <p>{review.comment}</p>}
                <span className="text-muted">{formatDate(review.createdAt)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ItemDetails;
