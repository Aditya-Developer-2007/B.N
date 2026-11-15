const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    sku: { type: String, required: true, unique: true, index: true, uppercase: true, trim: true },
    name: { type: String, required: true, trim: true },
    brandSegment: { type: String, default: 'Wholesale Division' },
    category: { type: String, required: true, index: true },
    categoryLabel: { type: String, default: '' },
    packSize: { type: String, required: true },
    moq: { type: String, default: '1 Case Lot' },
    moqNote: { type: String, default: 'Wholesale Box Lot' },
    image: { type: String, required: true },
    estimatedMargin: { type: String, default: '35% – 45%' },
    description: { type: String, default: 'Authentic manufacturer wholesale cosmetic inventory with verified batch codes.' },
    inStock: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
