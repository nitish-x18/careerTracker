function Input({
  id,
  type = "text",
  placeholder = "",
  value,
  onChange,
  name,
  className = "",
  required = false,
  min,
  max,
  disabled = false,
  ...rest
}) {
  return (
    <input
      id={id}
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      min={min}
      max={max}
      disabled={disabled}
      className={`w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-gray-100 ${className}`}
      {...rest}
    />
  );
}

export default Input;