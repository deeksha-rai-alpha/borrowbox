import "./FormField.css";

export const Textarea = ({ label, error, registration = {}, rows = 4, ...rest }) => {
  return (
    <div className="bb-field">
      {label && <label className="bb-field__label">{label}</label>}
      <textarea
        rows={rows}
        className={`bb-field__input bb-field__input--textarea ${error ? "bb-field__input--error" : ""}`}
        {...registration}
        {...rest}
      />
      {error && <span className="bb-field__error">{error}</span>}
    </div>
  );
};

export const Select = ({ label, error, options = [], registration = {}, placeholder = "Select...", ...rest }) => {
  return (
    <div className="bb-field">
      {label && <label className="bb-field__label">{label}</label>}
      <select
        className={`bb-field__input bb-field__input--select ${error ? "bb-field__input--error" : ""}`}
        {...registration}
        {...rest}
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      {error && <span className="bb-field__error">{error}</span>}
    </div>
  );
};
