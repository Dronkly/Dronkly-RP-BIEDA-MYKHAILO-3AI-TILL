const User = require("../models/User");
const PaymentMethod = require("../models/PaymentMethod");

const getProfile = async (req, res) => {
  try {
    const { email } = req.params;

    const user = await User.findOne({ email }).select("-password");

    if (!user) {
      return res.status(404).json({ message: "Uživatel nebyl nalezen." });
    }

    const paymentMethods = await PaymentMethod.find({ userId: user._id });

    res.status(200).json({
      user,
      paymentMethods,
    });
  } catch (error) {
    console.error("GET PROFILE ERROR:", error);
    res.status(500).json({ message: "Chyba při načítání profilu." });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password -verificationCode -verificationCodeExpires")
      .sort({ createdAt: -1 });

    res.status(200).json(users);
  } catch (error) {
    console.error("GET ALL USERS ERROR:", error);
    res.status(500).json({ message: "Chyba při načítání uživatelů." });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { email } = req.params;
    const { name, surname, phone, birthDate, street, city, zipCode, country } =
      req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "Uživatel nebyl nalezen." });
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
      message: "Profil byl úspěšně upraven.",
      user,
    });
  } catch (error) {
    res.status(500).json({ message: "Chyba při úpravě profilu." });
  }
};

const addPaymentMethod = async (req, res) => {
  try {
    const { email } = req.params;
    const {
      cardholderName,
      cardBrand,
      cardNumber,
      expiryMonth,
      expiryYear,
      isDefault,
    } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "Uživatel nebyl nalezen." });
    }

    if (
      !cardholderName ||
      !cardBrand ||
      !cardNumber ||
      !expiryMonth ||
      !expiryYear
    ) {
      return res
        .status(400)
        .json({ message: "Vyplň všechna pole platební metody." });
    }

    const cleanedCardNumber = cardNumber.replace(/\s/g, "");

    if (cleanedCardNumber.length < 4) {
      return res.status(400).json({ message: "Číslo karty není platné." });
    }

    const last4 = cleanedCardNumber.slice(-4);

    if (isDefault) {
      await PaymentMethod.updateMany(
        { userId: user._id },
        { isDefault: false },
      );
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
      message: "Platební metoda byla přidána.",
      paymentMethod,
    });
  } catch (error) {
    res.status(500).json({ message: "Chyba při přidávání platební metody." });
  }
};

const addDiscountToUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { code, value, title } = req.body;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "Uživatel nebyl nalezen." });
    }

    user.discounts.push({
      code,
      value,
      title,
      isUsed: false,
    });

    await user.save();

    res.status(200).json({ message: "Sleva byla přidána uživateli.", user });
  } catch (error) {
    console.error("ADD DISCOUNT TO USER ERROR:", error);
    res.status(500).json({ message: "Chyba při přidávání slevy." });
  }
};

const deletePaymentMethod = async (req, res) => {
  try {
    const { email, methodId } = req.params;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "Uživatel nebyl nalezen." });
    }

    const deletedMethod = await PaymentMethod.findOneAndDelete({
      _id: methodId,
      userId: user._id,
    });

    if (!deletedMethod) {
      return res
        .status(404)
        .json({ message: "Platební metoda nebyla nalezena." });
    }

    res.status(200).json({ message: "Platební metoda byla smazána." });
  } catch (error) {
    console.error("DELETE PAYMENT METHOD ERROR:", error);
    res.status(500).json({ message: "Chyba při mazání platební metody." });
  }
};

const Order = require("../models/Order");

const getAdminUserDetail = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select(
      "-password -verificationCode -verificationCodeExpires",
    );

    if (!user) {
      return res.status(404).json({ message: "Uživatel nebyl nalezen." });
    }

    const orders = await Order.find({ userEmail: user.email }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      user,
      orders,
    });
  } catch (error) {
    console.error("GET ADMIN USER DETAIL ERROR:", error);
    res.status(500).json({ message: "Chyba při načítání detailu uživatele." });
  }
};

const updateAdminUser = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      surname,
      phone,
      birthDate,
      street,
      city,
      zipCode,
      country,
      role,
    } = req.body;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "Uživatel nebyl nalezen." });
    }

    user.name = name;
    user.surname = surname;
    user.phone = phone;
    user.birthDate = birthDate;
    user.street = street;
    user.city = city;
    user.zipCode = zipCode;
    user.country = country;
    user.role = role || user.role;

    await user.save();

    res.status(200).json({
      message: "Uživatel byl úspěšně upraven.",
      user,
    });
  } catch (error) {
    console.error("UPDATE ADMIN USER ERROR:", error);
    res.status(500).json({ message: "Chyba při úpravě uživatele." });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  addPaymentMethod,
  deletePaymentMethod,
  getAllUsers,
  getAdminUserDetail,
  addDiscountToUser,
  updateAdminUser,
};
