import React from 'react';
const LowStockTable = ({ data }) => {
  if (!data || data.length === 0) return <p>All inventory levels are healthy.</p>;
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase">Ingredient</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase">Current Stock</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase">Reorder Level</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((item) => (
            <tr key={item.name}>
              <td className="px-6 py-4 font-medium">{item.name}</td>
              <td className="px-6 py-4 text-red-500 font-bold">{`${item.stock} ${item.unit}`}</td>
              <td className="px-6 py-4">{`${item.reorder_level} ${item.unit}`}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default LowStockTable;