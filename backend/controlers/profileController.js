const User = require('../models/User');
const PaymentMethod = require('../models/PaymentMethod');

const getProfile = async (req, res) => {
  try {
    const { email } = req.params;

    const user = await User.findOne({ email }).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'Uživatel nebyl nalezen.' });
    }

    const paymentMethods = await PaymentMethod.find({ userId: user._id });

    res.status(200).json({
      user,
      paymentMethods,
    });
  } catch (error) {
    res.status(500).json({ message: 'Chyba při načítání profilu.' });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { email } = req.params;
    const { name, surname, phone, birthDate, street, city, zipCode, country } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'Uživatel nebyl nalezen.' });
    }

    user.name = name;
    user.surname = surname;
    user.phone = phone;
    user.birthDate = birthDate;
    user.street = street;
    user.city = city;
    user.zipCode = zipCode;
    user.country = country;

    await user.save();

    res.status(200).json({
      message: 'Profil byl úspěšně upraven.',
      user,
    });
  } catch (error) {
    res.status(500).json({ message: 'Chyba při úpravě profilu.' });
  }
};

const addPaymentMethod = async (req, res) => {
  try {
    const { email } = req.params;
    const { cardholderName, cardBrand, cardNumber, expiryMonth, expiryYear, isDefault } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'Uživatel nebyl nalezen.' });
    }

    if (!cardholderName || !cardBrand || !cardNumber || !expiryMonth || !expiryYear) {
      return res.status(400).json({ message: 'Vyplň všechna pole platební metody.' });
    }

    const cleanedCardNumber = cardNumber.replace(/\s/g, '');

    if (cleanedCardNumber.length < 4) {
      return res.status(400).json({ message: 'Číslo karty není platné.' });
    }

    const last4 = cleanedCardNumber.slice(-4);

    if (isDefault) {
      await PaymentMethod.updateMany({ userId: user._id }, { isDefault: false });
    }

    const paymentMethod = await PaymentMethod.create({
      userId: user._id,
      cardholderName,
      cardBrand,
      last4,
      expiryMonth,
      expiryYear,
      isDefault: !!isDefault,
    });

    res.status(201).json({
      message: 'Platební metoda byla přidána.',
      paymentMethod,
    });
  } catch (error) {
    res.status(500).json({ message: 'Chyba při přidávání platební metody.' });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  addPaymentMethod,
};