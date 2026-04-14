const User = require('../models/User');

const registerUser = async (req, res) => {
  try {
    const { name, surname, email, password } = req.body;

    if (!name || !email || !password || !surname ) {
      return res.status(400).json({ message: 'Vyplň všechna pole.' });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({ message: 'Uživatel s tímto emailem už existuje.' });
    }

    const newUser = new User({
      name,
      surname,
      email,
      password,
    });

    await newUser.save();

    res.status(201).json({
      message: 'Registrace proběhla úspěšně.',
      user: {
        id: newUser._id,
        name: newUser.name,
        surname: newUser.surname,
        email: newUser.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Chyba serveru.' });
  }
};

module.exports = { registerUser };