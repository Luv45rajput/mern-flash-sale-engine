const express = require('express');
const router = express.Router();
const { 
  initializeFlashSale, 
  purchaseFlashSaleItem 
} = require('../controllers/flashSaleController');

// Route to initialize stock in Redis: POST /api/flash-sale/init
router.post('/init', initializeFlashSale);

// Route to handle flash sale purchases: POST /api/flash-sale/purchase
router.post('/purchase', purchaseFlashSaleItem);

module.exports = router;