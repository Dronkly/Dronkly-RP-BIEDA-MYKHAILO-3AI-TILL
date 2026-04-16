const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    surname: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },

     phone: {
      type: String,
      default: '',
      trim: true,
    },
    birthDate: {
      type: String,
      default: '',
    },
    street: {
      type: String,
      default: '',
      trim: true,
    },
    city: {
      type: String,
      default: '',
      trim: true,
    },
    zipCode: {
      type: String,
      default: '',
      trim: true,
    },
    country: {
      type: String,
      default: '',
      trim: true,
    },

    role: {
     type:String,
     default: 'User'

    },

    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationCode: {
      type: String,
      default: '',
    },
    verificationCodeExpires: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);