// src/pages/DashboardPage.jsx
import React, { useEffect, useState } from 'react';
import { getStatsSummary, getMostOrderedItems, getPeakHours, getLowStockAlerts } from '../api';
import StatCard from '../components/StatCard';
import MostOrderedChart from '../components/MostOrderedChart';
import PeakHoursChart from '../components/PeakHoursChart';
import LowStockTable from '../components/LowStockTable';

const DashboardPage = () => {
  const [summary, setSummary] = useState(null);
  const [popularItems, setPopularItems] = useState([]);
  const [peakHours, setPeakHours] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllStats = async () => {
      try {
        const [summaryRes, popularRes, peakRes, lowStockRes] = await Promise.all([
          getStatsSummary(),
          getMostOrderedItems(),
          getPeakHours(),
          getLowStockAlerts(),
        ]);
        setSummary(summaryRes.data);
        setPopularItems(popularRes.data);
        setPeakHours(peakRes.data);
        setLowStock(lowStockRes.data);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllStats();
  }, []);

  if (loading) return <div className="text-center text-xl">Loading Dashboard...</div>;

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">Sales & Inventory Dashboard</h1>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatCard title="Total Sales" value={`₹${summary?.total_sales.toFixed(2)}`} />
        <StatCard title="Total Orders" value={summary?.total_orders} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Most Popular Items</h2>
          <MostOrderedChart data={popularItems} />
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Peak Ordering Hours</h2>
          <PeakHoursChart data={peakHours} />
        </div>
      </div>
      
      {/* Low Stock Alert */}
       <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-red-600">Low Stock Alerts</h2>
          <LowStockTable data={lowStock} />
        </div>
    </div>
  );
};

export default DashboardPage;