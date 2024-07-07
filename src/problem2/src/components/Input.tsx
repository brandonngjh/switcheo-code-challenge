import React from 'react';

interface InputProps {
  value: string;
  onChange: (value: string) => void;
}

const Input: React.FC<InputProps> = ({ value, onChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (newValue === "" || /^\d*\.?\d*$/.test(newValue)) {
      onChange(newValue);
    }
  };

  return (
    <input
      placeholder="0"
      className="dark:bg-dark_bg rounded p-2 w-1/2"
      value={value}
      onChange={handleChange}
      maxLength={50}
    />
  );
};

export default Input;
