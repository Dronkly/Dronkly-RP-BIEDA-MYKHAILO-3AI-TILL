require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("../models/User");
const { encryptEmail, hashEmail, normalizeEmail } = require("../utils/crypto");

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const users = await User.find();

    for (const user of users) {
      if (user.email && !user.email.includes(":")) {
        const normalizedEmail = normalizeEmail(user.email);

        user.email = encryptEmail(normalizedEmail);
        user.emailHash = hashEmail(normalizedEmail);
      }

      if (user.password && !user.password.startsWith("$2")) {
        user.password = await bcrypt.hash(user.password, 10);
      }

      await user.save();
      console.log(`Upraven uživatel: ${user._id}`);
    }

    console.log("Hotovo. Všichni uživatelé jsou upravení.");
    process.exit(0);
  } catch (error) {
    console.error("Chyba migrace:", error);
    process.exit(1);
  }
};

run();