import "./Button.css";

/**
 * Reusable pill Button.
 * variant: "primary" | "outline" | "ghost" | "danger"
 * size: "md" | "sm"
 */
const Button = ({
  children,
  variant = "primary",
  size = "md",
  type = "button",
  disabled = false,
  fullWidth = false,
  icon = null,
  onClick,
  ...rest
}) => {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`bb-btn bb-btn--${variant} bb-btn--${size} ${fullWidth ? "bb-btn--full" : ""}`}
      {...rest}
    >
      {icon && <span className="bb-btn__icon">{icon}</span>}
      <span>{children}</span>
    </button>
  );
};

export default Button;
