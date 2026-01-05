// src/components/OrderReceipt.jsx
import React from 'react';

const OrderReceipt = ({ order, onClose }) => {
  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full transform scale-100 animate-pop-in">
        {/* Receipt Header */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 rounded-t-2xl text-white text-center">
          <div className="text-6xl mb-2">🎉</div>
          <h2 className="text-2xl font-bold">Order Successful!</h2>
          <p className="text-green-100">Your food adventure begins now!</p>
        </div>

        {/* Receipt Body */}
        <div className="p-6">
          {/* Order Info */}
          <div className="text-center mb-6">
            <p className="text-sm text-gray-500">Order ID</p>
            <p className="font-mono font-bold text-gray-800">{order.order_id}</p>
            <p className="text-xs text-gray-400 mt-1">
              {formatDate(order.created_at)} at {formatTime(order.created_at)}
            </p>
          </div>

          {/* Order Items */}
          <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 mb-4">
            <h3 className="font-semibold text-gray-800 mb-3 text-center">Your Delicious Order 🍽️</h3>
            {order.items.map((item, index) => (
              <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{item.name}</p>
                  <p className="text-sm text-gray-500">Quantity: {item.qty}</p>
                </div>
                <span className="font-semibold text-gray-900">
                  ₹{((item.price_cents * item.qty) / 100).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <div className="flex justify-between text-lg font-bold">
              <span>Total Paid:</span>
              <span className="text-green-600">₹{((order.total * 1.05) / 100).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-500 mt-1">
              <span>Including tax (5%)</span>
              <span>₹{((order.total * 0.05) / 100).toFixed(2)}</span>
            </div>
          </div>

          {/* Estimated Time */}
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 text-center mb-6">
            <div className="flex items-center justify-center mb-2">
              <span className="text-2xl mr-2">⏰</span>
              <span className="font-semibold text-orange-800">Estimated Delivery Time</span>
            </div>
            <p className="text-2xl font-bold text-orange-600">25-35 minutes</p>
            <p className="text-sm text-orange-500 mt-1">Our chefs are working their magic! ✨</p>
          </div>

          {/* Fun Message */}
          <div className="text-center bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200">
            <p className="text-sm text-purple-800">
              <span className="font-semibold">Pro Tip:</span> Get ready for a flavor explosion! 
              Your taste buds are about to throw a party! 🎊
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg"
          >
            🏠 Continue Exploring Menu
          </button>
          <button className="w-full mt-3 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors">
            📱 Track Your Order
          </button>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 rounded-b-2xl p-4 text-center">
          <p className="text-xs text-gray-500">
            Thank you for choosing Flavor Heaven! ❤️<br />
            We hope to see you again soon!
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderReceipt;