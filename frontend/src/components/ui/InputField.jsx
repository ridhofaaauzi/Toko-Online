const InputField = ({
  label,
  type,
  name,
  value,
  onChange,
  error,
  placeholder,
}) => (
  <div className="form-group">
    <label>{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className={error ? "input-error" : ""}
      placeholder={placeholder}
    />
    {error && <span className="input-error-message">{error}</span>}
  </div>
);

export default InputField;
