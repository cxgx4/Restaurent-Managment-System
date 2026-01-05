import React from 'react';
const StatCard = ({ title, value }) => (
  <div className="bg-white p-6 rounded-lg shadow-md text-center">
    <h3 className="text-lg font-medium text-gray-500">{title}</h3>
    <p className="text-4xl font-bold text-gray-800 mt-2">{value}</p>
  </div>
);
export default StatCard;