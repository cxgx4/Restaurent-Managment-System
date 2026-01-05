// src/components/PaymentModal.jsx
import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react'; // <-- 1. IMPORT FIX

// --- !! IMPORTANT !! ---
// 2. FILL IN YOUR UPI DETAILS HERE
// You can get this from your Google Pay, PhonePe, or Paytm app
const YOUR_UPI_ID = "cherryhere08@oksbi";        // Example: 1234567890@upi
const YOUR_NAME = "Cherry on Top :)";  // Example: "Cherry's Kitchen"
// -------------------------

const PaymentModal = ({ amount, cartItems, onSuccess, onCancel }) => {
  const [processing, setProcessing] = useState(false);

  // This function *trusts* the user has paid
  const handlePaymentConfirmation = async () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      onSuccess({
        method: 'Dynamic UPI QR',
        transaction_id: 'MANUAL_' + Math.random().toString(36).substr(2, 9).toUpperCase(),
        status: 'completed_by_user_confirmation',
        amount: amount
      });
    }, 2000); 
  };

  // Create the dynamic UPI payment string
  const upiString = `upi://pay?pa=${YOUR_UPI_ID}&pn=${encodeURIComponent(YOUR_NAME)}&am=${amount.toFixed(2)}&cu=INR&tn=Order%20Payment`;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full transform scale-100 animate-pop-in">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-t-2xl text-white">
          <h2 className="text-2xl font-bold">Pay with UPI 📱</h2>
          <p className="text-blue-100">Scan the QR code to complete your payment</p>
        </div>

        {/* Order Summary */}
        <div className="p-6 border-b">
          <h3 className="font-semibold text-gray-800 mb-3">Order Summary 🍽️</h3>
          {cartItems.map(item => (
            <div key={item.id} className="flex justify-between text-sm text-gray-600 mb-2">
              <span>{item.name} x {item.qty}</span>
              <span>₹{((item.price_cents * item.qty) / 100).toFixed(2)}</span>
            </div>
          ))}
          <div className="flex justify-between font-bold text-lg mt-3 pt-3 border-t">
            <span>Total Amount:</span>
            <span className="text-green-600">₹{amount.toFixed(2)}</span>
          </div>
        </div>

        {/* QR Code Section */}
        <div className="p-6 text-center">
          <h3 className="font-semibold text-gray-800 mb-4">1. Scan and Pay</h3>
          <div className="bg-gray-100 p-4 rounded-lg inline-block">
            
            {/* 2. COMPONENT RENAME FIX */}
            <QRCodeSVG
              value={upiString}
              size={192} // Sets the size (w-48 h-48 is 192px)
              level={"H"} // High error correction
              includeMargin={true}
              className="rounded-lg"
            />

          </div>
          <p className="text-sm text-gray-500 mt-2">Use any UPI app (Google Pay, PhonePe, etc.)</p>
          <p className="font-semibold text-gray-700 mt-1">The amount of ₹{amount.toFixed(2)} will be pre-filled.</p>

          <h3 className="font-semibold text-gray-800 mt-6 mb-4">2. Confirm Your Order</h3>
          <p className="text-sm text-gray-600 mb-4">
            After paying, click the button below to confirm your order.
          </p>

          {/* Action Buttons */}
          <div className="flex space-x-3 mt-6">
            <button
              onClick={onCancel}
              disabled={processing}
              className="flex-1 bg-gray-500 text-white py-3 rounded-xl font-semibold hover:bg-gray-600 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handlePaymentConfirmation}
              disabled={processing}
              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all transform hover:scale-105 disabled:opacity-50 flex items-center justify-center"
            >
              {processing ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Confirming...
                </>
              ) : (
                "I Have Paid, Confirm Order"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;