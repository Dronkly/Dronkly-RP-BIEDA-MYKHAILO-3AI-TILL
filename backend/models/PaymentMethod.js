const mongoose = require('mongoose');

const paymentMethodSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    cardholderName: {
      type: String,
      required: true,
      trim: true,
    },
    cardBrand: {
      type: String,
      required: true,
      enum: ['Visa', 'Mastercard', 'Maestro', 'JCB', 'American Express', 'Jiná'],
    },
    last4: {
      type: String,
      required: true,
      minlength: 4,
      maxlength: 4,
    },
    expiryMonth: {
      type: String,
      required: true,
    },
    expiryYear: {
      type: String,
      required: true,
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('PaymentMethod', paymentMethodSchema);