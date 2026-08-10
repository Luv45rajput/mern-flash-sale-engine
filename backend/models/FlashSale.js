const mongoose = require('mongoose');

const flashSaleSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true, unique: true },
  totalStock: { type: Number, required: true, min: 0 },
  availableStock: { type: Number, required: true, min: 0 },
  flashSalePrice: { type: Number, required: true, min: 0 },
  startTime: { type: Date, required: true, index: true },
  endTime: { type: Date, required: true, index: true }
}, { timestamps: true });

// Compound index to quickly filter active flash sales
flashSaleSchema.index({ startTime: 1, endTime: 1 });

module.exports = mongoose.model('FlashSale', flashSaleSchema);