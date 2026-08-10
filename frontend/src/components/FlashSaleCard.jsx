import React, { useState } from 'react';
import axios from 'axios';

export default function FlashSaleCard() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleCheckout = async () => {
    setLoading(true);
    setMessage('');

    try {
      const response = await axios.post('http://localhost:5000/api/flash-sale/checkout', {
        customerId: "64a2b1f8e4b0c8a1b2c3d4e5",
        productId: "64a2b1f8e4b0c8a1b2c3d4e6",
        vendorId: "64a2b1f8e4b0c8a1b2c3d4e7",
        quantity: 1,
        price: 99.99,
        idempotencyKey: `txn_${Date.now()}`
      });

      setMessage(`Success! Order ID: ${response.data.orderId} | Remaining Stock: ${response.data.remainingStock}`);
    } catch (error) {
      setMessage(`Failed: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-6 m-4 border border-gray-100">
      <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">High-Demand Flash Sale</div>
      <h2 className="block mt-1 text-lg leading-tight font-medium text-black">Enterprise Wireless Headphones</h2>
      <p className="mt-2 text-gray-500">Limited stock available. Protected by Redis atomic decrements and MongoDB transactions.</p>
      
      <div className="mt-4 flex items-center justify-between">
        <span className="text-2xl font-bold text-gray-900">$99.99</span>
        <button
          onClick={handleCheckout}
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition-colors disabled:opacity-50"
        >
          {loading ? 'Processing...' : 'Flash Buy Now'}
        </button>
      </div>

      {message && (
        <div className={`mt-4 p-3 rounded text-sm ${message.includes('Success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message}
        </div>
      )}
    </div>
  );
}