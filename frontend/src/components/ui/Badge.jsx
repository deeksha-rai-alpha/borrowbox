import "./Badge.css";

/**
 * Small status pill.
 * tone: "success" | "warning" | "danger" | "info" | "purple"
 */
const Badge = ({ tone = "info", children }) => {
  return <span className={`bb-badge bb-badge--${tone}`}>{children}</span>;
};

export default Badge;
