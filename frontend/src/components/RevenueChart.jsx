// src/components/RevenueChart.jsx
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const RevenueChart = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={350}> 
      <LineChart 
        data={data} 
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
        <XAxis dataKey="date" tick={{ fontSize: 12 }} />
        <YAxis 
          tickFormatter={(value) => `₹${value}`} 
          tick={{ fontSize: 12 }} 
          width={80} // Give more space for labels like ₹1000.00
        />
        <Tooltip 
          formatter={(value, name) => [`₹${value.toFixed(2)}`, name]} 
          labelStyle={{ fontWeight: 'bold' }} 
          contentStyle={{ borderRadius: '8px', boxShadow: '2px 2px 10px rgba(0,0,0,0.1)' }}
        />
        <Legend wrapperStyle={{ paddingTop: '20px' }} />
        <Line 
          type="monotone" 
          dataKey="Revenue" 
          stroke="#3b82f6" // Blue
          strokeWidth={3} 
          dot={{ r: 5 }} 
          activeDot={{ r: 8 }} 
        />
        <Line 
          type="monotone" 
          dataKey="Profit" 
          stroke="#10b981" // Green
          strokeWidth={3} 
          dot={{ r: 5 }} 
          activeDot={{ r: 8 }} 
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default RevenueChart;