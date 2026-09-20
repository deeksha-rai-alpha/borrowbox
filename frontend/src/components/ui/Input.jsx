import "./FormField.css";

/**
 * Reusable text input with label + inline error message.
 * Works directly with react-hook-form's register() spread.
 */
const Input = ({ label, error, type = "text", registration = {}, ...rest }) => {
  return (
    <div className="bb-field">
      {label && <label className="bb-field__label">{label}</label>}
      <input
        type={type}
        className={`bb-field__input ${error ? "bb-field__input--error" : ""}`}
        {...registration}
        {...rest}
      />
      {error && <span className="bb-field__error">{error}</span>}
    </div>
  );
};

export default Input;
