import "./EmptyState.css";

const EmptyState = ({ title, description, action }) => {
  return (
    <div className="bb-empty">
      <div className="bb-empty__icon">◇</div>
      <h4>{title}</h4>
      {description && <p>{description}</p>}
      {action && <div className="bb-empty__action">{action}</div>}
    </div>
  );
};

export default EmptyState;
