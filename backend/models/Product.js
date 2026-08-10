const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  slug: { type: String, required: true, unique: true, index: true },
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  category: { type: String, required: true, index: true },
  price: { type: Number, required: true, min: 0 },
  images: [String],
  attributes: { type: Map, of: String }
}, { timestamps: true });

// Enterprise Text Index for Search Engine optimization
productSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Product', productSchema);