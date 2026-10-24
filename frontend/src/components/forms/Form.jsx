function Form({ children, onSubmit, className = "" }) {
  return (
    <form
      onSubmit={onSubmit}
      className={`space-y-5 ${className}`}
    >
      {children}
    </form>
  );
}

export default Form;