const Input = ({ label, type = "text", value, onChange, placeholder }) => {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="border px-3 py-2 rounded outline-none focus:ring-2 focus:ring-blue-400"
      />
    </div>
  );
};

export default Input;