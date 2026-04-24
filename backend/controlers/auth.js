const User = require("../models/User");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");

const { encryptEmail, hashEmail, normalizeEmail } = require("../utils/crypto");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const isStrongPassword = (password) => {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password);
};

const registerUser = async (req, res) => {
  try {
    const { name, surname, email, password } = req.body;

    if (!name || !email || !password || !surname) {
      return res.status(400).json({ message: "Vyplň všechna pole." });
    }

    if (!isStrongPassword(password)) {
      return res.status(400).json({
        message:
          "Heslo musí mít alespoň 8 znaků, jedno velké písmeno, jedno malé písmeno a číslo.",
      });
    }

    const normalizedEmail = normalizeEmail(email);
    const emailHashValue = hashEmail(normalizedEmail);
    const hashedPassword = await bcrypt.hash(password, 10);

    let existingUser = await User.findOne({ emailHash: emailHashValue });

    const verificationCode = Math.floor(
      100000 + Math.random() * 900000,
    ).toString();

    const expires = new Date(Date.now() + 10 * 60 * 1000);

    if (existingUser) {
      if (existingUser.isVerified) {
        return res
          .status(409)
          .json({ message: "Uživatel s tímto emailem už existuje." });
      }

      existingUser.name = name;
      existingUser.surname = surname;
      existingUser.email = encryptEmail(normalizedEmail);
      existingUser.emailHash = emailHashValue;
      existingUser.password = hashedPassword;
      existingUser.verificationCode = verificationCode;
      existingUser.verificationCodeExpires = expires;

      await existingUser.save();
    } else {
      existingUser = await User.create({
        name,
        surname,
        email: encryptEmail(normalizedEmail),
        emailHash: emailHashValue,
        password: hashedPassword,
        isVerified: false,
        verificationCode,
        verificationCodeExpires: expires,
      });
    }

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: normalizedEmail,
      subject: "Ověřovací kód k registraci",
      text: `Tvůj ověřovací kód je: ${verificationCode}`,
    });

    res.status(200).json({
      message: "Ověřovací kód byl odeslán na email.",
    });
  } catch (error) {
    console.log("CHYBA REGISTER:", error);
    res.status(500).json({ message: "Chyba serveru při registraci." });
  }
};

const verifyCode = async (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({ message: "Email a kód jsou povinné." });
    }

    const normalizedEmail = normalizeEmail(email);

    const user = await User.findOne({
      emailHash: hashEmail(normalizedEmail),
    });

    if (!user) {
      return res.status(404).json({ message: "Uživatel nebyl nalezen." });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "Účet už je ověřený." });
    }

    if (user.verificationCode !== code) {
      return res.status(400).json({ message: "Neplatný ověřovací kód." });
    }

    if (
      !user.verificationCodeExpires ||
      user.verificationCodeExpires < new Date()
    ) {
      return res.status(400).json({ message: "Platnost kódu vypršela." });
    }

    user.isVerified = true;
    user.verificationCode = "";
    user.verificationCodeExpires = null;

    if (!user.discounts || user.discounts.length === 0) {
      user.discounts = [
        {
          code: "WELCOME10",
          value: 10,
          title: "Sleva 10 % na první nákup",
          isUsed: false,
        },
      ];
    }

    await user.save();

    res.status(200).json({ message: "Email byl úspěšně ověřen." });
  } catch (error) {
    console.log("VERIFY CODE ERROR:", error);
    res.status(500).json({ message: "Chyba serveru při ověření." });
  }
};

const checkEmailAvailability = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email je povinný." });
    }

    const normalizedEmail = normalizeEmail(email);

    const existingUser = await User.findOne({
      emailHash: hashEmail(normalizedEmail),
    });

    res.status(200).json({
      exists: !!existingUser,
    });
  } catch (error) {
    console.log("CHECK EMAIL ERROR:", error);
    res.status(500).json({ message: "Chyba při kontrole emailu." });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Vyplň email a heslo." });
    }

    const normalizedEmail = normalizeEmail(email);

    const user = await User.findOne({
      emailHash: hashEmail(normalizedEmail),
    });

    if (!user) {
      return res.status(404).json({ message: "Uživatel nebyl nalezen." });
    }

    if (!user.isVerified) {
      return res.status(403).json({ message: "Účet ještě není ověřený." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Špatné heslo." });
    }

    res.status(200).json({
      message: "Přihlášení proběhlo úspěšně.",
      user: {
        id: user._id,
        _id: user._id,
        name: user.name,
        surname: user.surname,
        email: normalizedEmail,
        role: user.role,
      },
    });
  } catch (error) {
    console.log("LOGIN ERROR:", error);
    res.status(500).json({ message: "Chyba serveru při přihlášení." });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email je povinný." });
    }

    const normalizedEmail = normalizeEmail(email);

    const user = await User.findOne({
      emailHash: hashEmail(normalizedEmail),
    });

    if (!user) {
      return res.status(404).json({ message: "Uživatel nebyl nalezen." });
    }

    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();

    user.resetPasswordCode = resetCode;
    user.resetPasswordExpires = new Date(Date.now() + 10 * 60 * 1000);

    await user.save();

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: normalizedEmail,
      subject: "Obnovení hesla",
      text: `Tvůj kód pro obnovení hesla je: ${resetCode}`,
    });

    res.status(200).json({ message: "Kód byl odeslán na email." });
  } catch (error) {
    console.log("FORGOT PASSWORD ERROR:", error);
    res.status(500).json({ message: "Chyba při odesílání kódu." });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, code, password } = req.body;

    if (!email || !code || !password) {
      return res.status(400).json({ message: "Vyplň všechna pole." });
    }

    if (!isStrongPassword(password)) {
      return res.status(400).json({
        message:
          "Heslo musí mít alespoň 8 znaků, jedno velké písmeno, jedno malé písmeno a číslo.",
      });
    }

    const normalizedEmail = normalizeEmail(email);

    const user = await User.findOne({
      emailHash: hashEmail(normalizedEmail),
    });

    if (!user) {
      return res.status(404).json({ message: "Uživatel nebyl nalezen." });
    }

    if (user.resetPasswordCode !== code) {
      return res.status(400).json({ message: "Neplatný kód." });
    }

    if (!user.resetPasswordExpires || user.resetPasswordExpires < new Date()) {
      return res.status(400).json({ message: "Platnost kódu vypršela." });
    }

    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordCode = "";
    user.resetPasswordExpires = null;

    await user.save();

    res.status(200).json({ message: "Heslo bylo úspěšně změněno." });
  } catch (error) {
    console.log("RESET PASSWORD ERROR:", error);
    res.status(500).json({ message: "Chyba při změně hesla." });
  }
};

module.exports = {
  registerUser,
  verifyCode,
  loginUser,
  checkEmailAvailability,
  forgotPassword,
  resetPassword,
};