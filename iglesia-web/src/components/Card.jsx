import React from 'react';

const Card = ({ title, description, bgColor, onClick }) => (
  <div
    className={`${bgColor} text-white p-6 rounded-lg shadow-md hover:shadow-lg cursor-pointer`}
    onClick={onClick}
  >
    <h3 className="text-xl font-bold">{title}</h3>
    <p>{description}</p>
  </div>
);

export default Card;
