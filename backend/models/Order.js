const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    userEmail: {
      type: String,
      default: '',
    },
    items: [
      {
        productId: String,
        name: String,
        price: Number,
        quantity: Number,
      },
    ],
    totalPrice: {
      type: Number,
      required: true,
    },
    paymentMethodId: {
      type: String,
      default: null,
    },
    manualPayment: {
      cardholderName: String,
      cardLast4: String,
      expiryMonth: String,
      expiryYear: String,
    },
    contact: {
      phone: String,
      email: String,
    },
    address: {
      street: String,
      city: String,
      zipCode: String,
      country: String,
    },
    status: {
      type: String,
      default: 'paid',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);