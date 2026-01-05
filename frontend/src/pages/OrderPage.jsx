// src/pages/OrderPage.jsx
import React, { useState, useEffect } from 'react';
import { getMenu, placeOrder } from '../api';
import PaymentModal from '../components/PaymentModal';
import OrderReceipt from '../components/OrderReceipt';

const OrderPage = () => {
  const [groupedMenu, setGroupedMenu] = useState({});
  const [cart, setCart] = useState({});
  const [status, setStatus] = useState({ message: '', type: '' });
  const [showPayment, setShowPayment] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [activeCategory, setActiveCategory] = useState('');

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setStatus({ message: 'Loading our delicious menu... 🍕', type: 'info' });
        const response = await getMenu();
        const grouped = response.data.reduce((acc, item) => {
          const category = item.category || 'Other';
          if (!acc[category]) acc[category] = [];
          acc[category].push(item);
          return acc;
        }, {});
        setGroupedMenu(grouped);
        setActiveCategory(Object.keys(grouped)[0] || '');
        setStatus({ message: '', type: '' });
      } catch (error) {
        setStatus({ message: 'Failed to load menu. Our chefs are working on it! 🔧', type: 'error' });
      }
    };
    fetchMenu();
  }, []);

  const handleUpdateCart = (item, quantity) => {
    setCart(prevCart => {
      const newCart = { ...prevCart };
      if (quantity > 0) {
        newCart[item.id] = { ...item, qty: quantity };
      } else {
        delete newCart[item.id];
      }
      return newCart;
    });
  };

  const handleProceedToPayment = () => {
    if (Object.keys(cart).length === 0) {
      setStatus({ message: 'Your cart is looking lonely! Add some delicious items first! 🍽️', type: 'error' });
      return;
    }
    setShowPayment(true);
  };

  const handlePaymentSuccess = async (paymentDetails) => {
    try {
      setStatus({ message: 'Finalizing your order... Almost there! 🎉', type: 'info' });
      const orderItems = Object.values(cart).map(({ id, qty }) => ({ menu_item_id: id, qty }));
      
      const response = await placeOrder({ 
        items: orderItems,
        payment_details: paymentDetails
      });
      
      setCurrentOrder({
        ...response.data,
        items: Object.values(cart),
        total: cartTotal
      });
      
      setShowPayment(false);
      setShowReceipt(true);
      setCart({});
      setStatus({ message: '', type: '' });
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 'Failed to place order. Our kitchen is having a meltdown! 🔥';
      setStatus({ message: `Error: ${errorMessage}`, type: 'error' });
    }
  };

  const cartTotal = Object.values(cart).reduce((total, item) => total + item.price_cents * item.qty, 0);

  // Witty food comments based on items
  const getWittyComment = (item) => {
    const comments = {
      'pizza': '🍕 So cheesy, it should be illegal!',
      'pasta': '🍝 Twirls of happiness in every bite!',
      'burger': '🍔 So good, you\'ll want to write a love song about it!',
      'sushi': '🍣 Fresh AF - your taste buds will thank you!',
      'salad': '🥗 Eating healthy never tasted so naughty!',
      'curry': '🍛 Spicy enough to make your ancestors proud!',
      'dessert': '🍰 Because calories don\'t count when you\'re happy!',
      'default': '✨ So delicious, you\'ll forget your own name!'
    };

    const itemName = item.name.toLowerCase();
    for (const [key, comment] of Object.entries(comments)) {
      if (itemName.includes(key)) return comment;
    }
    return comments.default;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          🍒 Cherry on Top 🍒
        </h1>
        <p className="text-xl text-gray-600">
          Where every bite tells a delicious story! 📖
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          {/* Category Navigation */}
          <div className="lg:col-span-1 bg-white rounded-2xl shadow-lg p-6 sticky top-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Food Categories 🎯</h3>
            <div className="space-y-2">
              {Object.keys(groupedMenu).map(category => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-300 ${
                    activeCategory === category 
                      ? 'bg-orange-500 text-white transform scale-105 shadow-lg' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <span className="font-semibold">{category}</span>
                  <span className="text-sm opacity-75 ml-2">
                    ({groupedMenu[category].length} items)
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Menu Section */}
          <div className="lg:col-span-2 space-y-8">
            {Object.entries(groupedMenu).map(([category, items]) => (
              <div 
                key={category} 
                className={`transition-all duration-500 ${
                  activeCategory === category ? 'opacity-100' : 'opacity-40'
                }`}
              >
                <div className="flex items-center mb-6">
                  <h2 className="text-4xl font-bold text-gray-800 border-b-4 border-orange-500 pb-2 flex-1">
                    {category}
                  </h2>
                  <span className="text-sm text-gray-500 bg-orange-100 px-3 py-1 rounded-full ml-4">
                    {items.length} delicious options
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {items.map(item => {
                    const cartItem = cart[item.id];
                    return (
                      <div 
                        key={item.id} 
                        className="bg-white rounded-2xl shadow-lg overflow-hidden transform hover:scale-105 transition-all duration-300 hover:shadow-2xl"
                      >
                        <div className="relative">
                          <img 
                            className="w-full h-48 object-cover" 
                            src={item.image_url} 
                            alt={item.name}
                            onError={(e) => {
                              e.target.src = `https://source.unsplash.com/400x300/?${item.name.split(' ')[0]},food`;
                            }}
                          />
                          <div className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                            ₹{(item.price_cents / 100).toFixed(2)}
                          </div>
                        </div>
                        
                        <div className="p-6">
                          <h3 className="text-xl font-bold text-gray-900 mb-2">
                            {item.name}
                          </h3>
                          <p className="text-gray-600 text-sm mb-3">
                            {getWittyComment(item)}
                          </p>
                          
                          <div className="mt-4">
                            {!cartItem ? (
                              <button 
                                onClick={() => handleUpdateCart(item, 1)}
                                className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold py-3 rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
                              >
                                🛒 Add to Cart • ₹{(item.price_cents / 100).toFixed(2)}
                              </button>
                            ) : (
                              <div className="flex items-center justify-between bg-gray-100 rounded-xl p-2">
                                <button 
                                  onClick={() => handleUpdateCart(item, cartItem.qty - 1)}
                                  className="bg-gray-300 text-gray-800 w-10 h-10 rounded-full font-bold text-lg hover:bg-gray-400 transition-colors"
                                >
                                  −
                                </button>
                                <div className="text-center">
                                  <span className="text-2xl font-bold text-gray-900">{cartItem.qty}</span>
                                  <p className="text-xs text-gray-500">in cart</p>
                                </div>
                                <button 
                                  onClick={() => handleUpdateCart(item, cartItem.qty + 1)}
                                  className="bg-orange-500 text-white w-10 h-10 rounded-full font-bold text-lg hover:bg-orange-600 transition-colors"
                                >
                                  +
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Cart Section */}
          <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-xl sticky top-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Your Cart 🛒</h2>
              {Object.keys(cart).length > 0 && (
                <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                  {Object.keys(cart).length} items
                </span>
              )}
            </div>
            
            <div className="space-y-4 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
              {Object.keys(cart).length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-6xl mb-4">🛒</div>
                  <p className="text-gray-500 text-lg">Your cart is empty and sad! 😢</p>
                  <p className="text-gray-400 text-sm mt-2">Fill it with happiness!</p>
                </div>
              ) : (
                Object.values(cart).map(item => (
                  <div 
                    key={item.id} 
                    className="flex justify-between items-center bg-gray-50 p-4 rounded-xl border-l-4 border-orange-500"
                  >
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-500">x {item.qty}</p>
                      <p className="text-xs text-orange-500 mt-1">
                        {getWittyComment(item)}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-gray-900">
                        ₹{((item.price_cents * item.qty) / 100).toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            {Object.keys(cart).length > 0 && (
              <>
                <hr className="my-6 border-gray-200" />
                <div className="space-y-3">
                  <div className="flex justify-between text-lg">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-semibold">₹{(cartTotal / 100).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg">
                    <span className="text-gray-600">Tax (5%):</span>
                    <span className="font-semibold">₹{((cartTotal * 0.05) / 100).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xl font-bold border-t pt-3">
                    <span>Total:</span>
                    <span className="text-green-600">₹{((cartTotal * 1.05) / 100).toFixed(2)}</span>
                  </div>
                </div>
                
                <button 
                  onClick={handleProceedToPayment}
                  className="w-full mt-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 rounded-xl text-lg font-bold hover:from-green-600 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  💳 Proceed to Payment
                </button>
                
                <p className="text-center text-xs text-gray-500 mt-3">
                  🔒 Secure payment • No hidden charges
                </p>
              </>
            )}
            
            {status.message && (
              <div className={`mt-4 p-4 rounded-xl text-center ${
                status.type === 'success' 
                  ? 'bg-green-100 text-green-800 border border-green-200' 
                  : status.type === 'error' 
                  ? 'bg-red-100 text-red-800 border border-red-200'
                  : 'bg-blue-100 text-blue-800 border border-blue-200'
              }`}>
                {status.message}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPayment && (
        <PaymentModal
          amount={(cartTotal * 1.05) / 100}
          cartItems={Object.values(cart)}
          onSuccess={handlePaymentSuccess}
          onCancel={() => setShowPayment(false)}
        />
      )}

      {/* Order Receipt */}
      {showReceipt && currentOrder && (
        <OrderReceipt
          order={currentOrder}
          onClose={() => setShowReceipt(false)}
        />
      )}
    </div>
  );
};

export default OrderPage;