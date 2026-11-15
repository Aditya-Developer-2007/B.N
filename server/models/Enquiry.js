const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema(
  {
    productId: {
      type: String,
      default: '',
    },
    sku: {
      type: String,
      required: [true, 'SKU code is required'],
      trim: true,
      uppercase: true,
    },
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    qty: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [1, 'Quantity must be at least 1'],
      max: [25, 'Maximum 25 units allowed per product'],
      default: 1,
    },
    category: {
      type: String,
      default: '',
    },
    packSize: {
      type: String,
      default: '',
    },
  },
  { _id: false }
);

const enquirySchema = new mongoose.Schema(
  {
    buyerName: {
      type: String,
      required: [true, 'Contact person name is required'],
      trim: true,
    },
    businessName: {
      type: String,
      required: [true, 'Business/Shop name is required'],
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: [true, 'Phone/WhatsApp number is required'],
      trim: true,
    },
    businessType: {
      type: String,
      default: 'Cosmetics Retail Store',
      trim: true,
    },
    items: {
      type: [cartItemSchema],
      validate: {
        validator: function (v) {
          return Array.isArray(v) && v.length > 0;
        },
        message: 'Enquiry cart must contain at least one product item',
      },
    },
    totalItems: {
      type: Number,
      default: 0,
    },
    totalUnits: {
      type: Number,
      default: 0,
    },
    notes: {
      type: String,
      trim: true,
      default: '',
    },
    status: {
      type: String,
      enum: ['New', 'Contacted', 'Quoted', 'Fulfilled'],
      default: 'New',
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to calculate totals
enquirySchema.pre('save', function (next) {
  if (this.items && Array.isArray(this.items)) {
    this.totalItems = this.items.length;
    this.totalUnits = this.items.reduce((sum, item) => sum + (Number(item.qty) || 0), 0);
  }
  next();
});

module.exports = mongoose.model('Enquiry', enquirySchema);
