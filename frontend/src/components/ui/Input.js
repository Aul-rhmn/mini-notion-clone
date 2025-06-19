import React from 'react';

const Input = React.forwardRef(({ type = 'text', placeholder, className, ...props }, ref) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      ref={ref}
      {...props}
      className={`w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
    />
  );
});

export default Input;