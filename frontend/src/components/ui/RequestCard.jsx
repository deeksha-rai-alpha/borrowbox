import { Link } from "react-router-dom";
import Badge from "./Badge";
import Button from "./Button";
import { getItemImage } from "../../utils/imageConfig";
import { formatDateRange, statusMeta } from "../../utils/helpers";
import "./RequestCard.css";

/**
 * Generic request card used in Requests page (received/sent) and My Borrowings.
 * `personLabel` + `personName` describe the other party (e.g. "Borrower" / "Owner").
 * `actions` is an array of { label, variant, onClick, loading } rendered as buttons.
 */
const RequestCard = ({ request, personLabel, personName, actions = [] }) => {
  const status = statusMeta(request.status);
  const item = request.item || {};

  return (
    <div className="bb-reqcard">
      <Link to={`/item/${item._id}`} className="bb-reqcard__image">
        <img src={getItemImage(item)} alt={item.title} />
      </Link>

      <div className="bb-reqcard__body">
        <div className="bb-reqcard__top">
          <Link to={`/item/${item._id}`}>
            <h4>{item.title}</h4>
          </Link>
          <Badge tone={status.tone}>{status.label}</Badge>
        </div>

        <p className="bb-reqcard__dates">{formatDateRange(request.startDate, request.endDate)}</p>
        <p className="bb-reqcard__person">
          {personLabel}: <strong>{personName}</strong>
        </p>
        {request.message && <p className="bb-reqcard__message">"{request.message}"</p>}
      </div>

      {actions.length > 0 && (
        <div className="bb-reqcard__actions">
          {actions.map((action) => (
            <Button
              key={action.label}
              variant={action.variant || "outline"}
              size="sm"
              onClick={action.onClick}
              disabled={action.loading}
            >
              {action.loading ? "Please wait..." : action.label}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};

export default RequestCard;
