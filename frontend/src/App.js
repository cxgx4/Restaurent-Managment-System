import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import OrderPage from './pages/OrderPage';
import DashboardPage from './pages/DashboardPage';

function App() {
  return (
    <Router>
      <div className="bg-gray-100 min-h-screen font-sans">
        <nav className="bg-white shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* This line is changed */}
            <div className="flex items-center justify-end h-16">
              {/* <span className="text-2xl font-bold text-gray-800"></span> */}
              <div className="flex space-x-4">
                <Link to="/" className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">Order Food</Link>
                <Link to="/dashboard" className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">Owner Dashboard</Link>
              </div>
            </div>
          </div>
        </nav>
        <main>
          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <Routes>
              <Route path="/" element={<OrderPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}
export default App;