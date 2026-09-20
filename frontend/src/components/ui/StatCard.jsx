import "./StatCard.css";

const StatCard = ({ label, value, tone = "default" }) => {
  return (
    <div className={`bb-stat bb-stat--${tone}`}>
      <span className="bb-stat__value">{value}</span>
      <span className="bb-stat__label">{label}</span>
    </div>
  );
};

export default StatCard;
