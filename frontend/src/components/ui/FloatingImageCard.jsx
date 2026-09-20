import "./FloatingImageCard.css";

/**
 * Wraps any image in a "floating" rounded card with a soft ambient shadow.
 * On hover the card lifts further and the shadow deepens (as requested).
 * Used for item photos, hero imagery, and gallery shots.
 */
const FloatingImageCard = ({ src, alt, aspect = "4/3", rounded = "lg", offset = false }) => {
  return (
    <div
      className={`bb-float bb-float--${rounded} ${offset ? "bb-float--offset" : ""}`}
      style={{ aspectRatio: aspect }}
    >
      <img src={src} alt={alt} loading="lazy" />
    </div>
  );
};

export default FloatingImageCard;
