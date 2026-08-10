import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function App() {
  const [stock, setStock] = useState(10);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const productId = "64a2b1f8e4b0c8a1b2c3d4e6";

  const handleBuy = async () => {
    setLoading(true);
    setMessage('');
    try {
      const response = await axios.post(`${API_BASE_URL}/api/flash-sale/purchase`, {
        productId,
        quantity: 1,
        price: 99.99,
        idempotencyKey: 'txn_' + Date.now()
      });
      setMessage(`Success! Order ID: ${response.data.orderId} | Remaining Stock: ${response.data.remainingStock}`);
      setStock(response.data.remainingStock);
    } catch (error) {
      setMessage(`Failed: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleRestock = async () => {
    try {
      await axios.post(`${API_BASE_URL}/api/flash-sale/init`, {
        productId,
        totalStock: 10
      });
      setStock(10);
      setMessage('Flash sale restocked to 10 units!');
    } catch (error) {
      setMessage('Failed to restock');
    }
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', textAlign: 'center', marginTop: '50px' }}>
      <h1>Amazon-Scale Flash Sale Engine</h1>
      <p>Demonstrating high-concurrency race condition prevention using MERN, Redis, and MongoDB.</p>
      
      <div style={{ border: '1px solid #ddd', display: 'inline-block', padding: '30px', borderRadius: '10px', marginTop: '20px', background: '#fff' }}>
        <h3>Enterprise Wireless Headphones</h3>
        <p>Limited stock available. Protected by Redis atomic decrements and MongoDB transactions.</p>
        <h4 style={{ color: '#2b6cb0' }}>Available Stock: {stock} units</h4>
        <h2 style={{ color: '#2d3748' }}>$99.99</h2>
        
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <button 
            onClick={handleBuy} 
            disabled={loading}
            style={{ background: '#48bb78', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer', fontSize: '16px' }}
          >
            {loading ? 'Processing...' : 'Flash Buy Now'}
          </button>
          
          <button 
            onClick={handleRestock}
            style={{ background: '#3182ce', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer', fontSize: '16px' }}
          >
            Restock (10)
          </button>
        </div>

        {message && (
          <div style={{ marginTop: '20px', padding: '10px', background: message.includes('Success') || message.includes('restocked') ? '#c6f6d5' : '#fed7d7', color: message.includes('Success') || message.includes('restocked') ? '#22543d' : '#9b2c2c', borderRadius: '5px' }}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;