import React, { useState } from "react";

interface TextboxInput {
  id: string;
  labelContent: string;
  name: string;
  placeholder?: string; // Optional placeholder prop
  value?: string; // Add value prop to control the input
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void; // Add onChange handler
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export default function Textbox({
  id,
  labelContent,
  name,
  placeholder = "placeholder",
  value,
  onChange,
  onKeyDown
}: TextboxInput) {
  const [isFocused, setIsFocused] = useState(false);
  
  // Only use internal state if value prop is not provided (uncontrolled component)
  const [internalValue, setInternalValue] = useState("");
  
  const handleFocus = () => {
    setIsFocused(true);
  };
  
  const handleBlur = () => {
    setIsFocused(false);
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // If parent provided onChange handler, call it
    if (onChange) {
      onChange(e);
    } else {
      // Otherwise use internal state
      setInternalValue(e.target.value);
    }
  };
  
  // Use either controlled value from props or internal state
  const inputValue = value !== undefined ? value : internalValue;
  
  return (
    <div> 
      <label htmlFor={name} className="text-[18px]">{labelContent}</label>
      <input
        type="text"
        name={name}
        id={id}
        className="w-full border-b-1 mb-3 focus:outline-none text-[20px]"
        placeholder={isFocused ? "" : placeholder}
        value={inputValue}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={onKeyDown}
      />
    </div> 
  );
}