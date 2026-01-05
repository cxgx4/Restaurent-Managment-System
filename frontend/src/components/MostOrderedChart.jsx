import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
const MostOrderedChart = ({ data }) => (
  <ResponsiveContainer width="100%" height={300}>
    <BarChart data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="item_name" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey="total_sold" fill="#8884d8" name="Units Sold" />
    </BarChart>
  </ResponsiveContainer>
);
export default MostOrderedChart;