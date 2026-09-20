import { Link } from "react-router-dom";
import Badge from "./Badge";
import { getItemImage } from "../../utils/imageConfig";
import { itemStatusMeta } from "../../utils/helpers";
import "./ItemCard.css";

const ItemCard = ({ item }) => {
  const status = itemStatusMeta(item.status);

  return (
    <Link to={`/item/${item._id}`} className="bb-itemcard">
      <div className="bb-itemcard__image">
        <img src={getItemImage(item)} alt={item.title} loading="lazy" />
        <span className="bb-itemcard__status">
          <Badge tone={status.tone}>{status.label}</Badge>
        </span>
      </div>

      <div className="bb-itemcard__body">
        <div className="bb-itemcard__top">
          <h4>{item.title}</h4>
          {item.owner?.rating?.average > 0 && (
            <span className="bb-itemcard__rating">★ {item.owner.rating.average}</span>
          )}
        </div>
        <p className="bb-itemcard__meta">
          {item.category} · {item.condition}
        </p>
        <p className="bb-itemcard__location">{item.location}</p>
      </div>
    </Link>
  );
};

export default ItemCard;
