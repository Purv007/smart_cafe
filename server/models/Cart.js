const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true, unique: true },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      // Denormalized fields for quick DB visibility and stability
      name: { type: String },
      price: { type: Number },
      image: { type: String },
      quantity: { type: Number, required: true }
    }
  ],
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Cart', cartSchema); 