import React from 'react';

const Button = ({ children, onClick, type = 'button', color = 'blue' }) => (
  <button
    onClick={onClick}
    type={type}
    className={`bg-${color}-500 text-white py-2 px-4 rounded hover:bg-${color}-600`}
  >
    {children}
  </button>
);

export default Button;
