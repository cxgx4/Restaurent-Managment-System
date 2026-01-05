import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
const PeakHoursChart = ({ data }) => {
  const formattedData = data.map(d => ({...d, hour_label: d.hour_of_day > 12 ? `${d.hour_of_day - 12} PM` : (d.hour_of_day === 12 ? '12 PM' : `${d.hour_of_day} AM`)})).sort((a,b) => a.hour_of_day - b.hour_of_day);
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={formattedData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="hour_label" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="order_count" fill="#82ca9d" name="Number of Orders" />
      </BarChart>
    </ResponsiveContainer>
  );
};
export default PeakHoursChart;